<template>
  <div id="home" ref="home">
    <h1 class="sr-only">홈</h1>
    <!-- <b-button @click="pageScrollMoveStart(0, 2)">테스트</b-button>
    <b-button @click="howv = !howv">테스트2</b-button>
    <div>{{ how('v') }}</div> -->

    <!-- <b-button @click="button">토글</b-button> -->
    <!-- <div class="main-transition">
      <transitionode="out-in">
        <div v-if="show.main" key="main">11111</div>
        <div v-if="show.featured" key="featured">2222</div>
        <div v-if="show.recent" key="recent">3333</div>
      </transition> name="main" m
    </div> -->
    <div class="home-start" ref="homeStart"></div>
    <!-- <div class="swiper-container" ref="swiperContainer" style="display:none;">
      <div class="swiper-wrapper">
        Slides
        <div class="swiper-slide">Slide 1</div>
        <div class="swiper-slide">Slide 2</div>
        <div class="swiper-slide">Slide 3</div>
      </div>
      If we need pagination
      <div class="swiper-pagination"></div>

      If we need navigation buttons
      <div class="swiper-button-prev"></div>
      <div class="swiper-button-next"></div>

      If we need scrollbar
      <div class="swiper-scrollbar"></div>
    </div> -->
    <!-- style="display:none;" -->
    <div class="page-scroll-container" ref="container">
      <!-- ref="scroll0" -->
      <div class="page-scroll-section" v-b-visible="visible(0)">
        <!-- <transition name="scroll0" @after-enter="afterEnter0"
         @before-enter="refreshRellax"> -->
        <transition
          @enter="enter0"
          @leave="leave0"
          @beforeEnter="beforeEnter0"
          @beforeLeave="beforeLeave0"
        >
          <!-- <transition name="page0"> -->
          <!-- :class="{ 'out-of-sight': !isVisible(0) }" -->
          <div v-if="isVisible(0)" class="w-100 h-100">
            <div class="position-absolute w-100 h-100 top0">
              <parallax :speed="-80" class="w-100 h-100 position-relative">
                <div ref="img0-0" class="position-relative w-100 h-100">
                  <div class="img0-0 position-absolute"></div>
                </div>
              </parallax>
            </div>
            <div class="position-absolute w-100 h-100 top0">
              <parallax :speed="-90" class="w-100 h-100 position-relative">
                <div
                  ref="img0-3"
                  data-animation-number="3"
                  class="position-relative w-100 h-100"
                >
                  <!-- <img -->
                  <b-img
                    alt=""
                    aria-hidden="true"
                    class="img0-3 position-absolute"
                    src="../assets/home/3.png"
                  >
                    <!--
                    -->
                  </b-img>
                </div>
              </parallax>
            </div>
            <div class="position-absolute w-100 h-100 top0">
              <parallax :speed="-80" class="w-100 h-100 position-relative">
                <div
                  ref="img0-2"
                  data-animation-number="2"
                  class="position-relative w-100 h-100"
                >
                  <b-img
                    alt=""
                    aria-hidden="true"
                    class="img0-2 position-absolute"
                    src="../assets/home/2.png"
                  ></b-img>
                </div>
              </parallax>
            </div>
            <div class="position-absolute w-100 h-100 top0">
              <parallax :speed="-75" class="w-100 h-100 position-relative">
                <div
                  ref="img0-1"
                  data-animation-number="1"
                  class="position-relative w-100 h-100"
                >
                  <b-img
                    alt=""
                    aria-hidden="true"
                    class="img0-1 position-absolute"
                    src="../assets/home/arch.png"
                  ></b-img>
                </div>
              </parallax>
            </div>
            <div class="noto-serif position-absolute w-100 h-100 top0">
              <parallax :speed="-70" class="w-100 h-100 position-relative">
                <div class="sec0-text">
                  <div ref="sec0-text" class="text-center sec0-text-aminated">
                    <span>
                      독립영화, 작은 파도<br />영화배급협동조합 씨네소파
                    </span>
                  </div>
                </div>
              </parallax>
            </div>
          </div>
        </transition>
        <!-- </transition> -->
      </div>
      <!-- ref="scroll1" -->
      <div
        class="page-scroll-section d-none"
        ref="section1"
        v-b-visible="visible(1)"
      >
        <transition
          @beforeEnter="beforeEnter1"
          @enter="enter1"
          @afterEnter="afterEnter1"
          @beforeLeave="beforeLeave1"
          @leave="leave1"
          @afterLeave="afterLeave1"
        >
          <!-- data-rellax-mobile-speed="-1.5"
                data-rellax-tablet-speed="-1.5"
                data-rellax-desktop-speed="-1.5" -->
          <div v-if="isVisible(1)" class="w-100 h-100">
            <div ref="steel1" class="position-absolute w-100 h-100 top0">
              <!-- <div class="w-100 h-100 position-relative"> -->
              <!-- <parallax :speed="-80" class="steel1"></parallax> -->
              <!-- </div> -->
            </div>
            <div ref="black1" class="position-absolute w-100 h-100 top0">
              <!-- data-rellax-percentage="2" -->
              <!-- <div ref="black1" class="w-100 h-100 position-relative top0"> -->
              <!-- <parallax :speed="-80" class="black1"> -->
              <!-- <div class="black1"></div> -->
              <!-- </parallax> -->
              <!-- <div class="rellax position-relative black1" data-rellax-speed="-3"></div> -->
              <!-- </div> -->
            </div>
            <div class="position-absolute w-100 h-100 top0">
              <!-- data-rellax-mobile-speed="-3"
                data-rellax-tablet-speed="-3"
                data-rellax-desktop-speed="-5" -->
              <!-- <parallax :speed="-30" class="w-100 h-100 position-relative"> -->
              <div class="home-featured position-relative">
                <h2 ref="steel1-title" class="title">여름날</h2>
                <p ref="steel1-subtitle" class="subtitle">
                  Days In a Summer, 2020
                </p>
                <p ref="steel1-open" class="open">2020.08.20 개봉</p>
                <p ref="steel1-synopsis" class="synopsis">
                  그들은 평범한 일상 속에서 자신처럼 고립되어 있는 폐왕성에
                  도착하고, 그곳에서 누구나 언젠가 지나쳐야만 하는 유배된 시간과
                  만난다.
                </p>
                <p ref="steel1-featured-more">
                  <b-link
                    class="featured-more"
                    :to="{ name: 'IndividualFilm', params: { id: 1 } }"
                  >
                    <span>더보기</span>
                    <!-- style="enable-background:new 0 0 1920 1080;"
                          xml:space="preserve" -->
                    <svg
                      width="8px"
                      class="ml-1"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 47.22 81.75"
                    >
                      <polygon
                        class="cls-1"
                        fill="currentColor"
                        points="6.34 81.75 0 75.41 34.54 40.87 0
                          6.34 6.34 0 47.22 40.87 6.34 81.75"
                      />
                    </svg>
                  </b-link>
                </p>
              </div>
              <!-- </parallax> -->
            </div>
          </div>
        </transition>
      </div>
      <!-- ref="scroll2" -->
      <div class="page-scroll-section d-none" v-b-visible="visible(2)">
        <transition
          @beforeEnter="beforeEnter2"
          @enter="enter2"
          @leave="leave2"
          @afterEnter="afterEnter2"
          @beforeLeave="beforeLeave2"
          @afterLeave="afterLeave2"
        >
          <!-- <transition name="page2"> -->
          <div v-if="isVisible(2)" class="w-100 h-100 position-absolute">
            <div
              ref="whiteboard"
              class="w-100 h-100 position-absolute witeboard-wrapper"
            >
              <parallax :speed="-80" class="whiteboard"></parallax>
            </div>
            <div class="row section2-wrapper">
              <parallax :speed="-30" class="col-12 col-md-3">
                <h2
                  ref="main-new-post-header"
                  class="main-new-post-header text-center"
                >
                  새소식
                </h2>
              </parallax>
              <parallax
                :speed="-30"
                class="col-12 col-md-9 news"
                role="table"
                aria-label="새 소식"
                aria-describedby="main-new-post-described"
              >
                <div id="main-new-post-described" class="sr-only">
                  씨네소파의 최근 소식 5개를 확인할 수 있습니다.
                </div>
                <div class="sr-only" role="rowgroup">
                  <div role="row">
                    <div role="columnheader">날짜</div>
                    <div role="columnheader">제목</div>
                  </div>
                </div>
                <div role="rowgroup">
                  <div
                    class="news-row d-flex align-items-center"
                    role="row"
                    ref="news"
                    v-for="(a, index) in news"
                    :key="index"
                  >
                    <div role="cell" class="news-cell news-cell-date">
                      {{ a.dateFormatted }}
                    </div>
                    <div role="cell" class="news-cell news-cell-link">
                      <b-link :to="{ name: 'Post', params: { id: a.id } }">{{
                        a.title
                      }}</b-link>
                    </div>
                    <!-- <div role="cell">{{}}</div> -->
                  </div>
                </div>
              </parallax>
            </div>
            <!-- HELLO WORLD2!!
          <b-button @click="$store.commit('toggleMenuTransparent')">메뉴 투명 토글이</b-button>
          <b-button @click="$store.commit('setNavLinkWhite', true)">메뉴 하얗게</b-button>
          <b-button @click="$store.commit('setNavLinkWhite', false)">메뉴 원래대로</b-button>
          <b-button id="hi" @click="$store.commit('setLogoWhite', true)">로고 하얗게</b-button>
          <b-button @click="$store.commit('setLogoWhite', false)">로고 원래대로</b-button> -->
          </div>
        </transition>
      </div>
    </div>
  </div>
