<template>
  <div class="not-found text-center">
    <h2>페이지를 찾을 수 없습니다!</h2>
    <router-link :to="{name: 'Home'}"><u>홈으로 이동</u></router-link>
  </div>
</template>

<script>
export default {
  title: '404',
  name: 'NotFound',
};
</script>

<style lang="scss" scoped>

@use '../../style/common';
@use '../../style/breakpoint';

.not-found {
  padding-top: 50px;
}
/* @include breakpoint.max-with(md) {
  .not-found {
    padding-top: 0;
  }
} */
</style>
