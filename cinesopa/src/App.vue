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
    }"
  >
    <VueSkipTo to="#main" label="본문 바로가기" />
    <div class="loading" v-if="pageLoading">loading</div>
    <div class="h-header"></div>
    <!-- fixed header 를 위한 빈자리 -->
    <!-- <affix relative-element-selector="#body"> -->
    <!-- :style="{ 'background-color': $store.state.menuTransparent ? 'transparent' : '#fff' }" -->
    <div
      :style="{ 'margin-top': `${headerMarginTopWhenScrollTop}px` }"
      class="header-wrapper transition-header fixed-top"
      :class="{ transparent: $store.state.menuTransparent }"
    >
    
    <!-- <b-link :to="'/test'">테스트</b-link> -->
      <header
        class="position-relative mx-auto"
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
              viewBox="0 0 226.77 47.02"
              role="img"
              aria-hidden="true"
              aria-labelledby="logo-title"
            >
              <title id="logo-title">씨네소파 로고</title>
              <path
                fill="currentColor"
                class="cls-1"
                d="M219.89,17.21a9.48,9.48,0,0,0-5.07,1.31V1.79h-5.4V35.5C207.89,38,202.3,41,198.06,41h0V11.57h-5.4V41l-11.6,0V11.57h-5.41V41h-6.49v5.4l29.13,0c3.79,0,8.56-1.52,11.13-4.2V47h5.4V25.34a5.34,5.34,0,0,1,5.07-2.73A8,8,0,0,1,223.66,24l3.11-4.41A13.32,13.32,0,0,0,219.89,17.21Z"
              />
              <rect
                fill="currentColor"
                class="cls-1"
                x="101.21"
                y="1.77"
                width="5.4"
                height="45.23"
              />
              <path
                fill="currentColor"
                class="cls-1"
                d="M137.38,19.09c1.59,3.39,4.55,6.57,8.79,9.32a49.12,49.12,0,0,0,14,5.46l1.14-5.28c-4.91-1.12-10.1-3.32-12.34-4.93-8.54-6.17-8.19-10.3-7.29-13.44a6.81,6.81,0,0,1,3.2-4.1,5.43,5.43,0,0,1,3.87-.56L150.63.49a10.7,10.7,0,0,0-7.2.32c-3.75,1.48-5.48,4.33-8.78,12.12-2.9,6.85-11.54,13.3-21,15.71L115,33.87C124.32,31.5,132.77,25.82,137.38,19.09Z"
              />
              <path
                fill="currentColor"
                class="cls-1"
                d="M140.57,37.41a12.74,12.74,0,0,0-2.39-8.89l-4.47,3a7.34,7.34,0,0,1,1.49,5.29c-.25,2.35-1,3.48-1.73,4.16H112.36v5.4h51.38V41H139.56A10.69,10.69,0,0,0,140.57,37.41Z"
              />
              <rect
                fill="currentColor"
                class="cls-1"
                x="48.16"
                y="1.79"
                width="5.4"
                height="45.23"
              />
              <path
                fill="currentColor"
                class="cls-1"
                d="M69.59,41H66.08V3.25h-5.4V46.44h8.91c10.28,0,17-1.18,20.56-3.6l-3-4.47C85.65,39.37,81.43,41,69.59,41Z"
              />
              <rect
                fill="currentColor"
                class="cls-1"
                x="169.16"
                y="3.25"
                width="36.17"
                height="5.4"
              />
              <path
                fill="currentColor"
                class="cls-1"
                d="M92.74,25.9V47h5.4V1.77h-5.4V20.34a9.51,9.51,0,0,1-2.58.66A22.68,22.68,0,0,1,83,20.5l-1.63,5.15a26.18,26.18,0,0,0,7,.85A13,13,0,0,0,92.74,25.9Z"
              />
              <path
                fill="currentColor"
                class="cls-1"
                d="M17.78,22.81a11.62,11.62,0,0,0,3.91,10.78c3.17-4.64,4.16-8.09,5.83-15.73,1.79-8.17,7.32-13.65,13.59-15.2l1.3,5.25C38,9,34.35,12.8,32.87,18.49a17.72,17.72,0,0,0,1.56,12.84c2.42,4,6.83,7.58,9.52,8.57L42.07,45A25.67,25.67,0,0,1,28.71,31.91,29.11,29.11,0,0,1,15.93,46.08l-2.58-4.74A23.06,23.06,0,0,0,18.06,38a18.54,18.54,0,0,1-4.45-6,30.58,30.58,0,0,1-10.8,11.3L0,38.63c7.38-4.49,10.73-11.49,13.75-21.34,1.77-5.79,4.27-10,7.43-12.47a16.22,16.22,0,0,1,4.11-2.38l2,5a10.78,10.78,0,0,0-2.75,1.6,14.7,14.7,0,0,0-3.3,4.15A43.75,43.75,0,0,0,17.78,22.81Z"
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
            :class="{ /*small: isMenuShouldSmall,*/ white: $store.state.navLinkWhite }"
          >
            <!-- :class="[isMenuShouldSmall ? 'px-3' : 'px-3', {}]" -->
            <b-link :to="{ name: 'Page', params: { permalink: 'about' } }">인사해요 </b-link>
            <!-- :class="[isMenuShouldSmall ? 'px-3' : 'px-3']"  -->
            <b-link :to="{ name: 'FilmList' }">
              영화봐요
            </b-link>
            <!-- :class="[isMenuShouldSmall ? 'px-3' : 'px-3']" -->
            <b-link :to="{ name: 'BoardActivity', params: { permalink: 'activity' } }"
              >활동해요
            </b-link>
            <!-- :class="[isMenuShouldSmall ? 'px-3' : 'px-3']" -->
            <b-link :to="{ name: 'BoardNotice', params: { permalink: 'notice' } }"
              >공지해요
            </b-link>
            <!-- :class="[isMenuShouldSmall ? 'px-3' : 'px-3']" -->
            <b-link :to="{ name: 'Distribution', params: { permalink: 'about' } }"
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
                <b-link
                  class="px-4"
                  :to="{ name: 'BoardActivity', params: { permalink: 'activity' } }"
                  >활동해요
                </b-link>
              </p>
              <p>
                <b-link class="px-4" :to="{ name: 'BoardNotice', params: { permalink: 'notice' } }"
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
        <!-- {{  }} -->
        <!-- mode="out-in" -->
        <transition
          name="fade"
          mode="out-in"
          @beforeLeave="beforeLeave"
          @enter="enter"
          @afterEnter="afterEnter"
        >
          <router-view :key="$route.path.split('/')[1]" :style="{ overflow: 'visible' }" />
        </transition>
      </main>
      <footer>
        <div
          class="footer-sns-buttons mb-1 d-flex footer-link-color
          justify-content-center align-items-center"
        >
          <b-link
            href="https://www.instagram.com/cinesopa/"
            target="_blank"
            rel="external"
            title="씨네소파 인스타그램 새 창으로 이동"
          >
            <font-awesome-icon :icon="['fab', 'instagram']" />
          </b-link>
          <b-link
            href="https://www.facebook.com/coop.cinesopa"
            target="_blank"
            rel="external"
            title="씨네소파 페이스북 새 창으로 이동"
          >
            <font-awesome-icon :icon="['fab', 'facebook']" />
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
              role="img"
              aria-hidden="true"
              aria-labelledby="naver-blog-icon-title"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 250.36 250.36"
            >
              <title id="naver-blog-icon-title">네이버 블로그 아이콘</title>
              <path
                fill="currentColor"
                d="M200.28,0H50.07A50.08,50.08,0,0,0,0,50.08V200.3a50.07,50.07,
                0,0,0,50.07,50.06H200.28a50.07,50.07,0,0,0,50.08-50.06V50.08A50.07,50.07,
                0,0,0,200.28,0Zm32.09,133.73a33.92,33.92,0,0,1-33.86,34H148l-17.24,28.07a4.15,
                4.15,0,0,1-.58.84,5.77,5.77,0,0,1-10,0,5.61,5.61,0,0,
                1-.56-.79l-17.25-28.08H51.85a33.91,33.91,0,0,1-33.86-34V53.12a33.92,
                33.92,0,0,1,33.86-34H198.51a33.92,33.92,0,0,1,33.86,34Z"
              />
              <path
                fill="currentColor"
                d="M65.6,78.21a17.44,17.44,0,0,0-11.16,5.17V62.56H41.31v54.69H54.58V113s3.13,5.65,
                11,5.65c0,0,18.5-.68,18.5-20.4C84.1,98.21,83.42,78.21,65.6,78.21Zm-2.89,28.86a8.44,
                8.44,0,1,1,8.43-8.44A8.44,8.44,0,0,1,62.71,107.07Z"
              />
              <path
                fill="currentColor"
                d="M88.31,61.34V74s6-.27,6,10.89v32.37H107V81.88S107.49,61.34,88.31,61.34Z"
              />
              <path
                fill="currentColor"
                d="M137.89,78.38s-21.69,0-21.69,20.25c0,0-.7,20,21.69,
                20,0,0,22.18,0,22.18-20C160.07,98.63,160.79,78.38,137.89,
                78.38Zm0,28.69a8.44,8.44,0,1,1,8.43-8.44A8.44,8.44,0,0,1,137.89,107.07Z"
              />
              <path
                fill="currentColor"
                d="M196.29,79.71v3.67a14.37,14.37,0,0,0-11-5S166.7,
                77.6,166.7,98.49c0,0-.2,19.47,18.06,19.47,
                0,0,7.45.31,11.53-5V116s.92,9.59-8.37,9.59h-3.16v11.62h5.1s19.18.21,
                19.18-20.5v-37Zm-7.85,27.36a8.44,8.44,0,1,1,8.43-8.44A8.43,
                8.43,0,0,1,188.44,107.07Z"
              />
            </svg>
          </b-link>

          <!-- <b-icon-app class="m-2"></b-icon-app>
          <b-icon-tools class="m-2"></b-icon-tools>
          <b-icon-person-fill class="m-2"></b-icon-person-fill> -->
        </div>
        <div class="footer-links d-flex footer-link-color justify-content-center">
          <b-link :to="{ name: 'EmailRefuse' }" class="mx-2 my-2">이메일무단수집거부</b-link>
          <b-link :to="{ name: 'Sitemap' }" class="mx-2 my-2">사이트맵</b-link>
        </div>
        <!-- class p-2 -->
        <div class="footer-information d-flex footer-text-color justify-content-center">
          <!-- <p>사업자등록번호 159-87-00749&nbsp; &nbsp;|&nbsp;
            &nbsp;부산시 해운대구 재반로103번길 5, 3층&nbsp; &nbsp;|
            &nbsp; &nbsp;coop.cinesopa@gmail.com</p> -->
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
import cssVars from 'css-vars-ponyfill';

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
      pageLoading: false,
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
      return this.scrollY <= 50;
    },
    isBottom() {
      return this.scrollY + this.windowHeight === this.documentHeight;
    },
    userStyle() {
      return this.cssVariables;
    },
    isMobile() {
      const isMobile = this.windowWidth < 768;
      this.$store.commit('setIsMobile', isMobile);
      return isMobile;
    },
    isDesktop() {
      return this.windowWidth >= 768;
    },
    isMenuShouldSmall() {
      return this.windowWidth < 992;
    },
    headerMarginTopWhenScrollTop() {
      return this.isTop ? -this.scrollY : 0;
    },
    // logoWidth() {
    //   return this.isTop ? 237 : 154;
    // },
  },

  created() {
    this.setWindowSize();
    // cssVars();
  },

  mounted() {
    // this.$nextTick(() => {
    //   cssVars({
    //     onlyLegacy: false,
    //   });
    // });
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
      this.scrollY = window.scrollY || window.pageYOffset;
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
    beforeLeave(/* element */) {
      let top = 0;
      if (window.scrollY >= 1) top = 1;
      window.scroll({
        top,
        behavior: 'smooth',
      });
      // this.prevHeight = getComputedStyle(element).height;
    },
    enter(/* element */) {
      // const { height } = getComputedStyle(element);
      // // eslint-disable-next-line no-param-reassign
      // element.style.height = this.prevHeight;
      // setTimeout(() => {
      //   // eslint-disable-next-line no-param-reassign
      //   element.style.height = height;
      // });
    },
    afterEnter(/* element */) {
      // // eslint-disable-next-line no-param-reassign
      // element.style.height = 'auto';
    },
  },
};
</script>

