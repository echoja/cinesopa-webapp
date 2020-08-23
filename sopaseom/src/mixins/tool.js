/**
 * 비동기 함수를 받아서, 해당 함수가 다 완료되었는지 아닌지를 체크하는 데이터와 함수를 추가하는 mixin 생성기
 * mixin에 얘를 호출한 결과를 넣으면 됨.
 * @param {string} processingCheckVarName func가 진행중이라면 true, 그렇지 않으면
 * false 를 나타내는 체크 변수 이름 (data에 추가됨)
 * @param {string} methodName 생성할 method이름.
 * @param {Promise<function>} func 비동기 함수 본체
 */
export const makeProcessingMixin = (self, processingCheckVarName, methodName, func) => ({
  data() {
    return {
      [processingCheckVarName]: false,
    };
  },
  methods: {
    async [methodName](...args) {
      this[processingCheckVarName] = true;
      await func(self, ...args);
      this[processingCheckVarName] = false;
    },
  },
});

export const a = 10;
