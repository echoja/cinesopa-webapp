<template>
  <div class="change-password-request">
    <div class="info">
      <p class="Ttext-2xl Tmb-3">
        이메일을 입력하시고,<br />아래의 버튼을 눌러주세요.
      </p>
      <p class="Ttext-lg Ttext-gray-400 Tfont-medium">
        해당 이메일로 비밀번호를 변경할 수 있는<br />링크를 전달해 드립니다.
      </p>
    </div>
    <div class="Tgrid Tgrid-cols-1 Tjustify-items-center">
      <b-form-group label-class="Ttext-lg Tfont-bold" label="이메일" class="Tw-96">
        <b-form-input
          placeholder="example@naver.com"
          class="form-input"
          v-model="email"
          :state="isEmail"
          @keyup.enter="findPasswordButtonClicked"
        >
        </b-form-input>
      </b-form-group>
      <loading-button
        class="Tw-96 Tpy-3 Tmt-5"
        variant="primary"
        @click="findPasswordButtonClicked"
        :loading="loading"
        :disabled="!isEmail"
      >
        이메일로 링크 받기
      </loading-button>
    </div>
  </div>
</template>

<script>
import { BFormGroup, BFormInput } from 'bootstrap-vue';
import { makeSimpleMutation } from '@/api/graphql-client';
import { mapActions } from 'vuex';
import isEmail from 'validator/es/lib/isEmail';

const requestChangePasswordReq = makeSimpleMutation('requestChangePassword');
export default {
  components: {
    BFormInput,
    BFormGroup,
    LoadingButton: () => import('@/components/LoadingButton'),
  },
  data() {
    return {
      email: '',
      loading: false,
    };
  },
  computed: {
    /** @returns {string} */
    initEmail() {
      return this.$route.query.initEmail ?? '';
    },
    /** @returns {boolean} */
    isEmail() {
      const result = isEmail(this.email);
      if (result) return true;
      return null;
    },
  },
  mounted() {
    if (this.initEmail) {
      this.email = this.initEmail;
    }
  },
  methods: {
    ...mapActions(['pushMessage']),
    async findPasswordButtonClicked() {
      await this.requestChangePassword();
    },

    async requestChangePassword() {
      this.loading = true;
      const result = await requestChangePasswordReq(
        {
          email: this.email,
          // debug: true, // todo: 디버그가 아닐 때에는 디버그를 풀어야함!
        },
        '{success code}',
      );
      console.log('# requestChangePassword req result');
      console.log(result);
      if (result.success) {
        this.pushMessage({
          msg: '비밀번호 재설정 링크가 이메일로 전송되었습니다.',
          type: 'success',
          id: 'requestChangePasswordSuccess',
        });
      }
      this.loading = false;
    },
  },
};
</script>

<style lang="scss" scoped>
p {
  text-align: center;
}
.info {
  margin-bottom: 50px;
}

.form {
  display: flex;
  justify-content: center;
}
.form-input {
  flex: 0 1 300px;
}
.notice {
  font-weight: bold;
}
.sub-notice {
  font-size: 14px;
  color: #888;
}
</style>
<style>
</style>
