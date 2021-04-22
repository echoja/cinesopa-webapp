<template>
  <div class="sticky-container-wrapper">
    <main class="sticky-container" ref="sticky-container">
      <div class="sticky">
        <div class="slide-container">
          <div class="slide" ref="sl1">
            <div class="slide-big-text">
              <p>독립영화.</p>
            </div>
          </div>
          <div class="scdown" ref="scdown">
            <!-- <img src="@/assets/scroll-down.svg" /> -->
            <svg-scdown class="scdown-icon"></svg-scdown>
          </div>
          <div class="slide" ref="sl2">
            <div class="slide-big-text">
              <p>낯선 듯 익숙한 듯,</p>
              <p>어딘가 외로운 이름.</p>
            </div>
          </div>
          <div class="slide sl3" ref="sl3">
            <div class="slide-big-text">
              <p>
                <span ref="sl3-tl" class="d-inline-block">당신과</span> 독립영화
                <span ref="sl3-tr" class="d-inline-block">사이에</span>
              </p>
              <p>새로운 섬이 떠올랐습니다.</p>
            </div>
          </div>
          <div class="slide slide-left sl4" ref="sl4">
            <div class="sl4-content">
              <div class="slide-big-text" ref="sl4-big">
                <p ref="sl4-big-1">작은 파도가 닿는 곳,</p>
                <p ref="sl4-big-2">영화와 사람이 만나는</p>
                <p ref="sl4-big-3">영화의 섬</p>
              </div>
              <div class="slide-small-text">
                <p>
                  상영 기회가 없던, 작지만 본연의 <br class="small" />가치를
                  지닌 영화들을 발굴합니다.
                </p>
                <p>
                  당신이 영화를 좀 더 깊이있게 <br class="small" />누릴 수 있는
                  영화의 시간을 준비합니다.
                </p>
                <p>
                  당신과 영화의 다양한 만남과 <br class="small" />가능성을
                  제안합니다.
                </p>
              </div>
            </div>
          </div>
          <div class="wave" ref="wave">
            <!-- 파도맨~
          {{ require('../../assets/home-wave.svg') }} -->
            <div
              class="wave-animation"
              :style="{
                'background-image': `url('${require('@/assets/home-wave.svg')}')`,
              }"
            ></div>
          </div>

          <div class="slide slide-left sl5" ref="sl5">
            <div class="slide-big-text">
              <p>영화향유플랫폼 소파섬은</p>
              <p>당신의 풍요롭고</p>
              <p>영화로운 나날을 꿈꿉니다.</p>
            </div>
            <div class="go-surf-wrapper">
              <b-link :to="{ name: 'SopakitItems' }" class="go-surf"
                ><span>서핑하기</span>
                <img
                  class="go-surf-icon"
                  width="35"
                  src="@/assets/home-surf-button.svg"
              /></b-link>
            </div>
          </div>
        </div>
      </div>
    </main>
    <div class="home-footer">
      <footer-component></footer-component>
    </div>
  </div>
</template>

<script>
import BezierEasing from 'bezier-easing';
import { BLink } from 'bootstrap-vue';
import { store } from '@/loader';

const ease = BezierEasing(0.25, 0.1, 0.25, 1.0);
const easeIn = BezierEasing(0.38, 0.01, 0.78, 0.13);
const midSlow = BezierEasing(0, 0.7, 1, 0.3);
const linear = (o) => o;

