import Vue from 'vue';

import VueRouter from 'vue-router';
import store from '../store';

import {
  graphql, checkAuthQuery, logoutMeQuery, emailVerifyMutation,
} from '../graphql-client';
// import LayoutClient from '@/views/layout/LayoutClient.vue';

Vue.use(VueRouter);

const requireAuth = (role) => async (to, from, next) => {
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

const logoutBeforeEnter = async (to, from, next) => {
  await graphql(logoutMeQuery, {});
  next('/');
};

const emailVerifyBeforeEnter = async (to, from, next) => {
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

const onlyNoLoginBeforeEnter = async (to, from, next) => {
  const result = await graphql(checkAuthQuery, { redirectLink: '', role: 'GUEST' });
  const permissionStatus = result?.data?.checkAuth?.permissionStatus;
  if (permissionStatus === 'OK' || permissionStatus === undefined) {
    next('/');
  } else {
    next();
  }
};

/**
 * 어드민 전용 라우트 객체를 생성합니다.
 * @param {string} path 라우팅할 경로
 * @param {string} name 라우트 이름
 * @param {string} componentPath 실제 컴포넌트 이름
 */
const adminRoute = (path, name) => ({
  path,
  name,
  beforeEnter: requireAuth('ADMIN'),
  meta: {
    layout: () => import('@/views/layout/LayoutAdmin.vue'),
  },
});

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/client/Home.vue'),
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '@/views/client/About.vue'),
  },
  {
    path: '/logout',
    name: 'Logout',
    component: () => import('@/views/client/Logout.vue'),
    beforeEnter: logoutBeforeEnter,
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/client/Login.vue'),
    beforeEnter: onlyNoLoginBeforeEnter,
  },
  {
    path: '/join',
    name: 'CreateAccount',
    component: () => import('@/views/client/CreateAccount.vue'),
    beforeEnter: onlyNoLoginBeforeEnter,
  },
  {
    path: '/join/needVerification',
    name: 'CreateAccountNeedVerification',
    component: () => import('@/views/client/CreateAccountNeedVerification.vue'),
    beforeEnter: onlyNoLoginBeforeEnter,
  },
  {
    path: '/email_verify/:token',
    name: 'EmailVerify',
    component: () => import('@/views/client/About.vue'),
    beforeEnter: emailVerifyBeforeEnter,
  },
  {
    path: '/me',
    name: 'Me',
    component: () => import('@/views/client/Me.vue'),
    beforeEnter: requireAuth('GUEST'),
  },
  {
    ...adminRoute('/admin', 'Admin'),
    component: () => import('@/views/admin/Admin.vue'),
  },
  adminRoute('/admin', 'Admin', '@/views/admin/Admin.vue'),
  // adminRoute('/admin/page', 'AdminPage', '@/views/admin/Pages.vue'),
  adminRoute('/admin/Page/new', 'AdminPageNew', '@/views/admin/PageNew.vue'),
  adminRoute('/admin/Page/:id', 'AdminPageEdit', '@/views/admin/PageEdit.vue'),
  {
    path: '/admin/page',
    component: () => import('@/views/admin/Pages.vue'),
    name: 'Page',
    meta: {
      layout: () => import('@/views/layout/LayoutAdmin.vue'),
    },
  },
  // {
  //   path: '/admin/page/new',
  //   component: () => import('@/views/admin/PageNew.vue'),
  //   name: 'PageNew',
  //   meta: {
  //     layout: () => import('@/views/layout/LayoutAdmin.vue'),
  //   },
  // },
  // {
  //   path: '/admin/page/:id',
  //   component: () => import('@/views/admin/PageEdit.vue'),
  //   name: 'PageEdit',
  //   meta: {
  //     layout: () => import('@/views/layout/LayoutAdmin.vue'),
  //   },
  // },
  {
    path: '/:permalink',
    name: 'Page',
    component: () => import('@/views/client/Page.vue'),
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;
