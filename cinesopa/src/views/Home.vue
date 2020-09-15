<template>
  <div id="home">
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
    <div class="swiper-container" ref="swiperContainer" style="display:none;">
      <div class="swiper-wrapper">
        <!-- Slides -->
        <div class="swiper-slide">Slide 1</div>
        <div class="swiper-slide">Slide 2</div>
        <div class="swiper-slide">Slide 3</div>
      </div>
      <!-- If we need pagination -->
      <div class="swiper-pagination"></div>

      <!-- If we need navigation buttons -->
      <div class="swiper-button-prev"></div>
      <div class="swiper-button-next"></div>

      <!-- If we need scrollbar -->
      <div class="swiper-scrollbar"></div>
    </div>
    <!-- style="display:none;" -->
    <div class="page-scroll-container" ref="container">
      <!-- ref="scroll0" -->
      <div class="page-scroll-section " v-b-visible="visible(0)">
        <transition name="scroll1">
          <div
            v-if="isVisible(0)"
            class="d-flex h-100 border-bottom border-dark align-items-center justify-content-center"
          >
            <div>
              영화배급협동조합 씨네소파
            </div>
          </div>
        </transition>
      </div>
      <!-- ref="scroll1" -->
      <div class="page-scroll-section " v-b-visible="visible(1)">
        <transition name="scroll1">
          <div
            v-if="isVisible(1)"
            class="d-flex h-100 border-bottom border-dark align-items-center justify-content-center"
          ></div>
        </transition>
      </div>
      <!-- ref="scroll2" -->
      <div class="page-scroll-section " v-b-visible="visible(2)">
        <transition name="scroll1">
          <div
            v-if="isVisible(2)"
            class="d-flex h-100 border-bottom border-dark align-items-center justify-content-center"
          >
            HELLO WORLD2!!
            <b-button @click="$store.commit('toggleMenuTransparent')">메뉴 투명 토글이</b-button>
            <b-button @click="$store.commit('setNavLinkWhite', true)">메뉴 하얗게</b-button>
            <b-button @click="$store.commit('setNavLinkWhite', false)">메뉴 원래대로</b-button>
            <b-button id="hi" @click="$store.commit('setLogoWhite', true)">로고 하얗게</b-button>
            <b-button @click="$store.commit('setLogoWhite', false)">로고 원래대로</b-button>
          </div>
        </transition>
      </div>
    </div>
  </div>
</template>

<script>
import Rellax from 'rellax';
import Swiper, { Mousewheel } from 'swiper';
import { disableScroll, enableScroll, wheelOpt, wheelEvent } from '../plugins/scroll-deactive';
// import Swiper styles
import 'swiper/swiper-bundle.css';
// console.log(Rellax);

Swiper.use([Mousewheel]);

let moving = false;
let locateInScroll = true;
let currentLocation = 0;
let passedScroll = false;

// function onScrollImpl(self) {
//   let scrollProcessing = false;
//   let lastScrollTop = window.pageYOffset || document.documentElement.scrollTop;
//   return (e) => {
//     // console.log(e);
//     const visibles = self.scrollSection.filter((sec) => sec.isVisible === true);

//     const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;
//     console.log(
//       `last: ${lastScrollTop}, current: ${currentScrollTop}, \
//       visibleLength: ${visibles.length}, processing: ${scrollProcessing}`
//     );

//     const onDone = () => () => {
//       scrollProcessing = false;
//       enableScroll();
//     };
//     if (visibles.length === 2 && scrollProcessing === false) {
//       e.preventDefault();
//       scrollProcessing = true;
//       disableScroll();
//       let from = visibles[0].element;
//       let to = visibles[1].element;

//       // 순서 조정
//       if (currentScrollTop < lastScrollTop) {
//         from = visibles[1].element;
//         to = visibles[0].element;
//       }
//       window.scrollTo(0, from.getBoundingClientRect().top + currentScrollTop);
//       self.$scrollTo(to, 1000, {
//         onDone: onDone(0, 1),
//         cancelable: false,
//       });
//     }
//     lastScrollTop = currentScrollTop;
//   };
// }

// let onScroll;

