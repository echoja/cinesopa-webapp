<template>
  <div class="content-wrapper d-flex pt-2">
    <div class="p-2 flex-grow-1">
      <slot name="main"></slot>
    </div>
    <div class="p-2 sidebar2 ">
      <slot name="sidebar"></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'WrapWithEditor',
};
</script>

<style>
.sidebar2 {
  min-width: 200px;
}
</style>
