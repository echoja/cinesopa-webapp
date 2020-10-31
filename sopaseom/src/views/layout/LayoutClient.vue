<template>
  <div class="layout layout-client" :style="{ overflow }">
    <nav-menu></nav-menu>
    <transition name="fade" mode="out-in">
      <component :is="footerStyle">
        <transition name="fade" mode="out-in">
          <router-view
            id="main"
            :key="$route.fullPath.split('/')[1]"
            :style="{ overflow: 'visible' }"
          />
        </transition>
      </component>
    </transition>
  </div>
</template>

<script>
// import {
//   // BFormInput, BButton, BFormSelect, BFormCheckboxGroup, BFormCheckbox, BCard,
//   // BContainer,
//   // BCol,
//   // BRow,
// } from 'bootstrap-vue';

import BodyFixedFooter from './BodyFixedFooter.vue';
import BodyFooter from './BodyFooter.vue';

export default {
  name: 'LayoutClient',
  components: {
    NavMenu: () => import('@/components/NavMenu.vue'),
  },
  computed: {
    footerStyle() {
      return this.$route.meta.footerStyle || BodyFixedFooter;
    },
    overflow() {
      return (this.$route.meta.footerStyle || BodyFixedFooter) ===
        BodyFixedFooter
        ? 'hidden'
        : 'inherit';
    },
  },
  watch: {
    $route() {},
  },
};
</script>

<style lang="scss" scoped>
@import '@/common';

.layout {
  position: relative;
}

// .layout-main-wrapper {
//   margin-top: $desktop-header-height;
//   min-height: calc(
//     100vh - #{$desktop-footer-height} - #{$desktop-footer-height}
//   );
//   padding: 30px $desktop-min-x-margin;
// }
</style>

<style scoped>
/* *********************** */
/* **** AMINATION!!! ***** */
/* *********************** */

.fade-enter-active,
.fade-leave-active {
  transition-property: opacity;
  transition-property: height, opacity, margin, transform;
  transition-timing-function: ease;
  overflow: hidden;
}

.fade-enter-active {
  transition-duration: 1s;
}
.fade-leave-active {
  transition-duration: 0.3s;
}
.fade-enter,
.fade-leave-to {
  transform: translateY(20px);
  opacity: 0;
}
</style>
