<template>
  <div class="page-header">
    <slot></slot>
  </div>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
.page-header {
  width: 100%;
  height: 63px;
  border-bottom: 2px solid #000;
  margin-bottom: 0;
}
</style>

<style lang="scss">
.page-header {
  h1 {
    font-size: 24px;
    font-weight: bold;
    margin: 0;
  }
}

.page-header .page-header-inner-wrapper {
  display: flex;
  align-items: center;
  height: 100%;
}
</style>
