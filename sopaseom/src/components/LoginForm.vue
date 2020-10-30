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
    <div class="login-header">
      <img class="logo-main" src="@/assets/sopaseom-logo.svg" alt="" />
    </div>
    <div class="login-body">
      <validation-observer ref="observer" v-slot="{ handleSubmit }">
        <!-- @reset="onReset" -->
        <b-form
          @submit.stop.prevent="handleSubmit(login)"
          v-if="show"
          class="login-form"
        >
          <validation-provider
            name="Email"
            :rules="{ required: true, email: true }"
            v-slot="validationContext"
          >
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
            <!-- <p>{{ getValidationState(validationContext) }}</p> -->
            <!-- <b-form-invalid-feedback id="input-email-live-feedback">
                {{ validationContext.errors[0] }}
              </b-form-invalid-feedback> -->
          </validation-provider>
          <validation-provider
            name="Password"
            :rules="{ required: true }"
            v-slot="validationContext"
          >
            <b-form-input
              type="password"
              class="password-input"
              v-model="pwd"
              placeholder="패스워드"
              @keyup.enter="handleSubmit(login)"
              :disabled="state.loginProcessing"
            ></b-form-input>
            <!-- <b-form-invalid-feedback id="input-pwd-live-feedback">{{
                validationContext.errors[0]
              }}</b-form-invalid-feedback> -->
          </validation-provider>
          <p class="error-msg" v-if="loginFailReason.length > 0">
            {{ loginFailReason }}
          </p>
          <div class="login-button-wrapper">
            <b-button type="submit" class="login-button">로그인</b-button>
          </div>
          <div class="login-sub-menu">
            <div>
              <b-form-checkbox>자동 로그인</b-form-checkbox>
            </div>
            <div>
              <b-link :to="{ name: 'SopakitItems' }"> 아이디 찾기 </b-link>
              <span class="seperator">|</span>
              <b-link>비밀번호 찾기</b-link>
            </div>
          </div>
          <div class="kakao-login-button-wrapper">
            <b-button class="kakao-login-button">
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
            <b-button :to="{ name: 'Join' }" class="join-button"
              >소파섬 회원가입</b-button
            >
          </div>
        </b-form>
      </validation-observer>
    </div>
    <div class="login-footer">
      <p>Copyright © 2020 Cinesopa All Rights Reserved</p>
    </div>
  </div>
</template>

<script>
import url from 'url';
import { graphql } from '@/api/graphql-client';
import router from '@/router';
import {
  BForm,
  BFormGroup,
  BFormInvalidFeedback,
  BFormInput,
  BButton,
  BFormCheckbox,
  BLink,
} from 'bootstrap-vue';

const loginMutation = `
mutation Login ($email: String!, $pwd: String!) {
  login(provider: {email:$email, pwd: $pwd}) {
    wrong_reason
    wrong_pwd_count
    success
    emailVerificationRequired
    user {
      email
      role
      verified
    }
    redirectLink
  }
}
`;

export default {
  components: {
    BForm,
    BFormGroup,
    BFormInvalidFeedback,
    BFormCheckbox,
    BFormInput,
    BLink,
    BButton,
  },
  props: {
    'modal-id': {
      type: String,
      default: '',
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
    };
  },
  methods: {
    async wrongPassword() {
      this.email = '';
      this.pwd = '';
      this.show = false;
      this.$nextTick(() => {
        this.$refs.observer.reset();
        this.show = true;
        this.$nextTick(() => {
          this.$refs.email.focus();
        });
      });
    },

    async login() {
      this.loginFailReason = '';
      this.state.loginProcessing = true;
      await this.loginProcess();
      this.state.loginProcessing = false;
    },

    async loginProcess() {
      const { email, pwd } = this;
      const result = await graphql(loginMutation, { email, pwd });
      this.text = result;

      // 로그인 실패
      if (result.errors) {
        this.loginFailReason = '이메일과 비밀번호가 일치하지 않습니다.';
        await this.wrongPassword();
        return;
      }
      // 데이터로부터 redirectLink가 오면 해당 리다이렉트 페이지로 이동
      const redirectLink = result?.data?.login?.redirectLink;
      if (redirectLink) {
        console.log('#loginProcess');
        console.dir(result.data);
        const parsed = url.parse(redirectLink);
        router.push(parsed.pathname);
      } else {
        console.log('#loginProcess');
        console.log(result);
        router.push({ name: 'Home' });
      }
    },

    getValidationState({ dirty, validated, valid = null }) {
      return dirty || validated ? valid : null;
    },
  },
  created() {
    // console.log(this.$data);
    // => { message: "goodbye", foo: "abc", bar: "def" }
  },
};
</script>

<style lang="scss" scoped>
.login-component {
  max-width: 360px;
  margin: 0 auto;
}

.login-header {
  text-align: center;
  margin-top: -10px;
}

.logo-main {
  width: 113px;
}

.login-body {
  margin-top: 20px;
}
.password-input {
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
</style>

<style>
</style>
