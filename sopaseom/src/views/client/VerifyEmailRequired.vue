<template>
  <div class="verify-email-required">
    <page-header>
      <div class="page-header-inner-wrapper">
        <h1>이메일 인증 필요</h1>
      </div>
    </page-header>
    <div class="content">
      <h2>이메일 인증이 필요한 페이지입니다.</h2>
      <div class="mb-3">
        <p class="m-0">
          현재 접속된 계정의 이메일은 <code>{{ currentUser.email }}</code> 입니다.
        </p>
        <p class="m-0">
          아래 버튼을 클릭하면 가입하신 이메일로 인증 링크를 보내드립니다.
        </p>
      </div>
      <div class="button-wrapper">
        <loading-button
          :loading="loading"
          :disabled="buttonDisabled"
          @click="sendTokenButtonClicked"
          >{{ buttonText }}</loading-button
        >
      </div>
    </div>
  </div>
</template>

<script>
import { makeSimpleMutation } from '@/api/graphql-client';

const requestVerifyEmailReq = makeSimpleMutation('requestVerifyEmail');
export default {
  components: {
    LoadingButton: () => import('@/components/LoadingButton'),
    PageHeader: () => import('@/components/PageHeader'),
  },
  data() {
    return {
      loading: false,
      buttonDisabled: false,
      buttonText: '인증 링크 보내기',
      vuePageTitle: '',
      currentUser: {},
    };
  },
  async mounted() {
    this.vuePageTitle = '이메일 인증 필요';
    this.currentUser = await this.$store.dispatch('getCurrentUser');
  },
  methods: {
    async sendTokenButtonClicked() {
      this.loading = true;
      const res = await requestVerifyEmailReq({}, '{success}');
      // console.log('# sendTokenButtonClicked res');
      // console.log(res);
      this.loading = false;
      this.buttonDisabled = true;
      this.buttonText = '전송되었습니다';
    },
  },
};
</script>

<style lang="scss" scoped>
.content {
  margin-top: 50px;
  text-align: center;
}
</style>

<style scoped></style>

<style></style>
