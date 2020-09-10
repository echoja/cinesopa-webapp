<template>
  <div>
    <transition name="fade" mode="out-in">
      <router-view :key="$route.path" />
    </transition>
  </div>
</template>

<script>
export default {};
</script>

<style></style>
