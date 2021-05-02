<template>
  <div class="pt-5">
    <h2 class="title mb-4">세금계산서 정보 요청</h2>

    <p v-if="status === 'loading'">
      <small-spinner class="mr-2"></small-spinner>정보를 불러오는 중입니다.
    </p>

    <p v-else-if="status === 'failed'">
      정보를 불러오는 데 실패했습니다. 문의사항으로 연락주시기 바랍니다. (에러
      코드: <code>{{ errCode }}</code
      >) <br />
      <b-link :to="{ name: 'Home' }"><u>홈으로 이동</u></b-link>
    </p>

    <p v-else-if="status === 'success'">
      세금계산서 정보가 성공적으로 제출되었습니다. <br />
      <b-link :to="{ name: 'Home' }"><u>홈으로 이동</u></b-link>
    </p>
    <template
      v-else-if="
        status === 'loaded' || status === 'uploading' || status === 'submitting'
      "
    >
      <p class="mb-4">
        본 페이지는 공동체상영 진행을 위해 필요한 서류 업로드 및 정보 기입을
        하는 페이지이며, 이메일로 전송된 링크로만 접속하실 수 있습니다. 하단의
        정보가 잘못되었거나 문의사항이 있으실 경우 support@cinesopa.kr 으로
        연락해주시기 바랍니다. 개인정보 보호를 위해 {{ dueDateFormat }}까지
        제출하지 않을 시 링크는 폐기됩니다.
      </p>
      <hr class="mb-4" />
      <div class="mb-4">
        <form-row title="주최">{{ application.host }}</form-row>
        <form-row title="행사명">{{ application.festival }}</form-row>
        <form-row title="작품명">{{ application.film_title }}</form-row>
        <form-row title="상영일">{{ dateRange }}</form-row>
        <form-row title="담당자 이메일 주소">{{
          application.applicant_email
        }}</form-row>
        <form-row title="공급가액">{{ supplyFormatted }} 원</form-row>
        <form-row title="부가가치세액">{{ taxFormatted }} 원</form-row>
        <form-row title="총액">{{ chargeFormatted }} 원</form-row>
        <form-row title="사업자등록증">
          <b-form-file plain v-model="businessLicenseFileObj"> </b-form-file>
        </form-row>
        <form-row title="세금계산서 작성일자">
          <b-form-checkbox
            class="mb-2"
            v-model="no_receipt_date"
            @change="noReciptDateChanged"
          >
            상영일과 동일합니다.
          </b-form-checkbox>
          <b-form-datepicker
            :disabled="no_receipt_date"
            v-model="application.receipt_date"
            value-as-date
            locale="ko"
          >
          </b-form-datepicker>
        </form-row>
        <form-row title="세금계산서 받을 이메일 주소">
          <b-form-checkbox
            class="mb-2"
            v-model="emails_are_same"
            @change="emailsAreSameChanged"
          >
            담당자 이메일과 동일합니다.
          </b-form-checkbox>
          <b-form-input
            v-model="application.receipt_email"
            :disabled="emails_are_same"
          >
          </b-form-input>
        </form-row>
        <form-row title="기타 요청사항">
          <b-form-textarea
            rows="4"
            size="sm"
            v-model="application.receipt_etc_req"
          >
          </b-form-textarea>
        </form-row>
      </div>
      <hr />
      <div class="mb-5">
        <!-- </div> -->
        <b-button
          class="border-round"
          @click="$bvModal.show('confirm-modal')"
          variant="primary"
        >
          <font-awesome-icon
            class="mr-2"
            :icon="['fas', 'paper-plane']"
          ></font-awesome-icon>
          <span> 제출 </span>
        </b-button>
      </div>
    </template>
    <b-modal
      id="confirm-modal"
      @ok="submitClicked"
      ok-title="예"
      cancel-title="아니오"
      hide-header
      centered
    >
      <template v-if="noinputdata.length > 0">
        <b>{{ noinputdata.join(', ') }}</b> 항목이 채워지지 않았습니다.
      </template>
      정말로 제출하시겠습니까?
    </b-modal>
    <b-modal
      centered
      no-close-on-backdrop
      id="sending-modal"
      hide-header
      hide-footer
    >
    <!-- 업로드 단계에서 보이는 것 -->
    <div v-if="status === 'uploading'">

      <b-progress
        :value="uploadProgressLoaded"
        :max="uploadProgressTotal"
        show-progress
        animated
        class="mb-2"
      ></b-progress>
      <p class="m-0 text-center">업로드 중입니다.</p>
    </div>

    <!-- submit 단계에서 보이는 것 -->
      <div v-if="status === 'submitting'" class="d-flex justify-center align-items-center">
        <small-spinner class="mr-2"></small-spinner> 제출 중입니다.
      </div>
    </b-modal>
  </div>
