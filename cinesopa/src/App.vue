<template>
  <!-- bottom: isBottom, -->
  <!-- top: isTop, -->
  <!-- 
      ['route-' + $route.name]: true, -->
  <!--       mobile: isMobile,
      desktop: isDesktop, -->
  <!-- cancelable: true, -->
  <!-- onStart: onStart, -->
  <!-- onDone: onDone, -->
  <!-- onCancel: onCancel, -->
  <!-- x: false, -->
  <!-- y: true -->
  <!-- easing: 'linear', -->
  <!-- force: true, -->
  <!-- v-scroll-to="{
        el: '#main',
        container: 'body',
        duration: 500,
        lazy: true,
        offset: -200,
      }" -->
  <div id="app" ref="app" class="top noto-sans">
    <!-- to="#main" -->
    <b-link class="skip-to" @click="skipToClicked">본문 바로가기</b-link>
    <div class="loading" v-if="pageLoading">loading</div>
    <div class="h-header" v-show="is_site_public"></div>
    <!-- fixed header 를 위한 빈자리 -->
    <!-- <affix relative-element-selector="#body"> -->
    <!-- :style="{ 'background-color': $store.state.menuTransparent ? 'transparent' : '#fff' }" -->
    <!-- :style="{ 'margin-top': `${headerMarginTopWhenScrollTop}px` }" -->
    <div
      v-show="is_site_public"
      class="header-wrapper transition-header fixed-top"
      :class="{ transparent: $store.state.menuTransparent }"
      ref="header-wrapper"
    >
      <!-- <b-link :to="'/test'">테스트</b-link> -->
      <header class="position-relative mx-auto">
        <div class="logo text-center transition-header">
          <!-- :style="{ color: $store.state.logoColor }" -->
          <b-link
            :to="{ name: 'Home' }"
            :class="{ white: $store.state.logoWhite }"
            @click="getBlur"
          >
            <span class="sr-only">홈으로 이동</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="transition-header"
              focusable="false"
              viewBox="0 0 226.77 47.02"
              role="img"
              aria-hidden="true"
              aria-labelledby="logo-title"
            >
              <title id="logo-title">씨네소파 로고</title>
              <path
                fill="currentColor"
                class="cls-1"
                d="M219.89,17.21a9.48,9.48,0,0,0-5.07,1.31V1.79h-5.4V35.5C207.89,38,202.3,41,198.06,
                41h0V11.57h-5.4V41l-11.6,0V11.57h-5.41V41h-6.49v5.4l29.13,0c3.79,0,8.56-1.52,
                11.13-4.2V47h5.4V25.34a5.34,5.34,0,0,1,5.07-2.73A8,8,0,0,1,223.66,
                24l3.11-4.41A13.32,
                13.32,0,0,0,219.89,17.21Z"
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
                d="M137.38,19.09c1.59,3.39,4.55,6.57,8.79,9.32a49.12,49.12,0,0,0,14,
                5.46l1.14-5.28c-4.91-1.12-10.1-3.32-12.34-4.93-8.54-6.17-8.19-10.3-7.29-13.44a6.81,
                6.81,0,0,
                1,3.2-4.1,5.43,5.43,0,0,1,3.87-.56L150.63.49a10.7,10.7,0,0,0-7.2.32c-3.75,1.48-5.48,
                4.33-8.78,
                12.12-2.9,6.85-11.54,13.3-21,15.71L115,33.87C124.32,31.5,132.77,25.82,137.38,19.09Z"
              />
              <path
                fill="currentColor"
                class="cls-1"
                d="M140.57,37.41a12.74,12.74,0,0,0-2.39-8.89l-4.47,3a7.34,7.34,0,0,1,1.49,5.29c-.25,
                2.35-1,3.48-1.73,
                4.16H112.36v5.4h51.38V41H139.56A10.69,10.69,0,0,0,140.57,37.41Z"
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
                d="M69.59,41H66.08V3.25h-5.4V46.44h8.91c10.28,0,17-1.18,20.56-3.6l-3-4.47C85.65,
                39.37,81.43,41,69.59,41Z"
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
                d="M92.74,25.9V47h5.4V1.77h-5.4V20.34a9.51,9.51,0,0,1-2.58.66A22.68,22.68,0,0,
                1,83,20.5l-1.63,5.15a26.18,
                26.18,0,0,0,7,.85A13,13,0,0,0,92.74,25.9Z"
              />
              <path
                fill="currentColor"
                class="cls-1"
                d="M17.78,22.81a11.62,11.62,0,0,0,3.91,10.78c3.17-4.64,4.16-8.09,5.83-15.73,
                1.79-8.17,7.32-13.65,13.59-15.2l1.3,5.25C38,9,34.35,12.8,32.87,18.49a17.72,
                17.72,0,0,0,1.56,12.84c2.42,4,6.83,7.58,9.52,8.57L42.07,45A25.67,25.67,0,0,
                1,28.71,31.91,29.11,29.11,0,0,1,15.93,46.08l-2.58-4.74A23.06,23.06,0,0,0,
                18.06,38a18.54,18.54,0,0,1-4.45-6,30.58,30.58,0,0,1-10.8,11.3L0,38.63c7.38-4.49,
                10.73-11.49,13.75-21.34,1.77-5.79,4.27-10,7.43-12.47a16.22,16.22,0,0,1,
                4.11-2.38l2,5a10.78,10.78,0,0,0-2.75,1.6,14.7,14.7,0,0,0-3.3,4.15A43.75,43.75,
                0,0,0,17.78,22.81Z"
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
            class="text-center transition-header d-flex justify-content-center"
            :class="{
              /*small: isMenuShouldSmall,*/ white: $store.state.navLinkWhite,
            }"
          >
            <!-- :class="[isMenuShouldSmall ? 'px-3' : 'px-3', {}]" -->
            <b-link
              v-for="(obj, objIndex) in menuItems"
              :key="objIndex"
              :to="obj.route"
              @click="getBlur($event)"
              >{{ obj.label }}</b-link
            >
            <!-- <b-link :to="{ name: 'About' }">회사소개 </b-link> -->
            <!-- :class="[isMenuShouldSmall ? 'px-3' : 'px-3']"  -->
            <!-- <b-link :to="{ name: 'FilmList', params: { type: 'all' } }"> -->
            <!-- 작품소개 -->
            <!-- </b-link> -->
            <!-- :class="[isMenuShouldSmall ? 'px-3' : 'px-3']" -->
            <!-- <b-link :to="{ name: 'BoardArchive', params: { board: 'all' } }" -->
            <!-- >아카이브 -->
            <!-- </b-link> -->
            <!-- :class="[isMenuShouldSmall ? 'px-3' : 'px-3']" -->
            <!-- <b-link :to="{ name: 'BoardNotice', params: { board: 'all' } }" -->
            <!-- >공지사항 -->
            <!-- </b-link> -->
            <!-- :class="[isMenuShouldSmall ? 'px-3' : 'px-3']" -->
            <!-- <b-link -->
            <!-- :to="{ name: 'Distribution', params: { permalink: 'about' } }" -->
            <!-- >신청하기 -->
            <!-- </b-link> -->
            <!-- <router-link to="/">Home</router-link> |
          <router-link to="/about">About</router-link> -->
          </div>
        </div>

        <!-- 모바일 -->
        <div
          class="menu-mobile d-block d-md-none h-100 d-flex align-items-center"
        >
          <b-link v-b-toggle.sidebar-menu class="menu-button ml-3 p-0">
            <span class="sr-only">메인메뉴 열기</span>
            <font-awesome-icon size="2x" :icon="['fas', 'bars']" />
          </b-link>
          <b-sidebar
            id="sidebar-menu"
            title="메뉴"
            :backdrop-variant="'dark'"
            backdrop
            shadow
            aria-label="메뉴"
            close-label="닫기"
            @shown="sidebarMenuShown"
          >
            <template #header-close>
              <span class="close-figure" aria-hidden="true">&times;</span>
              <span class="sr-only"> 닫기 </span>
            </template>
            <div class="px-3 py-2">
              <p v-for="(obj, objIndex) in menuItems" :key="objIndex">
                <b-link class="px-4" :to="obj.route" @click="getBlur($event)">{{
                  obj.label
                }}</b-link>
              </p>
              <!-- <p>
                <b-link class="px-4" :to="">회사소개 </b-link>
              </p>
              <p>
                <b-link class="px-4" :to=""> 작품소개 </b-link>
              </p>
              <p>
                <b-link class="px-4" :to=""> </b-link>
              </p>
              <p>
                <b-link class="px-4" :to=""> </b-link>
              </p>
              <p><b-link class="px-4" :to=""> </b-link></p> -->
            </div>
          </b-sidebar>
        </div>
      </header>
    </div>
    <div id="body" v-show="is_site_public">
      <main id="main">
        <!-- {{  }} -->
        <!-- mode="out-in" -->
        <transition
          name="fade"
          mode="out-in"
          @beforeLeave="beforeLeave"
          @enter="enter"
          @afterLeave="afterLeave"
          @afterEnter="afterEnter"
        >
          <router-view
            :key="$route.fullPath.split('/')[1]"
            :style="{ overflow: 'visible' }"
          />
        </transition>
      </main>
      <footer class="body-footer">
        <!-- accessbility -->
        <div class="accessibility">
          <a
            href="http://www.wa.or.kr/board/list.asp?BoardID=0006"
            target="_blank"
            title="새창"
            class="accessibility-link"
          >
            <b-img
              width="118"
              height="83"
              class="wa"
              src="./assets/gray_accessbility.jpg"
              alt="(사)한국장애인단체종연합회 한국웹접근성인증평가원 웹 접근성 우수사이트 인증마크(WA인증마크)"
            ></b-img>
          </a>
        </div>
        <!-- sns buttons -->
        <div
          class="footer-sns-buttons mb-1 d-flex footer-link-color justify-content-center align-items-center"
        >
          <b-link
            href="https://www.instagram.com/cinesopa/"
            target="_blank"
            rel="external"
          >
            <span class="sr-only">씨네소파 인스타그램 이동</span>
            <font-awesome-icon :icon="['fab', 'instagram']" />
          </b-link>
          <b-link
            href="https://www.facebook.com/coop.cinesopa"
            target="_blank"
            rel="external"
          >
            <span class="sr-only">씨네소파 페이스북 이동</span>
            <font-awesome-icon :icon="['fab', 'facebook']" />
          </b-link>
          <!-- <b-img class="m-2" src="./assets/naver-blog.svg"></b-img> -->
          <b-link
            href="https://blog.naver.com/cinesopa"
            target="_blank"
            rel="external"
          >
            <span class="sr-only">씨네소파 네이버 블로그 이동</span>
            <!-- aria-describedby="설명id" -->
            <svg
              width="30"
              role="img"
              aria-hidden="true"
              aria-labelledby="naver-blog-icon-title"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 250.36 250.36"
              focusable="false"
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

        <!-- footer links -->
        <div
          class="footer-links d-flex footer-link-color justify-content-center"
        >
          <b-link :to="{ name: 'EmailRefuse' }" class="mx-2 my-2"
            >이메일무단수집거부</b-link
          >
          <b-link :to="{ name: 'Sitemap' }" class="mx-2 my-2">사이트맵</b-link>
        </div>
        <!-- footer info -->
        <div
          class="footer-information d-flex footer-text-color justify-content-center"
        >
          <!-- <p>사업자등록번호 159-87-00749&nbsp; &nbsp;|&nbsp;
            &nbsp;부산시 해운대구 재반로103번길 5, 3층&nbsp; &nbsp;|
            &nbsp; &nbsp;coop.cinesopa@gmail.com</p> -->
          <p>
            <span class="m-0 m-md-2 footer-information-item"
              >사업자등록번호 159-87-00749</span
            >
            <span class="m-0 m-md-2 footer-information-divider">|</span>
            <span class="m-0 m-md-2 footer-information-item"
              >{{ address || '부산시 해운대구 재반로103번길 5, 3층'}}</span
            >
            <span class="m-0 m-md-2 footer-information-divider">|</span>
            <span class="m-0 m-md-2 footer-information-item"
              >{{ contact_email || 'coop.cinesopa@gmail.com' }}</span
            >
          </p>
        </div>
        <div
          class="footer-copyright d-flex footer-text-color justify-content-center mb-4"
        >
          <p>Copyright ⓒ 2020 CINESOPA All Rights Reserved</p>
        </div>
        <!-- {{ text }} -->
      </footer>
    </div>
    <div id="under-contruction" v-if="!is_site_public">
      <p>사이트 공사중입니다!</p>
      <p>coop.cinesopa@gmail.com</p>
    </div>
  </div>
