<template>
  <div class="">
    <div class="guide">
      <p class="guide-main">
        여럿이 함께 영화를 보거나 아카이빙을 위한 상영 신청 페이지입니다.<br />
      </p>
      <p class="guide-main-sub">
        본 신청서를 작성하시면 <span class="colored-strong">3일 이내</span>에 메일 또는 전화로
        연락을 드리오니,<br />잠시만 기다려주세요 :)
      </p>
      <hr />
      <h2>
        상영 절차
      </h2>
      <ol>
        <li>
          상영 신청서를 작성합니다
        </li>
        <li>
          담당자와 세부사항을 논의하고 확정합니다.
        </li>
        <li>
          상영본 외장하드를 수령합니다.
        </li>
        <li>상영을 한 후 상영본을 반환합니다.</li>
        <li>
          상영료를 정산합니다.
        </li>
      </ol>
      <h2>
        상영료 안내
      </h2>
      <b-table class="guide-showing-fee" :items="showingFeeItems" :fields="showingFeeFields">
      </b-table>

      <h2>
        유의사항
      </h2>
      <ul>
        <li>
          상영료 외 비용은 발생하지 않습니다.
        </li>
        <li>
          하나의 영화가 아닌, 여러 영화를 상영하실 경우 영화 각각 신청서를 작성해주세요.
        </li>
        <li>
          <p>감독님 섭외 부분은 신청인께서 직접 하셔야함을 알려드립니다.</p>
          <p class="small">씨네소파는 신청인과 감독의 상호 연락처 전달 업무만 담당합니다.</p>
        </li>
        <li>
          씨네소파는 예비사회적기업으로서 독립영화 저변 확대를 위해 노력하고 있습니다.<br />이에,
          상영료를 좌석 수가 아닌 관객 수를 기준으로 책정하고 있습니다. 그에 따른 차액만큼<br />
          사회서비스제공확인서(양식제공)를 요청드릴 수 있으니 참고 부탁드립니다.
        </li>
      </ul>
    </div>

    <validation-observer ref="observer" v-slot="{ /* handleSubmit, */ validate /* errors */ }">
      <b-form class="community-form" @submit.stop.prevent="submit(validate())">
        <h2>행사 정보</h2>
        <b-form-group
          class="community-form-group"
          label="주최기관 / 단체 이름"
          label-cols-sm="3"
          label-align-sm="left"
          label-size="md"
          label-for="compnay-name"
        >
          <b-form-input
            class="underlined-box"
            v-model="form.companyName"
            id="compnay-name"
            type="text"
            placeholder=""
            :required="required"
          ></b-form-input>
        </b-form-group>
        <b-form-group
          class="community-form-group"
          label="행사 이름"
          label-cols-sm="3"
          label-align-sm="left"
          label-size="md"
          label-for="festival-name"
        >
          <b-form-input
            class="underlined-box"
            v-model="form.festivalName"
            id="festival-name"
            type="text"
            placeholder=""
            :required="required"
          ></b-form-input>
        </b-form-group>
        <b-form-group
          class="community-form-group"
          label="상영일"
          label-cols-sm="3"
          label-align-sm="left"
          label-size="md"
          label-for="playdate"
        >
          <b-form-datepicker
            class="underlined-box"
            v-model="form.playdate"
            id="playdate"
            placeholder="클릭하여 날짜 선택"
            :required="required"
            label-today-button="오늘 날짜"
            label-reset-button="재설정"
            label-close-button="닫기"
            label-prev-year="이전해"
            label-prev-month="이전달"
            label-current-month="현재달"
            label-next-month="다음달"
            label-next-year="다음해"
            label-today="오늘"
            label-selected="선택된 날짜"
            label-no-date-selected="날짜가 선택되지 않았습니다"
            label-calendar="달력"
            label-nav="달력 열기"
            label-help="방향키를 이용하여 날짜를 선택하세요"
          >
            <!-- <template #button-content :style="{ width: `300px` }"> -->
            <!-- <div class="w-100 h-100 d-flex align-items-center justify-content-center"> -->
            <!-- <font-awesome-icon :icon="['fas', 'calendar']"></font-awesome-icon> -->
            <!-- </div> -->
            <!-- </template> -->
          </b-form-datepicker>
        </b-form-group>
        <b-form-group
          class="community-form-group"
          label="상영 회차"
          label-cols-sm="3"
          label-align-sm="left"
          label-size="md"
          label-for="playtimes"
        >
          <b-form-input
            class="underlined-box"
            v-model="form.playtimes"
            id="playtimes"
            type="number"
            placeholder=""
            :required="required"
          ></b-form-input>
          <template #description>영화를 총 몇 회 상영하는지 적어주세요.</template>
        </b-form-group>
        <b-form-group
          class="community-form-group"
          label="상영 장소"
          label-cols-sm="3"
          label-align-sm="left"
          label-size="md"
          label-for="playplace"
        >
          <b-form-input
            class="underlined-box"
            v-model="form.playplace"
            id="playplace"
            type="text"
            placeholder="예) 소파극장 (부산시 해운대구)"
            :required="required"
          ></b-form-input>
        </b-form-group>

        <h2>신청인 정보</h2>

        <b-form-group
          class="community-form-group"
          label="이름"
          label-cols-sm="3"
          label-align-sm="left"
          label-size="md"
          label-for="username"
        >
          <b-form-input
            class="underlined-box"
            v-model="form.username"
            id="username"
            type="text"
            placeholder=""
            :required="required"
          ></b-form-input>
        </b-form-group>
        <b-form-group
          class="community-form-group"
          label="전화번호"
          label-cols-sm="3"
          label-align-sm="left"
          label-size="md"
          label-for="userphone"
        >
          <b-form-input
            class="underlined-box"
            v-model="form.userphone"
            id="userphone"
            type="text"
            placeholder="예) 01012345678"
            :required="required"
          ></b-form-input>
          <template #description>반드시 연락 가능한 연락처를 적어주세요. </template>
        </b-form-group>
        <b-form-group
          class="community-form-group"
          label="이메일"
          label-cols-sm="3"
          label-align-sm="left"
          label-size="md"
          label-for="useremail"
        >
          <b-form-input
            class="underlined-box"
            v-model="form.useremail"
            id="useremail"
            type="email"
            placeholder=""
            :required="required"
          ></b-form-input>
          <template #description>
            반드시 수신 가능한 이메일을 적어주세요.
          </template>
        </b-form-group>

        <h2>상영본 정보</h2>

        <b-form-group
          class="community-form-group"
          label="영화 이름"
          label-cols-sm="3"
          label-align-sm="left"
          label-size="md"
          label-for="filmname"
        >
          <b-form-input
            class="underlined-box"
            v-model="form.filmname"
            id="filmname"
            type="text"
            placeholder=""
            :required="required"
          ></b-form-input>
          <template #description>
            하나의 영화만 기재해주세요.<br />여러 영화를 상영하신다면, 각각 신청서를 작성해주시기
            바랍니다.
          </template>
        </b-form-group>

        <b-form-group
          class="community-form-group"
          label="상영 포맷"
          label-cols-sm="3"
          label-align-sm="left"
          label-size="md"
          label-for="format"
        >
          <b-form-radio-group
            class="radio-group"
            id="format"
            @change="formatSelected"
            v-model="form.format"
            stacked
          >
            <b-form-radio value="DCP">DCP <small>(별도 영사기 필요)</small></b-form-radio>
            <b-form-radio value="MOV1"
              >초고화질 MOV <small>(100GB 내외, 고사양 PC 및 대형 프로젝터용)</small></b-form-radio
            >
            <b-form-radio value="MOV2"
              >고화질 MOV <small>(10~30GB 내외, 일반 PC 및 노트북용)</small></b-form-radio
            >
            <b-form-radio value="MOV3"
              >일반 MOV <small>(2~3GB, 유튜브 1080p 화질)</small></b-form-radio
            >
          </b-form-radio-group>
        </b-form-group>
        <h2>
          비용 및 배송 관련 정보
        </h2>
        <b-form-group
          class="community-form-group"
          label="상영본 수령 방법"
          label-cols-sm="3"
          label-align-sm="left"
          label-size="md"
          label-for="how-to-receive"
          description="일반 MOV만 이메일 발송이 가능합니다."
        >
          <b-form-radio-group
            class="radio-group"
            id="how-to-receive"
            :required="required"
            @change="changedHowToReceive"
            v-model="form.howToReceive"
          >
            <b-form-radio value="택배">택배로 수령 (배송비 무료)</b-form-radio>
            <b-form-radio :disabled="disabledReceiveByEmail" value="이메일"
              >이메일로 수령</b-form-radio
            >
          </b-form-radio-group>
        </b-form-group>

        <b-form-group
          class="community-form-group"
          label="상영본 받을 주소"
          label-cols-sm="3"
          label-align-sm="left"
          label-size="md"
          :label-for="!receivedByEmail ? 'address' : null"
          :disabled="receivedByEmail"
        >
          <b-button
            id="address"
            variant="outline-primary"
            @click="openMap"
            aria-describedby="다음 주소창이 새 창으로 열립니다."
            >주소 검색</b-button
          >
          <p v-if="addressNew !== ''" class="address-new">{{ addressNew }}</p>
          <p v-if="addressOld !== ''" class="address-old">{{ addressOld }}</p>
          <!-- <b-form-text
            >하나의 영화만 기재해주세요. 여러 영화를 상영하신다면, 각각 신청서를 작성해주시기
            바랍니다.</b-form-text
          > -->
        </b-form-group>

        <b-form-group
          class="community-form-group"
          label="상세 주소"
          label-cols-sm="3"
          label-align-sm="left"
          label-size="md"
          :label-for="!receivedByEmail ? 'addressDetailed' : null"
          :disabled="receivedByEmail"
        >
          <b-form-input
            class="underlined-box"
            v-model="form.addressDetailed"
            id="addressDetailed"
            type="text"
            placeholder=""
            :required="required"
          ></b-form-input>
          <!-- <b-form-text
            >하나의 영화만 기재해주세요. 여러 영화를 상영하신다면, 각각 신청서를 작성해주시기
            바랍니다.</b-form-text
          > -->
        </b-form-group>

        <b-form-group
          class="community-form-group"
          label="상영본 받을 날짜"
          label-cols-sm="3"
          label-align-sm="left"
          label-size="md"
          label-for="receive-date"
        >
          <b-form-datepicker
            class="underlined-box"
            v-model="form.receiveDate"
            id="receive-date"
            placeholder="클릭하여 날짜 선택"
            :required="required"
            label-today-button="오늘 날짜"
            label-reset-button="재설정"
            label-close-button="닫기"
            label-prev-year="이전해"
            label-prev-month="이전달"
            label-current-month="현재달"
            label-next-month="다음달"
            label-next-year="다음해"
            label-today="오늘"
            label-selected="선택된 날짜"
            label-no-date-selected="날짜가 선택되지 않았습니다"
            label-calendar="달력"
            label-nav="달력 열기"
            label-help="방향키를 이용하여 날짜를 선택하세요"
          >
            <!-- <template #button-content :style="{ width: `300px` }"> -->
            <!-- <div class="w-100 h-100 d-flex align-items-center justify-content-center"> -->
            <!-- <font-awesome-icon :icon="['fas', 'calendar']"></font-awesome-icon> -->
            <!-- </div> -->
            <!-- </template> -->
          </b-form-datepicker>
        </b-form-group>
        <hr />
        <b-form-group
          class="community-form-group"
          label="영화 구분"
          label-cols-sm="3"
          label-align-sm="left"
          label-size="md"
          label-for="film-type"
          description="영화 길이가 60분 이상이면 장편, 60분 미만이면 단편입니다."
        >
          <b-form-radio-group
            class="radio-group"
            :required="required"
            id="film-type"
            v-model="form.filmType"
          >
            <b-form-radio value="long">장편</b-form-radio>
            <b-form-radio value="short">단편</b-form-radio>
          </b-form-radio-group>
        </b-form-group>
        <b-form-group
          class="community-form-group"
          label="예상 관객수"
          label-cols-sm="3"
          label-align-sm="left"
          label-size="md"
          label-for="expected-population"
        >
          <b-form-select
            class="rounded-box w-50"
            v-model="form.expectedPopulation"
            id="expected-population"
            placeholder=""
            :required="required"
          >
            <template v-slot:first>
              <option value=""></option>
            </template>

            <option
              v-for="(key, index) in Object.keys(showingFeePopLabels)"
              :value="key"
              :key="index"
              >{{ showingFeePopLabels[key] }}</option
            >
          </b-form-select>
        </b-form-group>
        <b-form-group
          class="community-form-group"
          label="예상 상영료(부가세 포함)"
          label-cols-sm="3"
          label-align-sm="left"
          label-size="md"
          label-for="showingFee"
          description="영화 구분(장편/단편)과 예상 관객수를 설정하면 예상 상영료가 표시됩니다."
        >
          <template #label> 예상 상영료<br />(부가세 포함) </template>
          <p id="showingFee">
            <var>{{ showingFee }}</var> 원
          </p>
        </b-form-group>
        <b-form-group
          class="community-form-group"
          label="입금 예정일"
          label-cols-sm="3"
          label-align-sm="left"
          label-size="md"
          label-for="depositdate"
        >
          <b-form-datepicker
            class="underlined-box"
            v-model="form.depositdate"
            id="depositdate"
            placeholder="클릭하여 날짜 선택"
            :required="required"
            label-today-button="오늘 날짜"
            label-reset-button="재설정"
            label-close-button="닫기"
            label-prev-year="이전해"
            label-prev-month="이전달"
            label-current-month="현재달"
            label-next-month="다음달"
            label-next-year="다음해"
            label-today="오늘"
            label-selected="선택된 날짜"
            label-no-date-selected="날짜가 선택되지 않았습니다"
            label-calendar="달력"
            label-nav="달력 열기"
            label-help="방향키를 이용하여 날짜를 선택하세요"
          >
          </b-form-datepicker>
        </b-form-group>
        <hr />
        <b-form-group
          class="community-form-group"
          label="추가 요청할 서류"
          label-cols-sm="3"
          label-align-sm="left"
          label-size="md"
          label-for="additional-papers"
        >
          <b-form-checkbox-group
            id="additional-papers"
            v-model="form.additionalPapers"
          >
            <b-form-checkbox
              :disabled="form.additionalPapers.includes('현금영수증')"
              :value="'세금계산서'"
              >세금계산서</b-form-checkbox
            >
            <!-- <b-form-checkbox
              :disabled="form.additionalPapers.includes('세금계산서')"
              :value="'현금영수증'"
              >현금영수증</b-form-checkbox
            > -->
            <b-form-checkbox :value="'견적서'">견적서</b-form-checkbox>
          </b-form-checkbox-group>
          <!-- {{ form.additionalPapers }} -->
        </b-form-group>
        <b-form-group
          class="community-form-group"
          label="기타 요청 사항"
          label-cols-sm="3"
          label-align-sm="left"
          label-size="md"
          label-for="others"
          description="추가로 요청하실 사항이나 논의가 필요한 부분이 있다면, 자유롭게 적어주세요!"
        >
          <b-form-textarea
            v-model="form.others"
            size="sm"
            id="others"
            rows="5"
          ></b-form-textarea>
        </b-form-group>

        <!-- <p>상영료:</p> -->

        <!-- <datalist id="my-list-id">
          <option>Manual Option</option>
          <option v-for="(size, index) in sizes" :key="index">{{ size }}</option>
        </datalist> -->

        <validation-provider
          :rules="{ shouldCheck: true }"
          :customMessages="{ shouldCheck: '반드시 동의하여야 합니다.' }"
          v-slot="v_context"
        >
          <b-form-group id="check-privacy">
            <div class="check-privacy-wrapper">
              <b-checkbox
                :state="getValidationState(v_context)"
                v-model="checkPrivacy"
                v-bind="v_context.ariaInput"
                class="check-privacy d-flex align-items-center"
              >
                <strong>개인정보처리방침에 동의합니다.</strong>
              </b-checkbox>
              <b-link
                class="privacy-button"
                size="sm"
                outlined
                v-b-modal.modal-privacy
                variant="outline-dark"
                >전문 보기</b-link
              >
              <b-modal id="modal-privacy" size="lg" scrollable hide-footer title="개인정보처리방침">
                <privacy></privacy>
              </b-modal>
            </div>
            <b-form-invalid-feedback
              :state="getValidationState(v_context)"
              id="check-prifacy-invalid-feedback"
              >{{ v_context.errors[0] }}</b-form-invalid-feedback
            >
            <span class="invalid-feedback" v-bind="v_context.ariaMsg">{{
              v_context.errors[0]
            }}</span>
            <!-- <span>{{ JSON.stringify(v_context) }}</span> -->
          </b-form-group>
        </validation-provider>
        <b-button type="submit" variant="primary">신청서를 제출하겠습니다</b-button>
      </b-form>
    </validation-observer>
  </div>
