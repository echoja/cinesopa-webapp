<template>
  <div class="my-info">
    <h2>계정 설정</h2>
    <div class="info-group">
      <div class="info-row">
        <div class="info-cell head">이메일</div>
        <div class="info-cell body">eszqsc112@naver.com</div>
      </div>
      <div class="info-row">
        <div class="info-cell head">비밀번호</div>
        <div class="info-cell body">
          <b-button size="sm">비밀번호 변경</b-button>
        </div>
      </div>
      <div class="info-row">
        <div class="info-cell head">카카오 계정</div>
        <div class="info-cell body kakao">
          <template v-if="isConnectedWithKakao">
            <span class="is-connected">연동됨</span>
            <!-- <b-button @click="disableKakaoClicked" size="sm">
              연동 해제
            </b-button> -->
          </template>
          <template v-else>
            <span class="is-connected">연동되지 않음</span>
            <!-- <b-button @click="connectKakaoClicked">연동하기</b-button> -->
          </template>
        </div>
      </div>
    </div>
    <h2>기본 배송지 설정</h2>
    <div class="info-group default-delivery-form">
      <div class="info-row">
        <div class="info-cell head">이름</div>
        <div class="info-cell body">
          <b-form-input v-model="defaultDelivery.name"></b-form-input>
        </div>
      </div>
      <div class="info-row">
        <div class="info-cell head">주소</div>

        <div class="info-cell body">
          <div>
            <finding-address-button size="sm" @address-loaded="addressLoaded">
              주소 찾기
            </finding-address-button>
            <b-form-input v-model="defaultDelivery.address"></b-form-input>
            <p v-if="defaultDelivery.jibunAddress" class="description">
              지번: {{ defaultDelivery.jibunAddress }}
            </p>
          </div>
        </div>
      </div>
      <div class="info-row">
        <div class="info-cell head">상세 주소</div>
        <div class="info-cell body">
          <b-form-input
            v-model="defaultDelivery.detailedAddress"
          ></b-form-input>
        </div>
      </div>
      <div class="info-row">
        <div class="info-cell head">전화번호</div>
        <div class="info-cell body">
          <b-form-input v-model="defaultDelivery.phone"></b-form-input>
          <p class="description">예: 010-1234-5678</p>
        </div>
      </div>
      <div class="info-row">
        <div class="info-cell head">배송시<br />요청사항</div>
        <div class="info-cell body">
          <b-form-textarea v-model="defaultDelivery.request"></b-form-textarea>
        </div>
      </div>
    </div>
    <hr />
    <b-button @click="saveDefaultDeliveryClicked"> 변경사항 저장 </b-button>
  </div>
</template>

<script>
import { BFormInput, BButton, BFormTextarea } from 'bootstrap-vue';
import moment from 'moment';
import { mapState } from 'vuex';

export default {
  components: {
    BFormInput,
    BButton,
    BFormTextarea,
    FindingAddressButton: () => import('@/components/FindingAddressButton'),
  },
  title: '내 정보',
  data() {
    return {
      // isConnectedWithKakao: true,
      defaultDelivery: {
        name: '',
        address: '',
        detailedAddress: '',
        phone: '',
        request: '',
      },
    };
  },
  computed: {
    ...mapState(['currentUser']),
    isConnectedWithKakao() {
      return this.currentUser.has_pwd === false;
    },
  },
  methods: {
    disableKakaoClicked() {},
    saveDefaultDeliveryClicked() {},
    connectKakaoClicked() {},
    addressLoaded(data) {
      console.log('MyInfo addressLoaded');
      console.log(data);
      this.defaultDelivery.address = `${data.roadAddress} (${data.bname})`;
      this.defaultDelivery.jibunAddress = data.jibunAddress;
      this.defaultDelivery.detailedAddress = data.buildingName;
    },
  },
};
</script>

<style lang="scss" scoped>
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
.info-row {
  display: flex;
  margin-bottom: 15px;
  align-items: center;
}

.default-delivery-form .info-row {
  align-items: stretch;
  .info-cell.head {
    padding-top: 5px;
  }
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

span.is-connected {
  padding-right: 10px;
  font-weight: bold;
}

.description {
  font-size: 13px;
  color: #aaa;
}
</style>

<style scoped></style>

<style></style>
