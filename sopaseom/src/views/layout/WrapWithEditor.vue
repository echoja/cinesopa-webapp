<template>
  <div class="d-flex pt-2">
    <div class="p-2">
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
  width: 300px;
  flex-grow: 0;
  flex-shrink: 0;
}
</style>
