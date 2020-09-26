<template>
  <div>
    <transition name="fade" mode="out-in">
      <router-view :key="$route.name" />
      <!-- <router-view /> -->
    </transition>
  </div>
</template>

<script>
export default {};
</script>

<style></style>
