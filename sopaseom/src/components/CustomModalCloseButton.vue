<template>
  <b-button class="Tborder-0 Tbg-transparent Tabsolute Tright-0 Ttop-0 Tp-3" @click="hide">
    <svg-close class="Tw-10 Ty-10"></svg-close>
  </b-button>
</template>

<script>
import { BButton } from 'bootstrap-vue';

export default {
  components: {
    BButton,
    SvgClose: () => import('@/components/CloseFigure'),
  },
  props: {
    hide: Function,
  },
};
</script>

<style>
</style>
