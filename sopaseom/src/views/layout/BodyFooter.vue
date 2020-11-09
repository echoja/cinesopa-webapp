<template>
  <div class="body">
    <div class="main-wrapper">
      <slot></slot>
    </div>
    <footer-component></footer-component>
  </div>
</template>

<script>
export default {
  components: {
    FooterComponent: () => import('@/components/FooterComponent.vue'),
  },
};
</script>

<style lang="scss" scoped>
@import '@/common';

.main-wrapper {
  // margin-top: $desktop-header-height;
  min-height: calc(
    100vh - #{$desktop-footer-height + $desktop-footer-height}
  );
  padding: 0 $desktop-min-x-margin 30px;
}

@include max-with(sm) {
  .main-wrapper {
    // margin-top: $mobile-header-height;
    padding: 0 $mobile-min-x-margin 30px;
  }
}
</style>

<style>
</style>