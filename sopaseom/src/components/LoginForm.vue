<!--
Name        Type        Description
errors        string[]        The list of error messages.
failedRules        [x: string]: string        A map object of failed
rules with (rule, message) as a (key, value)
valid        boolean | null        The current validation state.
flags        { [x: string]: boolean }        The flags map object state.
aria        { [x: string]: string }        Map object of aria attributes for accessibility.
classes        { [x: string]: boolean }        Map object of the classes
configured based on the validation state.
validate        (e: any) => Promise        A function that is used as an event handler to trigger v
alidation. Useful for fields that do not use v-model.
reset        () => void        A function that resets the validation state on the provider.
*/

// const exampleQuery = `
// {
//   users {
//     id
//     email
//   }
// }
// `;

// /**
//  * 비동기 함수를 받아서, 해당 함수가 다 완료되었는지 아닌지를 체크하는 데이터와 함수를 추가하는 mixin 생성기
//  * mixin에 얘를 호출한 결과를 넣으면 됨.
//  * @param {string} processingCheckVarName func가 진행중이라면 true, 그렇지 않으면
//  * false 를 나타내는 체크 변수 이름 (data에 추가됨)
//  * @param {string} methodName 생성할 method이름.
//  * @param {Promise<function>} func 비동기 함수 본체
//  */
// const makeProcessingMixin = (processingCheckVarName, methodName, func) => ({
//   data() {
//     return {
//       [processingCheckVarName]: false,
//     };
//   },
//   methods: {
//     async [methodName](...args) {
//       this[processingCheckVarName] = true;
//       await func(...args);
//       this[processingCheckVarName] = false;
//     },
//   },
// });

-->

<!-- old version -->
<!--<template>
  <div>
    <validation-observer ref="observer" v-slot="{ handleSubmit }">

      <b-form @submit.stop.prevent="handleSubmit(login)" v-if="show">
        <validation-provider
          name="Email"
          :rules="{ required: true, email: true }"
          v-slot="validationContext"
        >
          <b-form-group id="input-email-group" label="이메일 주소" label-for="input-email">
            <b-form-input
              ref="email"
              id="input-email"
              name="input-email"
              :state="getValidationState(validationContext)"
              trim
              type="email"
              v-model="email"
              placeholder="이메일"
              :disabled="state.loginProcessing"
              @keyup.enter="handleSubmit(login)"
            ></b-form-input>
            <b-form-invalid-feedback id="input-email-live-feedback">
              {{ validationContext.errors[0] }}
            </b-form-invalid-feedback>
          </b-form-group>
        </validation-provider>
        <validation-provider name="Password" :rules="{ required: true }" v-slot="validationContext">
          <b-form-group id="input-pwd-group" label="비밀번호" label-for="input-pwd">
            <b-form-input
              type="password"
              v-model="pwd"
              placeholder="패스워드"
              @keyup.enter="handleSubmit(login)"
              :disabled="state.loginProcessing"
            ></b-form-input>
            <b-form-invalid-feedback id="input-pwd-live-feedback">{{
              validationContext.errors[0]
            }}</b-form-invalid-feedback>
          </b-form-group>
        </validation-provider>
        <p class="error-msg" v-if="loginFailReason.length > 0">{{ loginFailReason }}</p>
        <b-button type="submit">로그인</b-button>
      </b-form>
    </validation-observer>

    <p>{{ text }}</p>
  </div>
</template> -->

