<template>
  <div class="verify-email">
    <page-header>
      <div class="page-header-inner-wrapper">
        <h1>이메일 인증</h1>
      </div>
    </page-header>
    <div class="msg">
      <small-spinner v-if="loading"></small-spinner><span>{{ msg }}</span>
    </div>
    <div class="submsg" v-if="submsg">
      {{ submsg }}
    </div>
    <div v-if="tokenExpired" class="token-expired-area">
      <b-button @click="requestAgainButtonClicked"
        >인증 이메일 다시 보내기</b-button
      >
    </div>
    <div class="button-group">
      <b-button :to="{ name: 'Home' }">홈으로</b-button>
    </div>
    <!-- {{ token }} -->
  </div>
</template>

<script>
import { checkAuth, makeSimpleMutation } from '@/api/graphql-client';
import { BButton } from 'bootstrap-vue';

const verifyUserEmailReq = makeSimpleMutation('verifyUserEmail');

export default {
  title: '이메일 인증',
  components: {
    PageHeader: () => import('@/components/PageHeader'),
    SmallSpinner: () => import('@/components/SmallSpinner'),
    BButton,
  },
  data() {
    return {
      msg: '이메일 인증 중입니다.',
      loading: true,
      submsg: '',
      tokenExpired: false,
    };
  },
  computed: {
    token() {
      return this.$route.query.token ?? '';
    },
  },
  async mounted() {
    const res = await verifyUserEmailReq(
      { token: this.token },
      '{success code user {email verified role}}',
    );
    console.log('# VerifyEmail mounted');
    console.log(res);
    this.loading = false;
    // 실패했을 경우
    if (res.success === false) {
      this.msg = '이메일 인증에 실패했습니다.';
      if (res.code === 'no_such_token') {
        this.submsg = '토큰이 잘못되었습니다.';
      } else if (res.code === 'token_expired') {
        this.submsg = '토큰이 만료되었습니다.';
        this.tokenExpired = true;
      }
    } else {
      this.msg = '이메일 인증에 성공했습니다.';
    }

    checkAuth();
  },
  methods: {
    async requestAgainButtonClicked() {
      // todo
    },
  },
};
</script>

<style lang="scss" scoped>
.msg {
  margin-top: 50px;
}

.msg {
  font-size: 20px;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
}

.submsg {
  text-align: center;
}

.verify-email .small-spinner {
  margin-left: 0;
}
.button-group {
  margin-top: 50px;
  display: flex;
  justify-content: center;
}
</style>

<style scoped></style>

<style></style>
