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
  font-size: $desktop-subheader-font-size;
  z-index: 20;
  width: 100%;
  height: $desktop-subheader-height;
  background-color: #fff;
  border-bottom: 2px solid #000;
  margin-bottom: 0;
  position: sticky;
  // top: 0;
  top: $desktop-header-height + 2px;
}

// transition 때 이상하게 top 이 계산되는 문제 수정

@include prevent-break-top0(".page-header");

// .left-right-enter-active .page-header,
// .left-right-leave-active .page-header,
// .fade-enter-active .page-header,
// .fade-leave-active .page-header {
//   top: 0;
// }

// .body:not(.left-right-enter-active):not(.left-right-leave-active) .page-header {
//   top: $desktop-header-height + 2px;
// }

@include max-with(md) {
  .page-header {
    font-size: $mobile-subheader-font-size;
    top: $mobile-header-height;
    height: $mobile-subheader-height;
    margin-bottom: 20px;
    border-top: 2px solid #000;
  }
  // .body:not(.left-right-enter-active):not(.left-right-leave-active)
  //   .page-header {
  //   top: $mobile-header-height;
  // }
}

.page-header h1 {
  font-size: $desktop-subheader-font-size;
  font-weight: bold;
  margin: 0;
}

@include max-with(md) {
  .page-header h1 {
    font-size: $mobile-subheader-font-size;
  }
}

.page-header .page-header-inner-wrapper {
  display: flex;
  align-items: center;
  height: 100%;
}
</style>

<style lang="scss">
@import '@/common';
</style>
