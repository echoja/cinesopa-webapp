<template>
  <div class="body">
    <div class="main-wrapper">
      <slot></slot>
    </div>
    <div class="fixed-footer">
      <footer-simple-component></footer-simple-component>
    </div>
  </div>
</template>

<script>
export default {
  components: {
    FooterSimpleComponent: () =>
      import('@/components/FooterSimpleComponent.vue'),
  },
};
</script>

<style lang="scss" scoped>
@import '@/common';

.body {
  width: 100%;
  // min-height: calc(
  //   100vh - #{$desktop-header-height} - #{$desktop-simple-footer-height}
  // );
}
// @include max-with(sm) {
//   .body {
//     min-height: calc(
//       100vh - #{$mobile-header-height} - #{$mobile-simple-footer-height}
//     );
//   }
// }
.main-wrapper {
  margin-top: $desktop-header-height;
  // margin-bottom: 100px;
  padding: 0 $desktop-min-x-margin 30px;
  height: calc(
    100vh - #{$desktop-header-height} - #{$desktop-simple-footer-height}
  );
  display: flex;
  flex-direction: column;
}

@include max-with(sm) {
  .main-wrapper {
    margin-top: $mobile-header-height;
    padding: 0 $mobile-min-x-margin 30px;
    height: calc(
      100vh - #{$mobile-header-height} - #{$mobile-simple-footer-height}
    );
  }
}

.fixed-footer {
  position: fixed;
  bottom: 0;
  width: 100%;
}

@include max-with(sm) {
  .fixed-footer {
    position: relative;
  }
}
</style>
