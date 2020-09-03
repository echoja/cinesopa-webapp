import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    menuTransparent: false,
  },
  mutations: {
    setMenuTransparent(state, isTransparent) {
      state.menuTransparent = isTransparent;
    },
  },
  actions: {},
  modules: {},
});
