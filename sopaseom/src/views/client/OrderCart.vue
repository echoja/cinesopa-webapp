<template>
  <div class="cart">
    장바구니~

    <div class="test">
      <b-link :to="{name: 'Payment'}">다음</b-link>
    </div>
  </div>
</template>

<script>
import { BLink } from 'bootstrap-vue';

export default {
  title: '장바구니',
  components: {
    BLink,
  },
};
</script>

<style lang="scss" scoped></style>

<style scoped></style>

<style></style>
