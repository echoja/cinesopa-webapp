<template>
  <div>
    <p class="main-summary">
      작품 의뢰 주셔서 감사드립니다.
    </p>
    <p class="sub-summary">
      본 신청서를 작성하시면 2주 이내 연락을 드리니, 잠시만 기다려주세요 :)
    </p>

    <!-- <hr /> -->
    <!-- <p class="how-to">
      신청서에 영화를 볼 수 있는 링크를 함께 첨부해주세요.
      <small>
        (반드시 비밀번호가 있는 비공개 링크 첨부)
      </small>
    </p>
    <p class="how-to">*링크 첨부가 어려운 분들은 이메일 coop.cinesopa@gmail.com 으로
      시사용 파일(mp4, avi, wmv / 2GB 이하)을 보내주세요.
   메일 제목에 ‘배급의뢰’와 ‘영화제목’을 꼭 써주세요.</p>
    <p class="how-to">*시사용 DVD를 우편으로 발송할 경우에는 포장 겉면에 반드시 <배급의뢰신청>이라고 기재하시고 아래 주소로 보내주세요.
  부산광역시 해운대구 재반로</p>
    <p class="how-to">내부 시사 후 15일 이내에 메일로 연락드립니다.</p> -->
    <validation-observer ref="observer" v-slot="{ /*handleSubmit, */ validate /*errors*/ }">
      <!-- <b-button @click="log(validate(), errors)">체크체크</b-button> -->
      <b-form class="distribution-form" @submit.stop.prevent="submit(validate())">
        <!-- <b-input type="text" required></b-input> -->

        <hr />
        <h2>신청인</h2>
        <b-form-group
          class="distribution-form-group"
          label="이름"
          label-cols-sm="3"
          label-align-sm="left"
          label-size="md"
          label-for="user-name"
        >
            <!-- placeholder="박소파" -->
          <b-form-input
            class="underlined-box"
            v-model="form.user.name"
            id="user-name"
            type="text"
            :required="required"
          ></b-form-input>
        </b-form-group>
        <b-form-group
          class="distribution-form-group"
          label="이메일"
          label-cols-sm="3"
          label-align-sm="left"
          label-size="md"
          label-for="user-email"
        >
            <!-- placeholder="cinesopa@example.com" -->
          <b-form-input
            class="underlined-box"
            v-model="form.user.email"
            id="user-email"
            type="email"
            :required="required"
          ></b-form-input>
        </b-form-group>
        <b-form-group
          class="distribution-form-group"
          label="연락처"
          label-cols-sm="3"
          label-align-sm="left"
          label-size="md"
          label-for="user-phone"
          description="'-' 없이 숫자만 입력해주세요."
        >
            <b-form-input
              class="underlined-box"
              v-model="form.user.phone"
              type="text"
              id="user-phone"
              
              :required="required"
            ></b-form-input>
        </b-form-group>
                <b-form-group
          class="distribution-form-group"
          label="역할"
          label-cols-sm="3"
          label-align-sm="left"
          label-size="md"
          label-for="user-role"
        >
         <b-form-select
            class="rounded-box w-50"
            v-model="form.user.role"
            id="user-role"
            placeholder=""
            :required="required"
          >
            <!-- <template v-slot:first>
              <option value="">-- 형식 --</option>
            </template> -->
            <!-- <option :value="''">선택</option> -->
            <option :value="'감독'">감독</option>
            <option :value="'프로듀서'">프로듀서</option>
            <option :value="'기타'">기타</option>
          </b-form-select>
                </b-form-group>

        <!-- <h2 class="d-flex align-items-center">
          감독
          <b-form-checkbox
            @change="isUserSameWithDirectorChanged"
            v-model="form.isUserSameWithDirector"
            class="same"
            >신청인 정보와 동일</b-form-checkbox
          >
        </h2>
        <b-form-group
          class="distribution-form-group"
          label="이름"
          label-cols-sm="3"
          label-align-sm="left"
          label-size="md"
          label-for="director-name"
        >
          <b-form-input
            class="underlined-box"
            v-model="form[directorInfoFrom].name"
            id="director-name"
            type="text"
            :placeholder="form.isUserSameWithDirector ? '' : '김감독'"
            :disabled="form.isUserSameWithDirector"
          ></b-form-input>
        </b-form-group>
        <b-form-group
          class="distribution-form-group"
          label="이메일"
          label-cols-sm="3"
          label-align-sm="left"
          label-size="md"
          label-for="director-email"
        >
          <b-form-input
            class="underlined-box"
            v-model="form[directorInfoFrom].email"
            id="director-email"
            type="email"
            :placeholder="form.isUserSameWithDirector ? '' : 'cinesopa@example.com'"
            :disabled="form.isUserSameWithDirector"
          ></b-form-input>
        </b-form-group>
        <b-form-group
          class="distribution-form-group"
          label="연락처"
          label-cols-sm="3"
          label-align-sm="left"
          label-size="md"
          label-for="director-phone"
        >
          <b-form-input
            class="underlined-box"
            v-model="form[directorInfoFrom].phone"
            type="text"
            id="director-phone"
            :placeholder="form.isUserSameWithDirector ? '' : '\'-\' 없이 숫자만 입력'"
            :disabled="form.isUserSameWithDirector"
          ></b-form-input>
        </b-form-group> -->

        <h2>
          작품 정보
        </h2>
        <b-form-group
          class="distribution-form-group"
          label="한글 제목"
          label-cols-sm="3"
          label-align-sm="left"
          label-size="md"
          label-for="film-title"
        >
          <b-form-input
            class="underlined-box"
            v-model="form.film.title"
            type="text"
            id="film-title"
            placeholder=""
            :required="required"
          ></b-form-input>
        </b-form-group>
        <b-form-group
          class="distribution-form-group"
          label="영어 제목"
          label-cols-sm="3"
          label-align-sm="left"
          label-size="md"
          label-for="film-title_en"
        >
          <b-form-input
            class="underlined-box"
            v-model="form.film.title_en"
            type="text"
            id="film-title_en"
            placeholder=""
            :required="required"
          ></b-form-input>
        </b-form-group>
         <b-form-group
          class="distribution-form-group"
          label="감독 이름"
          label-cols-sm="3"
          label-align-sm="left"
          label-size="md"
          label-for="film-director_name"
        >
          <b-form-input
            class="underlined-box"
            v-model="form.film.director_name"
            type="text"
            id="film-director_name"
            placeholder=""
            :required="required"
          ></b-form-input>
        </b-form-group>
        <!-- <b-form-group
          class="distribution-form-group"
          label="길이 구분"
          label-cols-sm="3"
          label-align-sm="left"
          label-size="md"
          label-for="film-islong"
        >
          <b-form-select
            class="rounded-box w-50"
            v-model="form.film.islong"
            id="film-islong"
            placeholder=""
            :required="required"
          >
            <option :value="true">장편</option>
            <option :value="false">단편</option>
          </b-form-select>
          <b-form-text>60분보다 길면 장편, 짧으면 단편입니다.</b-form-text>
        </b-form-group> -->
        <b-form-group
          class="distribution-form-group"
          label="형식"
          label-cols-sm="3"
          label-align-sm="left"
          label-size="md"
          label-for="film-type"
        >
          <b-form-select
            class="rounded-box w-50"
            v-model="form.film.type"
            id="film-type"
            placeholder=""
            :required="required"
          >
            <!-- <template v-slot:first>
              <option value="">-- 형식 --</option>
            </template> -->
            <option :value="'극영화'">극영화</option>
            <option :value="'실험영화'">실험영화</option>
            <option :value="'다큐멘터리'">다큐멘터리</option>
            <option :value="'애니메이션'">애니메이션</option>
            <option :value="'기타'">기타</option>
          </b-form-select>
        </b-form-group>
        <b-form-group
          class="distribution-form-group"
          label="러닝타임"
          label-cols-sm="3"
          label-align-sm="left"
          label-size="md"
          label-for="film-runningtime"
        >
          <div class="d-flex align-items-center">
            <b-form-input
              class="underlined-box"
              v-model="form.film.runningtime"
              type="number"
              id="film-runningtime"
              :required="required"
              placeholder=""
            ></b-form-input>
            <div class="w-50">분</div>
          </div>
        </b-form-group>
        <b-form-group
          class="distribution-form-group"
          label="제작일"
          label-cols-sm="3"
          label-align-sm="left"
          label-size="md"
          label-for="film-prod_date"
        >
            <!-- :required="required" -->
          <b-form-datepicker
            class="underlined-box"
            v-model="form.film.prod_date"
            id="film-prod_date"
            placeholder=""
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
            <!-- <template #button-content>
              날짜 선택
            </template> -->
          </b-form-datepicker>
        </b-form-group>
        <b-form-group
          class="distribution-form-group wide"
          label="시놉시스"
          label-cols-sm="3"
          label-align-sm="left"
          label-size="md"
          label-for="film-synopsis"
        >
          <b-form-textarea
            v-model="form.film.synopsis"
            size="sm"
            id="film-synopsis"
            placeholder=""
            :required="required"
            rows="5"
          ></b-form-textarea>
        </b-form-group>
        <b-form-group
          class="distribution-form-group wide"
          label="연출의도"
          label-cols-sm="3"
          label-align-sm="left"
          label-size="md"
          label-for="film-purpose"
        >
          <b-form-textarea
            v-model="form.film.purpose"
            size="sm"
            id="film-purpose"
            placeholder=""
            :required="required"
            rows="5"
          ></b-form-textarea>
        </b-form-group>
        <b-form-group
          class="distribution-form-group wide"
          label="영화제 리스트"
          label-cols-sm="3"
          label-align-sm="left"
          label-size="md"
          label-for="film-festival_list"
        >
          <b-form-textarea
            v-model="form.film.festival_list"
            size="sm"
            id="film-festival_list"
            placeholder="예) 2019 제24회 부산국제영화제 단편경쟁 수상(김감독)"
            rows="5"
          ></b-form-textarea>
        </b-form-group>

        <b-form-group
          class="distribution-form-group"
          label="스크리너 링크"
          label-cols-sm="3"
          label-align-sm="left"
          label-size="md"
          label-for="film-link"
          description="비밀번호로 보호된, vimeo 및 youtube 등의 링크를 적어주세요."
        >
            <b-form-input
              class="underlined-box"
              v-model="form.film.link"
              type="text"
              id="film-link"
              :required="required"
            ></b-form-input>
        </b-form-group>
        <b-form-group
          class="distribution-form-group"
          label="비밀번호"
          label-cols-sm="3"
          label-align-sm="left"
          label-size="md"
          label-for="film-linkpw"
        >
          <b-form-input
            class="underlined-box"
            v-model="form.film.linkpw"
            type="text"
            id="film-linkpw"
            placeholder=""
            :required="required"
          ></b-form-input>
        </b-form-group>

        <b-form-group
          class="distribution-form-group wide"
          label="기타 정보"
          label-cols-sm="3"
          label-align-sm="left"
          label-size="md"
          label-for="film-etc"
          description="기타 참고할 만한 정보를 적어주세요."
        >
          <b-form-textarea
            v-model="form.film.etc"
            size="sm"
            id="film-etc"
            rows="5"
          ></b-form-textarea>
        </b-form-group>

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

        <b-button class="submit" type="submit" variant="primary">의뢰서를 제출합니다</b-button>
        <!-- </b-col>
      </b-row> -->
      </b-form>
    </validation-observer>
  </div>
