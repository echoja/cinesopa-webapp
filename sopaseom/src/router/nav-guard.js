import store from '../store';
// eslint-disable-next-line object-curly-newline
import { graphql, checkAuthQuery, logoutMeQuery, emailVerifyMutation } from '../api/graphql-client';

export const logoutBeforeEnter = async (to, from, next) => {
  await graphql(logoutMeQuery, {});
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
  const result = await graphql(checkAuthQuery, { redirectLink: '', role: 'GUEST' });
  console.log('## onlyNoLoginBeforeEnter');
  console.dir(result.data);
  const permissionStatus = result?.data?.checkAuth?.permissionStatus;
  // console.log(`permissionStatus : ${permissionStatus}`);
  if (permissionStatus === 'OK' || permissionStatus === undefined) {
    next('/');
  } else {
    next();
  }
};

const requestCheckAuth = async (role, shouldVerified = false) => {
  const redirectLink = document.location.href;
  const res = await graphql(checkAuthQuery, { redirectLink, role, shouldVerified });
  return res?.data?.checkAuth;
};

export const myBeforeEnter = async (to, from, next) => {
  const result = await requestCheckAuth('GUEST');
  console.log('# myBeofreEnter');
  console.log(result);
  console.log(to.fullPath);
  // tooo
  next();
};

/**
 * 현재 사용자의 role 을 기반으로, 해당 페이지가
 * 접근가능한지 아닌지 판단하는 router before 함수 입니다.
 * @param {string} role 사용자의 role
 * @param {string} shouldVerified 이메일이 인증되어야 하는지 여부를 체크
 * @param {string} failRN 만약 실패했을 때 이동할 route 이름 (RN = Route Name)
 */
export const requireAuth = (role, shouldVerified, failRN = {}) => async (to, from, next) => {
  const result = await requestCheckAuth(role, shouldVerified);
  const {
    loginRequiredRN = 'Login',
    noPermissionRN = '401',
    emailVerificationRequiredRN = 'ShouldVerify',
  } = failRN;
  const { permissionStatus, user, emailVerificationRequired } = result;
  // console.log('## requireAuth');
  // console.dir(result);
  if (permissionStatus === 'LOGIN_REQUIRED') {
    next({ name: loginRequiredRN });
  } else if (permissionStatus === 'NO_PERMISSION') {
    if (emailVerificationRequired) {
      next({ name: emailVerificationRequiredRN });
    } else {
      next({ name: noPermissionRN });
    }
  } else {
    store.commit('setUser', {
      user,
    });
    next();
  }
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