</template>

<script>
import { makeRequest } from './graphql-client';
// import cssVars from 'css-vars-ponyfill';
import { fixFocusScroll, getOptionsFromServer } from '@/util';

const getIsPublicFromServer = makeRequest('siteOption', {
  type: 'query',
  paramList: [
    {
      varName: 'name',
      typeName: 'String!',
    },
  ],
  resultString: '{name value success code}',
});

export default {
  title: '영화배급협동조합 씨네소파',
  data() {
    return {
      menuItems: [
        { label: '회사소개', route: { name: 'About' } },
        {
          label: '작품소개',
          route: { name: 'FilmList', params: { type: 'all' } },
        },
        {
          label: '아카이브',
          route: { name: 'BoardArchive', params: { board: 'all' } },
        },
        {
          label: '공지사항',
          route: { name: 'BoardNotice', params: { board: 'all' } },
        },
        { label: '신청하기', route: { name: 'Distribution' } },
      ],
      is_site_public: true,
      phone: '',
      address: '',
      contact_email: '',
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
    // isTop() {
    //   return this.scrollY <= 50;
    // },
    // isBottom() {
    //   return this.scrollY + this.windowHeight === this.documentHeight;
    // },
    userStyle() {
      return this.cssVariables;
    },
    // isMobile() {
    //   const isMobile = this.windowWidth < 768;
    //   this.$store.commit('setIsMobile', isMobile);
    //   return isMobile;
    // },
    // isDesktop() {
    //   return this.windowWidth >= 768;
    // },
    isMenuShouldSmall() {
      return this.windowWidth < 992;
    },
    // headerMarginTopWhenScrollTop() {
    //   return this.isTop ? -this.scrollY : 0;
    // },
    // logoWidth() {
    //   return this.isTop ? 237 : 154;
    // },
  },
  created() {
    // polyfill for CustomEvent
    (() => {
      if (typeof window.CustomEvent === 'function') return;
      function CustomEvent(event, paramsInput) {
        const params = paramsInput || {
          bubbles: false,
          cancelable: false,
          detail: null,
        };
        const evt = document.createEvent('CustomEvent');
        evt.initCustomEvent(
          event,
          params.bubbles,
          params.cancelable,
          params.detail,
        );
        return evt;
      }
      window.CustomEvent = CustomEvent;
    })();
  },

  mounted() {
    // cssVars({
    //   onlyLegacy: false,
    //   onComplete() {
    //     const event = new CustomEvent('cssVarsSuccessed');
    //     // 이벤트 디스패치.
    //     window.dispatchEvent(event);
    //   },
    // });
    this.$nextTick(() => {
      this.setWindowSize();
      this.updateThingsWhenScroll();
    });
    getIsPublicFromServer({ name: 'is_site_public' })
      .then((result) => {
        // console.log('#App getIsPublicFromServer');
        // console.log(result);
        this.is_site_public = result.value;
      })
      .catch((err) => {
        console.error('#App getIsPublicFromServer Error!');
        console.error(err);
      });

    // 옵션 설정을 서버로부터 불러오기
    getOptionsFromServer('is_site_public', 'address', 'phone', 'contact_email')
      .then((optionResults) => {
        const [
          is_site_public,
          address,
          phone,
          contact_email,
        ] = optionResults.map((option) => option.value);
        this.is_site_public = is_site_public;
        this.address = address;
        this.phone = phone;
        this.contact_email = contact_email;
      })
      .catch((err) => {
        console.error(err);
      });
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
      this.updateThingsWhenScroll();
      // console.log(e);
      // this.scrollY = window.scrollY || window.pageYOffset;
    },
    onResize() {
      this.setWindowSize();
      // console.log('resized!');
    },
    setWindowSize() {
      if (window.innerWidth < 768) {
        this.$refs.app.classList.add('mobile');
        this.$refs.app.classList.remove('desktop');
        this.$store.commit('setIsMobile', true);
      } else {
        this.$refs.app.classList.remove('mobile');
        this.$refs.app.classList.add('desktop');
        this.$store.commit('setIsMobile', false);
      }
      // this.windowHeight = window.innerHeight;
      // this.documentHeight = document.body.clientHeight;
      // this.windowWidth = window.innerWidth;
    },
    updateThingsWhenScroll() {
      const scrollY = window.scrollY || window.pageYOffset;
      // console.log(`scrollY: ${scrollY}`);
      const isTop = scrollY <= 50;
      if (isTop) {
        this.$refs.app.classList.add('top');
        this.$refs['header-wrapper'].style.marginTop = -scrollY;
      } else {
        this.$refs.app.classList.remove('top');
        this.$refs['header-wrapper'].style.marginTop = 0;
      }
    },
    beforeLeave(/* element */) {
      let top = 0;
      if ((window.scrollY || window.pageYOffset) >= 1) top = 1;
      window.scroll({
        top,
        behavior: 'smooth',
      });
      // this.prevHeight = getComputedStyle(element).height;
    },
    enter(/* element */) {
      // console.log(`route name: ${this.$route.name}`);
      // console.log(`route full path split / [0]${this.$route.fullPath.split('/')[1]}`);
      if (this.$route.name === 'Home') {
        this.$refs.app.classList.add('route-home');
      }
      // const { height } = getComputedStyle(element);
      // // eslint-disable-next-line no-param-reassign
      // element.style.height = this.prevHeight;
      // setTimeout(() => {
      //   // eslint-disable-next-line no-param-reassign
      //   element.style.height = height;
      // });
    },
    afterLeave() {
      if (this.$route.name !== 'Home') {
        this.$refs.app.classList.remove('route-home');
      }
    },
    afterEnter(/* element */) {
      // // eslint-disable-next-line no-param-reassign
      // element.style.height = 'auto';
    },
    skipToClicked() {
      // this.$scrollTo('#main', 500);
      this.$nextTick(() => {
        const element = document.getElementById('main');
        const offset = 300;

        // 포커싱 비주얼적으로 보여주기 위해 -1 설정하고, 1초 뒤에 삭제
        element.setAttribute('tabindex', '-1');
        setTimeout(() => element.removeAttribute('tabindex'), 1000);

        // setActive 는 인터넷 익스플로러 용.
        if (element.setActive) {
          element.setActive();
        } else {
          element.focus({ preventScroll: true });
        }

        // 실제 스크롤.
        window.scroll(0, element.offsetTop - offset);
      });
    },
    sidebarMenuShown() {
      // console.log('# App sidebarMenuShown called');

      this.$nextTick(() => {
        const closeButton = document
          .getElementById('sidebar-menu')
          .getElementsByClassName('close')[0];

        closeButton.focus();
        closeButton.setAttribute('title', '닫기');
      });
    },
    getBlur(e) {
      this.$nextTick(() => {
        document.activeElement.blur();
      });
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
  color: #2b3e4a;
  overflow: hidden;
}

.skip-to * {
  padding: 0;
  margin: 0;
  box-sizing: border-box;
}

.skip-to {
  position: fixed;
  z-index: 1000;
  display: block;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
  font-weight: bold;
  font-size: 20px;

  &:focus {
    left: 3px;
    top: 3px;
    clip: auto;
    height: auto;
    width: auto;
    background-color: #fff;
    border: 2px solid #333;
    padding: 10px 20px;
  }
}

// #app.route-home {
//   overflow: hidden;
// }

.route-home {
  & footer,
  & .h-header {
    display: none;
  }
  & #main {
    margin-bottom: 0;
  }
}

#main {
  max-width: 1260px;
  margin: 0 auto 200px;
}

