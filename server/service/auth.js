require('../typedef');

// const connectMongo = require('connect-mongo'); 테스트에서 DANGLING 유발!!!
const { enumAuthmap } = require('../db/schema/enum');
// const sessionStore = require('./session-store'); 테스트에서 DANGLING 유발!!!

const authmapLevel = {
  [enumAuthmap.ADMIN]: 2,
  [enumAuthmap.GUEST]: 1,
  [enumAuthmap.ANYONE]: 0,
};

// 서버로 graphql api가 들어왔을 때 해당 요청이 정말로 권한이 있는 요청인지 체크하는 리졸버 래퍼 함수.
// 함수 시그니처 : (args, context) => ...
// const makeResolverWithUserRole = (role, func) => {
//   return async (args, context) => {
//     if (context.isUnauthenticated()) throw Error("Not Authenticated");
//     const user = await context.getUser();
//     if (isOk(user.role, role)) {
//       return await func(args, context);
//     }
//     // else
//     // if (!roleList.includes(user.role))
//     //   throw Error(
//     //     `UserRole not matched. required:${roleList}, given:${user.role}`
//     //   );
//     // return await func(args, context);
//   };
// };

// /**
//  * 해당 이메일을 가진 유저가 로그인해있을 때, 로그아웃시킨다.
//  * @param {string} email
//  * @param {PassportContext} context 콘텍스트
//  * @returns {object}
//  */
// const logout = async (email, context) => {
//   const userFromDB = await user.getUser(email);
//   const userFromContext = context.getUser();
//   if (userFromDB) {
//     await context.req.session
//   }
//   return userFound;
// };

/**
 * 현재 세션의 유저를 로그아웃시킨다.
 * @param {string} email 이메일
 * @param {PassportContext} context 콘텍스트
 * @returns 로그아웃했던 유저 정보(Nullable)와 redirectLink를 ""로 설정한 객체
 */
const logoutMe = async (context) => {
  const user = context.getUser();
  context.logout();
  return user;
};

/**
 * 해당 콘텍스트에 유저를 로그인시킵니다.
 * 세션도 저장됩니다.
 * @param {string} email 이메일
 * @param {string} pwd 비밀번호
 * @param {PassportContext} context 콘텍스트
 * @returns 유저 정보와 리다이렉트할 링크
 */
const login = async (email, pwd, context) => {
  // 사용자 인증
  const { user } = await context.authenticate('graphql-local', {
    email,
    password: pwd,
  });
  // 로그인
  // console.log("calling context.login");
  await context.login(user);
  const redirectLink = context.req?.session?.redirectLink;
  // console.log("-- session in login --");
  // console.dir(context.req.session);
  // console.log(context.req.sessionID);

  // 본래 있던 redirectLink 삭제
  if (redirectLink) {
    delete context.req.session.redirectLink;
  }
  return { user, redirectLink };
};
// /**
//  *
//  * @param {string} email
//  * @param {connectMongo.MongoStore} sessionStore
//  */
// const removeAllSession = async (email, sessionStore) => {
//   sessionStore.
// }

/**
 *
 */
const isOwnerToFile = async (req, rawFilename) => {

};

module.exports = {
  login,
  logoutMe,
  isOwnerToFile,
  authmapLevel,
};