<style lang="scss" scoped>
// header
@use 'util';

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
  margin: 0 auto 200px;
}

#nav {
  font-size: 22px;
  margin-top: 0;
  left: 100%;
  transform: translateX(-96%);
  min-width: 612px;
  position: absolute;

  &.small {
    min-width: 600px;
  }

  &.white a {
    color: #fff;
  }
  & a {
    @extend %smooth-hover;
    font-weight: 500;
    padding: 16px;
    color: var(--nav-link-color);
  }

  & a:hover {
    color: var(--nav-link-hover-color);
  }
  // & a:last-child {
  //   padding-right: 0;
  // }
}
.desktop #nav {
  margin-top: 20px;
}

// header

.transition-header {
  transition: 0.5s ease;
}

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
  // background-color: rgba(255, 255, 255, 0.4);
  // backdrop-filter: blur(5px);
  background-color: #fff;
  // @include util.smooth-move(0.2s);
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

// logo

.logo {
  position: absolute;
  & svg {
    @include util.smooth-move(0.5s);
  }
}

.logo a {
  color: var(--logo-color);
  display: inline-block;
  padding: 10px;
  // transition: 1s;
}
.logo a:hover {
  color: var(--text-color);
}

.logo a.white {
  color: #fff;
}

.mobile .logo {
  margin-top: 25px;
  left: 50%;
  transform: translateX(-50%);
  & img,
  & svg {
    width: 154px;
    height: 31.92px;
  }
}