</template>

<script>
import Rellax from 'rellax';
// import Swiper, { Mousewheel } from 'swiper';
// import Velocity from 'velocity-animate';
import moment from 'moment';
// import { disableScroll, enableScroll /* , wheelEvent */ } from '../plugins/scroll-deactive';
// import Swiper styles
// import 'swiper/swiper-bundle.css';
import Parallax from '../components/parallax.vue';

// function getPosition(element) {
//   let xPosition = 0;
//   let yPosition = 0;
//   let el = element;

//   while (el) {
//     xPosition += el.offsetLeft - el.scrollLeft + el.clientLeft;
//     yPosition += el.offsetTop - el.scrollTop + el.clientTop;
//     el = el.offsetParent;
//   }

//   return { x: xPosition, y: yPosition };
// }

// function getTopByoffset(element) {
//   // Our element
//   let elem = element;

//   // Set our distance placeholder
//   let distance = 0;

//   // Loop up the dom
//   do {
//     // Increase our distance counter
//     distance += elem.offsetTop;

//     // Set the element to it's parent
//     // elem = elem.offsetParent;
//     // console.dir(elem);
//     // console.log(elem);
//     // console.log(distance);
//     elem = elem.parentElement;
//   } while (elem);
//   return distance < 0 ? 0 : distance;
// }