</template>

<script>
// import
import {
  ValidationObserver,
  ValidationProvider,
  extend,
  // extend,
  // localize,
} from 'vee-validate';
import Privacy from '../components/Privacy.vue';

extend('shouldCheck', (value) => value === true);

export default {
  title: '상영 신청',
  name: 'Community',
  components: {
    privacy: Privacy,
    'validation-observer': ValidationObserver,
    'validation-provider': ValidationProvider,
  },
  data() {
    return {
      // required: false,
      showingFeeMap: {
        0: {
          long: 150000,
          short: 100000,
        },
        1: {
          long: 300000,
          short: 150000,
        },
        2: {
          long: 400000,
          short: 200000,
        },
        3: {
          long: 500000,
          short: 250000,
        },
      },
      showingFeePopLabels: {
        0: '30명 이하',
        1: '31 ~ 60명',
        2: '61 ~ 80명',
        3: '81명 이상',
      },
      showingFeeFields: [
        {
          key: 'popClass',
          label: '구분',
          isRowHeader: true,
        },
        {
          key: 'long',
          label: '장편',
        },
        {
          key: 'short',
          label: '단편',
        },
      ],
      required: true,
      checkPrivacy: false,
      mapLoader: null,
      addressNew: '',
      addressOld: '',
      form: {
        a: null,
        companyName: '',
        festivalName: '',
        playdate: null,
        playtimes: null,
        playplace: null,
        username: null,
        userphone: null,
        useremail: null,
        filnmane: null,
        format: null,
        howToReceive: null,
        addressDetailed: '',
        receiveDate: null,
        filmType: '',
        expectedPopulation: '',
        depositdate: null,
        additionalPapers: [],
        others: '',
      },
    };
  },

  computed: {
    disabledReceiveByEmail() {
      return this.form.format !== 'MOV3' && this.form.format !== null;
    },
    receivedByEmail() {
      return this.form.howToReceive === '이메일';
    },
    showingFee() {
      const { expectedPopulation, filmType } = this.form;
      if (expectedPopulation === '' || filmType === '') return 0;
      let fee = this.showingFeeMap[expectedPopulation][filmType];
      fee += fee / 10 + 10000;
      return this.numberWithCommas(fee);
    },
    showingFeeItems() {
      const keys = Object.keys(this.showingFeeMap);
      const items = [];
      keys.forEach((key) => {
        let { long, short } = this.showingFeeMap[key];
        short += short / 10 + 10000;
        long += long / 10 + 10000;
        short = `${this.numberWithCommas(short)}원`;
        long = `${this.numberWithCommas(long)}원`;

        items.push({
          popClass: this.showingFeePopLabels[key],
          long,
          short,
        });
      });
      return items;
    },
  },

  created() {
    this.$loadScript('https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js')
      .then((/* result */) => {
        // console.log(this);
        // console.dir(result);
        const self = this;
        // eslint-disable-next-line no-undef
        this.mapLoader = new daum.Postcode({
          oncomplete(data) {
            console.log(this);
            console.log(data);
            console.log(self);
            self.addressNew = data.address;
            self.addressOld = data.jibunAddress;
            self.form.addressDetailed = data.buildingName;
            // 팝업에서 검색결과 항목을 클릭했을때 실행할 코드를 작성하는 부분입니다.
            // 예제를 참고하여 다양한 활용법을 확인해 보세요.
          },
        });
      })
      .catch((err) => {
        console.log(this);
        console.error(err);
      });
  },

  methods: {
    async submit(isValidPromise) {
      const isValid = await isValidPromise;
      if (isValid) {
        console.log('success!');
        // todo
        this.$router.push({ name: 'SuccessRequest' });
      } else {
        // todo
      }
    },
    getValidationState({ dirty, validated, valid = null }) {
      return dirty || validated ? valid : null;
    },

    openMap() {
      this.mapLoader.open();
    },

    spaced(event) {
      console.log(event.target);
    },
    formatSelected(value) {
      if (value !== 'MOV3') {
        this.form.howToReceive = '택배';
      }
      console.log();
    },
    changedHowToReceive() {
      this.addressNew = '';
      this.addressOld = '';
    },
    numberWithCommas(x) {
      return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    },
  },
};
</script>

