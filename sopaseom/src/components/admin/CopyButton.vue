<template>
  <button
    class="Tbg-gray-400 focus:Toutline-none Ttext-white Ttext-xs hover:Tbg-gray-300 Ttransition-colors Trounded-md Tp-0.5"
    @click="copyClicked"
  >
    복사
  </button>
</template>

<script>
import copy from 'copy-to-clipboard';
import { mapActions } from 'vuex';

export default {
  name: 'CopyButton',
  props: {
    content: String,
  },

  methods: {
    ...mapActions(['pushMessage']),
    copyClicked() {
      copy(this.content);
      this.pushMessage({
        type: 'success',
        id: 'copySuccess',
        msg: '성공적으로 복사되었습니다.',
      });
    },
  },
};
</script>

<style>
</style>