// function getTop(element) {
//   // return getTopByoffset(element);
//   const rect = element.getBoundingClientRect();
// console.log(rect);
//   return (window.scrollY || window.pageYOffset) + rect.top;
// }

// Swiper.use([Mousewheel]);

let moving = false;
let locateInScroll = true;
let currentLocation = 0;
let passedScroll = false;
let rellaxInstance = null;

// transition end 이벤트를 쓰기 위한 브라우저 대응
function getTransitionEndEventName() {
  const transitions = {
    transition: 'transitionend',
    OTransition: 'oTransitionEnd',
    MozTransition: 'transitionend',
    WebkitTransition: 'webkitTransitionEnd',
  };
  const bodyStyle = document.body.style;
  let result = '';
  Object.keys(transitions).some((transition) => {
    if (bodyStyle[transition] !== undefined) {
      result = transitions[transition];
      return true;
    }
    return false;
  });
  return result;
}

export default {
  name: 'Home',
  title: '홈',
  components: {
    parallax: Parallax,
  },
  data() {
    return {
      howv: false,
      currentScroll: 0,
      scrollSection: [], // {element: domObject, isVisible: bool}
      lastScrollTop: window.pageYOffset || document.documentElement.scrollTop,
      scrollProcessing: false,
      // swiper: null,
      // swiper 스크롤이 마지막 번째까지 완전히 끝났는지 테스트하는 도구.
      scrollEnded: false,
      windowHeight: 0,
      news: [
        {
          date: new Date('2018-01-11'),
          dateFormatted: null,
          title: '2018년 정기총회 공고',
          id: 1,
        },
        {
          date: new Date('2018-03-11'),
          dateFormatted: null,
          title: '2018년 임시총회 공고',
          id: 1,
        },
        {
          date: new Date('2018-01-18'),
          dateFormatted: null,
          title:
            '성송이 영화배급협동조합 씨네소파 대표 - 부산에서 독립영화 배급하기',
          id: 1,
        },
        {
          date: new Date('2017-11-06'),
          dateFormatted: null,
          title:
            '[ACT! 107호 인터뷰] “희생하지 않습니다.” - 부산 영화배급협동조합 씨네소파',
          id: 1,
        },
        {
          date: new Date('2017-07-20'),
          dateFormatted: null,
          title:
            "독립영화 배급 나선 당찬 20대 청년들 '씨네소파' 협동조합 \"멀티플렉스 게, 섰거라!",
          id: 1,
        },
      ],
    };
  },
  computed: {
    computeRellaxSpeed() {
      const height = this.windowHeight;
      return (speedInput) => {
        let speed = speedInput;
        if (speed >= 10) speed = 10;
        else if (speed <= -10) speed = -10;
        const result = (speed / 10) * (height / 100);
        // console.log(`계산된 rellax speed!!! ${result}`);
        return result;
      };
    },
  },
  // watch: {
  //   windowHeight() {
  //     if (rellaxInstance?.refresh) {
  //       this.$nextTick(() => {
  //         rellaxInstance.refresh();
  // console.log('rellaxInstance refreshed!');
  //       });
  //     }
  //   },
  // },

  async mounted() {
    moving = false;
    locateInScroll = true;
    window.scrollTo(0, 0);
    currentLocation = 0;
    this.windowHeight = window.innerHeight;
    this.$nextTick(() => {
      if (rellaxInstance?.destroy) {
        rellaxInstance.destroy();
      }
      // rellaxInstance = new Rellax('.rellax', {
      //   // center: true,
      // });
      // console.log('first rellax init');
    });

    // if (rellaxInstance?.refresh) {
    //   rellaxInstance.refresh();
    // console.log('refreshed!');
    // } else {
    //

    // }
    const { children } = this.$refs.container;
    children.forEach((child) => {
      this.scrollSection.push({
        element: child,
        isVisible: false,
      });
    });

    // console.log(this.scrollSection);
    this.setScrollSectionX();

    // adding events;
    // onScroll = onScrollImpl(this);
    // window.addEventListener('scroll', onScroll);

    // 스크롤 취소 ...
    // window.addEventListener(wheelEvent, this.onWheel, { passive: false });
    window.addEventListener('resize', this.onResize);
    // window.addEventListener('cssVarsSuccessed', this.onCssVarsSuccessed);
    document.addEventListener('touchmove', this.onTouchMove, {
      passive: false,
    });

    this.$store.commit('setMenuTransparent', true);

    // swiper initializing
    // const swiper = new Swiper('.swiper-container', {
    //   mousewheel: {
    //     releaseOnEdges: true,
    //   },
    //   direction: 'vertical',
    //   slidesPerView: 1,
    //   speed: 500,
    // });

    // swiper addEventListener.
    // swiper.on('slideChange', (context) => {
    //   const { previousIndex, realIndex } = context;
    //   const topElement = this.$refs.homeStart;

    //   // enableScroll(); 어차피 중복 addEventListener 안되므로 할 필요 없음.
    //   disableScroll();

    //   // console.log(`preveious: ${previousIndex}, now: ${realIndex}`);
    //   // 첫 번째에서 두 번째로 넘어갈 때
    //   if (previousIndex === 0 && realIndex === 1) {
    //     this.$scrollTo(topElement, 100, {
    //       offset: 51,
    //       cancelable: false,
    //     });
    //   } else if (previousIndex === 1 && realIndex === 0) {
    //     // 두 번째에서 첫 번째로 넘어갈 때
    //     this.$scrollTo(topElement, 100, {
    //       cancelable: false,
    //     });
    //   } else if (previousIndex === 2 && realIndex === 1) {
    //     // 세 번째에서 두 번째로 넘어갈 때
    //     this.$scrollTo(topElement, 100, {
    //       offset: 51,
    //       cancelable: false,
    //     });
    //   }
    // });
    // swiper.on('slideChangeTransitionEnd', (context) => {
    //   const { previousIndex, realIndex } = context;

    //   console.log(`preveious: ${previousIndex}, now: ${realIndex}`);
    //   // 두번째 에서 세번째로 넘어가고 완전히 끝났을 때
    //   if (previousIndex === 1 && realIndex === 2) {
    //     enableScroll();
    //     this.scrollEnded = true;
    //   }
    // });
    // this.swiper = swiper;

    // 기본은 취소하도록 한다.
    // disableScroll();

    // custom parallax. parallax 기능을 직접 구현해보도록 하자!
    // const el = this.$refs['steel1-parallax'];
    // const elTop = getTop(el);
    // const standard = getTop(this.$refs.section1);
    // console.dir(el);
    // console.log(elTop);
    // console.log(standard);

    // 스타일 초기화 (애니메이션용)
    // [
    //   'img0-0',
    //   'img0-1',
    //   'img0-2',
    //   'img0-3',
    //   'sec0-text',
    //   'main-new-post-header',
    //   'steel1-title',
    //   'steel1-subtitle',
    //   'steel1-open',
    //   'steel1-synopsis',
    //   'steel1-featured-more',
    //   'black1',
    //   'steel1',
    // ].forEach((elstring) => {
    //   this.$refs[elstring].style.opacity = 0;
    // });

    // 날짜 포매팅하기
    const { news } = this;
    this.news.forEach((o, index) => {
      news[index].dateFormatted = moment(o.date).format('yyyy.MM.DD');
    });

    // 애니메이션 등록하기
    // this.$refs['img0-1'].addEventListener('animationiteration', this.changeAnimation, false);
  },

  async beforeDestroy() {
    // window.removeEventListener('scroll', onScroll);

    // 스크롤(휠) 취소
    // window.removeEventListener(wheelEvent, this.onWheel, { passive: false });
    window.removeEventListener('resize', this.onResize);
    // window.removeEventListener('cssVarsSuccessed', this.onCssVarsSuccessed);
    document.removeEventListener('touchmove', this.onTouchMove, {
      passive: false,
    });
    this.$store.commit('setMenuTransparent', false);
    this.$store.commit('setLogoWhite', false);
    this.$store.commit('setNavLinkWhite', false);
  },
  methods: {
    getCurrentScrollY() {
      return window.scrollY || window.pageYOffset;
    },
    customAppearHook(e) {
      // console.log(`customAppearHook! >> ${e}`);
    },

    // onWheel2() {
    //   const visibles = this.scrollSection.filter((sec) => sec.isVisible === true);

    //   const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;
    //   console.log(
    //     `last: ${this.lastScrollTop}, current: ${currentScrollTop},
    // visibleLength: ${visibles.length}, processing: ${this.scrollProcessing}`
    //   );

    //   const onDone = (/* from, to */) => () => {
    //     this.scrollProcessing = false;
    //   };
    //   if (visibles.length === 2 && this.scrollProcessing === false) {
    //     this.scrollProcessing = true;
    //     if (currentScrollTop > this.lastScrollTop) {
    //       this.$scrollTo(visibles[1].element, 5000, {
    //         onDone: onDone(0, 1),
    //         cancelable: false,
    //       });
    //     } else if (currentScrollTop < this.lastScrollTop) {
    //       this.$scrollTo(visibles[0].element, 5000, {
    //         onDone: onDone(1, 0),
    //         cancelable: false,
    //       });
    //     }
    //   }

    //   this.lastScrollTop = currentScrollTop;
    // },

    // 휠 이벤트
    /** @param {WheelEvent} event */
    onWheel(event) {
      const { container } = this.$refs;
      const currentScrollY = this.getCurrentScrollY();
      // console.log(event);
      // const { deltaY } = event;
      const deltaY = event.deltaY ? event.deltaY : (event.wheelDelta || 0) * -1;
      const maxCount = this.scrollSection.length;
      // console.dir(this.$refs.container);
      // console.dir(container);

      // console.log(
      //   `${currentScrollY} + ${window.innerHeight} +
      // ${deltaY} <= ${container.offsetTop} + ${container.offsetHeight}`,
      // );
      // console.log(
      //   `${currentScrollY + window.innerHeight + deltaY} <= ${container.offsetTop +
      //     container.offsetHeight}`,
      // );
      // console.log(`locateInScroll: ${locateInScroll}`);
      if (!locateInScroll) {
        // 위에서 (처음상태에서) 스크롤 객체로 진입
        if (
          !passedScroll &&
          currentScrollY < container.offsetTop &&
          container.offsetTop + deltaY > 50
        ) {
          // console.log(event);
          // this.$scrollTo(this.$refs.container, 100, {
          //   cancelable: false,
          // });
          if (!moving) {
            moving = true;
            this.$scrollTo(container, 100, {
              cancelable: false,
              onDone() {
                // console.log('done!!');
                moving = false;
                locateInScroll = true;
              },
            });
          }
          // eslint-disable-next-line brace-style
        }
        // 아래에서 위로 진입
        else if (
          currentScrollY + window.innerHeight + deltaY <=
          container.offsetTop + container.offsetHeight
        ) {
          // console.log('아래에서 위로 진입!');
          if (!moving) {
            // console.log('실제 움직여!');
            moving = true;
            passedScroll = false;
            this.$scrollTo(this.scrollSection[maxCount - 1].element, 1, {
              cancelable: false,
              onDone() {
                moving = false;
                locateInScroll = true;
                currentLocation = 2;
              },
            });
          }
        } else if (!moving) {
          // 어느 것도 해당하지 않으면 원래 행동대로 진행한다.
          return true;
        }
        // 한 번이라도 특수한 경우를 겪으면, 스크롤 동작을 멈춘다.
        event.preventDefault();
        return false;
      }

      // 내부에서 움직이는데, 밖으로 (아래로) 빠져나왔다면?
      if (
        // currentScrollY + window.innerHeight + deltaY >
        // container.offsetTop + container.offsetHeight
        currentLocation === 2 &&
        !moving &&
        deltaY > 0
      ) {
        // console.log('ended!11');
        locateInScroll = false;
        passedScroll = true;
        return true;
      }
      // 내부에서의 정상적인 움직임
      let dest = currentLocation + (deltaY > 0 ? 1 : -1);
      dest = dest < 0 ? 0 : dest;
      dest = dest >= maxCount ? maxCount - 1 : dest;

      if (!moving) {
        moving = true;
        // console.log(`${currentLocation} >> ${dest}`);
        currentLocation = dest;
        this.$scrollTo(this.scrollSection[dest].element, 700, {
          cancelable: false,
          onDone() {
            moving = false;
          },
        });
      }
      event.preventDefault();
      return false;
      // e.preventDefault();
      // e.stopPropagation();
      // return false;
    },
    onResize() {
      // this.windowHeight = window.innerHeight;
      this.setScrollSectionX();
      // if (rellaxInstance?.refresh) {
      //   rellaxInstance.refresh();
      // }
    },
    visible(index) {
      return (isVisible) => {
        this.scrollSection[index].isVisible = isVisible;
      };
      // console.log(`visible! >> ${str}, ${e}`);
    },
    visibleA(isVisible) {
      // console.log(`visible! >> a, ${isVisible}`);
      this.isVisibleA = isVisible;
    },
    visibleB(isVisible) {
      // console.log(`visible! >> b, ${isVisible}`);
      this.isVisibleB = isVisible;
    },
    visibleC(isVisible) {
      // console.log(`visible! >> c, ${isVisible}`);
      this.isVisibleC = isVisible;
    },
    isVisible(index) {
      // const isVisible = this.scrollSection[index]?.isVisible;
      return this.scrollSection[index]?.isVisible;
    },
    setScrollSectionX() {
      const left = this.$refs.home.offsetLeft;
      // console.dir(this.$refs.home);
      this.$refs.container.style.marginLeft = `-${left}px`;
      // this.$refs.swiperContainer.style.transform = `translateX(-${left}px)`;
    },
    beforeEnter0() {
      // remove next slide
      // this.remove1();

      ['img0-0', 'img0-1', 'img0-2', 'img0-3', 'sec0-text'].forEach(
        (elstring) => {
          this.$refs[elstring].style.opacity = 0;
          // Velocity(this.$refs[elstring], 'stop');
        },
      );

      // 물결 느낌 스스 나게 함.
      // const images = [];
      // images.push(this.$refs['img0-3'], this.$refs['img0-2'], this.$refs['img0-1']);
      // const loopWaves = (img) => {
      //   Velocity(
      //     img,
      //     {
      //       translateX: () => Math.floor(Math.random() * 21) - 10,
      //       translateY: () => Math.floor(Math.random() * 21) - 10,
      //     },
      //     {
      //       duration: Math.floor(Math.random() * 2000) + 2000,
      //       easing: 'easeInOutQuad',
      //       complete: () => {
      //         loopWaves(img);
      //       },
      //       // queue: false,
      //     },
      //   );
      // };
      // images.forEach((img) => {
      //   loopWaves(img);
      // });
    },
    async enter0() {
      // this.$refs['img0-1'].addEventListener('animationiteration', this.changeAnimation, false);
      // this.$refs['img0-1'].addEventListener(transitionEnd, this.transitionEnd);
      // this.$refs['img0-0'].classList.add('img0-0-wrapper');

      this.$nextTick(() => {
        // console.log('classAdded!!!');
        this.$refs['img0-0'].classList.add('img0-0-wrapper');
        this.$refs['img0-1'].classList.add('img0-1-wrapper');
        this.$refs['img0-2'].classList.add('img0-2-wrapper');
        this.$refs['img0-3'].classList.add('img0-3-wrapper');
      });

      // console.log('addEventListener!!');
      const transitionEnd = getTransitionEndEventName();
      this.$refs['img0-1'].addEventListener(transitionEnd, this.transitionEnd);
      this.$refs['img0-2'].addEventListener(transitionEnd, this.transitionEnd);
      this.$refs['img0-3'].addEventListener(transitionEnd, this.transitionEnd);

      // Velocity(
      //   this.$refs['img0-0'],
      //   { opacity: 1, bottom: [0, -150] },
      //   {
      //     delay: 2000,
      //     duration: 3000,
      //     easing: 'easeInOutQuad',
      //     queue: false,
      //   },
      // );

      // Velocity(
      //   this.$refs['img0-1'],
      //   { opacity: 1, bottom: [0, -150] },
      //   { duration: 3000, easing: 'easeInOutQuad', queue: false },
      // );
      // Velocity(
      //   this.$refs['img0-2'],
      //   { opacity: 1, bottom: [0, -150] },
      //   {
      //     delay: 300,
      //     duration: 3000,
      //     easing: 'easeInOutQuad',
      //     queue: false,
      //   },
      // );
      // Velocity(
      //   this.$refs['img0-3'],
      //   { opacity: 1, bottom: [0, -150] },
      //   {
      //     delay: 600,
      //     duration: 3000,
      //     easing: 'easeInOutQuad',
      //     queue: false,
      //   },
      // );
      // Velocity(
      //   this.$refs['sec0-text'],
      //   { opacity: 1, translateY: [0, 100] },
      //   {
      //     delay: 500,
      //     duration: 4000,
      //     easing: 'easeInOutQuad',
      //     queue: false,
      //   },
      // );
      // Velocity(el, { fontSize: '1em' }, { complete: done });
    },
    afterEnter0() {},
    beforeLeave0() {},
    // eslint-disable-next-line no-unused-vars
    leave0(el, done) {
      // ['img0-0', 'img0-1', 'img0-2', 'img0-3', 'sec0-text'].forEach((elstring) => {
      //   Velocity(this.$refs[elstring], 'stop');
      //   Velocity(
      //     this.$refs[elstring],
      //     { opacity: 0 },
      //     {
      //       duration: 1000,
      //       easing: 'easeInOutQuad',
      //       queue: false,
      //       complete: done,
      //     },
      //   );
      // });
    },
    beforeEnter1() {
      // [
      //   'steel1-title',
      //   'steel1-subtitle',
      //   'steel1-open',
      //   'steel1-synopsis',
      //   'steel1-featured-more',
      //   'black1',
      //   'steel1',
      // ].forEach((elstring) => {
      //   this.$refs[elstring].style.opacity = 0;
      // Velocity(this.$refs[elstring], 'stop');
      // });
    },

    // eslint-disable-next-line no-unused-vars
    enter1(el, done) {
      // this.$store.commit('setLogoWhite', true);
      // this.$store.commit('setNavLinkWhite', true);
      // Velocity(
      //   this.$refs.black1,
      //   { opacity: 1 },
      //   {
      //     duration: 2000,
      //     complete: done,
      //   },
      // );
      // Velocity(
      //   this.$refs.steel1,
      //   { opacity: 1 },
      //   {
      //     delay: 700,
      //     duration: 1000,
      //   },
      // );
      // const opacities = [1, 0.6, 1, 1, 1];
      // [
      //   'steel1-title',
      //   'steel1-subtitle',
      //   'steel1-open',
      //   'steel1-synopsis',
      //   'steel1-featured-more',
      // ].forEach((elstring, index) => {
      //   Velocity(
      //     this.$refs[elstring],
      //     { opacity: opacities[index], translateY: [0, 20] },
      //     {
      //       delay: 200 + index * 200,
      //       duration: 800,
      //       easing: 'easeInOutQuad',
      //       // complete: index === 4 ? done : null,
      //     },
      //   );
      // });
    },

    afterEnter1() {},
    afterLeave1() {
      // this.$refs.black1.style.opacity = 0;
    },
    beforeLeave1() {},
    // eslint-disable-next-line no-unused-vars
    leave1(el, done) {
      this.$store.commit('setLogoWhite', false);
      this.$store.commit('setNavLinkWhite', false);
      // const endLeave = (el, done) => {
      //   return () => {
      //     Velocity(el, 'stop');
      //     done();
      //   };
      // };

      // [
      //   'black1',
      //   'steel1',
      //   'steel1-title',
      //   'steel1-subtitle',
      //   'steel1-open',
      //   'steel1-synopsis',
      //   'steel1-featured-more',
      // ].forEach((elstring) => {
      //   Velocity(this.$refs[elstring], 'stop');
      //   Velocity(
      //     this.$refs[elstring],
      //     { opacity: 0 },
      //     {
      //       duration: 500,
      //       easing: 'easeInOutQuad',
      //       queue: false,
      //       complete: done,
      //     },
      //   );
      // });
    },
    beforeEnter2() {
      // ['main-new-post-header', 'whiteboard'].forEach((elstring) => {
      //   Velocity(this.$refs[elstring], 'stop');
      //   this.$refs[elstring].style.opacity = 0;
      // });
      // this.$refs.news.forEach((el) => {
      //   Velocity(el, 'stop');
      //   // eslint-disable-next-line no-param-reassign
      //   el.style.opacity = 0;
      //   // eslint-disable-next-line no-param-reassign
      //   // el.style.transform = 'translateY(50px)';
      // });
    },
    // eslint-disable-next-line no-unused-vars
    enter2(_, done) {
      // ['main-new-post-header', 'whiteboard'].forEach((elstring) => {
      //   Velocity(
      //     this.$refs[elstring],
      //     {
      //       opacity: 1,
      //     },
      //     {
      //       duration: 1000,
      //       complete: done,
      //     },
      //   );
      // });
      // this.$refs.news.forEach((el, index) => {
      //   Velocity(
      //     el,
      //     { opacity: 1, translateX: [0, 100] },
      //     {
      //       duration: 1000,
      //       delay: index * 200,
      //       easing: 'easeInOutQuad',
      //     },
      //   );
      // });
    },
    beforeLeave2() {
      // Velocity(this.$refs['main-new-post-header'], 'stop');
      // Velocity(this.$refs.whiteboard, 'stop');
      // this.$refs.news.forEach((el) => {
      //   Velocity(el, 'stop');
      // });
    },
    // eslint-disable-next-line no-unused-vars
    leave2(_, done) {
      // const array = this.$refs.news.slice();
      // array.push(this.$refs['main-new-post-header']);
      // array.push(this.$refs.whiteboard);
      // array.forEach((el) => {
      //   Velocity(
      //     el,
      //     {
      //       opacity: 0,
      //     },
      //     {
      //       duration: 1000,
      //       complete: done,
      //     },
      //   );
      // });
    },
    afterEnter2() {},

    afterLeave2() {},

    // how() {
    //   return this.howv;
    // },
    async pageScrollMoveStart(from, to) {
      this.$scrollTo(this.scrollSection[to].element);
      // cancelScroll = this.$scrollTo(element, duration, options)
    },
    async pageScrollMoveEnd(from, to) {
      // eslint-disable-next-line no-restricted-syntax
      for (const item of this.scrollSection) {
        item.isVisible = false;
      }
      this.scrollSection[to].isVisible = true;
      // this.scrollSection.map((el) => {

      // })
    },
    onCssVarsSuccessed() {
      // console.log('cssVarsSuccessed!');
      this.setScrollSectionX();
    },
    /**
     * @param {Event} event
     */
    changeAnimation(event) {
      // console.log(`changeAnimation Called! > ${event.target.classList}`);
      const { target } = event;
      const animationNumber = target.getAttribute('data-animation-number');

      target.style.setProperty(
        `--r${animationNumber}-1`,
        `${Math.random() * 20 - 10}px`,
      );
      target.style.setProperty(
        `--r${animationNumber}-2`,
        `${Math.random() * 20 - 10}px`,
      );
    },
    transitionEnd(event) {
      // console.log('`transitionEnd!`');
      const { target } = event;
      const animationNumber = target.getAttribute('data-animation-number');
      target.style.setProperty(
        `--r${animationNumber}-1`,
        `${Math.random() * 20 - 10}px`,
      );
      target.style.setProperty(
        `--r${animationNumber}-2`,
        `${Math.random() * 20 - 10}px`,
      );
      target.style.setProperty(
        `--r${animationNumber}-3`,
        `${Math.random() * 2 + 2}s`,
      );
    },
    onTouchMove(event) {
      event.preventDefault();
      // event.stopPropagate();
    },
  },
};
</script>

