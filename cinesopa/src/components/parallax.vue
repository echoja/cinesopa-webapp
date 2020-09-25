<template>
  <div class="parallax" ref="parallax">
    <slot></slot>
  </div>
</template>

<script>
export default {
  props: {
    speed: {
      type: Number,
      default: 2,
    },
  },
  data() {
    return {
      standard: 0,
      windowInnerHeightHalf: 0,
    };
  },
  computed: {
    realSpeed() {
      return this.speed / 100;
    },
  },
  created() {},
  mounted() {
    window.addEventListener('scroll', this.onScroll, { passive: true });
    // console.log(`speed: ${this.speed}`);
    const parent = this.$refs.parallax.parentElement;
    const scrollY = window.scrollY || window.pageYOffset;
    this.standard = Math.floor(
      parent.getBoundingClientRect().top + scrollY + parent.offsetHeight / 2,
    );
    this.windowInnerHeightHalf = window.innerHeight / 2;
    // console.log(parent.getBoundingClientRect());
    // console.log(parent);
    // console.log(
    //   `parent-scrollHeight: ${
    //     parent.scrollHeight
    //   } scrollY: ${scrollY} parent.getBoundingClientRect().top: ${
    //     parent.getBoundingClientRect().top
    //   }`,
    // );
    // console.log(`standard: ${this.standard}`);
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.onScroll, { passive: true });
  },
  methods: {
    onScroll() {
      const scrollY = window.scrollY || window.pageYOffset;
      const currentPoint = scrollY + this.windowInnerHeightHalf;
      const calculated = (this.standard - currentPoint) * this.realSpeed;
      this.$refs.parallax.style.transform = `translate3d(0px, ${calculated}px, 0px)`;
      console.log('transform Changed!');
    },
  },
};
</script>

<style></style>