</template>

<script>
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
  title: '배급의뢰',
  name: 'Distribution',
  components: {
    privacy: Privacy,
    'validation-observer': ValidationObserver,
    'validation-provider': ValidationProvider,
  },
  data() {
    return {
      required: true,
      // required: false,
      checkPrivacy: false,
      form: {
        isUserSameWithDirector: false,
        user: {
          name: null,
          email: null,
          phone: null,
          role: '감독',
        },
        director: {
          name: null,
          email: null,
          phone: null,
        },
        film: {
          title: null,
          title_en: null,
          director_name: '',
          islong: true,
          type: '극영화',
          runningtime: null,
          prod_date: null,
          synopsis: '',
          purpose: '',
          festival_list: '',
          link: '',
          linkpw: '',
          etc: '',
        },
      },
    };
  },
  methods: {
    fillDirectorInfo() {
      this.form.director.name = this.form.user.name;
      this.form.director.email = this.form.user.email;
      this.form.director.phone = this.form.user.phone;
    },
    isUserSameWithDirectorChanged(checked) {
      if (checked) {
        this.form.director.name = '';
        this.form.director.email = '';
        this.form.director.phone = '';
      } else {
        //
      }
    },
    async submit(isValidPromise) {
      const isValid = await isValidPromise;
      if (isValid) {
        // todo
        // console.log('hi!! success!');
        this.$router.push({ name: 'SuccessRequest' });
      } else {
        // this.$scrollTo(this.$refs.observer.$el, 500);
      }
    },
    async log(any, errors) {
      any
        .then((result) => {
          // console.log(`result! ${result}`);
        })
        .catch((err) => {
          // console.log(`err! ${err}`);
        });
      // const result = await any;
      // console.log(result);
      console.dir(errors);
      console.dir(await this.$refs.observer.validate());
      this.$scrollTo(this.$refs.observer.$el, 500);
    },
    getValidationState({ dirty, validated, valid = null }) {
      return dirty || validated ? valid : null;
    },
  },
  computed: {
    directorInfoFrom() {
      return this.form.isUserSameWithDirector ? 'user' : 'director';
    },
  },
};
</script>

