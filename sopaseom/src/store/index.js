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
const store = new Vuex.Store({
  /**
   * store.state.name 으로 접근할 수 있음.
   * 값을 수정하려면 mutation 을 써야 함.
   */
  state: {
    userInitialized: false,
    currentUser: null,
    testString: '초기테스트 스토어',
    errorMsg: '',
    ...testStates,
    messages: [],
    logoZoomed: false,
  },
  /**
   * 게터.
   * store.getters.funcname 이렇게 속성으로 접근가능함.
   */
  getters: {
    doubleCount(state) {
      return state.count * 2;
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
    setUserInitialized(state, userInitialized) {
      state.userInitialized = userInitialized;
    },
    setTestString(state, { value }) {
      state.testString = value;
    },
    pushMessage(state, msgObj) {
      state.messages.push(msgObj);
    },
    removeMessage(state, { id }) {
      const foundIndex = state.messages.findIndex((msg) => msg.id === id);
      if (foundIndex > -1) state.messages.splice(foundIndex, 1);
    },
  },
  /**
   * 비동기 작업들. 내부 함수는 async 가능
   * funcname({commit, dispatch, state, getters}, payload) { ... } 식으로 내부에 정의하면 됨. async 가능
   * 외부에서 store.dispatch('funcname', payload) 식으로 호출할수 있음.
   * 액션 내부에서
   */
  actions: {
    async setCurrentUser(state, { user }) {
      state.commit('setCurrentUser', { currentUser: user });
    },
    async changeTestString(state, { text }) {
      state.commit('setTestString', { value: text });
    },
    async pushMessage(state, { type, id, msg }) {
      state.commit('pushMessage', { type, id, msg });
    },
    async removeMessage(state, { id }) {
      state.commit('removeMessage', { id });
    },
  },
  modules: {},
});

export default store;