const def = {
  height: 7100,
  elements: {
    sl1: {
      top: 500,
      bottom: 1900,
      topStyle: {
        opacity: 0,
        translateY: -100,
      },
      bottomStyle: {
        opacity: 0,
        translateY: 100,
      },
    },
    scdown: {
      top: 0,
      bottom: 1000,
      topStyle: {
        opacity: 1,
      },
      bottomStyle: {
        opacity: 0,
      },
    },
    sl2: {
      top: 1900,
      bottom: 3200,
      topStyle: {
        opacity: 0,
        translateY: -100,
      },
      bottomStyle: {
        opacity: 0,
        translateY: 100,
      },
    },
    sl3: {
      top: 3300,
      bottom: 4600,
      topStyle: {
        opacity: 0,
      },
      bottomStyle: {
        opacity: 0,
      },
    },
    // 'sl3-tl': {
    //   top: 4000,
    //   bottom: 4200,
    //   topStyle: {
    //     translateX: -20,
    //   },
    //   bottomStyle: {
    //     translateX: 0,
    //   },
    // },
    wave: {
      top: 4500,
      bottom: 5900,
      topStyle: {
        opacity: 0,
        translateY: 300,
      },
      bottomStyle: {
        opacity: 0,
        translateY: 0,
      },
    },
    sl4: {
      top: 4700,
      bottom: 6000,
      topStyle: {
        opacity: 0,
      },
      bottomStyle: {
        opacity: 0,
      },
    },
    sl5: {
      top: 6100,
      bottom: 9000,
      topStyle: {
        opacity: 0,
      },
      bottomStyle: {
        opacity: 0,
      },
    },
  },
  animations: {
    sl1: [
      {
        top: 500,
        bottom: 1900,
        easing: midSlow,
        styles: {
          translateY: {
            topValue: 60,
            bottomValue: -60,
          },
        },
      },
      {
        top: 500,
        bottom: 800,
        easing: ease,
        styles: {
          opacity: {
            topValue: 0,
            bottomValue: 1,
          },
        },
      },
      {
        top: 1400,
        bottom: 1900,
        easing: easeIn,
        styles: {
          opacity: {
            topValue: 1,
            bottomValue: 0,
          },
        },
      },
    ],
    scdown: [
      {
        top: 600,
        bottom: 1000,
        easing: easeIn,
        styles: {
          opacity: {
            topValue: 1,
            bottomValue: 0,
          },
        },
      },
    ],
    sl2: [
      {
        top: 1900,
        bottom: 3200,
        easing: midSlow,
        styles: {
          translateY: {
            topValue: 60,
            bottomValue: -60,
          },
        },
      },
      {
        top: 1900,
        bottom: 2500,
        easing: ease,
        styles: {
          opacity: {
            topValue: 0,
            bottomValue: 1,
          },
        },
      },
      {
        top: 2600,
        bottom: 3200,
        easing: easeIn,
        styles: {
          opacity: {
            topValue: 1,
            bottomValue: 0,
          },
        },
      },
    ],
    sl3: [
      {
        top: 3300,
        bottom: 4600,
        easing: midSlow,
        styles: {
          translateY: {
            topValue: 60,
            bottomValue: -60,
          },
        },
      },
      {
        top: 3300,
        bottom: 3900,
        easing: ease,
        styles: {
          opacity: {
            topValue: 0,
            bottomValue: 1,
          },
        },
      },
      {
        top: 4000,
        bottom: 4600,
        easing: easeIn,
        styles: {
          opacity: {
            topValue: 1,
            bottomValue: 0,
          },
        },
      },
    ],
    // 'sl3-tl': [
    //   {
    //     top: 4000,
    //     bottom: 4200,
    //     easing: ease,
    //     styles: {
    //       translateX: {
    //         topValue: -20,
    //         bottomValue: 0,
    //       },
    //     },
    //   },
    // ],
    wave: [
      {
        top: 4500,
        bottom: 5300,
        easing: ease,
        styles: {
          translateY: {
            topValue: 200,
            bottomValue: 0,
          },
          opacity: {
            topValue: 0,
            bottomValue: 1,
          },
        },
      },
      {
        top: 5300,
        bottom: 5900,
        easing: easeIn,
        styles: {
          // translateY: {
          //   topValue: 0,
          //   bottomValue: -100,
          // },
          opacity: {
            topValue: 1,
            bottomValue: 0,
          },
        },
      },
    ],
    sl4: [
      {
        top: 4700,
        bottom: 6000,
        easing: midSlow,
        styles: {
          translateY: {
            topValue: 60,
            bottomValue: -60,
          },
        },
      },
      {
        top: 4700,
        bottom: 5300,
        easing: ease,
        styles: {
          opacity: {
            topValue: 0,
            bottomValue: 1,
          },
        },
      },
      {
        top: 5400,
        bottom: 6000,
        easing: easeIn,
        styles: {
          opacity: {
            topValue: 1,
            bottomValue: 0,
          },
        },
      },
    ],
    sl5: [
      {
        top: 6100,
        bottom: 7100,
        easing: midSlow,
        styles: {
          translateY: {
            topValue: 60,
            bottomValue: -60,
          },
        },
      },
      {
        top: 6100,
        bottom: 6700,
        easing: ease,
        styles: {
          opacity: {
            topValue: 0,
            bottomValue: 1,
          },
        },
      },
    ],
  },
};