export default {
  name: 'Home',
  title: '홈',
  data() {
    return {
      howv: false,
      rellax: {},
      currentScroll: 0,
      scrollSection: [], // {element: domObject, isVisible: bool}
      lastScrollTop: window.pageYOffset || document.documentElement.scrollTop,
      scrollProcessing: false,
      swiper: null,
      // swiper 스크롤이 마지막 번째까지 완전히 끝났는지 테스트하는 도구.
      scrollEnded: false,
    };
  },
  computed: {},

  async mounted() {
    moving = false;
    locateInScroll = true;
    window.scrollTo(0, 0);

    const rellax = new Rellax('.rellax', {
      // center: true,
    });

    this.rellax = rellax;
    const { children } = this.$refs.container;
    children.forEach((child) => {
      this.scrollSection.push({
        element: child,
        isVisible: false,
      });
    });

    console.log(this.scrollSection);
    this.setScrollSectionX();

    // adding events;
    // onScroll = onScrollImpl(this);
    // window.addEventListener('scroll', onScroll);
    window.addEventListener(wheelEvent, this.onWheel, { passive: false });
    window.addEventListener('resize', this.onResize);
    this.$store.commit('setMenuTransparent', true);

    // swiper initializing
    const swiper = new Swiper('.swiper-container', {
      mousewheel: {
        releaseOnEdges: true,
      },
      direction: 'vertical',
      slidesPerView: 1,
      speed: 500,
    });

    // swiper addEventListener.
    swiper.on('slideChange', (context) => {
      const { previousIndex, realIndex } = context;
      const topElement = this.$refs.homeStart;

      // enableScroll(); 어차피 중복 addEventListener 안되므로 할 필요 없음.
      disableScroll();

      // console.log(`preveious: ${previousIndex}, now: ${realIndex}`);
      // 첫 번째에서 두 번째로 넘어갈 때
      if (previousIndex === 0 && realIndex === 1) {
        this.$scrollTo(topElement, 100, {
          offset: 51,
          cancelable: false,
        });
      }
      // 두 번째에서 첫 번째로 넘어갈 때
      else if (previousIndex === 1 && realIndex === 0) {
        this.$scrollTo(topElement, 100, {
          cancelable: false,
        });
      }
      // 세 번째에서 두 번째로 넘어갈 때
      else if (previousIndex === 2 && realIndex === 1) {
        this.$scrollTo(topElement, 100, {
          offset: 51,
          cancelable: false,
        });
      }
    });
    swiper.on('slideChangeTransitionEnd', (context) => {
      const { previousIndex, realIndex } = context;

      console.log(`preveious: ${previousIndex}, now: ${realIndex}`);
      // 두번째 에서 세번째로 넘어가고 완전히 끝났을 때
      if (previousIndex === 1 && realIndex === 2) {
        enableScroll();
        this.scrollEnded = true;
      }
    });
    this.swiper = swiper;

    // 기본은 취소하도록 한다.
    // disableScroll();
  },

  async beforeDestroy() {
    // window.removeEventListener('scroll', onScroll);
    window.removeEventListener(wheelEvent, this.onWheel, { passive: false });
    window.removeEventListener('resize', this.onResize);
    this.$store.commit('setMenuTransparent', false);
  },
  methods: {
    getCurrentScrollY() {
      return window.scrollY || window.pageYOffset;
    },
    customAppearHook(e) {
      console.log(`customAppearHook! >> ${e}`);
    },

    // onWheel2() {
    //   const visibles = this.scrollSection.filter((sec) => sec.isVisible === true);

    //   const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;
    //   console.log(
    //     `last: ${this.lastScrollTop}, current: ${currentScrollTop}, visibleLength: ${visibles.length}, processing: ${this.scrollProcessing}`
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
      const { deltaY } = event;
      const maxCount = this.scrollSection.length;
      // console.dir(this.$refs.container);
      console.dir(container);

      console.log(
        `${currentScrollY} + ${window.innerHeight} + ${deltaY} <= ${container.offsetTop} + ${container.offsetHeight}`
      );
      console.log(
        `${currentScrollY + window.innerHeight + deltaY} <= ${container.offsetTop +
          container.offsetHeight}`
      );

      if (!locateInScroll) {
        // 위에서 (처음상태에서) 스크롤 객체로 진입
        if (
          !passedScroll &&
          currentScrollY < container.offsetTop &&
          container.offsetTop + deltaY > 50
        ) {
          console.log(event);
          // this.$scrollTo(this.$refs.container, 100, {
          //   cancelable: false,
          // });
          if (!moving) {
            moving = true;
            this.$scrollTo(container, 100, {
              cancelable: false,
              onDone() {
                console.log('done!!');
                moving = false;
                locateInScroll = true;
              },
            });
          }
          // window.scrollTo({
          //   top: container.offsetTop,
          //   behavior: 'smooth',
          // });
        }
        // 아래에서 위로 진입
        else if (
          currentScrollY + window.innerHeight + deltaY <=
          container.offsetTop + container.offsetHeight
        ) {
          console.log('아래에서 위로 진입!');
          if (!moving) {
            console.log('실제 움직여!');
            moving = true;
            passedScroll = false;
            this.$scrollTo(this.scrollSection[maxCount - 1].element, 100, {
              cancelable: false,
              onDone() {
                moving = false;
                locateInScroll = true;
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
      // 처음 상태에서 스크롤 객체로 진입

      // 내부에서 움직이는데, 밖으로 (아래로) 빠져나왔다면?
      if (
        currentScrollY + window.innerHeight + deltaY >
        container.offsetTop + container.offsetHeight
      ) {
        console.log('ended!11');
        locateInScroll = false;
        passedScroll = true;
        return true;
      }
      // 목적지 설정
      let dest = currentLocation + (deltaY > 0 ? 1 : -1);
      dest = dest < 0 ? 0 : dest;
      dest = dest >= maxCount ? maxCount - 1 : dest;

      if (!moving) {
        moving = true;
        console.log(`${currentLocation} >> ${dest}`);
        currentLocation = dest;
        this.$scrollTo(this.scrollSection[dest].element, 700, {
          cancelable: false,
          onDone() {
            moving = false;
          },
        });
      }
      event.preventDefault();

      // e.preventDefault();
      // e.stopPropagation();
      // return false;
    },
    // makeOnScrollimsi() {
    //   let lastScrollTop = window.pageYOffset || document.documentElement.scrollTop;
    //   let processing = false;
    //   return () => {
    //     // console.log(evt);
    //     const visibles = this.scrollSection.filter((sec) => sec.isVisible === true);

    //     const onDone = (from, to) => () => {
    //       processing = false;
    //       // enableScroll();
    //       // document.body.classList.remove('no-scroll');
    //       this.scrollSection[from].isVisible = false;
    //       this.scrollSection[to].isVisible = true;
    //     };

    //     const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;
    //     if (visibles.length === 2 && processing === false) {
    //       processing = true;
    //       if (currentScrollTop > lastScrollTop) {

    //         this.$scrollTo(visibles[0].element, 0);
    //         this.$scrollTo(visibles[1].element, 5000, {
    //           onDone: onDone(0, 1),
    //           cancelable: false,
    //         });
    //       } else if (currentScrollTop < lastScrollTop) {
    //         // going top
    //       }
    //     }

    //     lastScrollTop = currentScrollTop <= 0 ? 0 : currentScrollTop; // for mobile
    //   };
    // },
    onResize() {
      this.setScrollSectionX();
      // disableScroll();
    },
    visible(index) {
      return (isVisible) => {
        this.scrollSection[index].isVisible = isVisible;
      };
      // console.log(`visible! >> ${str}, ${e}`);
    },
    visibleA(isVisible) {
      console.log(`visible! >> a, ${isVisible}`);
      this.isVisibleA = isVisible;
    },
    visibleB(isVisible) {
      console.log(`visible! >> b, ${isVisible}`);
      this.isVisibleB = isVisible;
    },
    visibleC(isVisible) {
      console.log(`visible! >> c, ${isVisible}`);
      this.isVisibleC = isVisible;
    },
    isVisible(index) {
      return this.scrollSection[index]?.isVisible;
    },
    setScrollSectionX() {
      const { left } = this.$refs.homeStart.getBoundingClientRect();
      // this.$refs.scroll0.style.transform = `translateX(-${left}px)`;
      // this.$refs.scroll1.style.transform = `translateX(-${left}px)`;
      // this.$refs.scroll2.style.transform = `translateX(-${left}px)`;

      this.scrollSection.forEach((o) => {
        // eslint-disable-next-line no-param-reassign
        o.element.style.transform = `translateX(-${left}px)`;
      });
      this.$refs.swiperContainer.style.transform = `translateX(-${left}px)`;
    },
    test1(a, b, c, d) {
      console.log(a);
      console.log(b);
      console.log(c);
      console.log(d);
    },
    // async refresh() {
    //   console.log(this.rellax);
    //   // this.rellax.refresh();
    // },
    // async button() {
    //   if (this.show.main === true) {
    //     this.show.main = false;
    //     this.show.featured = true;
    //     return;
    //   }
    //   if (this.show.featured === true) {
    //     this.show.featured = false;
    //     this.show.recent = true;
    //     return;
    //   }
    //   if (this.show.recent === true) {
    //     this.show.recent = false;
    //     this.show.main = true;
    //   }
    // },
    how() {
      return this.howv;
    },
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
  },
};
</script>

<style>
.desktop #home {
  /* position: relative; */
  margin-top: calc(-1 * var(--desktop-top-header-height));
}

.mobile #home {
  /* position: relative; */
  margin-top: calc(-1 * var(--mobile-header-height));
}

.home-start {
  width: 100%;
  /* height: 51px; */
}

.main-enter,
.main-leave-to {
  opacity: 0;
}

.main-enter-active,
.main-leave-active {
  transition: opacity 5s;
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
  margin-bottom: 2px;
  /* background-color: #ddd; */
}

/* .desktop .page-scroll-section:first-child {
  height: calc(100vh - var(--desktop-top-header-height));
}
.mobile .page-scroll-section:first-child {
  height: calc(100vh - var(--mobile-header-height));
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

<style lang="scss" scoped>
// swiper

.swiper-container {
  width: 100vw;
  height: 100vh;
}
</style>
