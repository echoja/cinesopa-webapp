<template>
  <div class="number-controller">
    <div class="controller-down">
      <b-link @click="downClicked()">
        <svg-next></svg-next>
      </b-link>
    </div>
    <div class="controller-number">
      {{ value }}
    </div>
    <div class="controller-up">
      <b-link @click="upClicked()">
        <svg-next></svg-next>
      </b-link>
    </div>
  </div>
</template>

<script>
import { BLink } from 'bootstrap-vue';

export default {
  props: {
    value: Number,
  },
  components: {
    BLink,
    SvgNext: () => import('@/components/SvgNext'),
  },
  methods: {
    downClicked() {
      if (this.value > 0) {
        this.$emit('input', this.value - 1);
      }
    },
    upClicked() {
      if (this.value < 99) {
        this.$emit('input', this.value + 1);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.number-controller {
  display: flex;
  align-items: center;

  a:hover {
    color: #585858;
  }
  svg {
    width: 6px;
    border-style: solid;
    border-color: transparent;
    border-width: 0 17px 2px;
    box-sizing: content-box;
  }
}

.number-controller .controller-down svg,
.number-controller .controller-up svg {
  border-right: 0;
}
.controller-down svg {
  transform: scaleX(-1);
}
</style>

<style>
</style>