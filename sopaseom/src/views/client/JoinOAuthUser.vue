<template>
  <div class="join-oauth-user">
    <page-header>
      <div class="page-header-inner-wrapper">
        <h1>약관 동의</h1>
      </div>
    </page-header>
    <div class="wrapper">
      <p>SNS 계정으로 최초로 로그인 시, 약관 동의 과정이 필요합니다.</p>

      <b-form-checkbox v-model="allCheck" @change="allCheckChanged" size="lg"
        ><span class="checkbox-text bold">모두 동의</span></b-form-checkbox
      >
      <hr />
      <div class="form">
        <div
          class="check-item"
          v-for="(item, itemIndex) in checks"
          :key="itemIndex"
        >
          <b-form-checkbox
            v-model="item.value"
            :required="item.required"
            @change="pieceCheckChanged"
            size="lg"
            class="rounded-0"
          >
            <span class="checkbox-text">{{ item.label }}</span></b-form-checkbox
          >
          <b-link @click="buttonClicked(itemIndex)" class="show-more">
            <svg-next></svg-next>
          </b-link>
        </div>
        <div class="button-box">
          <loading-button
            :loading="kakaoUnlinkLoading"
            @click="cancelKakaoAgreementClicked"
            >카카오 연결 끊기</loading-button
          >
          <loading-button
            :loading="loading"
            :disabled="!canNext"
            @click="nextClicked"
            >확인</loading-button
          >
        </div>
        <div class="notice">
          <p>
            모두 동의는 필수 및 선택 정보에 대한 동의도 포함되어 있으며,
            개별적으로도 동의를 선택하실 수 있습니다.
          </p>
          <p class="bold">
            선택 항목에 대한 동의를 거부하시는 경우에도 서비스는 이용이
            가능합니다.
          </p>
        </div>
      </div>
      <b-modal
        id="advertisement-modal"
        size="xl"
        hide-footer
        title="서비스·이벤트정보 제공을 위한 개인정보 수집 및 이용 동의"
      >
        <ol>
          <li>항목: 마케팅</li>
          <li>이용 목적: 상품 및 서비스 안내, 이벤트 정보 및 혜택 제공</li>
          <li>수집항목: 이메일주소, 마케팅 수신 동의여부</li>
          <li>보유기간: 회원탈퇴 또는 동의 철회 시</li>
        </ol>
        <p class="sub">
          ※ 선택 개인정보의 경우 동의를 거부하실 수 있으며, 이 경우 회원가입은
          가능하나 일부 서비스 이용 및 각종 광고, 이벤트 등의 혜택정보 제공이
          제한될 수 있습니다.
        </p>
      </b-modal>
    </div>
  </div>
</template>

<script>
import { BFormCheckbox, BLink } from 'bootstrap-vue';
import { checkAuth, makeSimpleMutation } from '@/api/graphql-client';
import { mapActions, mapState } from 'vuex';

const updateMeReq = makeSimpleMutation('updateMe');
const cancelKakaoAgreementReq = makeSimpleMutation('cancelKakaoAgreement');

