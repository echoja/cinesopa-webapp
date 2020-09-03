<template>
  <div
    id="app"
    @scroll="onScroll"
    :class="{
      top: isTop,
      bottom: isBottom,
      'noto-sans': true,
      ['route-' + $route.name]: true,
      mobile: isMobile,
      desktop: isDesktop,
      ['power' + scrollY]: true,
    }"
  >
    <div class="h-header"></div>
    <!-- fixed header 를 위한 빈자리 -->
    <!-- <affix relative-element-selector="#body"> -->
    <!-- :style="{ 'background-color': $store.state.menuTransparent ? 'transparent' : '#fff' }" -->
    <div class="header-wrapper fixed-top" :class="{ transparent: $store.state.menuTransparent }">
      <header
        class="position-relative mx-auto"
        :class="{
          /*'d-flex': !isTop, 'justify-content-between': !isTop*/
        }"
      >
        <div class="logo text-center transition-header">
          <!-- :style="{ color: $store.state.logoColor }" -->
          <b-link
            :to="{ name: 'Home' }"
            title="홈으로 이동"
            :class="{ white: $store.state.logoWhite }"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="transition-header"
              viewBox="0 0 254 52.07"
              role="img"
              aria-hidden="true"
              aria-labelledby="logo-title"
            >
              <title id="logo-title">씨네소파 로고</title>
              <path
                fill="currentColor"
                d="M2.38,47.22,0,43l1.19,2.1L0,43A32.77,32.77,0,0,0,13.36,26C17.27,13.68,20.07,6,28.05,2.65L29.9,7.1c-5.72,2.38-8,8-11.95,20.33A37.13,37.13,0,0,1,2.38,47.22Z"
              />
              <path
                fill="currentColor"
                d="M23.25,43A20.51,20.51,0,0,1,13.8,24.76l4.8.48L16.2,25l2.4.22A15.71,15.71,0,0,0,25.92,39Z"
              />
              <path
                fill="currentColor"
                d="M17.24,50.43l-2-4.37,1,2.19-1-2.18c.44-.21,10.88-5.35,14.13-19.76,3.88-17.2,8.38-20,15.4-23.18l.69-.31,2,4.39-.71.32C41.2,10,37.57,11.64,34,27.37,30.23,44.17,17.77,50.18,17.24,50.43Z"
              />
              <path
                fill="currentColor"
                d="M46.93,49.07C34.79,42.22,29.48,33,30.69,20.93l4.8.48C34.47,31.53,38.86,39,49.3,44.87Z"
              />
              <rect fill="currentColor" x="54.49" y="1.33" width="4.82" height="50.18" />
              <path
                fill="currentColor"
                d="M84.43,50.8H68.67V3h4.82V46H84.37c5.28-.13,11.79-1.13,13.07-2.41l3.41,3.4c-1,1-3.13,2.46-9.84,3.31-3.41.44-6.43.51-6.55.52Z"
              />
              <path
                fill="currentColor"
                d="M98.14,28.48a18.16,18.16,0,0,1-6.44-1.11l.92-2.23.92-2.23a14.52,14.52,0,0,0,12-1.27L108,25.81A19.53,19.53,0,0,1,98.14,28.48Z"
              />
              <rect fill="currentColor" x="104.39" y="1.33" width="4.82" height="50.18" />
              <rect fill="currentColor" x="113.74" y="1.47" width="4.82" height="50.18" />
              <path
                fill="currentColor"
                d="M128.4,36.6l-.68-4.77.34,2.38-.35-2.38A33.75,33.75,0,0,0,138,28,34.41,34.41,0,0,0,153.58,9.84C155.71,4,159,1.68,161.34.73a9.78,9.78,0,0,1,7.77.14L167,5.18a5.05,5.05,0,0,0-3.82,0c-2.09.83-3.83,3-5,6.3l0,0a39.63,39.63,0,0,1-18,20.77A37.57,37.57,0,0,1,128.4,36.6Z"
              />
              <path
                fill="currentColor"
                d="M180,36.56c-12.59-3-20.89-8.23-24.66-15.56a16.87,16.87,0,0,1-1.79-10.87l4.69,1.11-2.35-.56,2.35.54c-.13.59-2.85,14.54,22.87,20.65Z"
              />
              <path
                fill="currentColor"
                d="M153,49.84l-3.33-3.47a8.36,8.36,0,0,0,2.69-7.75,11.7,11.7,0,0,0-1.6-4.18l4-2.73C157.07,35.14,159.75,43.34,153,49.84Z"
              />
              <rect fill="currentColor" x="126.07" y="45.69" width="57.83" height="4.82" />
              <rect fill="currentColor" x="190.14" y="3.45" width="40.26" height="4.82" />
              <rect fill="currentColor" x="197.94" y="12.1" width="4.82" height="36" />
              <rect fill="currentColor" x="217.22" y="12.1" width="4.82" height="36" />
              <path
                fill="currentColor"
                d="M224.8,50.51H190.14V45.69h34.69a11.47,11.47,0,0,0,3.77-.83,17.92,17.92,0,0,0,7.82-6.16l3.84,2.91C233.79,50.15,226.06,50.51,224.8,50.51Z"
              />
              <rect fill="currentColor" x="235.93" y="1.04" width="4.82" height="51.03" />
              <path
                fill="currentColor"
                d="M240.4,27.81l-4.13-2.49a14,14,0,0,1,4.56-4.41c2.78-1.66,7.33-2.92,13.17.44l-2.4,4.18C244.58,21.49,240.8,27.15,240.4,27.81Z"
              />
            </svg>
            <!-- <b-img
              src="./assets/cinesopa-logo.svg"
              class="transition-header"
              alt="씨네소파 로고"
            ></b-img> -->
          </b-link>
        </div>

        <!-- 데스크톱 -->
        <div class="menu-desktop d-none d-md-block">
          <div
            id="nav"
            class="font-weight-600 text-center transition-header d-flex justify-content-center"
            :class="{ small: isMenuShouldSmall, white: $store.state.navLinkWhite }"
          >
            <b-link
              :class="[isMenuShouldSmall ? 'px-3' : 'px-4', {}]"
              :to="{ name: 'Page', params: { permalink: 'about' } }"
              >인사해요
            </b-link>
            <b-link :class="[isMenuShouldSmall ? 'px-3' : 'px-4']" :to="{ name: 'FilmList' }">
              영화봐요
            </b-link>
            <b-link
              :class="[isMenuShouldSmall ? 'px-3' : 'px-4']"
              :to="{ name: 'Board', params: { permalink: 'activity' } }"
              >활동해요
            </b-link>
            <b-link
              :class="[isMenuShouldSmall ? 'px-3' : 'px-4']"
              :to="{ name: 'Board', params: { permalink: 'notice' } }"
              >공지해요
            </b-link>
            <b-link
              :class="[isMenuShouldSmall ? 'px-3' : 'px-4']"
              :to="{ name: 'Request', params: { permalink: 'about' } }"
              >신청해요
            </b-link>
            <!-- <router-link to="/">Home</router-link> |
          <router-link to="/about">About</router-link> -->
          </div>
        </div>

        <!-- 모바일 -->
        <div class="menu-mobile d-block d-md-none h-100 d-flex align-items-center">
          <b-link v-b-toggle.sidebar-menu class="menu-button ml-3 p-0 ">
            <font-awesome-icon size="2x" :icon="['fas', 'bars']" />
          </b-link>
          <b-sidebar id="sidebar-menu" title="MENU" :backdrop-variant="'dark'" backdrop shadow>
            <div class="px-3 py-2">
              <p>
                <b-link class="px-4" :to="{ name: 'Page', params: { permalink: 'about' } }"
                  >인사해요
                </b-link>
              </p>
              <p>
                <b-link class="px-4" :to="{ name: 'FilmList' }">
                  영화봐요
                </b-link>
              </p>
              <p>
                <b-link class="px-4" :to="{ name: 'Board', params: { permalink: 'activity' } }"
                  >활동해요
                </b-link>
              </p>
              <p>
                <b-link class="px-4" :to="{ name: 'Board', params: { permalink: 'notice' } }"
                  >공지해요
                </b-link>
              </p>
              <p>
                <b-link class="px-4" :to="{ name: 'Request', params: { permalink: 'about' } }"
                  >신청해요
                </b-link>
              </p>
            </div>
          </b-sidebar>
        </div>
      </header>
    </div>
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
      </main>
      <footer>
        <div
          class="footer-sns-buttons mb-1 d-flex footer-link-color justify-content-center align-items-center"
        >
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
        <!-- class p-2 -->
        <div class="footer-information d-flex footer-text-color justify-content-center">
          <!-- <p>사업자등록번호 159-87-00749&nbsp; &nbsp;|&nbsp; &nbsp;부산시 해운대구 재반로103번길 5, 3층&nbsp; &nbsp;|&nbsp; &nbsp;coop.cinesopa@gmail.com</p> -->
          <p>
            <span class="m-0 m-md-2 footer-information-item">사업자등록번호 159-87-00749</span>
            <span class="m-0 m-md-2 footer-information-divider">|</span>
            <span class="m-0 m-md-2 footer-information-item"
              >부산시 해운대구 재반로103번길 5, 3층</span
            >
            <span class="m-0 m-md-2 footer-information-divider">|</span>
            <span class="m-0 m-md-2 footer-information-item">coop.cinesopa@gmail.com</span>
          </p>
        </div>
        <div class="footer-copyright d-flex footer-text-color justify-content-center mb-4">
          <p>Copyright ⓒ 2020 CINESOPA All Rights Reserved</p>
        </div>
        <!-- {{ text }} -->
      </footer>
    </div>
  </div>
