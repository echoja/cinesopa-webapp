import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    menuTransparent: false,
    menuFontColor: 'default',
  },
  mutations: {
    setMenuTransparent(state, isTransparent) {
      state.menuTransparent = isTransparent;
    },
    toggleMenuTransparent(state) {
      state.menuTransparent = !state.menuTransparent;
    },
    setMenuFontColor(state, color) {
      state.menuFontColor = color;
    },
    setMenuFontColorDefault(state) {
      state.menuFontColor = 'default';
    },
  },
  actions: {},
  modules: {},
});
