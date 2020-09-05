import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    menuTransparent: false,
    logoWhite: false,
    navLinkWhite: false,
    isMobile: false,
  },
  mutations: {
    setMenuTransparent(state, isTransparent) {
      state.menuTransparent = isTransparent;
    },
    toggleMenuTransparent(state) {
      state.menuTransparent = !state.menuTransparent;
    },
    setLogoWhite(state, isLogoWhite) {
      state.logoWhite = isLogoWhite;
    },
    setIsMobile(state, isMobile) {
      state.isMobile = isMobile;
    },
    setNavLinkWhite(state, isNavLinkWhite) {
      state.navLinkWhite = isNavLinkWhite;
    },
  },
  actions: {},
  modules: {},
});