<style>
/* .desktop #home { */
/* position: relative; */
/* margin-top: calc(-1 * 230px); */
/* } */

/* .mobile #home { */
/* position: relative; */
/* margin-top: calc(-1 * 80px); */
/* } */

.home-start {
  width: 100%;
  /* height: 51px; */
}

/* .page0-enter-active {
  animation: fade-in 1s, slide-up 1s;
  animation-fill-mode: both;
}
.page0-enter .page0-enter-active .img0-1-wrapper {
  animation: 0.5s ease 0.5s silde-up;
}

.page0-leave-active {
  animation: fade-in 1s reverse, slide-up 1s reverse;
  animation-fill-mode: both;
} */

@keyframes fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
@keyframes slide-up {
  from {
    bottom: -150px;
    opacity: 0;
  }
  to {
    bottom: 0;
    opacity: 1;
  }
}

@keyframes slide-up-text {
  from {
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes random-wave-0 {
  to {
    transform: translate(var(--r0-1, 0), var(--r0-2, 0));
  }
}
@keyframes random-wave-1 {
}
.random-wave-1 {
  animation: var(--r0-3, 2s) infinite random-wave-0;
}
.img0-0-wrapper {
  animation: 3s ease 2000ms forwards slide-up;
}
.img0-1-wrapper {
  animation: 3s slide-up forwards
    /*, var(--r1-3, 2s) infinite forwards random-wave-1*/;
  transition: var(--r1-3, 2s);
  transform: translate(var(--r1-1, 5px), var(--r1-2, 5px));
}
.img0-2-wrapper {
  animation: 3s ease 300ms forwards slide-up;
  transition: var(--r2-3, 2s);
  transform: translate(var(--r2-1, 5px), var(--r2-2, 5px));
}
.img0-3-wrapper {
  animation: 3s ease 600ms forwards slide-up;
  transition: var(--r3-3, 2s);
  transform: translate(var(--r3-1, 5px), var(--r3-2, 5px));
}
.sec0-text-aminated {
  animation: 4s ease 500ms forwards slide-up-text;
}

.scroll0-enter,
.scroll0-leave-to {
  opacity: 0;
}

.scroll0-enter-active,
.scroll0-leave-active {
  transition: opacity 1s;
}

.scroll1-enter,
.scroll1-leave-to {
  opacity: 0;
}

.scroll1-enter-active,
.scroll1-leave-active {
  transition: opacity 5s;
}

/* .main-transition > div {
  width: 100vw;
  height: 100vh;
  position: fixed;
  left: 0;
  top: 0;
  z-index: -2;
} */

.page-scroll-section {
  width: 100vw;
  height: 100vh;
  /* margin-bottom: 2px; */
  position: relative;
  /* background-color: #ddd; */
}

/* .desktop .page-scroll-section:first-child {
  height: calc(100vh - 230px);
}
.mobile .page-scroll-section:first-child {
  height: calc(100vh - 80px);
} */

.main-placeholder > div {
  width: 100vw;
  height: 100vh;
}

#hi {
  width: 10px;
  height: 10px;
}
</style>

<!--------------------------------------------------------------------->
<!-- scoped!!!!!!!!!!!!!! -->
<!--------------------------------------------------------------------->

<style lang="scss" scoped>
// swiper

.out-of-sight {
  // display: none;
  // overflow: hidden;
}

// .mobile .page-scroll-container {
//   overflow: hidden;
// }

// .swiper-container {
//   width: 100vw;
//   height: 100vh;
// }

.abs-vertical-center {
  left: 50%;
  transform: translateX(-50%);
}
.wrapper1 {
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
}
.bottom1-0 {
}

.img0-0 {
  transform: translateX(-50%);
  left: 50%;
  width: 2200px;
  height: 1600px;
  bottom: -1400px;
  // background-repeat: repeat;
  // background-image: url('../assets/home/1-2.png');
}
.sec0-text {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  font-size: 22px;
  font-weight: 700;
  min-width: 300px;
}
.img0-1 {
  transform: translateX(-50%);
  // transform: rotateX(45deg);
  left: calc(50% + 220px);
  bottom: -590px;
}
.img0-2 {
  transform: translateX(-50%);
  left: calc(50%);
  bottom: -320px;
}
.img0-3 {
  transform: translateX(-50%);
  left: calc(50% + 100px);
  bottom: -320px;
}
// .img0-1-wrapper {
//   right: -210px;
// }
.img0-1-1 {
  top: 50%;
}

.img0-1-trace {
  width: 100%;
  height: 100vh;
  position: absolute;
  top: calc(100% + 150px);
  background-image: url('../assets/home/1-2.png');
  background-color: #000;
}

.black1 {
  position: absolute;
  top: -25%;
  height: 150%;
  width: 100%;
  background: radial-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.6));

  // background-color: #000;
}
.steel1 {
  position: absolute;
  top: -25%;
  height: 150%;
  width: 100%;
  background-image: url('../assets/test/steel23.jpg');
  background-size: cover;
}