.desktop .logo {
  left: 0;
  margin-left: 20px;
  margin-top: 20px;
  & img,
  & svg {
    width: 154px;
    height: 31.92px;
  }
}

// top desktop nav, logo, img

.top.desktop {
  & #nav {
    // margin-top: 86px;
    margin-top: 100px;
    transform: translateX(-50%);
    left: 50%;
  }
  & .logo {
    margin-top: 40px;
    margin-left: 0;
    left: 50%;
    transform: translateX(-50%);
    & img,
    & svg {
      width: 200px;
      height: 41.47px;
    }
  }
}

</style>

<style lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@100;300;400;500;700;900&family=Noto+Serif+KR:wght@200;300;400;500;600;700;900&display=swap');

:root {
  --text-color: #2b3e4a;
  // --text-secondary-color: #576870;
  --text-secondary-color: #767676;
  --desktop-top-header-height: 230px;
  --desktop-header-height: 100px;
  --mobile-header-height: 80px;
  --logo-color: #00a9e0;
  --link-color: #009eda;
  --nav-link-hover-color: #009eda;
  --max-content-size: 1260px;
  --footer-text-color: #767676;
  --footer-icon-color: #aaa;
  --secondary-text-color: #767676;
}

a,
button {
  color: var(--text-color);
}