#nav {
  font-size: 24px;
  margin-top: 0;
  left: 100%;
  transform: translateX(-96%);
  min-width: 650px;
  position: absolute;

  &.small {
    min-width: 600px;
  }

  &.white a {
    color: #fff;
    opacity: 0.7;
  }
  a {
    @extend %smooth-hover;
    font-weight: 500;
    padding: 16px;
  }

  a:hover {
    color: #009eda;
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
  height: 230px;
}

.mobile .h-header {
  height: 80px;
}

header {
  height: 100px;
  max-width: 1260px;
}

.header-wrapper {
  // background-color: rgba(255, 255, 255, 0.4);
  // backdrop-filter: blur(5px);
  background-color: #fff;
  z-index: 900;
  // @include util.smooth-move(0.2s);
  &.transparent {
    background-color: transparent;
  }
}

.desktop .header-wrapper,
.desktop header {
  height: 100px;
}

.mobile .header-wrapper,
.mobile header {
  height: 80px;
}

// logo

.logo {
  position: absolute;
  & svg {
    @include util.smooth-move(0.5s);
  }
}

.logo a {
  color: #00a9e0;
  display: inline-block;
  padding: 10px;
  // transition: 1s;
}
.logo a:hover {
  color: #2b3e4a;
}

.logo a.white {
  color: #fff;
  opacity: 0.7;
}