.mobile .home-featured {
  left: 8vw;
  padding-right: 30px;
  top: 25%;
}

.home-featured {
  color: #fff;
  left: 18vw;
  top: 30%;
  // transform: translateY(-50%);

  & .title {
    font-size: 48px;
    font-weight: 500;
    margin-bottom: 0px;
  }
  & .subtitle {
    font-weight: 700;
    opacity: 0.8;
  }
  & .open {
    margin-bottom: 40px;
    font-size: 20px;
    margin-bottom: 40px;
  }
  & .synopsis {
    // margin-top: 20px;
    font-size: 18px;
    max-width: 410px;
    padding-right: 30px;
  }
  & .featured-more {
    display: inline-flex;
    align-items: center;
    color: #ccc;
    transition: 1s;
    & span {
      padding: 10px;
      padding-left: 0;
    }
    & svg {
      margin-top: 2px;
    }
    &:hover {
      color: #009eda;
      transition: none;
      text-decoration: none;
    }
  }
}
.whiteboard-wrapper {
  top: -50%;
}

// hsl(0, 0%, 100%) 0%,
// hsla(0, 0%, 100%, 0.738) 19%,
// hsla(0, 0%, 100%, 0.541) 34%,
// hsla(0, 0%, 100%, 0.382) 47%,
// hsla(0, 0%, 100%, 0.278) 56.5%,
// hsla(0, 0%, 100%, 0.194) 65%,
// hsla(0, 0%, 100%, 0.126) 73%,
// hsla(0, 0%, 100%, 0.075) 80.2%,
// hsla(0, 0%, 100%, 0.042) 86.1%,
// hsla(0, 0%, 100%, 0.021) 91%,
// hsla(0, 0%, 100%, 0.008) 95.2%,
// hsla(0, 0%, 100%, 0.002) 98.2%,
// hsla(0, 0%, 100%, 0) 100%

