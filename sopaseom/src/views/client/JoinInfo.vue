<template>
  <div>
    <b-form>
      <validation-provider
        ref="emailProvider"
        name="Email"
        :rules="{ required: true, email: true }"
        v-slot="vcon"
      >
        <!-- :state="getValidationState(vcon)" -->
        <!-- id="fieldset-1"
      description="Let us know your name."
      label="Enter your name"
      label-for="input-1"
      valid-feedback="Thank you!"
      :invalid-feedback="invalidFeedback"
      :state="state" -->
        <!-- :invalid-feedback="emailAlreadyExistsErrorMsg" -->
        <b-form-group label="이메일" label-for="input-email">
          <b-form-input
            ref="email"
            id="input-email"
            name="input-email"
            debounce="500"
            trim
            type="email"
            placeholder="example@sopa.com"
            v-model="validate.email.value"
            @keyup.enter="nextButtonClicked"
            :state="emailIsValid"
            @update="inputted('email')"
          ></b-form-input>
          <!-- <b-tooltip
            target="input-email"
            triggers="manual"
            placement="right"
            :show="validate.email.showTooltip"
          >
            {{ vcon.errors[0] }}
          </b-tooltip> -->
          <!-- id="email-invalid-feedback" -->
          <b-form-invalid-feedback :state="emailIsValid">
            {{ emailAlreadyExistsErrorMsg || emailValidationFailMessage }}
          </b-form-invalid-feedback>
        </b-form-group>
        <!-- <p>{{ getValidationState(validationContext) }}</p> -->
        <!-- <b-form-invalid-feedback id="input-email-live-feedback">
                {{ validationContext.errors[0] }}
              </b-form-invalid-feedback> -->
      </validation-provider>
      <validation-provider
        name="Password"
        ref="passwordProvider"
        :rules="{ required: true, password_min: 8 }"
        v-slot="vcon"
      >
        <b-form-group label="비밀번호" label-for="input-password">
          <!-- description="비밀번호는 최소 8자 이상이어야 합니다." -->
          <b-form-input
            type="password"
            id="input-password"
            class="input-password"
            v-model="validate.password.value"
            @keyup.enter="nextButtonClicked"
            :state="validate['password'].valid"
            @update="inputted('password')"
          ></b-form-input>
          <template
            #description
            v-if="
              (validate['password'].valid === null) | validate['password'].valid
            "
          >
            비밀번호는 최소 8자 이상이어야 합니다.
          </template>
          <b-form-invalid-feedback :state="validate['password'].valid">
            {{ vcon.errors[0] }}
          </b-form-invalid-feedback>
          <!-- <b-tooltip
            target="input-password"
            triggers="manual"
            placement="right"
            :show="validate.password.showTooltip"
          >
            {{ vcon.errors[0] }}
          </b-tooltip> -->
          <!-- <b-form-invalid-feedback id="input-pwd-live-feedback">{{
                validationContext.errors[0]
              }}</b-form-invalid-feedback> -->
        </b-form-group>
      </validation-provider>
      <validation-provider
        name="Password"
        ref="passwordAgainProvider"
        :rules="{
          required: true,
          password_same: { other: validate.password.value },
        }"
        v-slot="vcon"
      >
        <b-form-group label="비밀번호 재입력" label-for="input-password-again">
          <b-form-input
            type="password"
            id="input-password-again"
            class="input-password-again"
            v-model="validate['password-again'].value"
            @keyup.enter="nextButtonClicked"
            :state="validate['password-again'].valid"
            @update="inputted('password-again')"
          ></b-form-input>
          <b-form-invalid-feedback :state="validate['password-again'].valid">
            {{ vcon.errors[0] }}
          </b-form-invalid-feedback>

          <!-- <b-tooltip
            target="input-password-again"
            triggers="manual"
            placement="right"
            :show="validate['password-again'].showTooltip"
          >
            {{ vcon.errors[0] }}
          </b-tooltip> -->
          <!-- <b-form-invalid-feedback id="input-pwd-live-feedback">{{
                validationContext.errors[0]
              }}</b-form-invalid-feedback> -->
        </b-form-group>
      </validation-provider>
      <div class="next-button-wrapper">
        <b-button
          class="next-button"
          @click="nextButtonClicked"
          :disabled="!canNext || joinProcessing"
        >
          <span v-if="joinProcessing">
            <b-spinner></b-spinner>
          </span>
          <span v-else>가입</span>
        </b-button>
      </div>
    </b-form>
  </div>
