/**
 * resolver의 기본 형태
 *
 * @typedef {function} Resolver
 * @callback fpsCallback
 * @param {object} obj
 * @param {object} args
 * @param {object} context
 * @param {object} info
 */

class AuthValidator {
  /**
   * AuthValidator 를 생성합니다.
   * @param {Object.<string, number>} authmapLevel
   */
  constructor(authmapLevel) {
    this.authmapLevel = authmapLevel;
  }
  /**
   * 권한이 올바른지 체크하는 함수. 주어진 권한이 조건 권한보다 더 상위의 권한인지 체크.
   * @param {string} given 주어진 권한
   * @param {string} condition 조건 권한
   * @returns {boolean} 올바르면 true, 틀리면 false.
   */
  isOk(given, condition) {
    let result = false;
    try {
      result = this.authmapLevel[given] >= this.authmapLevel[condition];
      // console.log(authmapLevel[given]);
      // console.log(authmapLevel[condition]);
      return result;
    } catch {
      throw `given(${given}) or condition(${condition}) should be in [${_.map(
        _.keys(this.authmapLevel),
        (o) => `${o}`
      ).join(", ")}]`;
    }
  }
  /**
   * 클라이언트에서 해당 페이지에 권한이 있는지 없는지 체크하는 리졸버와 이어지는 함수.
   * 각 api에 대해 체크하는 게 아니라서 에러를 일으킬 필요가 없고,
   * 클라이언트에게 로그인이 필요하거나 권한이 없다고 알려주는 역할임.
   * 로그인에 필요한 페이지에 접속했을 시, 현재 링크를 req.session.redirectLink 에 저장하여
   * 나중에 로그인이 성공했을 시 redirectLink 로 즉시 이동할 수 있도록 함.
   */
  /**
   *
   * @param {string} redirectLink
   * @param {string[]} roleAvailable 조건 권한. 유저는 roleAvailable 안에 있어야 가능함.
   * @param {object} context Resolver 로부터 받는 context 객체
   */
  accessCheck(redirectLink, roleAvailable, context) {
    const {
      isUnauthenticated,
      req: { session },
      getUser,
    } = context;

    if (isUnauthenticated()) {
      // 리다이렉트 링크 설정
      if (redirectLink !== "") {
        session.redirectLink = redirectLink;
      }

      return {
        permissionStatus: "LOGIN_REQUIRED",
      };
    } else {
      const user = getUser();
      if (roleAvailable.includes(user.role)) {
        return {
          permissionStatus: "OK",
          user,
        };
      }
      // if (isOk(this.enumAuthmap[user.role], this.enumAuthmap[roleCondition])) {
      //   return {
      //     permissionStatus: "OK",
      //     user: getUser(),
      //   };
      //}
      else {
        return {
          permissionStatus: "NO_PERMISSION",
        };
      }
    }
  }
}

module.exports = {
  /**
   * authMapLevel 로 초기화합니다.
   * @param {Object.<string, number>} authmapLevel 
   */
  init(authmapLevel) {
    return new AuthValidator(authmapLevel);
  },
};
