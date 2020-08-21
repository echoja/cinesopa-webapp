import Vue from 'vue';

import VueRouter from 'vue-router';
import admin from './admin';

import { requireAuth } from './tool';
import {
  graphql, checkAuthQuery, logoutMeQuery, emailVerifyMutation,
} from '../graphql-client';
// import LayoutClient from '@/views/layout/LayoutClient.vue';

Vue.use(VueRouter);

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
  console.log(`permissionStatus : ${permissionStatus}`);
  if (permissionStatus === 'OK' || permissionStatus === undefined) {
    next('/');
  } else {
    next();
  }
};

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

const routesFinal = admin.concat(routes);
console.dir(routesFinal);
const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: routesFinal,
});

export default router;