<template>
  <div class="login-component">
    <div class="login-header" v-if="!shouldHideLogo">
      <img class="logo-main" src="@/assets/sopaseom-logo.svg" alt="" />
    </div>
    <h2 class="mobile-title">계정으로 로그인</h2>
    <div class="login-body">
      <!-- v-slot="{ handleSubmit, invalid }" -->
      <!-- <validation-observer ref="observer"> -->
      <!-- @reset="onReset" -->
      <!-- @submit.stop.prevent="handleSubmit(login)" -->
      <b-form v-if="show" class="login-form" ref="form">
        <validation-provider
          ref="emailProvider"
          name="Email"
          :rules="{ required: true, email: true }"
          v-slot="vcon"
        >
          <!-- :state="getValidationState(vcon)" -->
          <b-form-input
            ref="email"
            id="input-email"
            name="input-email"
            debounce="300"
            trim
            type="email"
            v-model="email"
            placeholder="이메일"
            :disabled="state.loginProcessing"
            @keyup.enter="loginButtonClicked"
            @input="inputted('email')"
          ></b-form-input>
          <b-tooltip
            target="input-email"
            triggers="manual"
            placement="right"
            :show="validate.email.showTooltip"
          >
            {{ vcon.errors[0] }}
          </b-tooltip>
          <!-- <p>{{ getValidationState(validationContext) }}</p> -->
          <!-- <b-form-invalid-feedback id="input-email-live-feedback">
                {{ validationContext.errors[0] }}
              </b-form-invalid-feedback> -->
        </validation-provider>
        <validation-provider
          name="Password"
          ref="passwordProvider"
          :rules="{ required: true }"
          v-slot="vcon"
        >
          <b-form-input
            type="password"
            id="input-password"
            class="input-password"
            ref="password"
            v-model="pwd"
            placeholder="비밀번호"
            @keyup.enter="loginButtonClicked"
            :disabled="state.loginProcessing"
            @input="inputted('password')"
          ></b-form-input>
          <b-tooltip
            target="input-password"
            triggers="manual"
            placement="right"
            :show="validate.password.showTooltip"
          >
            {{ vcon.errors[0] }}
          </b-tooltip>
          <!-- <b-form-invalid-feedback id="input-pwd-live-feedback">{{
                validationContext.errors[0]
              }}</b-form-invalid-feedback> -->
        </validation-provider>

        <div class="login-button-wrapper">
          <b-button @click="loginButtonClicked" class="login-button"
            >로그인</b-button
          >
        </div>

        <div class="login-sub-menu">
          <div>
            <b-form-checkbox v-model="autoLogin">자동 로그인</b-form-checkbox>
          </div>
          <div>
            <b-link :to="{ name: 'ChangePasswordRequest' }" @click="closeModal"
              >비밀번호 재설정</b-link
            >
            <!-- <span class="seperator">|</span>
              <b-link>비밀번호 찾기</b-link> -->
          </div>
        </div>
        <p class="error-msg" v-if="loginFailReason.length > 0">
          <font-awesome-icon
            class="exclamation-icon"
            :icon="['fas', 'exclamation-circle']"
          >
          </font-awesome-icon>
          {{ loginFailReason }}
        </p>
        <div class="kakao-login-button-wrapper">
          <b-button @click="kakaoLoginButtonClicked" class="kakao-login-button">
            <svg
              class="kakaotalk-logo"
              width="17.67"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 17.67 16.4"
            >
              <path
                fill="#381e1f"
                d="M17.67,7.26c0,4-4,7.26-8.83,7.26A10.18,10.18,0,0,1,4,13.35,7,7,0,0,1,0,7.26C0,3.25,4,0,8.84,0S17.67,3.25,17.67,7.26Z"
              />
              <polygon
                fill="#381e1f"
                points="3.14 16.4 7.46 14.43 4.03 13.35 3.14 16.4"
              />
            </svg>
            <span class="kakao-login-button-text"
              ><span class="bold">카카오</span>로 로그인</span
            ></b-button
          >
        </div>
        <div class="join-guide">
          <p class="join-guide-text">아직 회원이 아니신가요?</p>
          <b-button
            :to="{ name: 'Join' }"
            @click="closeModal"
            class="join-button"
            >소파섬 회원가입</b-button
          >
        </div>
      </b-form>
      <!-- </validation-observer> -->
    </div>
    <div class="login-footer">
      <p>Copyright © 2020 Cinesopa All Rights Reserved</p>
    </div>
  </div>
</template>

<script>
import url from 'url';
import { checkAuth, makeSimpleMutation } from '@/api/graphql-client';
import router from '@/router';
import {
  BForm,
  // BFormGroup,
  // BFormInvalidFeedback,
  BFormInput,
  BButton,
  BFormCheckbox,
  BLink,
  BTooltip,
} from 'bootstrap-vue';
import { mapActions } from 'vuex';

// const loginMutation = `
// mutation Login ($email: String!, $pwd: String!) {
//   login(provider: {email:$email, pwd: $pwd}) {
//     wrong_reason
//     wrong_pwd_count
//     success
//     emailVerificationRequired
//     user {
//       email
//       role
//       verified
//     }
//     redirectLink
//   }
// }
// `;
const loginRequest = makeSimpleMutation('login');

