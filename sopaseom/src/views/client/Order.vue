<template>
  <div>
    <page-header>
      <div class="page-header-inner-wrapper">
        <h1>주문/결제</h1>
      </div>
    </page-header>
    <div class="order-outer-box">
      <div class="order-inner-box">
        <div class="process">
          <span :class="{ current: $route.name === 'Cart' }"> 장바구니 </span>
          <span class="seperator"> > </span>
          <span :class="{ current: $route.name === 'Payment' }">
            주문/결제
          </span>
          <span class="seperator"> > </span>
          <span
            :class="{
              current:
                $route.name === 'PaymentSuccess' ||
                $route.name === 'PaymentSuccessNoBank',
            }"
          >
            주문완료
          </span>
        </div>
        <hr />
        <!-- <b-overlay :show="joinProcessing" rounded="sm"> -->
        <transition name="slide" mode="out-in">
          <router-view class="order-content"></router-view>
        </transition>
        <!-- </b-overlay> -->
      </div>
    </div>
  </div>
</template>

<script>
export default {
  // title: '주문하기',
  components: {
    PageHeader: () => import('@/components/PageHeader'),
  },
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

@include max-with(sm) {
  .process span.seperator {
    padding: 0 8px;
  }
}

.order-outer-box {
  margin: 20px auto;
  max-width: 820px;
  // min-height: 600px;
  display: flex;
  align-items: center;
}
.order-inner-box {
  width: 100%;
}

.order-content {
  padding-top: 20px;
  // height: 410px;
}

@include max-with(sm) {
  .order-content {
    padding-top: 5px;
  }
}

hr {
  border-color: #000;
}

/** ANIMATION  !!! */

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

<style scoped></style>

<style></style>