let enabled = {};
let disabled = {};

const px = (num) => `${num}px`;

const isAmong = (num, top, bottom) => num >= top && num <= bottom;

const applyStyle = (element, styleName, value, unit = 'px') => {
  if (styleName === 'translateY') {
    // eslint-disable-next-line no-param-reassign
    element.style.transform = `translateY(${value}${unit})`;
    return;
  }
  if (styleName === 'translateX') {
    // eslint-disable-next-line no-param-reassign
    element.style.transform = `translateX(${value}${unit})`;
    return;
  }
  // eslint-disable-next-line no-param-reassign
  element.style[styleName] = value;
};

export default {
  title: '홈',
  name: 'Home',
  components: {
    FooterComponent: () => import('@/components/FooterComponent.vue'),
    SvgScdown: () => import('@/components/SvgScdown'),
    BLink,
  },
  data() {
    return {
      isTop: false,
    };
  },
  watch: {
    $route(to, from) {
      // 페이지가 달라질 경우에만 this.init 실행.
      // if (to.fullPath !== from.fullPath) {
      console.log(`watch route - from: ${from.fullpath} to: ${to.fullPath}`);
      console.log('route changed!! from Home component');
      this.init();
      // }
    },
  },
  mounted() {
    this.init();
    window.addEventListener('scroll', this.onScroll);
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.onScroll);
  },
  beforeRouteEnter(to, from, next) {
    // console.log('home - beforeRouteEnter!!!');
    store.commit('setLogoZoomed', true);
    next();
  },
  beforeRouteLeave(to, from, next) {
    // console.log('home - beforeRouteLeave!!!');
    store.commit('setLogoZoomed', false);
    next();
  },
  methods: {
    // 상태 초기화'
    init() {
      this.initStatus();
      this.initAnimation();
    },
    initStatus() {
      store.commit('setLogoZoomed', true);
    },
    // 애니메이션 초기화
    initAnimation() {
      this.$refs['sticky-container'].style.height = px(def.height);
      disabled = { ...def.elements };

      // 각 애니메이션을 enabled == false 로 만듬.
      for (const refname of Object.keys(def.animations)) {
        for (const animation of def.animations[refname]) {
          animation.enabled = false;
        }
      }

      // 초기 스타일 적용
      Object.keys(disabled).forEach((ref) => {
        Object.keys(disabled[ref].topStyle).forEach((styleName) => {
          const pushValue = disabled[ref].topStyle[styleName];
          // let pushValue = disabled[ref].topStyle[styleName];
          // let pushStyle = styleName;
          // if (styleName === 'width' || styleName === 'height') {
          //   pushValue = px(pushValue);
          // } else if (styleName === 'translateX') {
          //   pushStyle = 'transform';
          //   pushValue = `translateX(${pushValue}px)`;
          // } else if(styleName === 'translateY') (
          //   styleName === 'translateY($'
          // )
          this.$refs[ref].style[styleName] = pushValue;
        });
      });
      enabled = {};
      // window.scrollTo(0, 0);
      this.onScroll();
    },
    applyStyles(currentPos, refname, styles, r, unit = 'px') {
      for (const style of Object.keys(styles)) {
        const { topValue, bottomValue } = styles[style];
        const calc = (bottomValue - topValue) * r + topValue;
        applyStyle(this.$refs[refname], style, calc, unit);
      }
    },
    applyAllAnimation(currentPos, refname) {
      const animations = def.animations[refname];
      if (!animations) return;
      for (const animation of animations) {
        const { top: a_top, bottom: a_bottom, easing, styles } = animation;
        const isIn = isAmong(currentPos, a_top, a_bottom);
        // 만약 애니메이션이 새롭게 들어갈 때 혹은 나갈때 enabled 설정
        if (isIn) {
          if (!animation.enabled) animation.enabled = true;
        } else if (!isIn && animation.enabled) {
          if (currentPos <= a_top) {
            this.applyStyles(currentPos, refname, styles, 0);
          } else if (currentPos >= a_bottom) {
            this.applyStyles(currentPos, refname, styles, 1);
          }
          // eslint-disable-next-line no-param-reassign
          animation.enabled = false;
        }

        // 애니메이션이 enabled 라면, 애니메이션 적용.
        if (animation.enabled) {
          const r = easing((currentPos - a_top) / (a_bottom - a_top));
          // eslint-disable-next-line no-param-reassign
          this.applyStyles(currentPos, refname, styles, r);
        }
      }
    },
    // applyAllAnimation(refname, currentPos) {
    //   const animations = def.animations[refname];
    //   if (animations) {
    //     for (const animation of animations) {
    //       this.checkAnimation(currentPos, animation, () )
    //     }
    //   }
    // },
    onScroll() {
      // 현재 스크롤 위치 파악
      const scrollTop = window.scrollY || window.pageYOffset;
      // console.log(
      //   `window.scrollY> ${window.scrollY}, window.pageYOffset> ${window.pageYOffset}, `,
      // );
      const currentPos = scrollTop + window.innerHeight / 2;
      // console.log(currentPos);

      if (scrollTop >= 20 && this.isTop) {
        console.log(`onscroll top, set Logo Zoomed to false >> ${scrollTop}`);
        store.commit('setLogoZoomed', false);
        this.isTop = false;
      } else if (scrollTop < 20 && !this.isTop) {
        store.commit('setLogoZoomed', true);
        this.isTop = true;
      }

      // disabled 순회하며 활성화할 요소 찾기.
      Object.keys(disabled).forEach((refname) => {
        // 만약 칸에 있다면 해당 요소 활성화
        if (
          isAmong(currentPos, disabled[refname].top, disabled[refname].bottom)
        ) {
          enabled[refname] = disabled[refname];
          this.$refs[refname].classList.remove('disabled');
          this.$refs[refname].classList.add('enabled');
          delete disabled[refname];

          // // 각 애니메이션에 대한 활성화 체크하기
          // enabled[refname].enabledAnimation = {};
          // enabled[refname].disabledAnimation = {};
          // const animations = def.animations[refname];
          // if (animations) {
          //   for (const anime of animations) {
          //   }
          // }
          // enabled[refname].disabledAnimation;
        }
      });

      // enabled 순회하면서 헤제할 요소를 체크
      Object.keys(enabled).forEach((refname) => {
        const { top, bottom, topStyle, bottomStyle } = enabled[refname];
        // console.log(`${top}, ${bottom}, ${topStyle}, ${bottomStyle}`);
        // 범위 밖에 있다면
        if (!isAmong(currentPos, top, bottom)) {
          // 위로 나갔다면 시작하는 스타일 적용
          if (currentPos <= top) {
            Object.keys(topStyle).forEach((styleName) => {
              applyStyle(this.$refs[refname], styleName, topStyle[styleName]);
              // this.$refs[refname].style[styleName] = topStyle[styleName];
            });
          }
          // 아래로 나갔다면 끝나는 스타일적용
          else if (currentPos >= bottom) {
            Object.keys(bottomStyle).forEach((styleName) => {
              applyStyle(
                this.$refs[refname],
                styleName,
                bottomStyle[styleName],
              );
              // this.$refs[refname].style[styleName] = bottomStyle[styleName];
            });
          }

          // 리스트에서 삭제하고 disabled로 옮김.
          disabled[refname] = enabled[refname];
          this.$refs[refname].classList.remove('enabled');
          this.$refs[refname].classList.add('disabled');
          delete enabled[refname];
        }
        // enable 순회중, 범위 내부에 제대로 있다면 각 애니메이션 적용시키기.
        else {
          // else if (def.animations[refname]) {
          // console.log(refname);

          this.applyAllAnimation(currentPos, refname);
          // Object.values(def.animations[refname]).forEach((animation) => {
          //   const { top: a_top, bottom: a_bottom, easing, styles } = animation;
          //   // console.log(animation);
          //   // console.log(currentPos);
          //   if (isAmong(currentPos, a_top, a_bottom)) {
          //     // console.log('isAmong');
          //     // console.log(`${currentPos}, ${a_top}, ${a_bottom}`);
          //     const r = easing((currentPos - a_top) / (a_bottom - a_top));
          //     // for (const styleName in styles)
          //     Object.keys(styles).forEach((styleName) => {
          //       const { topValue, bottomValue } = styles[styleName];
          //       const calc = (bottomValue - topValue) * r + topValue;
          //       applyStyle(this.$refs[refname], styleName, calc);
          //     });
          //   }
          // });
        }
      });
      // console.log({ enabled, disabled });
    },
  },
};
</script>

