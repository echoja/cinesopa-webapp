<template>
  <div
    id="app"
    @scroll.passive="onScroll"
    :class="{ top: isTop, 'noto-sans': true }"
    :style="userStyle"
  >
    <div class="h-header"></div>
    <!-- <affix relative-element-selector="#body"> -->
    <header
      class="position-fixed fixed-top h-header mx-auto"
      :class="{
        /*'d-flex': !isTop, 'justify-content-between': !isTop*/
      }"
    >
      <div class="logo text-center transition-header">
        <b-link :to="{ name: 'Home' }">
          <b-img src="./assets/imsi_logo.png" :width="logoWidth" class="transition-header"></b-img>
        </b-link>
      </div>
      <div
        id="nav"
        class="font-weight-600 text-center transition-header d-flex justify-content-center"
      >
        <b-link class="px-4" :to="{ name: 'Page', params: { permalink: 'about' } }"
          >인사해요</b-link
        >
        <b-link class="px-4" :to="{ name: 'FilmList' }">영화봐요</b-link>
        <b-link class="px-4" :to="{ name: 'Board', params: { permalink: 'activity' } }"
          >활동해요</b-link
        >
        <b-link class="px-4" :to="{ name: 'Board', params: { permalink: 'notice' } }"
          >공지해요</b-link
        >
        <b-link class="px-4" :to="{ name: 'Request', params: { permalink: 'about' } }"
          >신청해요</b-link
        >
        <!-- <router-link to="/">Home</router-link> |
          <router-link to="/about">About</router-link> -->
      </div>
    </header>
    <!-- </affix> -->
    <div id="body">
      <main id="main">
        <transition
          name="fade"
          mode="out-in"
          @beforeLeave="beforeLeave"
          @enter="enter"
          @afterEnter="afterEnter"
        >
          <router-view :key="$route.path" />
        </transition>
        <!-- <b-button @click="showA = !showA">토글</b-button>
        <transition name="fade">
          <p v-if="showA">
            hi
          </p>
        </transition> -->
      </main>
      <footer>
        {{ text }}
      </footer>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      prevHeight: 0,
      showA: true,
      scrollY: 0,
      cssVariables: {
        '--var-text-color': '#2B3E4A',
        '--var-header-height': '300px',
        '--var-link-color': '#00B6E7',
        '--var-max-content-size': '1260px',
      },
      text: `
          Quis magna Lorem anim amet ipsum do mollit sit cillum voluptate ex nulla
          tempor. Laborum consequat non elit enim exercitation cillum aliqua
          consequat id aliqua. Esse ex consectetur mollit voluptate est in duis
          laboris ad sit ipsum anim Lorem. Incididunt veniam velit elit elit veniam
          Lorem aliqua quis ullamco deserunt sit enim elit aliqua esse irure. Laborum
          nisi sit est tempor laborum mollit labore officia laborum excepteur
          commodo non commodo dolor excepteur commodo. Ipsum fugiat ex est consectetur
          ipsum commodo tempor sunt in proident.
        `,
      textColor: 'blue',
    };
  },
  computed: {
    isTop() {
      return this.scrollY === 0;
    },
    userStyle() {
      return this.cssVariables;
    },
    logoWidth() {
      return this.isTop ? 237 : 154;
    },
  },

  beforeMount() {
    window.addEventListener('scroll', this.onScroll, {
      passive: true,
    });
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.onScroll);
  },

  methods: {
    onScroll() {
      // console.log(e);
      this.scrollY = window.scrollY;
    },
    beforeLeave(element) {
      this.prevHeight = getComputedStyle(element).height;
    },
    enter(element) {
      const { height } = getComputedStyle(element);

      // eslint-disable-next-line no-param-reassign
      element.style.height = this.prevHeight;

      setTimeout(() => {
        // eslint-disable-next-line no-param-reassign
        element.style.height = height;
      });
    },
    afterEnter(element) {
      // eslint-disable-next-line no-param-reassign
      element.style.height = 'auto';
    },
  },
};
</script>

<style>
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
  transition-property: height, opacity, margin;
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
  opacity: 0;
}
</style>

<style lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@100;300;400;500;700;900&family=Noto+Serif+KR:wght@200;300;400;500;600;700;900&display=swap');

#app {
  // font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  // text-align: center;
  color: var(--var-text-color);
}

#main {
  max-width: var(--var-max-content-size);
  margin: 0 auto;
}

#nav {
  padding: 30px 0;
  font-size: 27px;
  margin-top: 0;
  left: 100%;
  transform: translateX(-100%);
  min-width: 750px;
  position: absolute;
}

#nav a {
  font-weight: bold;
  color: var(--var-text-color);
  transition: 1s;
  // #2c3e50
}

#nav a:hover {
  color: var(--var-link-color);
  text-decoration: none;
  transition:none;
}

.logo {
  transition: 1s ease;
  position: absolute;
  left: 0;
  margin-left: 20px;
  margin-top: 30px;
}

.top #nav {
  margin-top: 133px;
  left: 50%;
  transform: translateX(-50%);
  // transform: translateX(calc(var(--var-max-content-size) / -2 + 50%));
}

.top .logo {
  margin-top: 80px;
  margin-left: 0;
  left: 50%;
  transform: translateX(-50%);
}

#nav a.router-link-exact-active {
  color: var(--var-link-color);
}

header {
  max-width: var(--var-max-content-size);
}

footer {
  width: 50px;
}

.h-header {
  height: var(--var-header-height);
}

.transform-absolute-center {
}

.transition-header {
  transition: 1s ease;
}

/** fonts */

.noto-sans {
  font-family: 'Noto Sans KR', var(--font-family-sans-serif);
}

.noto-serif {
  font-family: 'Noto Serif KR', 'Times New Roman', Times, serif;
}
.font-weight-100 {
  font-weight: 100;
}
.font-weight-300 {
  font-weight: 300;
}
.font-weight-400 {
  font-weight: 400;
}
.font-weight-500 {
  font-weight: 500;
}
.font-weight-600 {
  font-weight: 600;
}
.font-weight-700 {
  font-weight: 700;
}
.font-weight-900 {
  font-weight: 900;
}
</style>
