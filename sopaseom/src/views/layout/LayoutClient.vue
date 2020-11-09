<template>
  <div class="layout layout-client" :style="layoutStyle">
    <nav-menu></nav-menu>
    <transition
      name="left-right"
      mode="out-in"
      @before-enter="fsBeforeEnter"
      @after-leave="fsAfterLeave"
    >
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
    <div class="message-box fixed-top">
      <!-- <h2>
            {{ messages }}
          </h2> -->
      <!-- @dismissed="messageDismissed(msgObj.id)"
          @dismiss-count-down="countDownChanged" -->
      <transition-group name="fade-alert">
        <div
          class="message-wrapper mx-auto w-50"
          v-for="msgObj in messages"
          :key="msgObj.id"
        >
          <b-alert :show="true" :variant="msgObj.type" dismissible>
            {{ msgObj.msg }}
          </b-alert>
        </div>
      </transition-group>
      <!-- @input="messageChanged($event, msgObj)" -->
    </div>
  </div>
</template>

<script>
// import {
//   // BFormInput, BButton, BFormSelect, BFormCheckboxGroup, BFormCheckbox, BCard,
//   // BContainer,
//   // BCol,
//   // BRow,
// } from 'bootstrap-vue';
import { mapState } from 'vuex';
import { BAlert } from 'bootstrap-vue';

import BodyFixedFooter from './BodyFixedFooter.vue';
import BodyNoFooter from './BodyNoFooter.vue';
import BodyFooter from './BodyFooter.vue';

export default {
  name: 'LayoutClient',
  components: {
    NavMenu: () => import('@/components/NavMenu.vue'),
    BAlert,
  },
  computed: {
    ...mapState(['messages']),
    footerStyle() {
      return this.$route.meta.footerStyle || BodyNoFooter;
    },
    layoutStyle() {
      const footerStyle = this.$route.meta || BodyFixedFooter;
      if (footerStyle === BodyNoFooter) {
        return { overflow: 'inherit' };
      }
      return { 'overflow-y': 'inherit', 'overlfow-x': 'hidden' };
    },
  },
  watch: {
    $route() {},
  },
  methods: {
    // todo
    fsBeforeEnter(el) {},
    fsAfterLeave(el) {},
  },
};
</script>

<style lang="scss" scoped>
@import '@/common';

.layout {
  position: relative;
  max-width: $desktop-max-width;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
}
.alert-success {
  background-color: #fff;
  border-width: 2px;
  border-color: #000;
  pointer-events: all;
}

.message-box {
  pointer-events: none;
}
// .layout-main-wrapper {
//   margin-top: $desktop-header-height;
//   min-height: calc(
//     100vh - #{$desktop-footer-height} - #{$desktop-footer-height}
//   );
//   padding: 30px $desktop-min-x-margin;
// }

.left-right-enter-active {
  transition-duration: 1s;
}
.left-right-leave-active {
  transition-duration: 0.3s;
}

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

.fade-alert-enter-active,
.fade-alert-leave-active {
  transition-property: height, opacity, margin, transform;
  overflow: hidden;
}

.fade-alert-enter-active {
  transition-duration: 1s;
  transition-timing-function: ease;
}
.fade-alert-leave-active {
  transition-duration: 1s;
  transition-timing-function: ease-in;
}
.fade-alert-enter {
  transform: translateY(-10px);
  opacity: 0;
}
.fade-alert-leave-to {
  opacity: 0;
}

.left-right-enter-active,
.left-right-leave-active {
  transition-property: opacity;
  transition-property: height, opacity, margin, transform;
  transition-timing-function: ease;
  overflow: hidden;
}


.left-right-enter {
  transform: translateX(-20px);
  opacity: 0;
}
.left-right-leave-to {
  transform: translateX(20px);
  opacity: 0;
}
</style>


<style>
.left-right-enter-active .page-header,
.left-right-leave-active .page-header {
  top: 0;
}
</style>