export default {
  components: {
    BFormCheckbox,
    BLink,
    SvgNext: () => import('@/components/SvgNext'),
    PageHeader: () => import('@/components/PageHeader'),
    LoadingButton: () => import('@/components/LoadingButton'),
  },
  data() {
    return {
      vuePageTitle: '',
      allCheck: false,
      loading: false,
      checks: [
        {
          value: false,
          label: '소파섬 이용약관 동의 (필수)',
          required: true,
          content: '<div>헬로</div>',
          route: { name: 'Policy' },
        },
        {
          value: false,
          label: '소파섬 개인 정보 수집 / 이용 동의 (필수)',
          required: true,
          content: '<div>헬로</div>',
          route: { name: 'Privacy' },
        },
        {
          value: false,
          label: '소파섬 광고성 정보 수집 / 이용 동의 (선택)',
          required: false,
          content: '<div>헬로</div>',
          modalId: 'advertisement-modal',
        },
      ],
      kakaoUnlinkLoading: false,
    };
  },
  computed: {
    ...mapState(['routeWhereAgreeSuccess']),
    /** @returns {boolean} */
    canNext() {
      return this.checks
        .filter((item) => item.required === true)
        .every((item) => item.value === true);
    },
  },
  mounted() {
    this.vuePageTitle = '회원가입 - 약관동의';
  },
  methods: {
    ...mapActions(['pushMessage']),
    allCheckChanged(value) {
      this.checks.forEach((item) => {
        // eslint-disable-next-line no-param-reassign
        item.value = value;
      });
    },
    pieceCheckChanged() {
      this.allCheck = false;
    },
    buttonClicked(itemIndex) {
      const item = this.checks[itemIndex];
      if (item.modalId) {
        this.$bvModal.show(item.modalId);
      } else if (item.route) {
        this.$router.push(item.route);
      }
    },
    async logoutButtonClicked() {
      window.location.href = '/graphql/kakao/detach';
      // await doLogout();

      // this.$router.push({ name: 'Home' });
    },
    async nextClicked() {
      this.loading = true;
      const { success, code } = await updateMeReq(
        {
          userinfo: {
            user_agreed: {
              policy: this.checks[0].value,
              privacy: this.checks[1].value,
              advertisement: this.checks[2].value,
            },
          },
        },
        '{success code}',
      );
      if (success) {
        this.pushMessage({
          msg: '약관 동의가 완료되었습니다.',
          type: 'success',
          id: 'joinOAuthUserSuccess',
        });
        await checkAuth();
        this.$router.push(this.routeWhereAgreeSuccess ?? { name: 'Home' });
      } else {
        this.pushMessage({
          msg: `약관 동의가 실패했습니다. ${code}`,
          type: 'danger',
          id: 'joinOAuthUserFail',
        });
        this.$router.push({ name: 'Home' });
        checkAuth();
      }
      // this.$store.commit('setUserAgreed', {
      //   policy: this.checks[0].value,
      //   privacy: this.checks[1].value,
      //   advertisement: this.checks[2].value,
      // });
      // this.$router.push({ name: 'JoinInfo' });
      this.loading = false;
    },

    async cancelKakaoAgreementClicked() {
      this.kakaoUnlinkLoading = true;
      const result = await cancelKakaoAgreementReq({}, '{success code}');
      if (result.success) {
        this.pushMessage({
          type: 'success',
          id: 'cancelKakaoAgreementSuccess',
          msg: '카카오와의 연결이 성공적으로 해제되었습니다.',
        });
        this.$store.commit('setCurrentUser', { currentUser: null });
        this.$router.push({ name: 'Home' });
      } else {
        console.error(result.code);
        this.pushMessage({
          type: 'danger',
          id: 'cancelKakaoAgreementFailed',
          msg: '카카오와의 연결을 끊는 도중 에러가 발생했습니다.',
        });
      }
      this.kakaoUnlinkLoading = false;
    },
  },
};
</script>

<style lang="scss" scoped>
@use '../../style/common';
@use '../../style/breakpoint';
.wrapper {
  max-width: 460px;
  margin: 50px auto 0;
}

h2 {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 20px;
}

@include breakpoint.max-with(sm) {
  h2 {
    font-size: 16px;
  }
}

.check-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.checkbox-text {
  font-size: 16px;
  display: inline-block;
  transform: translateY(-1px);
}

@include breakpoint.max-with(sm) {
  .checkbox-text {
    font-size: 14px;
    transform: translateY(-3px);
  }
}

.show-more {
  color: #aaa;
  width: 8px;
  border: 10px solid transparent;
  border-width: 5px 0 5px 15px;
  box-sizing: content-box;
  background-color: transparent;
  margin: 0;
}

.button-box {
  margin-top: 20px;

  display: flex;
  .btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    font-size: 21px;
    height: 55px;
  }
  .btn:first-child {
    margin-right: 30px;
  }
}

@include breakpoint.max-with(sm) {
  .button-box .btn {
    font-size: 16px;
  }
}

.notice {
  margin-top: 15px;
  font-size: 11px;
  letter-spacing: -0.5px;
  color: #585858;
  p {
    margin: 0;
  }
  .bold {
    font-weight: bold;
  }
}
// .bold {
//   font-weight: bold;
// }
</style>

<style scoped></style>

<style></style>
