<template>
  <div class="page-header">
    <slot></slot>
  </div>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
@use '../style/common';
@use '../style/breakpoint';

.page-header {
  font-size: common.$desktop-subheader-font-size;
  z-index: 20;
  width: 100%;
  height: common.$desktop-subheader-height;
  background-color: #fff;
  border-bottom: 2px solid #000;
  margin-bottom: 0;
  position: sticky;
  // top: 0;
  top: common.$desktop-header-height + 2px;
}

// transition 때 이상하게 top 이 계산되는 문제 수정

@include common.prevent-break-top0(".page-header");

// .left-right-enter-active .page-header,
// .left-right-leave-active .page-header,
// .fade-enter-active .page-header,
// .fade-leave-active .page-header {
//   top: 0;
// }

// .body:not(.left-right-enter-active):not(.left-right-leave-active) .page-header {
//   top: common.$desktop-header-height + 2px;
// }

@include breakpoint.max-with(md) {
  .page-header {
    font-size: common.$mobile-subheader-font-size;
    top: common.$mobile-header-height;
    height: common.$mobile-subheader-height;
    margin-bottom: 20px;
    border-top: 2px solid #000;
  }
  // .body:not(.left-right-enter-active):not(.left-right-leave-active)
  //   .page-header {
  //   top: common.$mobile-header-height;
  // }
}

.page-header h1 {
  font-size: common.$desktop-subheader-font-size;
  font-weight: bold;
  margin: 0;
}

@include breakpoint.max-with(md) {
  .page-header h1 {
    font-size: common.$mobile-subheader-font-size;
  }
}

.page-header .page-header-inner-wrapper {
  display: flex;
  align-items: center;
  height: 100%;
}
</style>

<style lang="scss">
@use '../style/common';
@use '../style/breakpoint';
</style>
