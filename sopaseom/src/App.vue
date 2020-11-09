<template>
  <div id="app" ref="app">
    <!-- <nav-menu></nav-menu> -->
    <!-- <transition :name="transitionName" mode="out-in"> -->
    <component :is="layout">
      <!-- @beforeLeave="beforeLeave"
        @enter="enter"
        @afterLeave="afterLeave"
        @afterEnter="afterEnter" -->
      <!-- <transition :name="transitionName" mode="out-in"> -->
      <!-- <router-view :key="$route.fullPath" /> -->
      <!-- <router-view
            id="main"
            :key="$route.fullPath.split('/')[1]"
            :style="{ overflow: 'visible' }"
          /> -->
      <!-- </transition> -->
    </component>
    <!-- </transition> -->
  </div>
</template>
<script>
import 'bootstrap-vue';
// BFormInput, BButton, BFormSelect, BFormCheckboxGroup, BFormCheckbox, BCard,
import LayoutClient from '@/views/layout/LayoutClient.vue';
import LayoutAdmin from '@/views/layout/LayoutAdmin.vue';
import NavMenu from './components/NavMenu.vue';

export default {
  name: 'LayoutWrapper',
  components: {
    LayoutClient,
    LayoutAdmin,
    NavMenu,
  },
  computed: {
    // 레이아웃 기본 값은 LayoutClient 임.
    // 어드민 같은 경우에는 헬퍼 함수를 통해 meta에 LayoutAdmin을 전달하고 있음.
    layout() {
      return this.$route.meta.layout || LayoutClient;
    },
  },
  watch: {
    $route(to, from) {
      // const toDepth = to.path.split('/').length;
      // const fromDepth = from.path.split('/').length;
      // this.transitionName = toDepth < fromDepth ? 'slide-right' : 'slide-left';
      if (to.path.split('/')[1] === 'admin') {
        this.transitionName = 'no-transition';
      } else {
        this.transitionName = 'fade';
      }
    },
  },
  data() {
    return {
      transitionName: 'fade',
    };
  },
  mounted() {
    window.addEventListener('resize', this.onResize);
    this.setWindowSize();
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.onResize);
  },
  methods: {
    // async successMsg(msg) {
    //   alert(`"유후~~" ${msg}`);
    // },
    onResize() {
      this.setWindowSize();
    },
    setWindowSize() {
      // if (window.innerWidth < 768) {
      //   this.$refs.app.classList.add('mobile');
      //   this.$refs.app.classList.remove('desktop');
      //   this.$store.commit('setIsMobile', true);
      // } else {
      //   this.$refs.app.classList.remove('mobile');
      //   this.$refs.app.classList.add('desktop');
      //   this.$store.commit('setIsMobile', false);
      // }
    },
  },
};
</script>
<style lang="scss" scoped>
#app {
  /* font-family: var(--font-family-sans-serif); */
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /* text-align: center; */
  color: #000;
}
</style>

<style>
/* *********************** */
/* ******* GENERAL ******* */
/* *********************** */

.router-link-exact-active {
  background-color: transparent;
}

:focus {
  outline: black solid 2px;
  outline-offset: 1px;
}

div:focus,
a:focus {
  outline: none;
}

/* *********************** */
/* **** AMINATION!!! ***** */
/* *********************** */
.a-enter-active .a-leave-active {
  transition: opacity 0.5s;
}
.a-enter,
.a-leave-to {
  opacity: 0;
}

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

.vue-skip-to {
  z-index: 1000;
}
</style>
