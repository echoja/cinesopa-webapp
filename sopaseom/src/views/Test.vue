<template>
  <div>
    <div>value: {{ abc }}</div>
    <div>
      <b-input type="text" v-model="inp"> </b-input>
    </div>
    <div>
      <!-- <b-button @click="getValue">값 가져오기</b-button> -->
      <b-button @click="changeValue">값 설정하기</b-button>
    </div>
  </div>
</template>

<script>
import store from '../store';

const storeTest = {
  name: 'TEST',
  data() {
    return {
      inp: '',
      // abc: '초깃값',
    };
  },
  computed: {
    abc() {
      return store.state.testString;
    },
  },
  methods: {
    // async getValue() {

    // },
    async changeValue() {
      await store.dispatch('changeTestString', { text: this.inp });
    },
  },
};

export default {
  mixins: [storeTest],
};
</script>

<style></style>
