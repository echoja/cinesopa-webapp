import store from '../store';

import {
  graphql, checkAuthQuery, logoutMeQuery, emailVerifyMutation,
} from '../api/graphql-client';

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
  console.log(token);
  const result = await graphql(emailVerifyMutation, { token });
  // const user = data.verifyUserEmail;

  console.log(result);
  next('/');
};

export const onlyNoLoginBeforeEnter = async (to, from, next) => {
  const result = await graphql(checkAuthQuery, { redirectLink: '', role: 'GUEST' });
  const permissionStatus = result?.data?.checkAuth?.permissionStatus;
  console.log(`permissionStatus : ${permissionStatus}`);
  if (permissionStatus === 'OK' || permissionStatus === undefined) {
    next('/');
  } else {
    next();
  }
};

/**
 * 현재 사용자의 role 을 기반으로, 해당 페이지가
 * 접근가능한지 아닌지 판단하는 router before 함수 입니다.
 * @param {string} role 사용자의 role
 */
export const requireAuth = (role) => async (to, from, next) => {
  const redirectLink = document.location.href;
  const result = await graphql(checkAuthQuery, { redirectLink, role });
  const permissionStatus = result?.data?.checkAuth?.permissionStatus;
  console.log(permissionStatus);
  console.log(result);
  if (permissionStatus === 'LOGIN_REQUIRED') {
    next({ name: 'Login' });
  } else if (permissionStatus === 'NO_PERMISSION') {
    next({ name: 'NoPermission' }); // make view required
  } else {
    store.commit('setUser', {
      user: result?.data?.checkAuth?.user,
    });
    next();
  }
};