<style lang="scss" scoped>
@use '../../style/common';
@use '../../style/breakpoint';

.sticky-container {
  position: relative;
}

.sticky {
  position: sticky;
  top: 0;
  width: 100%;
  height: 100vh;
  // background-color: #ddd;
}

.slide-container {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}
.slide {
  position: absolute;
  display: none;
  z-index: 0;
}
.slide.enabled {
  display: block;
}

.slide-big-text p {
  margin: 0;
  font-size: 45px;
  font-weight: bold;
  line-height: 1.35;
  letter-spacing: -1.5px;
  word-spacing: 1.5px;
  text-align: center;
}

.slide-small-text {
  margin-top: 20px;
  margin-left: 5px;
}

.slide-small-text p {
  font-size: 18px;
  margin: 0;
}

br.small {
  display: none;
}

@include breakpoint.max-with(md) {
  .slide-big-text p {
    font-size: 36px;
  }

  .sl3 .slide-big-text p,
  .sl5 .slide-big-text p {
    letter-spacing: -1px;
    word-spacing: 1px;
  }
  .sl3 .slide-big-text p {
    font-size: 26px;
  }
  .sl5 .slide-big-text p {
    font-size: 30px;
  }
  .slide-small-text p {
    font-size: 16px;
    line-height: 1.4;
    margin-bottom: 7px;
  }
  br.small {
    display: inline;
  }
}

