<template>
  <div>
    <transition name="slide" mode="out-in">
    <router-view></router-view>
    </transition>
  </div>
</template>

<script>
export default {
  title: '주문하기',
};
</script>

<style lang="scss" scoped>
.slide-enter-active,
.slide-leave-active {
  transition-property: opacity;
  transition-property: height, opacity, margin, transform;
  transition-timing-function: ease;
  overflow: hidden;
}

.slide-enter-active {
  transition-duration: 1s;
}
.slide-leave-active {
  transition-duration: 0.3s;
}
.slide-enter {
  transform: translateX(20px);
  opacity: 0;
}
.slide-leave-to {
  transform: translateX(-20px);
  opacity: 0;
}

</style>

<style scoped></style>

<style></style>