.mobile .logo {
  margin-top: 15px;
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
  margin-left: 0;
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

.accessibility {
  display: flex;
  justify-content: center;
  margin-top: 20px;
  margin-bottom: 20px;
}

.accessibility-link img {
  opacity: 0.6;
}
.accessibility-link:hover img {
  opacity: 0.4;
}
</style>

<style lang="scss">
@import '@/util';
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
  --link-dark-color: #007faf;
  --max-content-size: 1260px;
  --footer-text-color: #767676;
  --footer-icon-color: #aaa;
  --secondary-text-color: #767676;
}

a,
button {
  color: #2b3e4a;
}

button:hover {
  color: #2b3e4a;
}

// #body {
//   // overflow: hidden;
// }

#nav a.router-link-exact-active {
  color: #009eda;
  position: relative;
  &:after {
    content: '';
    position: absolute;
    left: 16px;
    right: 16px;
    bottom: 10px;
    height: 3px;
    background-color: #009eda;
  }
}

/* main menu !menu */

.menu-desktop .small a {
  font-size: 80%;
}

.menu-button {
  color: #2b3e4a;
}

.close-figure {
  font-size: 30px;
  color: #000;
}

/* footer !footer */

.body-footer {
  font-size: 14px;
  position: absolute;
  width: 100%;
  height: auto;
}

