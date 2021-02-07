<template>
  <b-button
    title="dfdff"
    class="eye"
    :id="`eye-${id}`"
    @click="clicked"
  >
    <font-awesome-icon :icon="['far', 'eye']"> </font-awesome-icon>
    <b-tooltip v-if="text" :target="`eye-${id}`" triggers="hover">
      {{ text }}<br />
      <small>눈을 클릭하여 복사하세요.</small>
    </b-tooltip>
  </b-button>
</template>

<script>
import copy from 'copy-to-clipboard';
import { BTooltip, BButton } from 'bootstrap-vue';
import { mapActions } from 'vuex';

let uuid = 0;
export default {
  name: 'EyeBox',
  props: {
    text: {
      type: String,
      default: '',
    },
  },
  components: {
    BTooltip,
    BButton,
  },
  data() {
    return {
      id: 0,
    };
  },
  created() {
    this.id = uuid;
    uuid += 1;
  },
  methods: {
    ...mapActions(['pushMessage']),
    clicked() {
      copy(this.text);
      this.pushMessage({
        type: 'success',
        msg: '클립보드에 복사되었습니다.',
        id: 'clipboardSuccess',
      });
    },
  },
};
</script>

<style>
</style>