<template>
  <div>
    <page-header>
      <div class="page-header-inner-wrapper">
        <h1>회원가입</h1>
      </div>
    </page-header>
    <div class="join-outer-box">
      <div class="join-inner-box">
        <div class="process">
          <span :class="{ current: $route.name === 'JoinPolicy' }">
            약관 동의
          </span>
          <span class="seperator"> > </span>
          <span :class="{ current: $route.name === 'JoinInfo' }">
            정보 입력
          </span>
          <span class="seperator"> > </span>
          <span :class="{ current: $route.name === 'JoinSuccess' }">
            완료
          </span>
        </div>
        <hr />
        <!-- <b-overlay :show="joinProcessing" rounded="sm"> -->
        <transition name="slide" mode="out-in">
          <router-view class="join-content"></router-view>
        </transition>
        <!-- </b-overlay> -->
      </div>
    </div>
    <!-- 회원가입~
    {{ $route.name }} -->
  </div>
</template>

<script>
import { BOverlay } from 'bootstrap-vue';
import { mapState } from 'vuex';

export default {
  components: {
    BOverlay,
    PageHeader: () => import('@/components/PageHeader.vue'),
  },
  computed: {
    ...mapState(['joinProcessing']),
  },
  title: '회원가입',
};
</script>

<style lang="scss" scoped>

@import '@/common';

.process {
  text-align: center;
  padding-top: 10px;
  margin-bottom: 20px;
}
.process span {
  font-size: 16px;
  font-weight: bold;
  color: #c4c4c4;
  &.current {
    color: #585858;
  }
  &.seperator {
    padding: 0 20px;
    font-weight: 100;
  }
}

.join-outer-box {
  margin: 20px auto;
  max-width: 460px;
  // min-height: 600px;
  display: flex;
  align-items: center;
}
.join-inner-box {
  width: 100%;
}

.join-content {
  padding-top: 20px;
  // height: 410px;
}

@include max-with(sm) {
  .join-content {
    padding-top: 5px;
  }
}

hr {
  border-color: #000;
}
</style>



<style scoped>
/* *********************** */
/* **** AMINATION!!! ***** */
/* *********************** */

.slide-enter-active,
.slide-leave-active {
  transition-property: opacity;
  transition-property: height, opacity, margin, transform;
  transition-timing-function: ease;
  overflow: hidden;
}

.slide-enter-active {
  transition-duration: 1s;
}
.slide-leave-active {
  transition-duration: 0.3s;
}
.slide-enter {
  transform: translateX(20px);
  opacity: 0;
}
.slide-leave-to {
  transform: translateX(-20px);
  opacity: 0;
}
</style>

<style></style>
