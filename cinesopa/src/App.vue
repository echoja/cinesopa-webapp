<template>
  <div
    id="app"
    @scroll="onScroll"
    :class="{ top: isTop, bottom: isBottom, 'noto-sans': true, ['route-' + $route.name]: true }"
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
        <b-link :to="{ name: 'Home' }" title="홈으로 이동">
          <b-img
            src="./assets/imsi_logo.png"
            :width="logoWidth"
            class="transition-header"
            alt="씨네소파 로고"
          ></b-img>
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
        <div class="footer-sns-buttons mb-1 d-flex footer-link-color justify-content-center align-items-center">
          <b-link
            href="https://www.instagram.com/cinesopa/"
            target="_blank"
            rel="external"
            title="씨네소파 인스타그램 새 창으로 이동"
          >
            <font-awesome-icon class="m-2" :icon="['fab', 'instagram']" />
          </b-link>
          <b-link
            href="https://www.facebook.com/coop.cinesopa"
            target="_blank"
            rel="external"
            title="씨네소파 페이스북 새 창으로 이동"
          >
            <font-awesome-icon class="m-2" :icon="['fab', 'facebook']" />
          </b-link>
          <!-- <b-img class="m-2" src="./assets/naver-blog.svg"></b-img> -->
          <b-link
            href="https://blog.naver.com/cinesopa"
            target="_blank"
            rel="external"
            title="씨네소파 네이버 블로그 새 창으로 이동"
          >
            <!-- aria-describedby="설명id" -->
            <svg
              width="30"
              class="m-2"
              role="img"
              aria-hidden="true"
              aria-labelledby="naver-blog-icon-title"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 250.36 250.36"
            >
              <title id="naver-blog-icon-title">네이버 블로그 아이콘</title>
              <path
                fill="currentColor"
                d="M200.28,0H50.07A50.08,50.08,0,0,0,0,50.08V200.3a50.07,50.07,0,0,0,50.07,50.06H200.28a50.07,50.07,0,0,0,50.08-50.06V50.08A50.07,50.07,0,0,0,200.28,0Zm32.09,133.73a33.92,33.92,0,0,1-33.86,34H148l-17.24,28.07a4.15,4.15,0,0,1-.58.84,5.77,5.77,0,0,1-10,0,5.61,5.61,0,0,1-.56-.79l-17.25-28.08H51.85a33.91,33.91,0,0,1-33.86-34V53.12a33.92,33.92,0,0,1,33.86-34H198.51a33.92,33.92,0,0,1,33.86,34Z"
              />
              <path
                fill="currentColor"
                d="M65.6,78.21a17.44,17.44,0,0,0-11.16,5.17V62.56H41.31v54.69H54.58V113s3.13,5.65,11,5.65c0,0,18.5-.68,18.5-20.4C84.1,98.21,83.42,78.21,65.6,78.21Zm-2.89,28.86a8.44,8.44,0,1,1,8.43-8.44A8.44,8.44,0,0,1,62.71,107.07Z"
              />
              <path
                fill="currentColor"
                d="M88.31,61.34V74s6-.27,6,10.89v32.37H107V81.88S107.49,61.34,88.31,61.34Z"
              />
              <path
                fill="currentColor"
                d="M137.89,78.38s-21.69,0-21.69,20.25c0,0-.7,20,21.69,20,0,0,22.18,0,22.18-20C160.07,98.63,160.79,78.38,137.89,78.38Zm0,28.69a8.44,8.44,0,1,1,8.43-8.44A8.44,8.44,0,0,1,137.89,107.07Z"
              />
              <path
                fill="currentColor"
                d="M196.29,79.71v3.67a14.37,14.37,0,0,0-11-5S166.7,77.6,166.7,98.49c0,0-.2,19.47,18.06,19.47,0,0,7.45.31,11.53-5V116s.92,9.59-8.37,9.59h-3.16v11.62h5.1s19.18.21,19.18-20.5v-37Zm-7.85,27.36a8.44,8.44,0,1,1,8.43-8.44A8.43,8.43,0,0,1,188.44,107.07Z"
              />
            </svg>
          </b-link>

          <!-- <b-icon-app class="m-2"></b-icon-app>
          <b-icon-tools class="m-2"></b-icon-tools>
          <b-icon-person-fill class="m-2"></b-icon-person-fill> -->
        </div>
        <div class="footer-links d-flex mb-4 footer-link-color justify-content-center">
          <b-link :to="{ name: 'EmailRefuse' }" class="mx-2 my-2">이메일무단수집거부</b-link>
          <b-link :to="{ name: 'Sitemap' }" class="mx-2 my-2">사이트맵</b-link>
        </div>
        <div class="footer-information d-flex footer-text-color justify-content-center">
          <span class="p-2">사업자등록번호 159-87-00749</span>
          <span class="p-2">|</span>
          <span class="p-2">부산시 해운대구 재반로103번길 5, 3층</span>
          <span class="p-2">|</span>
          <span class="p-2">coop.cinesopa@gmail.com</span>
        </div>
        <div class="footer-copyright d-flex footer-text-color justify-content-center mb-4">
          Copyright ⓒ 2020 CINESOPA All Rights Reserved
        </div>
        <!-- {{ text }} -->
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
      windowHeight: 0,
      documentHeight: 0,
      cssVariables: {
        '--text-color': '#2B3E4A',
        '--text-secondary-color': '#576870',
        '--header-height': '300px',
        '--link-color': '#00B6E7',
        '--max-content-size': '1260px',
        '--footer-text-color': '#767676',
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
    isBottom() {
      return this.scrollY + this.windowHeight === this.documentHeight;
    },
    userStyle() {
      return this.cssVariables;
    },
    logoWidth() {
      return this.isTop ? 237 : 154;
    },
  },

  created() {
    this.getHeight();
  },

  beforeMount() {
    window.addEventListener('scroll', this.onScroll, {
      passive: true,
    });
    window.addEventListener('resize', this.onResize);
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.onScroll);
    window.removeEventListener('resize', this.onResize);
  },

  methods: {
    onScroll() {
      // console.log(e);
      this.scrollY = window.scrollY;
    },
    onResize() {
      this.getHeight();
      console.log('resized!');
    },
    getHeight() {
      this.windowHeight = window.innerHeight;
      this.documentHeight = document.body.clientHeight;
    },
    beforeLeave(element) {
      let top = 0;
      if (window.scrollY >= 1) top = 1;
      window.scroll({
        top,
      });
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
  color: var(--text-color);
  overflow-x: hidden;
}

#main {
  max-width: var(--max-content-size);
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
  color: var(--text-color);
  transition: 1s;
  // #2c3e50
}

#nav a:hover {
  color: var(--link-color);
  text-decoration: none;
  transition: none;
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
  // transform: translateX(calc(var(--max-content-size) / -2 + 50%));
}

.top .logo {
  margin-top: 80px;
  margin-left: 0;
  left: 50%;
  transform: translateX(-50%);
}

#nav a.router-link-exact-active {
  color: var(--link-color);
}

header {
  max-width: var(--max-content-size);
}

.h-header {
  height: var(--header-height);
}

.transform-absolute-center {
}

.transition-header {
  transition: 1s ease;
}

.no-scroll {
  position: fixed;
  overflow-y: scroll;
  width: 100%;
}

/* footer !footer */

.footer-link-color,
.footer-link-color a {
  color: var(--text-secondary-color);
}

.footer-text-color {
  color: var(--footer-text-color);
}

.footer-sns-buttons {
  font-size: 30px;
}
.footer-sns-buttons svg {
  vertical-align: -0.125em;
}
.footer-links {
  font-size: 105%;
  font-weight: 700;
}
.footer-information {
  font-weight: 500;
}
.footer-copyright {
  font-weight: 600;
}

/** fonts !fonts */

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
