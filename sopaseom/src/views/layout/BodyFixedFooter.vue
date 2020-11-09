<template>
  <div class="body">
    <div class="main-wrapper">
      <slot></slot>
    </div>
    <!-- <div class="fixed-footer-placeholder"></div> -->
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
  // height: 100vh;
}

.main-wrapper {
  // margin-top: $desktop-header-height;
  padding: 0 $desktop-min-x-margin 30px;
  min-height: calc(
    100vh - #{$desktop-header-height + $desktop-simple-footer-height + 2px}
  );
  // margin-bottom: $desktop-simple-footer-height;
  display: flex;
  flex-direction: column;
}

@include max-with(sm) {
  .main-wrapper {
    // margin-top: $mobile-header-height;
    padding: 0 $mobile-min-x-margin 30px;
    margin-bottom: auto;
    min-height: auto;
    // margin-bottom: $mobile-simple-footer-height;
  }
}

.fixed-footer {
  position: sticky;
  bottom: 0;
  width: 100%;
  max-width: $desktop-max-width;
  z-index: 20;
}

@include max-with(sm) {
  .fixed-footer {
    position: relative;
  }
}

.fixed-footer-placeholder {
  display: block;
  width: 100%;
  height: $desktop-simple-footer-height;
}
@include max-with(sm) {
  .fixed-footer-placeholder {
    height: $mobile-simple-footer-height;
  }
}
</style>
