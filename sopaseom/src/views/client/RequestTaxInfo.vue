<template>
  <div class="pt-5">
    <h2 class="title mb-4">세금계산서 정보 요청</h2>
    <p class="mb-4">
      본 페이지는 공동체상영 진행을 위해 필요한 서류 업로드 및 정보 기입을 하는
      페이지이며, 이메일로 전송된 링크로만 접속하실 수 있습니다. 하단의 정보가
      잘못되었거나 문의사항이 있으실 경우 support@cinesopa.kr 으로 연락해주시기
      바랍니다. 개인정보 보호를 위해 {{ due_date_format }}까지 제출하지 않을 시
      링크는 폐기됩니다.
    </p>
    <hr class="mb-4" />
    <div class="mb-4">
      <form-row title="주최">{{ application.host }}</form-row>
      <form-row title="작품명">{{ application.film_title }}</form-row>
      <form-row title="상영일">{{ dateRange }}</form-row>
      <form-row title="담당자 이메일 주소">{{
        application.applicant_email
      }}</form-row>
      <form-row title="공급가액">{{ supplyFormatted }} 원</form-row>
      <form-row title="부가가치세액">{{ taxFormatted }} 원</form-row>
      <form-row title="총액">{{ chargeFormatted }} 원</form-row>
      <form-row title="사업자등록증">
        <b-form-file v-model="businessLicenseFileObj"> </b-form-file>
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
      <b-button
        class="border-round"
    </div>
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
    <b-modal
      id="confirm-modal"
      @ok="submitClicked"
      ok-title="예"
      cancel-title="아니오"
      hide-header
      centered
      >정말로 제출하시겠습니까?</b-modal
    >
    <b-modal centered no-close-on-backdrop id="sending-modal" hide-header hide-footer>
      <div>제출중입니다.</div>
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
} from 'bootstrap-vue';
import moment from 'moment';

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
  },
  data() {
    return {
      businessLicenseFileObj: null,
      application: {
        host: '주최',
        film_title: '마담B',
        start_date: new Date('2021-3-25'),
        end_date: new Date('2021-3-25'),
        applicant_email: 'eszqsc112@naver.com', // 담당자 이메일
        charge: 550000, // 부가세 포함
        business_license_url: '', // 사업자등록증 url
        receipt_date: null, // 세금계산서 발행 날짜
        receipt_email: 'test@naver.com', //  세금계산서 받을 이메일주소
        receipt_etc_req: '', // 기타 요청사항
      },
      no_receipt_date: false,
      emails_are_same: false,
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
    due_date_format() {
      return '2021.05.06 23:42'; // todo
    },
  },
  methods: {
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
    submitClicked() {
      this.$bvModal.show('sending-modal');
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
