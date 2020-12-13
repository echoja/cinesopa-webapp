<template>
  <span class="small-spinner">
    <b-spinner
      :style="{
        width: `${width}px`,
        height: `${width}px`,
        'border-width': borderWidth,
      }"
    ></b-spinner>
  </span>
</template>

<script>
import { BSpinner } from 'bootstrap-vue';

export default {
  components: { BSpinner },
  props: {
    width: {
      type: Number,
      default: 20,
    },
    borderWidth: {
      type: Number,
      default: 3,
    },
  },
};
</script>

<style lang="scss" scoped>
.small-spinner {
  margin: 0 15px;
  display: inline-flex;
  align-items: center;
}
</style>

<style>
</style>