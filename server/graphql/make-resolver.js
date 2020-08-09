const typedef = require('../typedef')



let _default_access;

/**
 * 권한을 가진 resolver 를 만듭니다.
 * @param {Resolver} func
 */
const makeResolver = (func) => {
  return {
    /**
     * only 함수를 호출해야 최종 함수가 완성됩니다.
     * @param {string[]} access
     */
    only(access) {
      return async (obj, args, context, info) => {
        // 권한 체크...
        let currentRole = "";
        if (context.isUnauthenticated()) {
          currentRole = _default_access;
        } else {
          currentRole = (await context.getUser()).role;
        }

        if (access.includes(currentRole)) {
          return await func(obj, args, context, info);
        } else {
          throw "resolver: 권한이 없습니다";
        }
      };
    },
  };
};

module.exports = {
  /**
   * makeResolver 함수를 만듭니다.
   * @param {string} default_access 로그인하지 않은 사람이 가지는 기본 권한
   */
  init(default_access) {
    _default_access = default_access;
    return makeResolver;
  },
};