export default {
  components: {
    BForm,
    // BFormGroup,
    // BFormInvalidFeedback,
    BFormCheckbox,
    BFormInput,
    BLink,
    BButton,
    BTooltip,
  },
  props: {
    modalId: {
      type: String,
      default: '',
    },
    hideLogo: {
      type: String,
      deafult: null,
    },
  },
  data() {
    return {
      state: {
        loginProcessing: false,
      },
      email: '',
      pwd: '',
      text: '',
      show: true,
      loginFailReason: '',
      autoLogin: true,
      validate: {
        email: {
          provider: 'emailProvider',
          showTooltip: false,
          tooltipText: '',
          tooltipTimer: 0,
        },
        password: {
          provider: 'passwordProvider',
          showTooltip: false,
          tooltipText: '',
          tooltipTimer: 0,
        },
      },
    };
  },
  computed: {
    shouldHideLogo() {
      const t = typeof this.hideLogo;
      return t === 'string' || t === true;
    },
    disableSession() {
      return !this.autoLogin;
    },
  },
  methods: {
    ...mapActions(['pushMessage', 'getCurrentUser']),
    async initWhenLoginFail() {
      // this.email = '';
      // this.pwd = '';
      this.$nextTick(() => {
        // console.log('# loginForm initWhenLoginFail password');
        // console.log(this.$refs.password);
        this.$refs.password.select();
      });
    },

    async login() {
      // this.loginFailReason = '';
      this.state.loginProcessing = true;
      await this.loginProcess();
      this.state.loginProcessing = false;
    },
    async loginProcess() {
      const { email, pwd } = this;
      // const result = await graphql(loginMutation, { email, pwd });
      const login = await loginRequest(
        { provider: { email, pwd, disableSession: this.disableSession } },
        `{ wrong_reason
        wrong_pwd_count
        success
        emailVerificationRequired
        user {
          email
          role
          verified
        }
        redirectLink
      }`,
      );
      this.text = login;

      // 권한 자체가 잘못된 문제. 이미 로그인된 상태인데 로그인 창이 떠있는 상태.
      if (!login) {
        this.closeModal();
        // 현재 페이지를 새로고침.
        router.go();
        return;
      }

      const {
        redirectLink,
        user,
        success,
        wrong_reason,
        wrong_pwd_count,
      } = login;

      console.log(`wrong_reason: ${wrong_reason}`);
      // 로그인 실패
      if (!success) {
        if (wrong_reason === 'too_much_attempt') {
          this.loginFailReason =
            '로그인 시도 허용횟수를 초과했습니다. 비밀번호를 재설정해주세요.';
        } else if (wrong_reason === 'no_email') {
          this.loginFailReason =
            '이메일이 존재하지 않습니다. 회원가입 하거나 카카오로 로그인 해주세요.';
        } else if (wrong_reason === 'wrong_pwd') {
          this.loginFailReason = '비밀번호가 일치하지 않아요.';
          if (wrong_pwd_count >= 2 && wrong_pwd_count <= 4) {
            this.loginFailReason += ` 로그인을 연속해서 실패하면 비밀번호를 재설정해야 합니다. (${wrong_pwd_count} / 5)`;
          }
        }
        await this.initWhenLoginFail();
        return;
      }

      // !! 로그인 성공
      // 로그인 창 없애기
      this.closeModal();

      // 로그인 성공한 유저를 현재 상태에 저장
      // this.$store.commit('setCurrentUser', { currentUser: user });
      checkAuth();

      // 이벤트 발생
      this.$emit('login-success', login);

      // 성공했다는 메시지 띄우기
      this.pushMessage({
        type: 'success',
        msg: '성공적으로 로그인 되었습니다.',
        id: 'loginSuccess',
      });
    },
    loginButtonClicked() {
      // validation 실시
      const providerJobs = [];
      Object.keys(this.validate).forEach((name) => {
        const item = this.validate[name];
        const provider = this.$refs[item.provider];
        // validation 작업이 비동기로 이루어지기 때문에
        // Promise 를 이용하여 다 넣음.
        providerJobs.push(
          new Promise((resolve, reject) => {
            provider
              .validate()
              .then((result) => {
                const { valid } = result;
                // validation 을 통과하지 못했다면, 툴팁을 나타나도록 함.
                if (!valid) {
                  item.showTooltip = true;
                  // 3초 뒤에 툴팁이 사라지도록 함.
                  // 만약 사라지는 timeout 이 이미 존재한다면, 그것을 삭제함.
                  if (item.tooltipTimer !== 0) {
                    clearTimeout(item.tooltipTimer);
                  }
                  item.tooltipTimer = setTimeout(() => {
                    item.showTooltip = false;
                  }, 3000);
                }
                return resolve(result);
              })
              .catch((err) => reject(err));
          }),
        );
      });
      // 모든 validation 작업이 완료되었을 때
      Promise.allSettled(providerJobs)
        .then((proms) => {
          if (proms.every((prom) => prom.value.valid)) {
            this.login();
          }
        })
        .catch((error) => {});

      // 모든 validation 이 만족하는지 체크
    },

    closeModal() {
      if (this.modalId !== '') {
        this.$bvModal.hide(this.modalId);
      }
    },

    getValidationState({ dirty, validated, valid = null }) {
      return dirty || validated ? valid : null;
    },

    inputted(refname) {
      if (this.validate[refname].showTooltip !== false) {
        this.validate[refname].showTooltip = false;
      }
    },

    kakaoLoginButtonClicked() {
      window.location.href = '/graphql/kakao/login';
      // this.$router.push('/graphql/kakao/login');
    },
  },
  created() {
    // console.log(this.$data);
    // => { message: "goodbye", foo: "abc", bar: "def" }
  },
};
</script>

