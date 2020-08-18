import store from '../store';

import {
  graphql, checkAuthQuery,
} from '../graphql-client';

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

/**
 * 어드민 전용 라우트 객체를 생성합니다.
 * @param {string} path 라우팅할 경로
 * @param {string} name 라우트 이름
 * @param {string} componentPath 실제 컴포넌트 이름
 */
export const adminRoute = (path, name) => ({
  path,
  name,
  beforeEnter: requireAuth('ADMIN'),
  meta: {
    layout: () => import('@/views/layout/LayoutAdmin.vue'),
  },
});
