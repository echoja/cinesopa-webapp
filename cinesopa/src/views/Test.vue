<template>
  <div>
    <div v-if="visible[1]">HELLO WORLD1!!</div>
    <transition name="scroll1">
      <div v-if="visible[1]">HELLO WORLD1!!</div>
    </transition>
    <!-- <b-button @click="visible1 = !visible1">toggle</b-button> -->
    <b-button @click="toggle1">toggle</b-button>
    <div class="swiper-container" ref="swiperContainer">
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
    <div style="height: 500px"><parallax :speed="-200">Hello</parallax></div>
    
    <b-form-input></b-form-input>
  </div>
</template>

<script>
import Swiper, { Mousewheel } from 'swiper';
// import Swiper styles
import 'swiper/swiper-bundle.css';
import Parallax from '../components/parallax.vue';
// import Parallax from '../components/parallax.vue';

Swiper.use([Mousewheel]);

export default {
  components: {
    // parallax: import('../components/parallax.vue'),
    parallax: Parallax,
  },
  data() {
    return {
      visible: [true, false, true],
      visible1: false,
      swiper: null,
    };
  },
  computed: {
    isVisible(index) {
      return () => {
        return this.visible[index];
      };
    },
  },
  mounted() {
    const swiper = new Swiper('.swiper-container', {
      mousewheel: {
        releaseOnEdges: true,
      },
    });
    this.swiper = swiper;
    window.addEventListener('wheel', this.onWheel, {
      passive: false,
    });
    document.addEventListener('scroll', this.onScroll);
  },
  beforeDestroy() {
    this.swiper.destroy();
  },
  methods: {
    toggle1() {
      this.visible[1] = !this.visible[1];
    },
    // isVisible(index) {
    //   return this.visible[index];
    // },
    onScroll(e) {
      // console.log(e);
      // console.log(`onscroll-y:${window.scrollY || window.pageYOffset}`);
      // e.preventDefault();
      // e.stopPropagation();
    },
    onWheel(e) {
      // console.log(e);

      // e.preventDefault();
      // e.preventDefault();
    },
  },
};
</script>

<style>
.scroll1-enter-active {
  transition-duration: 1s;
  transition-property: opacity, height;
  transition-timing-function: ease;
}
/* .scroll1-leave-active  */

.scroll1-enter,
.scroll1-leave-to {
  opacity: 0;
}
.scroll1-enter {
  height: 0;
}
.scroll1-enter-to {
  height: 100px;
}

.swiper-container {
  height: 600px;
  width: 100%;
}
</style>
