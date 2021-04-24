// eslint-disable-next-line no-unused-vars
import VueRouter from 'vue-router';
import store from '../store';
// eslint-disable-next-line object-curly-newline
import {
  graphql,
  // checkAuthQuery,
  logoutMeQuery,
  emailVerifyMutation,
  checkAuth,
} from '../api/graphql-client';

export const logoutBeforeEnter = async (to, from, next) => {
  await graphql(logoutMeQuery, {});
  store.commit('setCurrentUser', { currentUser: null });
  next('/');
};

export const emailVerifyBeforeEnter = async (to, from, next) => {
  const { token } = to?.params;
  if (!token) {
    console.log('no token exist');
    next('/');
    return;
  }
  console.log('# emailVerifyBeforeEnter');
  console.log(token);
  const result = await graphql(emailVerifyMutation, { token });
  // const user = data.verifyUserEmail;

  console.log(result);
  next('/');
};
/**
 * 오직 로그인하지 않은 사람만 접근하도록 하는 router before 함수.
 */
export const onlyNoLoginBeforeEnter = async (to, from, next) => {
  if (!store.state.userInitialized) {
    await checkAuth();
  }
  // const result = await graphql(checkAuthQuery, { redirectLink: '', role: 'GUEST' });
  // console.log('## onlyNoLoginBeforeEnter');
  if (store.state.currentUser === null) {
    next();
  } else {
    store.dispatch('pushMessage', {
      msg: '이미 로그인되어 있습니다.',
      type: 'success',
      id: 'alreadyLogined',
    });
    next('/');
  }

  // console.dir(result.data);
  // const permissionStatus = result?.data?.checkAuth?.permissionStatus;
  // // console.log(`permissionStatus : ${permissionStatus}`);
  // if (permissionStatus === 'OK' || permissionStatus === undefined) {
  //   next('/');
  // } else {
  //   next();
  // }
};

// const requestCheckAuth = async (role, shouldVerified = false) => {
//   const redirectLink = document.location.href;
//   const res = await graphql(checkAuthQuery, { redirectLink, role, shouldVerified });
//   return res?.data?.checkAuth;
// };

// export const myBeforeEnter = async (to, from, next) => {
//   const result = await requestCheckAuth('GUEST');
//   console.log('# myBeofreEnter');
//   console.log(result);
//   console.log(to.fullPath);
//   // todo
//   next();
// };

/**
 * 현재 사용자의 role 을 기반으로, 해당 페이지가
 * 접근가능한지 아닌지 판단하는 router before 함수 입니다.
 * @param {string} role 사용자의 role
 * @param {string} shouldVerified 이메일이 인증되어야 하는지 여부를 체크
 * @param {string} failRN 만약 실패했을 때 이동할 route 이름 (RN = Route Name)
 */

const roleConditionMap = {
  admin: ['ADMIN'],
  onlyGuest: ['GUEST'],
  onlyNoLogin: ['ANYONE'],
  guest: ['GUEST', 'ADMIN'],
  anyone: ['GUEST', 'ADMIN', 'ANYONE'],
};

/**
 * @typedef {Object} RequireAuthCondition
 * @property {('admin'|'onlyGuest'|'onlyNoLogin'|'guest'|'anyone')} [role='anyone']
 * @property {boolean} [shouldVerified=false]
 * @property {boolean} [shouldNotVerified=false]
 * @property {boolean} [shouldAgreed=false]
 * @property {boolean} [shouldNotAgreed=false]
 */

/**
 *
 * @typedef {Object} RequireAuthFailRN
 * @property {string} [loginRequiredRN='Login']
 * @property {string} [noPermissionRN='401']
 * @property {string} [emailVerificationRequiredRN='ShouldVerify']
 * @property {string} [agreeRequiredRN='JoinOAuthUser']
 */

/**
 * 각 페이지에 대한 접근 권한을 설정해주는 before route 함수를 생성합니다.
 * @param {RequireAuthCondition} condition
 * @param {RequireAuthFailRN} failRN
 */