<style lang="scss" scoped>
.guide {
  padding: 50px 0;

  max-width: 700px;
  & h2 {
    margin-top: 40px;
    font-size: 22px;
  }
  & li {
    font-size: 16px;
    margin-bottom: 5px;
    & p {
      margin-bottom: 0;
    }
  }

  & hr {
    margin-bottom: 60px;
  }
}

.community-form hr {
  margin: 40px 0;
}

.guide-main {
  font-size: 22px;
  font-weight: 600;
  letter-spacing: -0.7px;
  max-width: 660px;
  margin-bottom: 0;
}

.guide-main-sub {
  font-size: 19px;
  font-weight: 600;
}

.guide-showing-fee {
  text-align: center;
  margin-top: 20px;
}
.community-form h2 {
  margin-top: 70px;
  color: #009eda;
}

.community-form-group {
  max-width: 600px;
  margin: 20px 0;
}

.address-new {
  margin: 10px 0 0;
  font-weight: 500;
}
.address-old {
  font-size: 80%;
  color: #767676;
  margin: 0;
}

#check-privacy {
  margin-top: 50px;
}

.check-privacy-wrapper {
  display: flex;
  align-items: center;
}

.mobile .check-privacy-wrapper {
  margin: 0 -15px;
}

.privacy-button {
  margin-left: 10px;
  font-size: 14px;
  text-decoration: underline;
  transition: 1s;
  &:hover {
    color: #009eda;
    transition: none;
  }
}

.colored-strong {
  color: #009eda;
  font-weight: 700;
}

#showingFee {
  margin-top: 6px;
  font-size: 18px;
  margin-bottom: 0;
  & var {
    font-family: var(--font-family-monospace);
  }
}
</style>

<style lang="scss">
.community-form-group {
  & > label {
    font-weight: 500;
  }
}

.community-form {
  & .custom-control-input.is-valid ~ .custom-control-label,
  & .was-validated .custom-control-input:valid ~ .custom-control-label {
    color: #2b3e4a;
  }
  & .custom-control-input:checked ~ .custom-control-label::before {
    background-color: #009eda;
    border-color: #009eda;
  }
}

.community-form .radio-group,
#additional-papers {
  margin-top: 8px;
}

.mobile .community-form .radio-group {
  margin-top: 0px;
}

.guide-showing-fee tbody tr:last-child {
  border-bottom: 1px solid #dee2e6;
}

</style>
