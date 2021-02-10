<template>
  <div
    class="apply-button-set d-flex position-sticky bottom-0 justify-content-end"
  >
    <b-button v-if="!isOkOnly" @click="onCancelClick" class="mr-2">
      <slot name="cancel-content"> 취소 </slot>
    </b-button>
    <loading-button
      v-if="!isCancelOnly"
      @click="onOkClick"
      variant="primary"
      :disabled="disabled"
      :loading="loading"
      :loadingLabel="loadingLabel"
    >
      <slot name="ok-content">
        <font-awesome-icon :icon="['fas', 'save']" class="mr-2" />
        변경사항 저장
      </slot>
    </loading-button>
  </div>
</template>

<script>
import { BButton } from 'bootstrap-vue';
import LoadingButton from '@/components/LoadingButton.vue';

export default {
  name: 'ApplyButtonSet',
  components: {
    BButton,
    LoadingButton,
  },
  props: {
    okOnly: [String, Boolean],
    cancelOnly: [String, Boolean],
    disabled: {
      type: [Boolean, String],
      default: false,
    },
    loading: {
      type: Boolean,
      default: false,
    },
    loadingLabel: {
      type: String,
      default: '로딩중입니다.',
    },
  },
  computed: {
    /** @returns {boolean} */
    isOkOnly() {
      return this.okOnly === '' || this.okOnly === true;
    },
    /** @returns {boolean} */
    isCancelOnly() {
      return this.cancelOnly === '' || this.cancelOnly === true;
    },
  },
  methods: {
    onOkClick() {
      /**
       * OK 버튼을 클릭했을 때 이벤트를 발생시킵니다.
       *
       * @event ok
       */
      this.$emit('ok');
    },
    onCancelClick() {
      /**
       * 취소 버튼을 클릭했을 때 이벤트를 발생시킵니다.
       *
       * @event cancel
       */
      this.$emit('cancel');
    },
  },
};
</script>


<style>
</style>