<style lang="scss" scoped>
@import '@/common';

.login-component {
  max-width: 360px;
  margin: 0 auto;
}

.login-header {
  text-align: center;
  margin-top: -10px;
}
@include max-with(sm) {
  .login-header {
    margin-top: 0px;
  }
}

.logo-main {
  width: 113px;
}
@include max-with(sm) {
  .logo-main {
    display: none;
  }
}

.mobile-title {
  display: none;
  margin-top: 20px;
}
@include max-with(sm) {
  .mobile-title {
    display: block;
    font-size: 16px;
    text-align: center;
    font-weight: bold;
  }
}
.login-body {
  margin-top: 40px;
}
@include max-with(sm) {
  .login-body {
    margin-top: 20px;
  }
}

.input-password {
  margin-top: -1px;
}

.login-form input {
  border-radius: 0;
  border-color: #000;
  height: 50px;
  position: relative;
  // :focus {
  // }
}
.login-form input:focus {
  z-index: 1;
}

.seperator {
  padding: 0 5px;
}

.login-sub-menu {
  display: flex;
  justify-content: space-between;
  margin-top: 12px;
}
@include max-with(sm) {
  .login-sub-menu {
    font-size: 14px;
  }
}

.login-button {
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #000;
  border: 0;
  border-radius: 0;
  width: 100%;
  height: 50px;
  font-weight: 500;
  font-size: 16px;
}

.kakao-login-button-wrapper {
  margin-top: 27px;
}
.kakao-login-button {
  // background-color: #FFCD00;
  background-color: #f9e332;
  border: 0;
  border-radius: 0;
  display: flex;
  width: 100%;
  color: #381e1f;
  align-items: center;
  justify-content: center;
  height: 50px;
}

.kakaotalk-logo {
  margin-right: 10px;
}

.kakao-login-button-text {
  margin-top: -2px;
  font-size: 16px;
  font-weight: 500;
  .bold {
    font-weight: bold;
  }
}

.join-guide {
  margin-top: 40px;
  text-align: center;
}

.join-guide-text {
  margin-bottom: 8px;
  font-size: 14px;
}

.join-button {
  background-color: #fff;
  border-radius: 0;
  // border-width: 2px;
  color: #000;
  border-color: #000;
  padding: 8px 20px;
  font-weight: 500;
  font-size: 16px;
}

.login-footer {
  margin: 60px 0 0;
}

.login-footer p {
  font-size: 9px;
  text-align: center;
  margin: 0;
}

/** error */
.exclamation-icon {
  margin-right: 5px;
}

.error-msg {
  padding: 10px;
  background-color: #fff;
  font-weight: bold;
}
</style>

<style>
</style>
