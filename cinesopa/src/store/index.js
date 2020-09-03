import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    menuTransparent: false,
    menuFontColor: 'default',
    navLinkColor: '#2B3E4A',
    navLinkHoverColor: '#00B6E7',
  },
  mutations: {
    setMenuTransparent(state, isTransparent) {
      state.menuTransparent = isTransparent;
    },
    toggleMenuTransparent(state) {
      state.menuTransparent = !state.menuTransparent;
    },
    setMenuFontColor(state, { color, hoverColor }) {
      if (color) state.navLinkColor = color;
      if (hoverColor) state.navLinkHoverColor = hoverColor;
    },
    setMenuFontColorDefault(state) {
      state.navLinkColor = '#2B3E4A';
      state.navLinkHoverColor = '#00B6E7';
    },
  },
  actions: {},
  modules: {},
});