.slide-left {
  left: max(calc(100% - 400px) * 0.2, 10px);
  .slide-big-text p {
    text-align: left;
  }
}

.scdown {
  position: absolute;
  padding: 30px 0;
  width: 100%;
  height: 150px;
  text-align: center;
  bottom: 0;
}
.scdown-icon {
  animation: 5s ease infinite scdown;
}

@keyframes scdown {
  0% {
    transform: translateY(-50px);
    opacity: 1;
  }
  50% {
    transform: translateY(0);
    opacity: 0;
  }
  100% {
    transform: translateY(0);
    opacity: 0;
  }
}

.sl4-content {
  transform: translateY(-50px);
}
@include breakpoint.max-with(sm) {
  .sl4-content {
    transform: translateY(0);
  }
}

.wave {
  position: absolute;
  padding: 30px 0;
  width: 100%;
  height: 200px;
  bottom: 0;
  overflow: hidden;
}

@include breakpoint.max-with(sm) {
  .wave {
    height: 150px;
  }
}

.wave-animation {
  width: 200%;
  min-width: 2856px;
  height: 100%;
  // transform: translateX(-1428px);
  animation: 35s linear infinite flow;
}

@keyframes flow {
  from {
    transform: translateX(-1428px);
  }
  to {
    transform: translateX(0);
  }
}

.home-footer {
  width: 100%;
  // position: absolute;
  bottom: 0;
}

.go-surf-wrapper {
  margin: 10px 0 0 3px;
}

.go-surf-icon {
  margin: 3px 0 0 10px;
}

.go-surf {
  font-size: 28px;
  display: inline-flex;
  align-items: center;
}

@include breakpoint.max-with(md) {
  .go-surf {
    font-size: 20px;
  }
}
</style>
