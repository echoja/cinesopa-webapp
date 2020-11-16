<template>
  <b-button :to="to"><slot></slot></b-button>
</template>

<script>
import { BButton } from 'bootstrap-vue';

export default {
  props: ['to'],
  components: { BButton },
};
</script>
<style lang="scss" scoped>
.btn {
  border-radius: 50%;
  border-width: 2px;
  font-size: 18px;
  font-weight: bold;
  padding: 6px 17px 8px;
}
</style>
