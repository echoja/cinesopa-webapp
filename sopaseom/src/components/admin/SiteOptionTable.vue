<template>
  <table class="input-table form">
    <slot> </slot>
  </table>
</template>

<script>
export default {
  name: 'SiteOptionTable',
  data() {
    return {
      abe: '',
    };
  },
};
</script>

<style>
</style>