</template>

<script>
// import cssVars from 'css-vars-ponyfill';

export default {
  data() {
    return {
      prevHeight: 0,
      showA: true,
      scrollY: 0,
      windowHeight: 0,
      windowWidth: 0,
      documentHeight: 0,
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
    cssVariables() {
      // const variables = {
      //   '--text-color': '#2B3E4A',
      //   '--text-secondary-color': '#576870',
      //   '--desktop-top-header-height': '300px',
      //   '--desktop-header-height': '100px',
      //   '--mobile-header-height': '80px',
      //   '--link-color': '#00B6E7',
      //   '--max-content-size': '1260px',
      //   '--footer-text-color': '#767676',
      //   '--nav-link-color': this.$store.state.navLinkColor,
      //   '--nav-link-hover-color': this.$store.state.navLinkHoverColor,
      // };
      // this.$nextTick(() => {
      //   console.log('ponyfill called!');
      //   cssVars({
      //     onlyLegacy: false,
      //     variables,
      //     onComplete: (...args) => {
      //       console.log(args);
      //     },
      //   });
      // });
      // return;
      return null;
    },
    isTop() {
      return this.scrollY === 0;
    },
    isBottom() {
      return this.scrollY + this.windowHeight === this.documentHeight;
    },
    userStyle() {
      return this.cssVariables;
    },
    isMobile() {
      return this.windowWidth < 768;
    },
    isDesktop() {
      return this.windowWidth >= 768;
    },
    isMenuShouldSmall() {
      return this.windowWidth < 992;
    },
    // logoWidth() {
    //   return this.isTop ? 237 : 154;
    // },
  },

  created() {
    this.setWindowSize();
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
      this.setWindowSize();
      console.log('resized!');
    },
    setWindowSize() {
      this.windowHeight = window.innerHeight;
      this.documentHeight = document.body.clientHeight;
      this.windowWidth = window.innerWidth;
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

/* default style */

:root {
  --text-color: #2b3e4a;
  --text-secondary-color: #576870;
  --desktop-top-header-height: 300px;
  --desktop-header-height: 100px;
  --mobile-header-height: 80px;
  --link-color: #00b6e7;
  --max-content-size: 1260px;
  --footer-text-color: #767676;
}

#app {
  // font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  // text-align: center;
  color: var(--text-color);
  overflow-x: hidden;
}
a,
button {
  color: var(--text-color);
}

button:hover {
  color: var(--text-color);
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

  &.small {
    min-width: 600px;
  }

  &.white a {
    color: #fff;
  }
}

#nav a {
  font-weight: bold;
  transition: 1s;
  color: var(--nav-link-color);
}

#nav a:hover {
  color: var(--nav-link-hover-color);
  text-decoration: none;
  transition: none;
}
.logo {
  position: absolute;
  transition: 1s ease;
}
.logo a.white {
  color:#fff;
}

