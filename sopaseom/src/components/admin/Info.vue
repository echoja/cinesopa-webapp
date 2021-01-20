<template>
  <span class="info-hover-component">
    <b-link :id="elId">
      <font-awesome-icon :icon="['far', 'question-circle']"></font-awesome-icon>
    </b-link>
    <b-tooltip :target="elId" triggers="hover">
      <slot>
        {{ this.description }}
      </slot>
    </b-tooltip>
  </span>
</template>

<script>
import { BLink, BTooltip } from 'bootstrap-vue';

let uuid = 0;

export default {
  components: {
    BTooltip,
    BLink,
  },
  props: {
    description: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      id: 0,
    };
  },
  computed: {
    elId() {
      return `info-button-${this.id}`;
    },
  },
  created() {
    this.id = uuid.toString();
    uuid += 1;
  },
};
</script>

<style lang="scss" scoped>
.info-hover-component a {
  color: #aaa;
}
</style>

<style>
</style>