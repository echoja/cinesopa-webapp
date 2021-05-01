<template>
  <div class="order-fail">
    <h2 class="Tmb-2">주문 도중 오류가 발생했습니다.</h2>
    <div class="Tmb-5" v-if="reason">사유: {{ reason }}</div>
    <div class="button-group">
      <oval-button :to="{ name: 'Home' }"> 홈으로 </oval-button>
      <oval-button :to="{ name: 'Cart' }"> 장바구니 </oval-button>
    </div>
  </div>
</template>

<script>
export default {
  components: {
    OvalButton: () => import('@/components/OvalButton'),
  },
  computed: {
    /** @returns {string} */
    reason() {
      return this.$route.params.reason;
    },
  },
  data() {
    return {
      vuePageTitle: '',
    };
  },
  mounted() {
    this.vuePageTitle = '주문실패';
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
  }
}
</style>

<style scoped></style>

<style></style>
