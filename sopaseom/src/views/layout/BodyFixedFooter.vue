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
  // height: 100vh;
}
.main-wrapper {
  margin-top: $desktop-header-height;
  margin-bottom: 100px;
  padding: 0 $desktop-min-x-margin 30px;
}

@include max-with(sm) {
  .main-wrapper {
    padding: 0 $mobile-min-x-margin 30px;
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