</template>

<script>
import { numberWithCommas } from '@/util';
import {
  BFormDatepicker,
  BFormInput,
  BFormTextarea,
  BFormCheckbox,
  BFormFile,
  BButton,
  BLink,
  BProgress
} from 'bootstrap-vue';
import moment from 'moment';
import { makeSimpleMutation, makeSimpleQuery } from '@/api/graphql-client';
import upload from '@/upload-client';
import { mapActions } from 'vuex';

const applicationTaxReqReq = makeSimpleQuery('applicationTaxReq');
const submitTaxInformationReq = makeSimpleMutation('submitTaxInformation');

export default {
  name: 'RequestTaxInfo',
  components: {
    BFormInput,
    FormRow: () => import('@/components/admin/FormRow.vue'),
    BFormDatepicker,
    BFormTextarea,
    BFormCheckbox,
    BFormFile,
    BButton,
    BLink,
    BProgress,
    SmallSpinner: () => import('@/components/SmallSpinner.vue'),
  },
  data() {
    return {
      errCode: '',
      status: 'loading',
      businessLicenseFileObj: null,
      application: {
        host: '-',
        film_title: '-',
        /** @type {Date} */
        start_date: new Date('2021-3-25'),
        /** @type {Date} */
        end_date: new Date('2021-3-25'),
        applicant_email: 'eszqsc112@naver.com', // 담당자 이메일
        charge: 550000, // 부가세 포함
        // business_license_url: '', // 사업자등록증 url
        business_license_filename: '',
        business_license_url: '',
        receipt_date: new Date(), // 세금계산서 발행 날짜
        receipt_email: '', //  세금계산서 받을 이메일주소
        receipt_etc_req: '', // 기타 요청사항
        /** @type {Date} */
        reqdoc_expire_date: null,
      },
      no_receipt_date: false,
      emails_are_same: false,
      uploadProgressTotal: 0,
      uploadProgressLoaded: 0,
    };
  },
  computed: {
    /** @returns {number} */
    tax() {
      return Math.round(this.application.charge / 11);
    },
    /** @returns {number} */
    supply() {
      return this.application.charge - this.tax;
    },
    /** @returns {string} */
    supplyFormatted() {
      return numberWithCommas(this.supply);
    },
    /** @returns {string} */
    taxFormatted() {
      return numberWithCommas(this.tax);
    },
    /** @returns {string} */
    chargeFormatted() {
      return numberWithCommas(this.application.charge);
    },
    /** @returns {string} */
    dateRange() {
      return `
        ${moment(this.application.start_date).format('yyyy.MM.DD')} ~
        ${moment(this.application.end_date).format('yyyy.MM.DD')}`;
    },
    /** @returns {string} */
    dueDateFormat() {
      return moment(this.application.reqdoc_expire_date).format(
        'yyyy.MM.DD hh:mm:ss',
      );
    },
    /** @returns {string[]} */
    noinputdata() {
      const arr = [];
      if (!this.businessLicenseFileObj) {
        arr.push('사업자등록증');
      }
      if (!this.application.receipt_date) {
        arr.push('세금계산서 작성일자');
      }
      if (!this.application.receipt_email) {
        arr.push('세금계산서 받을 이메일 주소');
      }
      return arr;
    },
  },
  async mounted() {
    await this.fetchData();
  },
  methods: {
    pushMessage: mapActions(['pushMessage']).pushMessage,
    fail() {
      this.status = 'failed';
    },
    noReciptDateChanged(value) {
      if (value) {
        this.application.receipt_date = this.application.start_date;
      }
    },
    emailsAreSameChanged(value) {
      if (value) {
        this.application.receipt_email = this.application.applicant_email;
      }
    },
    // 최종적으로 Submit 하는 단계
    async submitClicked() {
      this.$bvModal.show('sending-modal');
      this.status = 'uploading';

      // 일단 파일을 업로드함
      if (this.businessLicenseFileObj) {
        const res = await upload(
          this.businessLicenseFileObj,
          this.businessLicenseFileObj.name,
          {
            onUploadProgress: (e) => {
              if (!this.uploadProgressTotal) {
                this.uploadProgressTotal = e.total ?? 1;
              }
              this.uploadProgressLoaded = e.loaded ?? 0;
              // console.log('# RequestTaxInfo.vue onUploadProgress');
              // console.log(e);
              // console.log(e.loaded);
              // console.log(e.total);
            },
          },
        );
        // console.log('# RequestTaxInfo.vue submitClicked file upload res');
        // console.log(res);
        const { file } = res.data;
        this.application.business_license_filename = file.filename;
        this.application.business_license_url = file.fileurl;
      }
      this.status = 'submitting';

      // 그 다음 정보 갱신
      const token = this.$store.state.taxReqLinkToken;
      const res = await submitTaxInformationReq(
        {
          token,
          input: {
            business_license_filename: this.application
              .business_license_filename,
            business_license_url: this.application.business_license_url,
            receipt_date: this.application.receipt_date,
            receipt_email: this.application.receipt_email,
            receipt_etc_req: this.application.receipt_etc_req,
          },
        },
        '{success code}',
      );
      // console.log('# RequestTaxInfo.vue submitTaxInformationReq res');
      // console.log(res);

      // 성공 실패에 따른 로직
      if (res.success) {
        this.pushMessage({
          type: 'success',
          id: 'submitTaxInformationReqSuccess',
          msg: '세금계산서 정보가 성공적으로 제출되었습니다.',
        });
        this.status = 'success';
      } else {
        this.pushMessage({
          type: 'danger',
          id: 'submitTaxInformationReqFailed',
          msg: '세금계산서 정보를 제출하던 중 오류가 발생했습니다.',
        });
        this.status = 'failed';
        this.errCode = res.code;
      }
      // 토큰 초기화
      this.$store.commit('setTaxLinkToken', null);
      this.$bvModal.hide('sending-modal');
    },
    async fetchData() {
      // 스토어에 저장되어 있는 토큰으로 서버에서 데이터 가져오기
      const token = this.$store.state.taxReqLinkToken;
      if (typeof token !== 'string') {
        this.errCode = 'no_token';
        this.status = 'failed';
        return;
      }
      const res = await applicationTaxReqReq(
        { token },
        `{success code doc {
        host festival film_title start_date end_date applicant_email charge reqdoc_expire_date
      }}`,
      );

      // 가져온 값으로 초기화
      if (res.success) {
        this.status = 'loaded';
        // console.log('# RequestTaxInfo request res');
        const { doc } = res;
        this.application = {
          ...doc,
          start_date: doc.start_date ? new Date(doc.start_date) : null,
          end_date: doc.end_date ? new Date(doc.end_date) : null,
          receipt_date: null, // 세금계산서 발행 날짜
          receipt_email: '', //  세금계산서 받을 이메일주소
          receipt_etc_req: '', // 기타 요청사항
          business_license_filename: null,
          business_license_url: null,
        };
      }
      // 실패시 에러
      else {
        this.status = 'failed';
        this.errCode = res.code;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.title {
  font-size: 24px;
  font-weight: bold;
}
p {
  font-size: 16px;
}

.border-round {
  border-radius: 3px;
}
</style>
