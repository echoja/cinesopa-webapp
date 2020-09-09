<template>
  <div class="container-fluid">
    <div class="guide">
      <h2>
        공동체상영 절차
      </h2>
      <ol>
        <li>
          공동체 상영 신청서를 작성합니다
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
      <p></p>
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
          감독님 섭외 부분은 신청인께서 직접 하셔야함을 알려드립니다. (씨네소파는 신청인과 감독의
          상호 연락처 전달 업무만 담당합니다.)
        </li>
        <li>
          씨네소파는 예비사회적기업으로서 독립영화 저변 확대를 위해 노력하고 있습니다. 이에,
          상영료를 좌석 수가 아닌 관객 수를 기준으로 책정하고 있습니다. 그에 따른 차액만큼
          사회서비스제공확인서(양식제공)를 요청드릴 수 있으니 참고 부탁드립니다.
        </li>
      </ul>
    </div>

    <validation-observer ref="observer" v-slot="{ handleSubmit, validate, errors }">
      <b-form class="community-form" @submit.stop.prevent="submit(validate())">
        <h2>행사 정보</h2>
        <b-form-group
          class="community-form-group"
          label="주최기관 혹은 단체 이름"
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
          <b-form-text>영화를 총 몇 회 상영하는지 적어주세요.</b-form-text>
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
            placeholder="예: 소파극장 (부산시 해운대구)"
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
            placeholder="예: 01012345678"
            :required="required"
          ></b-form-input>
          <b-form-text>반드시 연락 가능한 연락처를 적어주세요. </b-form-text>
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
          <b-form-text>반드시 수신 가능한 이메일을 적어주세요</b-form-text>
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
          <b-form-text
            >하나의 영화만 기재해주세요.<br />여러 영화를 상영하신다면, 각각 신청서를 작성해주시기
            바랍니다.</b-form-text
          >
        </b-form-group>

        <b-form-group
          class="community-form-group"
          label="상영 포맷"
          label-cols-sm="3"
          label-align-sm="left"
          label-size="md"
          label-for="format"
        >
          <b-form-radio-group id="format" @change="formatSelected" v-model="form.format" stacked>
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
        <b-form-group
          class="community-form-group"
          label="상영본 수령 방법"
          label-cols-sm="3"
          label-align-sm="left"
          label-size="md"
          label-for="how-to-receive"
        >
          <b-form-radio-group
            id="how-to-receive"
            :required="required"
            @change="changedHowToReceive"
            v-model="form.howToReceive"
          >
            <b-form-radio value="택배">택배로 수령 (배송비 무료)</b-form-radio>
            <b-form-radio :disabled="disabledReceiveByEmail" value="이메일"
              >이메일로 수령</b-form-radio
            >
            <b-form-text>일반 MOV만 이메일 발송이 가능합니다.</b-form-text>
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
          label="상영본 받을 주소 (상세)"
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
        >
          <b-form-radio-group :required="required" id="film-type" v-model="form.filmType">
            <b-form-radio value="long">장편</b-form-radio>
            <b-form-radio value="short">단편</b-form-radio>
            <b-form-text>영화 길이가 60분 이상이면 장편, 60분 미만이면 단편입니다.</b-form-text>
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
              <option value="">-- 선택해주세요 --</option>
            </template>
            <option :value="0">30명 이하</option>
            <option :value="1">31 ~ 60명</option>
            <option :value="2">61 ~ 80명</option>
            <option :value="3">81명 이상</option>
          </b-form-select>
        </b-form-group>
        <b-form-group
          class="community-form-group"
          label="상영료(부가세 포함)"
          label-cols-sm="3"
          label-align-sm="left"
          label-size="md"
        >
          <p>{{ showingFee }}</p>
        </b-form-group>

        <!-- <p>상영료:</p> -->

        <!-- <datalist id="my-list-id">
          <option>Manual Option</option>
          <option v-for="(size, index) in sizes" :key="index">{{ size }}</option>
        </datalist> -->

        <privacy height="300"></privacy>
        <validation-provider
          :rules="{ shouldCheck: true }"
          :customMessages="{ shouldCheck: '반드시 동의하여야 합니다.' }"
          v-slot="v_context"
        >
          <b-form-group id="check-privacy">
            <b-checkbox
              :state="getValidationState(v_context)"
              v-model="checkPrivacy"
              v-bind="v_context.ariaInput"
              class="check-privacy d-flex align-items-center mt-3"
            >
              <strong>개인정보처리방침에 동의합니다.</strong>
            </b-checkbox>
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
        <b-button type="submit">제출</b-button>
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
  title: '공동체상영 신청',
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
  & h2 {
    font-size: 18px;
  }
  & p,
  & li {
    font-size: 16px;
  }
}
.community-form h2 {
  margin-top: 70px;
  color: var(--link-color);
}

.community-form-group {
  max-width: 600px;
}

.address-new {
  margin: 10px 0 0;
  font-weight: 500;
}
.address-old {
  font-size: 80%;
  color: var(--text-secondary-color);
  margin: 0;
}
</style>

<style lang="scss">
.community-form-group {
  & > label {
    font-weight: 500;
  }
}
</style>
