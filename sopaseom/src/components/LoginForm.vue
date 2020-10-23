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
<template>
  <div>
    <validation-observer ref="observer" v-slot="{ handleSubmit }">
      <!-- @reset="onReset" -->
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
            <!-- <p>{{ getValidationState(validationContext) }}</p> -->
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
</template>

<script>
import url from 'url';
import { graphql } from '@/api/graphql-client';
import router from '@/router';
import { BForm, BFormGroup, BFormInvalidFeedback, BFormInput, BButton } from 'bootstrap-vue';

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
    BFormInput,
    BButton,
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

<style></style>