</template>

<script>
import {
  BFormGroup,
  BFormInput,
  // BTooltip,
  BButton,
  BForm,
  BFormInvalidFeedback,
  BOverlay,
  BSpinner,
} from 'bootstrap-vue';
import { graphql } from '@/loader';

import { mapGetters, mapMutations, mapState } from 'vuex';
import { checkAuth, manualCheckAuth } from '@/api/graphql-client';

const userExistsQuery = `
query userExistsQuery($email: String!) {
  userExists(email: $email) {
    email
    kakao
    pwd
  }
}
`;

const createGuestMutation = `
mutation createGuestMutation($email: String!, $pwd: String!, $user_agreed: UserAgreedInput, $debug: Boolean) {
  createGuest(email: $email, pwd: $pwd, user_agreed: $user_agreed, debug: $debug) {
    email
    role
    verified
    has_pwd
    user_agreed {
      privacy
      policy
      advertisement
    }
  }
}
`;

export default {
  title: '회원가입 - 정보입력',
  components: {
    BFormGroup,
    BFormInput,
    // BTooltip,
    BButton,
    BForm,
    BFormInvalidFeedback,
    BOverlay,
    BSpinner,
  },
  data() {
    return {
      emailAlreadyExists: false,
      emailAlreadyExistsErrorMsg: '',
      emailValidationFailMessage: '',
      validate: {
        email: {
          provider: 'emailProvider',
          showTooltip: false,
          required: true,
          value: '',
          tooltipText: '',
          tooltipTimer: 0,
          valid: null,
          failedRules: {},
        },
        password: {
          provider: 'passwordProvider',
          showTooltip: false,
          required: true,
          value: '',
          tooltipText: '',
          tooltipTimer: 0,
          valid: null,
          failedRules: {},
        },
        'password-again': {
          provider: 'passwordAgainProvider',
          showTooltip: false,
          required: true,
          value: '',
          tooltipText: '',
          tooltipTimer: 0,
          valid: null,
          failedRules: {},
        },
      },
    };
  },
  computed: {
    ...mapGetters(['isValidUserAgreed']),
    ...mapState(['joinProcessing', 'createUserAgreed']),
    canNext() {
      return (
        Object.values(this.validate)
          .filter((item) => item.required === true)
          .every((item) => item.valid === true) && this.emailIsValid
      );
    },
    emailValue() {
      return this.validate.email.value;
    },
    emailIsValid() {
      return (
        this.validate.email.valid &&
        this.validate.email !== '' &&
        !this.emailAlreadyExists
      );
    },
    emailErrorMsg() {
      return this.emailAlreadyExistsErrorMsg || 1;
    },
    // emailError() {
    //   if (this.validate.email.value === '') return null;
    //   if (this.validate.email.valid && this.emailAlreadyExists) return true;
    //   return false;
    // },
    // passwordAgainValid() {
    //   return (
    //     this.validate['password-again'].valid &&
    //     this.validate['password-again'].value === this.validate.password.value
    //   );
    // },
    // passwordAgainErrorMsg() {
    //   return this.validate[]
    // },
  },
  watch: {
    async emailValue() {
      // console.log(`watch executed! ${newValue}`);
      await this.checkAlreadyExist();
    },
  },

  mounted() {
    if (!this.isValidUserAgreed) {
      this.$router.push({ name: 'JoinPolicy' });
    }
  },

  methods: {
    ...mapMutations(['setJoinFinished', 'setJoinProcessing']),
    inputted(refname) {
      // console.log(`changed! ${refname}`);

      // 툴팁 제거
      if (this.validate[refname].showTooltip !== false) {
        this.validate[refname].showTooltip = false;
      }
      this.validateStart(refname);
      if (refname === 'password') {
        this.validateStart('password-again');
      }
    },
    getValidationState({ dirty, validated, valid = null }) {
      return dirty || validated ? valid : null;
    },

    validateStart(name) {
      // validation 실시
      const item = this.validate[name];
      const provider = this.$refs[item.provider];
      this.$nextTick(() => {
        provider
          .validate()
          .then((result) => {
            // console.log('result!!!!');
            // console.log(result);
            this.validateHandle(item, result);
          })
          .catch((err) => console.log(err));
      });
    },

    validateHandle(item, { valid, failedRules }) {
      // 일단 현재 툴팁을 제거함.
      // console.log('valid!!!!');
      // console.log(valid);

      // 값이 아무것도 없다면 (초기화 상태 그대로라면) 그냥 아무것도 안함.
      if (item.value === '') return;

      // console.log(failedRules);
      if (item.tooltipTimer !== 0) {
        clearTimeout(item.tooltipTimer);
        item.tooltipTimer = 0;
      }

      // validation 을 통과하지 못했다면, 툴팁을 나타나도록 함.
      if (!valid) {
        item.valid = false;
        item.showTooltip = true;
        item.failedRules = failedRules;
        // 3초 뒤에 툴팁이 사라지도록 함.
        // 만약 사라지는 timeout 이 이미 존재한다면, 그것을 삭제함.

        item.tooltipTimer = setTimeout(() => {
          item.showTooltip = false;
        }, 3000);
      } else {
        item.valid = true;
      }

      // 만약 이메일에 관한 에러라면, 이메일 에러 따로 설정
      if (failedRules.email) {
        this.emailValidationFailMessage = failedRules.email;
      }
    },

    async checkAlreadyExist() {
      const result = await graphql(userExistsQuery, { email: this.emailValue });
      const userExists = result.data?.userExists;
      console.log(userExists);
      if (!userExists) return;
      const { email, kakao, pwd } = userExists;
      if (email && pwd) {
        this.emailAlreadyExists = true;
        this.emailAlreadyExistsErrorMsg = '이미 존재하는 이메일입니다.';
        return;
      }
      if (email && kakao) {
        this.emailAlreadyExists = true;
        this.emailAlreadyExistsErrorMsg = '이미 카카오로 인증된 계정입니다.';
        return;
      }
      this.emailAlreadyExists = false;
      this.emailAlreadyExistsErrorMsg = '';
    },

    async nextButtonClicked() {
      this.setJoinProcessing(true);
      const args = {
        email: this.validate.email.value,
        pwd: this.validate.password.value,
        user_agreed: this.createUserAgreed,
        // debug: true, // 이걸 false 로 해야 실제 메일이 보내집니다!
      };
      console.log('# JoinInfo nextButtonClicked ');
      console.log(args);
      const r1 = await graphql(createGuestMutation, args);
      console.log('power super created guest');
      console.log(r1);
      await checkAuth();
      console.log('power super login');
      this.setJoinFinished(true);
      this.$router.push({ name: 'JoinSuccess' });
    },
  },
};
</script>

<style lang="scss" scoped>
.form-control {
  border-color: #777;
  height: 43px;
}

.next-button-wrapper {
  margin-top: 30px;
}

.was-validated .form-control:valid:focus,
.form-control.is-valid:focus {
  border-color: inherit;
  box-shadow: inherit;
  // box-shadow: 0 0 0 0.2rem rgba(40, 167, 69, 0.25)
}

.spinner-border {
  width: 30px;
  height: 30px;
  border-width: 3px;
}
</style>

<style lang="scss" >
@import '@/common';

.join-content .form-group label {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 4px;
}

@include max-with(sm) {
  .join-content .form-group label {
    font-size: 16px;
  }
}

.next-button {
  display: block;
  width: 100%;
  font-size: 21px;
  height: 55px;
}

@include max-with(sm) {
  .next-button {
    font-size: 16px;
  }
}
</style>
<style lang="scss">
.join-inner-box .spinner-border {
  animation-duration: 1s;
}
</style>
<style scoped></style>

<style></style>
