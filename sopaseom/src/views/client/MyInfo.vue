<template>
  <div class="my-info">
    <h2>계정 설정</h2>
    <div class="info-group">
      <div class="info-row">
        <div class="info-cell head">이메일</div>
        <div class="info-cell body">{{ this.currentUser.email }}</div>
      </div>
      <div class="info-row">
        <div class="info-cell head">비밀번호</div>
        <div class="info-cell body">
          <b-button size="sm" @click="changePasswordClicked"
            >비밀번호 변경</b-button
          >
        </div>
      </div>
      <div class="info-row">
        <div class="info-cell head">카카오 계정</div>
        <div class="info-cell body kakao">
          <template v-if="isConnectedWithKakao">
            <span class="current-status">연동됨</span>
            <b-button size="sm" @click="disableKakaoClicked">
              연동 해제
            </b-button>
          </template>
          <template v-else>
            <div>
              <b-button
                id="connect-kakao-button"
                size="sm"
                @click="connectKakaoClicked"
                >연동하기</b-button
              >
              <br />
              <p class="description">
                <!-- <p class="connect-kakao-description" target="connect-kakao-button" triggers="hover" placement="right"> -->
                본 이메일과 <b>동일한 이메일의 카카오 계정</b>으로만 연동이
                가능합니다.
              </p>
            </div>
          </template>
        </div>
      </div>

      <div class="info-row">
        <div class="info-cell head">광고성<br />이메일 수신</div>
        <div class="info-cell body advertisement">
          <b-form-checkbox
            v-model="advertisement"
            @change="advertisementChanged"
            >수신합니다.</b-form-checkbox
          >
          <!-- <span class="current-status">{{ advertisementMessage }}</span>
          <loading-button
            :loading="advertisementProcessing"
            size="sm"
            @click="changeAdvertisement"
          >
            변경하기
          </loading-button> -->
        </div>
      </div>
    </div>
    <h2>기본 배송지 설정</h2>
    <div class="info-group default-delivery-form">
      <div class="info-row">
        <div class="info-cell head">이름</div>
        <div class="info-cell body">
          <b-form-input v-model="default_dest.name"></b-form-input>
        </div>
      </div>
      <div class="info-row">
        <div class="info-cell head">주소</div>

        <div class="info-cell body">
          <div>
            <finding-address-button class="mb-2" size="sm" @address-loaded="addressLoaded">
              주소 찾기 ...
            </finding-address-button>
            <b-form-input v-model="default_dest.address"></b-form-input>
            <p v-if="jibunAddress" class="description">
              지번: {{ jibunAddress }}
            </p>
          </div>
        </div>
      </div>
      <div class="info-row">
        <div class="info-cell head">상세 주소</div>
        <div class="info-cell body">
          <b-form-input v-model="default_dest.address_detail"></b-form-input>
        </div>
      </div>
      <div class="info-row">
        <div class="info-cell head">전화번호</div>
        <div class="info-cell body">
          <b-form-input v-model="default_dest.phone"></b-form-input>
          <p class="description">예: 010-1234-5678</p>
        </div>
      </div>
      <div class="info-row">
        <div class="info-cell head">배송시<br />요청사항</div>
        <div class="info-cell body">
          <b-form-textarea v-model="default_dest.request"></b-form-textarea>
        </div>
      </div>
    </div>
    <hr />
    <b-button
      @click="saveDefaultDest"
      :disabled="defaultDestUpdateSuccessMessageShow"
    >
      변경사항 저장
    </b-button>
    <span
      class="button-response-text"
      v-if="defaultDestUpdateSuccessMessageShow"
      >{{ defaultDestUpdateSuccessMessage }}</span
    >
  </div>
</template>

<script>
import {
  BFormInput,
  BButton,
  BFormTextarea,
  BModal,
  BFormCheckbox,
} from 'bootstrap-vue';
import { mapActions, mapState } from 'vuex';
import { checkAuth, makeSimpleMutation } from '@/api/graphql-client';

const updateMeReq = makeSimpleMutation('updateMe');
const requestChangePasswordReq = makeSimpleMutation('requestChangePassword');

