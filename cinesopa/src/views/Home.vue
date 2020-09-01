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

    <div class="page-scroll-container" ref="container">
      <!-- ref="scroll0" -->
      <div class="page-scroll-section my-1" v-b-visible="visible(0)">
        <transition name="scroll1">
          <div
            v-if="isVisible(0)"
            class="d-flex h-100 border border-dark align-items-center justify-content-center"
          >
            <div>
              영화배급협동조합 씨네소파
            </div>
          </div>
        </transition>
      </div>
      <!-- ref="scroll1" -->
      <div class="page-scroll-section my-1" v-b-visible="visible(1)">
        <transition name="scroll1">
          <div
            v-if="isVisible(1)"
            class="d-flex h-100 border border-dark align-items-center justify-content-center"
          ></div>
        </transition>
      </div>
      <!-- ref="scroll2" -->
      <div class="page-scroll-section my-1" v-b-visible="visible(2)">
        <transition name="scroll1">
          <div
            v-if="isVisible(2)"
            class="d-flex h-100 border border-dark align-items-center justify-content-center"
          >
            HELLO WORLD2!!
          </div>
        </transition>
      </div>
    </div>

    <!-- <div class="main-placeholder">
      <div v-b-visible="visible('A')"><p>A</p></div>
      <div v-b-visible="visible('B')">
        <p>B</p>
        <div class="rellax" data-rellax-percentage="0.5">
          I’m that default chill speed of "-2" and "centered"
        </div>
        <div class="rellax" data-rellax-speed="7" data-rellax-percentage="0.5">
          I’m super fast!! And super centered!!
        </div>
        <div class="rellax" data-rellax-speed="-4" data-rellax-percentage="0.5">
          I’m extra slow and smooth, and hella centered.
        </div>
      </div>
      <div v-b-visible="visible('C')"><p>C</p></div>
    </div> -->
  </div>
</template>

<script>
import Rellax from 'rellax';
// console.log(Rellax);

function onScrollImpl(self) {
  let scrollProcessing = false;
  let lastScrollTop = window.pageYOffset || document.documentElement.scrollTop;
  return () => {
    // console.log('real!!! scroll!!!! yeah!!!');
    // const scrollSection = [
    //   {
    //     element: self.$refs.scroll0,
    //     isVisible: self.isVisibleA,
    //   },
    //   {
    //     element: self.$refs.scroll1,
    //     isVisible: self.isVisibleB,
    //   },
    //   {
    //     element: self.$refs.scroll2,
    //     isVisible: self.isVisibleC,
    //   },
    // ];
    const visibles = self.scrollSection.filter((sec) => {
      return sec.isVisible === true;
    });

    const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;
    console.log(
      `last: ${lastScrollTop}, current: ${currentScrollTop}, visibleLength: ${visibles.length}, processing: ${scrollProcessing}`
    );

    const onDone = () => () => {
      scrollProcessing = false;
    };
    if (visibles.length === 2 && scrollProcessing === false) {
      scrollProcessing = true;
      let from = visibles[0].element;
      let to = visibles[1].element;

      // 순서 조정
      if (currentScrollTop < lastScrollTop) {
        from = visibles[1].element;
        to = visibles[0].element;
      }
      window.scrollTo(0, from.getBoundingClientRect().top + currentScrollTop);
      self.$scrollTo(to, 1000, {
        onDone: onDone(0, 1),
        cancelable: false,
      });
    }
    lastScrollTop = currentScrollTop;
  };
}

let onScroll;

