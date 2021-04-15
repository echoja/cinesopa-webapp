// require('@/typedef');

// const connectMongo = require('connect-mongo'); 테스트에서 DANGLING 유발!!!
const { CustomPassportContext, DBManager, Userinfo, AuthmapLevel } = require('@/typedef');
const { enumAuthmap } = require('../db/schema/enum');

// const sessionStore = require('./session-store'); 테스트에서 DANGLING 유발!!!

// const authmapLevel = {
//   [enumAuthmap.ADMIN]: 2,
//   [enumAuthmap.GUEST]: 1,
//   [enumAuthmap.ANYONE]: 0,
// };
const MAX_LOGIN_ATTEMPT = 5;

class AuthService {
  /**
   * @type {DBManager}
   */
  #db;

  /** @type {AuthmapLevel} */
  authmapLevel = {
    ADMIN: 2,
    GUEST: 1,
    ANYONE: 0,
  };

  constructor(db) {
    this.#db = db;
  }

  /**
   * 현재 세션의 유저를 로그아웃시킨다.
   * @param {CustomPassportContext} context 콘텍스트
   * @returns 로그아웃했던 유저 정보(Nullable)와 redirectLink를 ""로 설정한 객체
   */
  async logoutMe(context) {
    const user = context.getUser();
    context.logout();
    return user;
  }

  /**
   * @typedef {Object} LoginOption
   * @property {boolean=} disableSession 기본: false
   */
  /**
   * 해당 콘텍스트에 유저를 로그인시킵니다.
   * 세션도 저장됩니다. verified 체크는 하지 않습니다.
   * @param {string} email 이메일
   * @param {string} pwd 비밀번호
   * @param {CustomPassportContext} context 콘텍스트
   * @param {LoginOption} option 로그인 할 때 옵션
   * @returns 유저 정보와 리다이렉트할 링크
   */
  async login(email, pwd, context, option = {}) {
    // console.log('# auth login option');
    // console.log(option);
    const { disableSession = false } = option;
    const redirectLink = context.req?.session?.redirectLink;
    const userFound = await this.#db.getUserByEmail(email);
    if (!userFound) return { wrong_reason: 'no_email', success: false };

    // 카카오 계정일 경우 별도 처리
    if (userFound.has_pwd !== true && typeof userFound.kakao_id === 'string')
      return { wrong_reason: 'only_kakao', success: false };

    // 로그인 시도 초과일 경우 곧바로 실패 처리
    if (userFound.wrong_pwd_count >= MAX_LOGIN_ATTEMPT) {
      return {
        wrong_reason: 'too_much_attempt',
        success: false,
        wrong_pwd_count: MAX_LOGIN_ATTEMPT,
      };
    }

    /**
     * @type {Userinfo}
     */
    let user;

    try {
      // 사용자 인증
      const userBlock = await context.authenticate('graphql-local', {
        email,
        password: pwd,
      });
      user = userBlock.user;
      await context.login(user);
    } catch (error) {
      console.error(error);
      // 비밀번호 틀린 횟수 세기
      let currentWrongCount = userFound.wrong_pwd_count + 1;
      let wrong_reason = 'wrong_pwd';

      // 5회 이상일 경우 바로 5회로 고정 후 wrong_reason 수정
      if (currentWrongCount >= MAX_LOGIN_ATTEMPT) {
        wrong_reason = 'too_much_attempt';
        currentWrongCount = MAX_LOGIN_ATTEMPT;
      }

      // 로그아웃 실패 처리 후 즉시 동작 종료
      await this.#db.updateUser(email, { wrong_pwd_count: currentWrongCount });
      return {
        wrong_reason,
        success: false,
        wrong_pwd_count: currentWrongCount,
      };
    }
    // 로그인
    // console.log("calling context.login");

    // console.log('-- session in login --');
    // console.dir(context.req.session.cookie);
    //

    // disable Session 이라면 쿠키 기능을 비활성화 하여
    // 브라우저 종료시 쿠키가 날라가도록 하여 브라우저를 끄면 자동으로
    // 로그아웃되도록 설정.
    if (disableSession) {
      context.req.session.cookie.expires = null;
    }

    // console.log(context.req.sessionID);
    // 로그인에 성공했다면, wrong_pwd_count 초기화
    this.#db.updateUser(email, { wrong_pwd_count: 0 });

    // 본래 있던 redirectLink 삭제
    if (redirectLink) {
      delete context.req.session.redirectLink;
    }
    return { user, redirectLink, success: true };
  }
}

const isOwnerToFile = async (req, rawFilename) => {};

module.exports = {
  /**
   *
   * @param {DBManager} db
   */
  make(db) {
    return new AuthService(db);
  },
  isOwnerToFile,
  // authmapLevel,
};