export default {
  components: {
    BFormInput,
    BButton,
    BFormTextarea,
    BFormCheckbox,
    BModal,
    FindingAddressButton: () => import('@/components/FindingAddressButton'),
  },
  data() {
    return {
      advertisement: false,
      vuePageTitle: '',
      defaultDestUpdateSuccessMessageShow: false,
      defaultDestUpdateSuccessMessage: '',
      // isConnectedWithKakao: true,
      jibunAddress: '',
      advertisementProcessing: false,
      default_dest: {
        name: '',
        address: '',
        address_detail: '',
        phone: '',
        request: '',
      },
    };
  },
  computed: {
    /** @returns {object} */
    currentUser: mapState(['currentUser']).currentUser,

    /** @returns {string} */
    advertisementMessage() {
      const advertisement = this.currentUser?.user_agreed?.advertisement;
      if (advertisement) return '수신중';
      return '수신하지 않음';
    },
    /** @returns {string} */
    default_destInitValue() {
      return this.currentUser?.default_dest;
    },
    /** @returns {boolean} */
    isConnectedWithKakao() {
      return this.currentUser?.has_pwd === false;
    },
  },
  async mounted() {
    this.vuePageTitle = '내 정보';
    const user = await this.getCurrentUser();
    const dest = user?.default_dest;
    if (dest) {
      this.default_dest = dest;
    }
    this.advertisement = user.user_agreed.advertisement ?? false;
  },
  // watch: {
  //   // 새롭게 갱신되는 기본 주소 정보를 가져옴.
  //   currentUser(user) {
  //     this.default_dest = user.default_dest;
  //   },
  // },
  methods: {
    ...mapActions(['getCurrentUser', 'pushMessage']),
    disableKakaoClicked() {},
    async saveDefaultDest() {
      const res = await updateMeReq(
        { userinfo: { default_dest: this.default_dest } },
        `
      {success code}`,
      );
      // console.log('# Myinfo.vue saveDefaultDest');
      // console.log(res);
      this.defaultDestUpdateSuccessMessageShow = true;
      this.defaultDestUpdateSuccessMessage = res.success
        ? '기본 배송지 설정 성공했습니다.'
        : '기본 배송지 설정을 실패했습니다.';

      // currentUser 정보 업데이트
      checkAuth();

      setTimeout(() => {
        this.defaultDestUpdateSuccessMessageShow = false;
      }, 2500);
      // if (res.success) {
      //   this.pushMessage({
      //     type: 'success',
      //     msg: '기본 배송지 설정 완료했습니다.',
      //     id: 'defaultDestUpdateSuccess',
      //   });
      // }
    },
    async changeAdvertisement() {
      this.advertisementProcessing = true;
      const advertisement = !this.currentUser?.user_agreed?.advertisement;
      const res = await updateMeReq(
        { userinfo: { user_agreed: { advertisement } } },
        `
      {success code}`,
      );
      if (res.success) {
        this.pushMessage({
          msg: '광고 수신 변경을 완료했습니다.',
          id: 'changeAdvertisementSuccess',
          type: 'success',
        });
      } else {
        this.pushMessage({
          msg: '광고 수신 변경에 실패했습니다.',
          id: 'changeAdvertisementFailed',
          type: 'danger',
        });
      }

      // currentUser 정보 업데이트
      await checkAuth();
      this.advertisementProcessing = false;
    },
    connectKakaoClicked() {},
    addressLoaded(data) {
      console.log('MyInfo addressLoaded');
      console.log(data);
      this.default_dest.address = `${data.roadAddress} (${data.bname})`;
      this.jibunAddress = data.jibunAddress;
      this.default_dest.address_detail = data.buildingName;
    },
    async advertisementChanged(checked) {
      this.advertisementProcessing = true;
      const advertisement = checked;
      const res = await updateMeReq(
        { userinfo: { user_agreed: { advertisement } } },
        `
      {success code}`,
      );
      if (res.success) {
        if (advertisement) {
          this.pushMessage({
            msg: '광고를 수신하도록 설정이 변경되었습니다.',
            id: 'changeAdvertisementToTrueSuccess',
            type: 'success',
          });
        } else {
          this.pushMessage({
            msg: '광고를 수신하지 않도록 설정이 변경되었습니다.',
            id: 'changeAdvertisementToFalseSuccess',
            type: 'success',
          });
        }
      } else {
        this.pushMessage({
          msg: '광고 수신 변경에 실패했습니다.',
          id: 'changeAdvertisementFailed',
          type: 'danger',
        });
      }

      // currentUser 정보 업데이트
      await checkAuth();
      this.advertisementProcessing = false;
    },
    async changePasswordClicked() {
      const result = await requestChangePasswordReq(
        {
          email: this.currentUser.email,
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
    },
  },
};
</script>

<style lang="scss" scoped>
@use '../../style/common';
@use '../../style/breakpoint';

@include breakpoint.max-with(md) {
  .my-info .form-control {
    font-size: 14px;
  }
}

h2 {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 20px;
}

p {
  margin: 0;
}

.info-group {
  margin-bottom: 35px;
}

@include breakpoint.max-with(md) {
  .info-group {
    font-size: 14px;
  }
}

.info-row {
  display: flex;
  margin-bottom: 15px;
  align-items: stretch;
}

.default-delivery-form .info-cell.head {
  padding-top: 5px;
}

.info-cell.head {
  flex: 0 0 100px;
  font-weight: 500;
}
.info-cell.body {
  flex: 1;
}

.info-cell.kakao {
  display: flex;
  align-items: center;
}

.default-delivery-form {
  input {
    max-width: 300px;
  }
  textarea {
    max-width: 500px;
  }
}

span.current-status {
  padding-right: 10px;
  font-weight: bold;
}

// .connect-kakao-description {

// }

.description {
  font-size: 13px;
  color: #aaa;
}

.button-response-text {
  font-size: 13px;
  margin-left: 15px;
}
</style>

<style scoped></style>

<style></style>