export default {
  name: 'Home',
  data() {
    return {
      howv: false,
      rellax: {},
      currentScroll: 0,
      scrollSection: [], // {element: domObject, isVisible: bool}
      lastScrollTop: window.pageYOffset || document.documentElement.scrollTop,
      scrollProcessing: false,
    };
  },
  computed: {
    // isVisible(key) {
    //   return function() {
    //     const isVisible = this.scrollSection[key]?.isVisible;
    //     return isVisible !== undefined ? isVisible : false;
    //   };
    // },
    // how() {
    //   return (o) => {
    //     return this.howv;
    //   };
    // },
  },
  async created() {
    // window.addEventListener('scroll', this.onScroll);
    window.addEventListener('wheel', this.onWheel);
    window.addEventListener('resize', this.onResize);
    // this.rellax = new Rellax('.rellax', {
    //   center: true,
    // });
  },
  async beforeDestroy() {
    // window.removeEventListener('scroll', this.onScroll);
    window.removeEventListener('scroll', onScroll);
    window.removeEventListener('wheel', this.onWheel);
    window.removeEventListener('resize', this.onResize);
  },
  async mounted() {
    const rellax = new Rellax('.rellax', {
      // center: true,
    });
    // console.log(rellax);
    // console.log('ho');
    this.rellax = rellax;
    // console.log(this.$refs.c.children);
    /**
     * @type {HTMLCollection}
    //  */
    const { children } = this.$refs.container;
    children.forEach((child) => {
      this.scrollSection.push({
        element: child,
        isVisible: false,
      });
    });
    // const c0 = children.item(0);
    // console.log(children[0].getBoundingClientRect());
    // console.log(children[1].getBoundingClientRect());
    // console.log(children[2].getBoundingClientRect());

    // console.dir(c0);
    // console.log(this.show);
    // this.scrollSection.a.element = this.$refs.scroll0;
    // this.scrollSection[1].element = this.$refs.scroll1;
    // this.scrollSection[2].element = this.$refs.scroll2;

    console.log(this.scrollSection);
    // console.log('mounted!');
    this.setScrollSectionX();

    onScroll = onScrollImpl(this);
    window.addEventListener('scroll', onScroll);
  },
  methods: {
    customAppearHook(e) {
      console.log(`customAppearHook! >> ${e}`);
    },
    // makeOnWheel() {
    //   let lastScrollTop = window.pageYOffset || document.documentElement.scrollTop;
    //   return (e) => {

    //   };
    // },
    // onScroll: (function o(self) {
    //   return onScrollImpl(self.scrollSection, self.$scrollTo);
    // })(this),
    // console.log('onscroll!!!');
    // this.onScroll = onScrollImpl(this.scrollSection, this.$scrollTo);
    // },
    onWheel2(e) {
      const visibles = this.scrollSection.filter((sec) => {
        return sec.isVisible === true;
      });

      const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;
      console.log(
        `last: ${this.lastScrollTop}, current: ${currentScrollTop}, visibleLength: ${visibles.length}, processing: ${this.scrollProcessing}`
      );

      const onDone = (from, to) => () => {
        this.scrollProcessing = false;
        // enableScroll();
        // document.body.classList.remove('no-scroll');
        // this.scrollSection[from].isVisible = false;
        // this.scrollSection[to].isVisible = true;
      };
      if (visibles.length === 2 && this.scrollProcessing === false) {
        this.scrollProcessing = true;
        if (currentScrollTop > this.lastScrollTop) {
          // going down
          // disableScroll();
          // document.body.classList.add('no-scroll');
          // this.$scrollTo(visibles[0].element, 0);
          this.$scrollTo(visibles[1].element, 5000, {
            onDone: onDone(0, 1),
            cancelable: false,
          });
        } else if (currentScrollTop < this.lastScrollTop) {
          // going top
          // disableScroll();
          // document.body.classList.add('no-scroll');
          // this.$scrollTo(visibles[1].element, 0);
          this.$scrollTo(visibles[0].element, 5000, {
            onDone: onDone(1, 0),
            cancelable: false,
          });
        }
      }

      this.lastScrollTop = currentScrollTop;
    },

    onWheel() {},
    makeOnScrollimsi() {
      let lastScrollTop = window.pageYOffset || document.documentElement.scrollTop;
      let processing = false;
      return (evt) => {
        // console.log(evt);
        const visibles = this.scrollSection.filter((sec) => {
          return sec.isVisible === true;
        });

        const onDone = (from, to) => () => {
          processing = false;
          // enableScroll();
          document.body.classList.remove('no-scroll');
          this.scrollSection[from].isVisible = false;
          this.scrollSection[to].isVisible = true;
        };

        const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;
        if (visibles.length === 2 && processing === false) {
          processing = true;
          if (currentScrollTop > lastScrollTop) {
            // going down
            // disableScroll();
            document.body.classList.add('no-scroll');
            this.$scrollTo(visibles[0].element, 0);
            this.$scrollTo(visibles[1].element, 5000, {
              onDone: onDone(0, 1),
              cancelable: false,
            });
          } else if (currentScrollTop < lastScrollTop) {
            // going top
          }
        }

        lastScrollTop = currentScrollTop <= 0 ? 0 : currentScrollTop; // for mobile
      };
      // console.log('hi');
      // evt.preventDefault();
      // evt.stopPropagation();
    },
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
      const { left } = this.$refs.container.getBoundingClientRect();
      // this.$refs.scroll0.style.transform = `translateX(-${left}px)`;
      // this.$refs.scroll1.style.transform = `translateX(-${left}px)`;
      // this.$refs.scroll2.style.transform = `translateX(-${left}px)`;

      this.scrollSection.forEach((o) => {
        // eslint-disable-next-line no-param-reassign
        o.element.style.transform = `translateX(-${left}px)`;
      });
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
#home {
  /* position: relative; */
  margin-top: calc(-1 * var(--header-height));
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

.main-transition > div {
  width: 100vw;
  height: 100vh;
  position: fixed;
  left: 0;
  top: 0;
  z-index: -2;
}

.page-scroll-section {
  width: 100vw;
  height: 100vh;
  /* background-color: #ddd; */
}

.main-placeholder > div {
  width: 100vw;
  height: 100vh;
}

.page-scroll-section {
}
</style>
