<template>
  <span class="info-hover-component">
    <b-link :id="elId" @click="click">
      <font-awesome-icon :icon="['far', 'question-circle']"></font-awesome-icon>
    </b-link>
    <b-modal :id="modalId" v-if="isModal" ok-only title="상세 설명">
      <slot>
        {{ this.description }}
      </slot>
    </b-modal>
    <b-tooltip :target="elId" triggers="hover" v-else>
      <slot>
        {{ this.description }}
      </slot>
    </b-tooltip>
  </span>
</template>

<script>
import { BLink, BModal, BTooltip } from 'bootstrap-vue';

let uuid = 0;

export default {
  components: {
    BTooltip,
    BLink,
    BModal,
  },
  props: {
    description: {
      type: String,
      default: '',
    },
    modal: {
      type: [String, Boolean, Number, Object],
      default: null,
    },
  },
  data() {
    return {
      id: 0,
    };
  },
  computed: {
    /** @returns {string} */
    elId() {
      return `info-button-${this.id}`;
    },
    /** @returns {string} */
    modalId() {
      return `info-modal-${this.id}`;
    },
    /** @returns {boolean} */
    isModal() {
      return this.modal !== null;
    },
  },
  created() {
    this.id = uuid;
    uuid += 1;
  },
  methods: {
    click() {
      if (this.isModal) {
        this.$bvModal.show(this.modalId);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.info-hover-component a {
  color: #aaa;
}
p {
  margin: 0;
}
</style>

<style>
</style>