button:hover {
  color: var(--text-color);
}



#nav a.router-link-exact-active {
  color: var(--link-color);
}

/* main menu !menu */

.menu-desktop .small a {
  font-size: 80%;
}

.menu-button {
  color: var(--text-color);
}

/* footer !footer */

footer {
  font-size: 14px;
}

footer p {
  margin: 0;
}

.footer-link-color,
.footer-link-color a {
  color: var(--text-secondary-color);
}

.footer-text-color {
  color: var(--text-secondary-color);
  // color: var(--footer-text-color);
}

.footer-sns-buttons {
  font-size: 30px;
  & a {
    transition: 1s;
  }
  & a:hover {
    color: var(--link-color);
    transition: none;
  }
}
.footer-sns-buttons svg {
  margin: 0px 6px;
  vertical-align: -0.125em;
  color: var(--footer-icon-color);
}
.footer-links {
  // font-size: 105%;
  font-weight: 500;
  margin-bottom: 20px;
}
.footer-information {
  font-weight: 400;
  margin-bottom: 10px;
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
  font-weight: 500;
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

/* search box */

.search-icon {
  position: absolute;
  pointer-events: none;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 1;
  font-size: 24px;
  color: #b0b6ba;
}

.search-box {
  border: 2px solid #b0b6ba;
  font-size: 18px;
  padding-top: 10px;
  padding-bottom: 10px;
}

.search-box::-ms-clear {
  display: none;
}
.search-box::-webkit-search-cancel-button {
  display: none;
}
.search-box::-webkit-search-decoration {
  -webkit-appearance: none;
  appearance: none;
}

// pagination
.film-pagination {
  & .page-item {
    & .page-link {
      width: 40px;
      height: 40px;
      text-align: center;
      border: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-left: 0;
      background-color: white;
      border-radius: 100px;
      color: var(--text-color);
    }
    & .page-link:hover {
      background-color: #eee;
    }

    &.disabled .page-link {
      border: 0;
    }

    &.active .page-link {
      color: #fff;
      background-color: var(--text-color);
    }
  }
}

// utility

.visually-hidden {
  position: absolute;
  left: -10000px;
  top: auto;
  width: 1px;
  height: 1px;
  overflow: hidden;
}
.underlined-box {
    border: 0;
    border-radius: 0;
    border-bottom: 1px solid #ddd;
}

</style>

<style>
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
</style>
