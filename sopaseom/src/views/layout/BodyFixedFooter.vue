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
  padding: 0 $desktop-min-x-margin $main-wrapper-padding-bottom;
  min-height: calc(
    100vh - #{$desktop-header-height + $desktop-simple-footer-height + 2px}
  );
  display: flex;
  flex-direction: column;
}

@include max-with(sm) {
  .main-wrapper {
    padding: 0 $mobile-min-x-margin $main-wrapper-padding-bottom;
    margin-bottom: auto;
    min-height: auto;
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