.body-footer p {
  margin: 0;
}

.footer-link-color,
.footer-link-color a {
  color: #767676;
}

.footer-text-color {
  color: #767676;
  // color: #767676;
}

.footer-sns-buttons {
  font-size: 30px;
  & a {
    transition: 1s;
  }
  & a:hover {
    color: #009eda;
    transition: none;
  }
}
.footer-sns-buttons svg {
  height: 1em;
  margin: 0px 6px;
  vertical-align: -0.125em;
  color: #aaa;
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
  font-family: 'Noto Sans KR', -apple-system, BlinkMacSystemFont, 'Segoe UI',
    Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif,
    'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji';
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
  border: 1px solid #b0b6ba;
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
      color: #2b3e4a;
    }
    & .page-link:hover {
      background-color: #eee;
    }

    &.disabled .page-link {
      border: 0;
    }

    &.active .page-link {
      color: #fff;
      background-color: #2b3e4a;
    }
  }
}

// carousel arrow style

.featured-wrapper,
.film-photos-wrapper {
  .carousel-control-prev-icon,
  .carousel-control-next-icon {
    width: 80px;
    height: 80px;
  }
  .carousel-control-prev-icon {
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 50.3 97.78'%3E%3Cpolygon fill='%23fff' points='48.89 0 50.3 1.41 2.82 48.89 50.3 96.37 48.89 97.78 0 48.89 48.89 0' /%3E%3C/svg%3E");
  }
  .carousel-control-next-icon {
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 50.51 98.2'%3E%3Cpolygon fill='%23fff' points='1.41 98.2 0 96.79 47.69 49.1 0 1.41 1.41 0 50.52 49.1 1.41 98.2' /%3E%3C/svg%3E");
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

// focus

// for test
// :focus {
//   outline: 3px solid #009eda;
//   // transition: 0s;
// }
a:focus,
main:focus {
  outline: 3px solid #000;
  // transition: 0s;
}

.carousel-control-prev:focus,
.carousel-control-next:focus {
  border: 3px solid #000;
  // outline: 3px solid #000;
}

a:focus {
  transition: 0s;
}

// common legend and caption

legend,
caption {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

// modal x button size setting

.modal-header .close {
  font-size: 35px;
  padding: 8px 15px 10px 10px;
  opacity: 0.8;
  margin: -0.8rem -0.8rem -0.8rem auto;
  &:focus {
    outline: 3px solid #000;
  }
}
.b-sidebar-header .close:focus {
  outline: 3px solid #000;
}

// calendar emphasize color
.b-calendar-grid-body {
  .btn-primary:not(:disabled):not(.disabled).active,
  .btn-primary:not(:disabled):not(.disabled):active,
  .show > .btn-primary.dropdown-toggle {
    color: #fff;
    background-color: $cal-emp-color;
    border-color: $cal-emp-color;
  }

  .btn-primary:not(:disabled):not(.disabled):active:focus,
  .btn-primary:not(:disabled):not(.disabled).active:focus,
  .show > .btn-primary.dropdown-toggle:focus {
    box-shadow: 0 0 0 0.2rem $cal-emp-color;
  }
  // 오늘 날짜 선택중
  .btn-outline-primary:focus,
  .btn-outline-primary.focus {
    box-shadow: 0 0 0 0.2rem $cal-emp-color;
  }
  // 일반 날짜 선택중
  .btn-light:focus,
  .btn-light.focus {
    color: $text-color;
    background-color: #fff;
    border-color: $text-color;
    box-shadow: 0 0 0 0.2rem rgba(0, 0, 0, 0.7);
  }
  // 오늘 날짜
  .btn-outline-primary {
    color: #007cad;
    text-decoration: underline solid currentColor 2px;
  }
}

// request chekcbox
.request {
  .custom-control-input:checked ~ .custom-control-label::before {
    background-color: $text-color;
    border-color: $text-color;
  }
  .custom-control-label::before {
    border-color: $text-color;
  }
}

// input focus 색상 조정
#main .form-control:focus,
#main .form-control.focus,
#main .custom-select:focus,
#main .custom-select.focus,
.modal .form-control:focus,
.modal .form-control.focus {
  box-shadow: 0 0 0 0.2rem rgba(0, 158, 218, 0.6);
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

/* .vue-skip-to {
  z-index: 1000;
} */

#under-contruction {
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}
</style>