.whiteboard {
  position: absolute;
  top: -25%;
  height: 150%;
  width: 100%;
  background: rgb(255, 255, 255);
  background: linear-gradient(
    0deg,
    hsl(0, 0%, 100%) 0%,
    hsl(0, 0%, 100%) 50%,
    hsla(0, 0%, 100%, 0.738) 59.5%,
    hsla(0, 0%, 100%, 0.541) 67%,
    hsla(0, 0%, 100%, 0.382) 73.5%,
    hsla(0, 0%, 100%, 0.278) 78.25%,
    hsla(0, 0%, 100%, 0.194) 82.5%,
    hsla(0, 0%, 100%, 0.126) 86.5%,
    hsla(0, 0%, 100%, 0.075) 90.1%,
    hsla(0, 0%, 100%, 0.042) 93.05%,
    hsla(0, 0%, 100%, 0.021) 95.5%,
    hsla(0, 0%, 100%, 0.008) 97.6%,
    hsla(0, 0%, 100%, 0.002) 99.1%,
    hsla(0, 0%, 100%, 0) 100%
  );
}
.main-new-post-header {
  color: #009eda;
  font-size: 40px;
  margin-bottom: 50px;
}
.news {
  // background-color: #ddd;
}
.news-row {
  margin-top: -1px;
  border-width: 1px 0;
  border-style: solid;
  border-color: #2b3e4a;
  // border: 1px
}
.news-cell {
  padding: 30px 0;
}
.news-cell-date {
  flex-shrink: 0;
  flex-grow: 0;
  padding-right: 50px;
  font-size: 16px;
  color: #767676;
}

.mobile .news-cell-date {
  font-size: 13px;
}

.news-cell-link {
  padding-right: 30px;
}
.news-cell-link a {
  font-size: 18px;
}
.mobile .news-cell-link a {
  font-size: 15px;
}

.section2-wrapper {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  max-width: 1260px;
  min-width: 1px;
  height: 100%;
  margin: 0 auto;
  padding: 20vh 0;
}
/* animation initlaizing */
// .sec0-text > div {
//   opacity: 0;
// }

.opacity0 {
  opacity: 0;
}
.top0 {
  top: 0;
}
</style>
