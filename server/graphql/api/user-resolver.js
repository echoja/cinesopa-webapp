require('../../typedef');

const _ = require('lodash');
const { getDateFromObj } = require('../../util');
const {
  db,
  user,
  auth,
  validator,
  ACCESS_ALL,
  ACCESS_ADMIN,
  ACCESS_AUTH,
  ACCESS_UNAUTH,
  makeResolver,
} = require('../../loader');
const { enumAuthmap } = require('../../db/schema/enum');

/**
 *
 * @param {PassportContext} context
 * @param {string} redirectLink
 */
const setRedirectLink = (context, redirectLink) => {
  // if (redirectLink !== undefined && redirectLink !== '') {
  // 클라이언트에서 곧바로 login 링크로 갔을 때, 이 코드가 실행되어야 클라이언트에도
  // 세션이 살아있을 수 있다.
  // 원인은 불명. 세션을 건드리면 그때서야 쿠키가 생성되어 클라이언트로
  // 전달되는 모양. 그래서 조건문이 처음에는 있었는데, 없앴다.
  // redirectLink가 설정되지 않은 상태라도 일단 session에 접근은 하도록.
  context.req.session.redirectLink = redirectLink;
  // }
};

/**
 *
 * @type {LoginResolver}
 * @callback LoginResolver
 * @param {{provider: {email: string, pwd: string}}} args
 * @returns {Promise<{userinfo: Userinfo, rediretLink: string}>}
 */
const login = makeResolver(async (obj, args, context, info) => {
  const {
    provider: { email, pwd },
  } = args;
  const loginResult = await auth.login(email, pwd, context);

  // 아직 인증된 상태가 아닐 경우
  if (loginResult.user && loginResult.user.verified !== true) {
    loginResult.emailVerificationRequired = true;
  }
  return loginResult;
}).only(ACCESS_UNAUTH);

// const logout = makeResolver(async (obj, args, context, info) => {
// 수정 필요
// }).only(ACCESS_ADMIN);

const logoutMe = makeResolver(async (obj, args, context, info) => {
  const currentUser = context.getUser();
  if (!currentUser) return null;

  await auth.logoutMe(context);
  return currentUser;
}).only(ACCESS_AUTH);

const checkAuth = makeResolver(async (obj, args, context, info) => {
  const { redirectLink, role, should_verified = false } = args;
  const contextUser = context.getUser();
  // const roleSymbol = enumAuthmap[role];
  const isOk = await validator.isOkContext(context, role, enumAuthmap);
  const result = {
    emailVerificationRequired: false,
  };

  // 무조건 isOk여야 하고, should_verified 일 경우 contextUser.verified 까지 충족해야 함.
  if (isOk) {
    if (
      !should_verified ||
      (should_verified && contextUser.verified === true)
    ) {
      console.log(
        `# checkAuth: USER ${contextUser.email} 님의 접근이 승인되었습니다.`,
      );
      return { permissionStatus: 'OK', user: contextUser };
    } else {
      result.emailVerificationRequired = true;
    }
  }

  // redirect 설정
  setRedirectLink(context, redirectLink);

  // 유저는 찾은 경우, NO_PERMISSION 리턴.
  if (contextUser) {
    console.log(
      `# checkAuth: USER ${contextUser.email} 님의 접근이 거부되었습니다.`,
    );
    result.permissionStatus = 'NO_PERMISSION';
    result.user = contextUser;
    return result;
  }
  const ip =
    context.req?.headers['x-forwarded-for'] ||
    context.req?.connection?.remoteAddress;
  console.log(`# checkAuth: ${ip} 의 접근이 거부되었습니다.`);
  return { permissionStatus: 'LOGIN_REQUIRED' };
}).only(ACCESS_ALL);

const createGuest = makeResolver(async (obj, args, context, info) => {
  const { email, pwd, debug } = args;
  await user.createGuest(email, pwd, debug);
  const loginResult = await auth.login(email, pwd, context);
}).only(ACCESS_ALL);

const verifyUserEmail = makeResolver(async (obj, args, context, info) => {
  const { token } = args;
  // console.log(`resolver-verifyUserEmail-token: ${token}`);
  return user.verifyEmail(token);
}).only(ACCESS_ALL);

const updateUserAdmin = makeResolver(async (obj, args, context, info) => {
  const { email, userinfo } = args;
  return db.updateUser(email, userinfo);
}).only(ACCESS_ADMIN);

const makePwdForKakaoUser = makeResolver(async (obj, args, context, info) => {
  const { pwd } = args;
  const found = context.getUser();
  if (!found || found.has_pwd) return null;
  return user.makePwdForKakaoUser(found.email, pwd);
}).only(ACCESS_AUTH);

const updateMe = makeResolver(async (obj, args, context, info) => {
  if (context.isUnauthenticated()) return null;
  const { email } = context.getUser();
  const { userinfo } = args;
  return db.updateUser(email, userinfo);
}).only(ACCESS_AUTH);

const users = makeResolver(async (obj, args, context, info) => {
  const { page, perpage } = args;
  return db.getUsers(page, perpage);
}).only(ACCESS_ADMIN);

// *** this is secure version!!***
const userResolver = makeResolver(async (obj, args, context, info) => {
  const { email } = args;
  return db.getUserByEmail(email);
}).only(ACCESS_ADMIN);

const currentUser = makeResolver(async (obj, args, context, info) => {
  if (context.isUnauthenticated()) return null;
  return context.getUser();
}).only(ACCESS_AUTH);

// const getUserByEmailNoAuth = makeResolver(async (obj, args, context, info) => {
//   const { email } = args;
//   return user.getUserByEmail(email, context);
// }).only(ACCESS_ALL);

const userExists = makeResolver(async (obj, args, context, info) => {
  const { email } = args;
  const user = await db.getUserByEmail(email);
  if (!user)
    return {
      email: false,
      kakao: false,
      pwd: false,
    };
  return {
    email: typeof user.email === 'string',
    kakao: typeof user.kakao_id === 'string',
    pwd: user.has_pwd === true,
  };
}).only(ACCESS_ALL);

const requestVerifyEmail = makeResolver(async (obj, args, context, info) => {
  const { debug } = args;
  const userFound = context.getUser();
  await user.startEmailVerifying(userFound.email, debug);
}).only(ACCESS_AUTH);

const requestChangePassword = makeResolver(async (obj, args, context, info) => {
  const { debug } = args;
  const contextUser = context.getUser();
  if (!contextUser)
    throw Error(
      'requestChangePassword resolver: 현재 유저를 찾을 수 없습니다.',
    );
  await user.requestChangePassword(contextUser.email, debug);
  return {
    success: true,
  };
}).only(ACCESS_AUTH);

// todo 나중에 productive 모드에서는 무조건 삭제해야 함.
const forceLogin = makeResolver(async (obj, args, context, info) => {
  const {email} = args;
  const found = await db.getUserByEmail(email);
  context.logout();
  context.login(found);
  return found;
}).only(ACCESS_ALL);

module.exports = {
  Query: {
    users,
    user: userResolver,
    currentUser,
    userExists,
    // getUserByEmailNoAuth,
    checkAuth,
    
  },
  Mutation: {
    login,
    logoutMe,
    createGuest,
    verifyUserEmail,
    updateUserAdmin,
    makePwdForKakaoUser,
    updateMe,
    requestVerifyEmail,
    requestChangePassword,
    forceLogin : process.env.NODE_ENV === 'production' ? () => null : forceLogin,
  },
};