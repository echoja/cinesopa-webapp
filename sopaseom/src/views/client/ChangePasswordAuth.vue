<template>
  <div>
    <!-- <div class="loading" v-if="loading">
      <small-spinner></small-spinner>로딩중입니다.
    </div> -->
    <div class="Tw-96 Tmx-auto Tmt-4">
      <validation-provider
        name="Password"
        ref="passwordProvider"
        :rules="{ required: true, password_min: 8 }"
        v-slot="vcon"
      >
        <b-form-group
          label-class="Ttext-lg Tfont-bold"
          label="비밀번호"
          label-for="input-password"
        >
          <!-- description="비밀번호는 최소 8자 이상이어야 합니다." -->
          <b-form-input
            type="password"
            id="input-password"
            class="input-password"
            autocomplete="new-password"
            v-model="validate.password.value"
            @keyup.enter="changePasswordClicked"
            :state="validate['password'].valid"
            @update="inputted('password')"
          ></b-form-input>
          <template
            #description
            v-if="
              validate['password'].valid === null || validate['password'].valid
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
        <b-form-group
          label-class="Ttext-lg Tfont-bold"
          label="비밀번호 확인"
          label-for="input-password-again"
        >
          <b-form-input
            type="password"
            id="input-password-again"
            class="input-password-again"
            autocomplete="off"
            v-model="validate['password-again'].value"
            @keyup.enter="changePasswordClicked"
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
      <loading-button
        class="Tpy-3 Tw-full Tmt-5"
        variant="primary"
        @click="changePasswordClicked"
        :loading="loading"
        :disabled="!canNext"
      >
        비밀번호 재설정
      </loading-button>
    </div>
  </div>
</template>

<script>
import { ValidationProvider } from 'vee-validate';
import {
  BFormGroup,
  BFormInput,
  BFormInvalidFeedback,
  BButton,
} from 'bootstrap-vue';
import { makeSimpleMutation } from '@/api/graphql-client';
import { mapActions } from 'vuex';

const changePasswordReq = makeSimpleMutation('changePassword');

export default {
  components: {
    ValidationProvider,
    BFormInvalidFeedback,
    BFormInput,
    BFormGroup,
    BButton,
    LoadingButton: () => import('@/components/LoadingButton'),
  },
  data() {
    return {
      vuePageTitle: '',
      loading: false,
      isTokenValid: false,
      validate: {
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
  mounted() {
    this.vuePageTitle = '비밀번호 재설정';
  },
  computed: {
    /** @returns {boolean} */
    canNext() {
      return Object.values(this.validate)
        .filter((item) => item.required === true)
        .every((item) => item.valid === true);
    },

    /** @returns {string} */
    token() {
      return this.$route.query.token ?? '';
    },
  },
  methods: {
    ...mapActions(['pushMessage']),
    // 입력을 시작함과 동시에 validation 도 시작함.
    inputted(refname) {
      // console.log(`changed! ${refname}`);

      // 툴팁 제거
      if (this.validate[refname].showTooltip !== false) {
        this.validate[refname].showTooltip = false;
      }
      this.validateStart(refname);

      // 일치성 검사는 password-again 에서 하므로 password 가 바뀌어도
      // 일치성 검사를 해야 하므로 password-again 으로 역할을 넘김.
      if (refname === 'password') {
        this.validateStart('password-again');
      }
    },

    // validation 실시
    validateStart(name) {
      const item = this.validate[name];

      // provider 는 ref 를 얻어서 실제 provider 를 얻음.
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

    // validate 수행 후 그 결과를 처리하는 함수임.
    validateHandle(item, { valid, failedRules }) {
      // 값이 아무것도 없다면 (초기화 상태 그대로라면) 그냥 아무것도 안함.
      if (item.value === '') return;

      // console.log(failedRules);
      if (item.tooltipTimer !== 0) {
        clearTimeout(item.tooltipTimer);
        item.tooltipTimer = 0;
      }

      // validation 을 통과하지 못했다면, 툴팁을 나타나도록 함.
      // (툴팁 관련 기능은 필요없음. 그냥 invalid 가 알아서 메시지를 보여줌.)
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

    // 비밀번호 재설정을 클릭하면 실행되는 함수
    async changePasswordClicked() {
      this.loading = true;
      const args = {
        token: this.token,
        pwd: this.validate.password.value,
      };
      console.log('# ChangePasswordAuth changePasswordClicked args');
      console.log(args);
      const result = await changePasswordReq(args, '{success code}');
      if (result.success) {
        this.$router.push({
          name: 'ChangePasswordSuccess',
        });
      } else {
        console.error(result.code);
        this.pushMessage({
          msg: `비밀번호 재설정 중 오류가 발생했습니다. > ${result.code}`,
          type: 'danger',
          id: 'changePasswordFailed',
        });
        this.$router.push({
          name: 'ChangePasswordRequest',
        });
      }
      this.loading = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.loading {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>

<style scoped></style>

<style></style>
