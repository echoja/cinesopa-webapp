<template>
  <div>
    <div v-if="visible[1]">HELLO WORLD1!!</div>
    <transition name="scroll1">
      <div v-if="visible[1]">HELLO WORLD1!!</div>
    </transition>
    <!-- <b-button @click="visible1 = !visible1">toggle</b-button> -->
    <b-button @click="toggle1">toggle</b-button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      visible: [true, false, true],
      visible1: false,
    };
  },
  computed: {
    isVisible(index) {
      return () => {
        return this.visible[index];
      };
    },
  },
  methods: {
    toggle1() {
      this.visible[1] = !this.visible[1];
    },
    // isVisible(index) {
    //   return this.visible[index];
    // },
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
</style>
