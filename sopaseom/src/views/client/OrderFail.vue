<template>
  <div class="order-fail">
    <h2>주문 도중 오류가 발생했습니다.</h2>
    <div v-if="reason"></div>
    <div class="button-group">
      <b-button :to="{name: 'Home'}"> 홈으로 </b-button>
      <b-button :to="{name: 'Cart'}"> 장바구니 </b-button>
    </div>
  </div>
</template>

<script>
import { BButton } from 'bootstrap-vue';
import OvalButton from '@/components/OvalButton.vue';

export default {
  title: '주문실패',
  components: {
    BButton,
    OvalButton,
  },
};
</script>

<style lang="scss" scoped>

.order-fail {
  display: flex;
  flex-direction: column;
  align-items: center;
}
h2 {
  font-size: 24px;
  font-weight: bold;
}

.button-group {
  margin-top: 10px;
  .btn {
  margin: 0 10px;
}}

</style>

<style scoped></style>

<style></style>
