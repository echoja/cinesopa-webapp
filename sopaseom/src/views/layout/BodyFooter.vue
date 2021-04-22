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
@use '../../style/common';
@use '../../style/breakpoint';

.main-wrapper {
  // margin-top: common.$desktop-header-height;
  min-height: calc(
    100vh - #{common.$desktop-footer-height + common.$desktop-footer-height}
  );
  padding: 0 common.$desktop-min-x-margin 30px;
}

@include breakpoint.max-with(sm) {
  .main-wrapper {
    // margin-top: common.$mobile-header-height;
    padding: 0 common.$mobile-min-x-margin 30px;
  }
}
</style>

<style>
</style>
