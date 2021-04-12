import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const testStates = {
  a: 1,
  b: 2,
  c: 3,
};

/**
 * store는 F5 할때마다 초기화된다.
 */
const s = new Vuex.Store({
  /**
   * store.state.name 으로 접근할 수 있음.
   * 값을 수정하려면 mutation 을 써야 함.
   */
  state: {
    userInitialized: false,
    currentUser: null,
    currentUserAsync: null,
    createUserAgreed: {
      policy: null,
      privacy: null,
      advertisement: null,
    },
    testString: '초기테스트 스토어',
    errorMsg: '',
    ...testStates,
    messages: [],
    logoZoomed: false,
    joinProcessing: false,
    joinFinished: false,
    additionalFooterPaddingBottom: 0,
    routeWhereLoginSuccess: null,
    routeWhereAgreeSuccess: null,
    /** @type {string} */
    taxReqLinkToken: null,
  },
  /**
   * 게터.
   * store.getters.funcname 이렇게 속성으로 접근가능함.
   */
  getters: {

    // 회원가입 동의 제대로 했는지 체크.
    // 회원가입 정보 적을 때 사용.
    isValidUserAgreed(state) {
      const {
        createUserAgreed: { advertisement, policy, privacy },
      } = state;
      return policy !== null && advertisement !== null && privacy !== null;
    },
  },

  /**
   * 동기 작업들
   * funcname(state, payload) {...} 식으로 내부에 정의하면 됨.
   * 외부에서 store.commit('funcname', payload) 식으로 호출할 수 있음.
   */
  mutations: {
    setLogoZoomed(state, logoZoomed) {
      state.logoZoomed = logoZoomed;
    },
    setErrorMsg(state, { message }) {
      state.errorMsg = message;
    },
    setCurrentUser(state, { currentUser }) {
      state.currentUser = currentUser;
    },
    setCurrentUserAsync(state, currentUserAsync) {
      state.currentUserAsync = currentUserAsync;
    },
    setUserInitialized(state, userInitialized) {
      state.userInitialized = userInitialized;
    },
    setTestString(state, { value }) {
      state.testString = value;
    },
    addMessage(state, msgObj) {
      state.messages.push(msgObj);
    },
    removeMessage(state, { id }) {
      const foundIndex = state.messages.findIndex((msg) => msg.id === id);
      if (foundIndex > -1) state.messages.splice(foundIndex, 1);
    },
    setUserAgreed(state, { policy, privacy, advertisement }) {
      state.createUserAgreed.policy = policy;
      state.createUserAgreed.privacy = privacy;
      state.createUserAgreed.advertisement = advertisement;
    },
    setJoinProcessing(state, joinProcessing) {
      state.joinProcessing = joinProcessing;
    },
    setJoinFinished(state, joinFinished) {
      state.joinFinished = joinFinished;
    },
    setAdditionalFooterPaddingBottom(state, additionalFooterPaddingBottom) {
      state.additionalFooterPaddingBottom = additionalFooterPaddingBottom;
    },
    setRouteWhereLoginSuccess(state, route) {
      state.routeWhereLoginSuccess = route;
    },
    setRouteWhereAgreeSuccess(state, route) {
      state.routeWhereAgreeSuccess = route;
    },
    setTaxLinkToken(state, token) {
      state.taxReqLinkToken = token;
    },
  },
  /**
   * 비동기 작업들. 내부 함수는 async 가능
   * funcname({commit, dispatch, state, getters}, payload) { ... } 식으로 내부에 정의하면 됨. async 가능
   * 외부에서 store.dispatch('funcname', payload) 식으로 호출할수 있음.
   * 액션 내부에서
   */
  actions: {
    async getCurrentUser(store) {
      return store.state.currentUserAsync || store.state.currentUser;
    },
    async setCurrentUser(store, { user }) {
      store.commit('setCurrentUser', { currentUser: user });
    },
    async changeTestString(store, { text }) {
      store.commit('setTestString', { value: text });
    },
    async pushMessage(store, { type, id, msg }) {
      // id가 겹치지 않을 때애만 추가
      if (store.state.messages.findIndex((value) => value.id === id) === -1) {
        store.commit('addMessage', { type, id, msg });
        setTimeout(() => {
          store.commit('removeMessage', { id });
        }, 2500);
      }
    },
    async removeMessage(store, { id }) {
      store.commit('removeMessage', { id });
    },
  },
  modules: {},
});

export default s;