.mobile .logo {
  margin-top: 25px;
  left: 50%;
  transform: translateX(-50%);
  & img,
  & svg {
    width: 154px;
  }
}

.desktop .logo {
  left: 0;
  margin-left: 20px;
  margin-top: 30px;
  & img,
  & svg {
    width: 154px;
  }
}

.top.desktop {
  // position:absolute;

  & #nav {
    margin-top: 133px;
    transform: translateX(-50%);
    left: 50%;
  }
  & .logo {
    margin-top: 80px;
    margin-left: 0;
    left: 50%;
    transform: translateX(-50%);
    & img,
    & svg {
      width: 237px;
    }
  }
}

#nav a.router-link-exact-active {
  color: var(--link-color);
}

// .header-wrapper {
//   background-color: #fff;
// }

.h-header {
  height: var(--desktop-top-header-height);
}

.mobile .h-header {
  height: var(--mobile-header-height);
}

header {
  height: var(--desktop-header-height);
  max-width: var(--max-content-size);
}

.header-wrapper {
  background-color: #fff;
  &.transparent {
    background-color: transparent;
  }
}

.desktop .header-wrapper,
.desktop header {
  height: var(--desktop-header-height);
}

.mobile .header-wrapper,
.mobile header {
  height: var(--mobile-header-height);
}

/* main menu !menu */
.menu-mobile {
}
.menu-desktop .small a {
  font-size: 80%;
}

.menu-button {
  color: var(--text-color);
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

footer p {
  margin: 0;
}

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

.mobile .footer-information-divider {
  display: none;
}

.mobile .footer-information-item {
  display: block;
  text-align: center;
  margin: 0;
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
