<template>
  <b-link class="strike-through-link" :to="to" v-bind="$attrs">
    <slot></slot>
    <span class="strike-through"></span>
  </b-link>
</template>

<script>
import { BLink } from 'bootstrap-vue';

export default {
  props: ['to'],
  components: {
    BLink,
  },
};
</script>

<style lang="scss" scoped>
.strike-through-link {
  position: relative;
}

.strike-through {
  display: none;
  pointer-events: none;
  position: absolute;
  left: -2px;
  right: -2px;
  top: 50%;
  height: 3px;
  transform: translateY(-1px);
  background-color: #000;
}

.router-link-exact-active .strike-through {
  display: block;
}
</style>

<style>
</style>