<!---------------------------------------------------------------->
<!-----------------------    SCOPED SCSS    ---------------------->
<!---------------------------------------------------------------->

<style lang="scss" scoped>
.distribution-form h2 {
  margin-top: 70px;
  color: #009eda;
}
.underlined-box {
  border: 0;
  border-radius: 0;
  border-bottom: 1px solid #ddd;
}
.distribution-form-group {
  max-width: 500px;
  margin: 20px 0;

  &.wide {
    max-width: 700px;
  }
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

.main-summary {
  padding: 50px 0 0;
  font-size: 22px;
  font-weight: 600;
  letter-spacing: -0.7px;
  margin-bottom: 0;
}
.mobile .main-summary {
  font-size: 18px;
}
.sub-summary {
  font-size: 19px;
  font-weight: 600;
}
.mobile .sub-summary {
  font-size: 16px;
}

// .distribution-form-group input::placeholder {
//   font-weight:300;
//   // color: #fff;
// }

.submit {
  font-size: 18.7px;
  font-weight: bold;
  padding: 10px 20px;
}

</style>


<!---------------------------------------------------------------->
<!-----------------------    NORMAL SCSS    ---------------------->
<!---------------------------------------------------------------->

<style lang="scss">
.distribution-form {
  & .custom-control-input:checked ~ .custom-control-label::before {
    background-color: #009eda;
    border-color: #009eda;
  }
  & .custom-control {
    min-height: 1.2rem;
    align-items: center;
    display: flex;
  }
  & .custom-control-label::after,
  & .custom-control-label::before {
    top: 50%;
    transform: translateY(-45%);
    left: -1.4rem;
  }
  & .distribution-form-group > label {
    font-weight: 500;
    max-width: 120px;
    // flex-shrink: 0;
    // flex-grow: 0;
  }
  & .custom-control-input.is-valid ~ .custom-control-label,
  & .was-validated .custom-control-input:valid ~ .custom-control-label {
    color: #2b3e4a;
  }
}

.distribution-form .radio-group {
  margin-top: 8px;
}

.mobile .distribution-form .radio-group {
  margin-top: 0px;
}

.same {
  font-size: 14px;
  display: inline-block;
  margin-left: 30px;
  color: #767676;
}
</style>
