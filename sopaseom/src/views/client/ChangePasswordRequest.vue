<template>
  <div class="change-password-request">
    <div class="info">
      <p class="notice">
        이메일을 입력하고, 비밀번호로 찾기 버튼을 눌러주세요.
      </p>
      <p class="sub-notice">
        해당 이메일로 비밀번호를 변경할 수 있는 링크를 전달해 드립니다.
      </p>
    </div>
    <div class="form">
      <b-form-input
        placeholder="이메일 입력"
        class="form-input"
        v-model="email"
      >
      </b-form-input>
      <loading-button
        variant="primary"
        @click="findPasswordButtonClicked"
        :loading="loading"
        >비밀번호 찾기</loading-button
      >
    </div>
  </div>
</template>

<script>
import { BFormInput } from 'bootstrap-vue';
import { makeSimpleMutation } from '@/api/graphql-client';

const requestChangePasswordReq = makeSimpleMutation('requestChangePassword');
export default {
  components: {
    BFormInput,
    LoadingButton: () => import('@/components/LoadingButton'),
  },
  data() {
    return {
      email: '',
      loading: false,
    };
  },
  computed: {
    initEmail() {
      return this.$route.query.initEmail;
    },
  },
  mounted() {
    if (this.initEmail) {
      this.email = this.initEmail;
    }
  },
  methods: {
    async findPasswordButtonClicked() {
      await this.requestChangePassword();
    },

    async requestChangePassword() {
      
    },
  },
};
</script>

<style lang="scss" scoped>
p {
  margin: 0;
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