export const requireAuth = (condition = {}, failRN = {}) => async (to, from, next) => {
  console.log('# requireAuth Called');
  const {
    role = 'anyone',
    shouldVerified = false,
    shouldAgreed = false,
    shouldNotVerified = false,
  } = condition;
  const roleArray = roleConditionMap[role];
  if (!roleArray) {
    console.error('# nav-guard requireAuth : role을 찾을 수 없습니다!');
    return next();
  }
  // const result = await requestCheckAuth(role, shouldVerified);
  const {
    loginRequiredRN = 'Login',
    noPermissionRN = '401',
    emailVerificationRequiredRN = 'VerifyEmailRequired',
    agreeRequiredRN = 'JoinOAuthUser',
  } = failRN;

  let user;
  try {
    user = (await store.state.currentUserAsync) || store.state.currentUser;
    store.commit('setCurrentUserAsync', null);
  } catch (e) {
    console.log('# requireAuth no user');
  }
  const currentRole = user?.role ?? 'ANYONE';

  console.log('# requireAuth processing...');
  console.log(condition);
  console.log(to);
  console.log(failRN);

  // 일단 가장 먼저, 유저가 카카오로 로그인되어 있는 상태인데
  // user_agreed 가 없다면, 우선 약관 동의부터 시킴.
  // should agreed 무시.
  if (user && user.user_agreed === null) {
    store.commit('setRouteWhereAgreeSuccess', to);
    return next({ name: agreeRequiredRN });
  }

  // role 에 해당하지 않는다면,
  if (!roleArray.includes(currentRole)) {
    // 로그인한 상태라면 권한이 없음
    if (user) {
      return next({ name: noPermissionRN });
    }

    // 로그인을 안했다면 로그인이 필요함. 로그인하기 전 redirectRoute를 설정함.
    store.commit('setRouteWhereLoginSuccess', to);
    // console.log()
    store.dispatch('pushMessage', {
      msg: '로그인이 필요한 서비스입니다.',
      type: 'success',
      id: 'loginRequire',
    });
    return next({ name: loginRequiredRN });
  }

  // 이제 role 충족됨.
  // 만약 verified 가 아니라면
  const userVerified = user?.verified;
  if (shouldVerified && !userVerified) {
    return next({ name: emailVerificationRequiredRN });
  }

  // 이메일 인증이 이미 되어있는 사람들에게는 필요없는 페이지인데
  // 만약 접근했을 경우 그냥 홈으로 보냅니다.
  if (shouldNotVerified && userVerified) {
    return next({ name: 'Home' });
  }

  // 만약 약관 동의를 안했다면
  const userAgreed = user?.user_agreed?.privacy && user?.user_agreed?.policy;
  if (shouldAgreed && !userAgreed) {
    return next({ name: agreeRequiredRN });
  }

  // 모든 조건을 다 통과했다면 정상적으로 진행
  return next();

  // if (permissionStatus === 'LOGIN_REQUIRED') {
  //   next({ name: loginRequiredRN });
  // } else if (permissionStatus === 'NO_PERMISSION') {
  //   if (emailVerificationRequired) {
  //     next({ name: emailVerificationRequiredRN });
  //   } else {
  //     next({ name: noPermissionRN });
  //   }
  // } else {
  //   store.commit('setCurrentUser', {
  //     currentUser: user,
  //   });
  //   next();
  // }
};

// export const makeRouterScrollToTopIfSamePage = (router) => {
//   console.log('ho1!');
//   router.afterEach((to, from) => {
//     console.log('ho2!');
//     if (to.fullPath === from.fullPath) {
//       console.log('ho3!');
//       VueScrollTo.scrollTo('body', 300);
//     }
//   });
// };

/**
 * 해당 라우터에 대해 매번 checkAuth 를 실시합니다.
 * vue 앱이 최초로 로딩됐을 때만 진행합니다.
 * checkAuth 와 userInitialized state 를 이용합니다.
 * @param {VueRouter} router
 */

export const checkAuthFor = (router) => {
  router.beforeEach(async (to, from, next) => {
    // console.log(next.toString());
    if (!store.state.userInitialized) {
      store.commit('setUserInitialized', true);
      checkAuth();
    }
    next();
  });
};
