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
@use '../../style/common';
@use '../../style/breakpoint';

.body {
  width: 100%;
  // height: 100vh;
}

.main-wrapper {
  padding: 0 common.$desktop-min-x-margin common.$main-wrapper-padding-bottom;
  min-height: calc(
    100vh - #{common.$desktop-header-height + common.$desktop-simple-footer-height + 2px}
  );
  display: flex;
  flex-direction: column;
}

@include breakpoint.max-with(sm) {
  .main-wrapper {
    padding: 0 common.$mobile-min-x-margin common.$main-wrapper-padding-bottom;
    margin-bottom: auto;
    min-height: auto;
  }
}

.fixed-footer {
  position: sticky;
  bottom: 0;
  width: 100%;
  max-width: common.$desktop-max-width;
  z-index: 20;
}

@include breakpoint.max-with(sm) {
  .fixed-footer {
    position: relative;
  }
}

.fixed-footer-placeholder {
  display: block;
  width: 100%;
  height: common.$desktop-simple-footer-height;
}
@include breakpoint.max-with(sm) {
  .fixed-footer-placeholder {
    height: common.$mobile-simple-footer-height;
  }
}
</style>
