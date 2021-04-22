<template>
  <div class="layout layout-client" :style="layoutStyle">
    <nav-menu></nav-menu>
    <transition
      name="left-right"
      mode="out-in"
      @before-enter="fsBeforeEnter"
      @after-leave="fsAfterLeave"
      @before-leave="fsBeforeLeave"
    >
      <component :is="footerStyle">
        <transition name="fade" mode="out-in">
          <router-view id="main" :key="$route.fullPath.split('/')[1].split('?')[0]" />
          <!-- :style="{ overflow: 'visible' }" -->
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
          class="message-wrapper"
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
  data() {
    return {
      layoutStyle: {},
    };
  },
  computed: {
    ...mapState(['messages']),
    footerStyle() {
      return this.$route.meta.footerStyle || BodyFooter;
    },
    // layoutStyle() {
    //   const footerStyle = this.$route.meta || BodyFixedFooter;
    //   if (footerStyle === BodyNoFooter) {
    //     return { overflow: 'inherit' };
    //   }
    //   return { 'overflow-y': 'inherit', 'overlfow-x': 'hidden' };
    // },
    shouldOverflowBeHidden() {
      const footerStyle = this.$route?.meta?.footerStyle || BodyFixedFooter;
      // console.log('# LayoutClient shouldOverflowBeHidden');
      // console.log(footerStyle);
      // console.log(BodyFixedFooter);
      if (footerStyle === BodyNoFooter) {
        return false;
      }
      return true;
    },
  },
  watch: {
    // $route(to, from) {
    //   // console.log('# Layoutclient watch route');
    //   // console.log(to);
    //   // console.log(from);
    // },
  },
  methods: {
    // todo 상황:
    // 오버플로 hidden > 오버플로 scroll : to의 beforeEnter 또는 from의 afterLeave 에서 overflow hidden 삭제
    // 오버플로 hidden > 오버플로 hidden : 아무것도 할 것 없음
    // 오버플로 scroll > 오버플로 scroll : 아무것도 할 것 없음.
    // 오버플로 scroll > 오버플로 hidden : route 가 변경되는 즉시 hidden 으로 변경

    fsBeforeEnter(/* el */) {
      // console.log('# LayoutClient fsBeforeEnter');
      // console.log(el);
      // console.log(this.$route);
      if (!this.shouldOverflowBeHidden) {
        // this.layoutStyle = { overflow: 'inherit' };
      }
    },
    fsBeforeLeave(/* el */) {
      if (this.shouldOverflowBeHidden) {
        // this.layoutStyle = { overflow: 'inherit' };
        // this.layoutStyle = { 'overflow-x': 'hidden', 'overflow-y': 'inherit' };
      }
      // console.log('# LayoutClient fsBeforeLeave');
      // console.log(el);
      // console.log(this.$route);
    },
    fsAfterLeave(/* el */) {},
  },
};
</script>

<style lang="scss" scoped>
@use '../../style/common';
@use '../../style/breakpoint';

.layout {
  position: relative;
  max-width: common.$desktop-max-width;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
}

.alert {
  pointer-events: all;
}

.alert-success {
  background-color: #fff;
  border-width: 2px;
  border-color: #000;
}

.message-wrapper {
  margin: 0 10px;
  width: auto;
  display: flex;
  justify-content: center;
}

// @include breakpoint.max-with(sm) {
//   .message-wrapper {
//     width: 100%;
//   }
// }

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
