<template>
  <svg
    :style="{ width: `${width}px` }"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 28.99 28.99"
  >
    <line class="a" x1="28.72" y1="0.27" x2="0.27" y2="28.72" />
    <line class="a" x1="0.27" y1="0.27" x2="28.72" y2="28.72" />
  </svg>
</template>

<script>
export default {
  props: {
    width: {
      type: Number,
      default: 25,
    },
  },
};
</script>

<style lang="scss" scoped>
.a {
  stroke: currentColor;
  stroke-width: 1.3px;
  stroke-miterlimit: 10;
  fill: none;
}
</style>

<style>
</style>
