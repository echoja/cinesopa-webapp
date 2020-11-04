<template>
  <div class="page-header">
    <slot></slot>
  </div>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
@import '@/common';

.page-header {
  font-size: 24px;
}

.page-header {
  width: 100%;
  height: 63px;
  background-color: #fff;
  border-bottom: 2px solid #000;
  margin-bottom: 0;
  position: sticky;
  top: $desktop-header-height;
}

@include max-with(sm) {

  .page-header {
    font-size: 20px;
    top: $mobile-header-height;
    height: 48px;
    margin-bottom: 20px;
  }

}
</style>

<style lang="scss">
@import '@/common';



</style>
