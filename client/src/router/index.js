import Vue from 'vue';

import VueRouter from 'vue-router';
import store from '../store';


import { graphql, checkAuthQuery, logoutMeQuery } from '../graphql-client';


Vue.use(VueRouter);

const requireAuth = async (from, to, next) => {
  const result = await graphql(checkAuthQuery, { redirectLink: document.location.href });
  if (result?.data?.checkAuth?.isAllow === 'LOGIN_REQUIRED') {
    next({ name: 'Login' });
  } else {
    store.commit('setUser', {
      user: result?.data?.checkAuth?.user,
    });
    next();
  }
};

const logoutBeforeEnter = async (from, to, next) => {
  await graphql(logoutMeQuery, {});
  next('/');
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
    component: () => import(/* webpackChunkName: "about" */ '../views/client/About.vue'),
  },
  {
    path: '/logout',
    name: 'Logout',
    component: () => import('../views/client/Logout.vue'),
    beforeEnter: logoutBeforeEnter,
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/client/Login.vue'),
  },
  {
    path: '/me',
    name: 'Me',
    component: () => import('../views/client/Me.vue'),
    beforeEnter: requireAuth,
  },
  {
    path: '/admin',
    name: 'Admin',
    component: () => import('../views/admin/Admin.vue'),
    children: [
      {
        path: '/admin/pages',
        component: () => import('../views/admin/Pages.vue'),
        name: 'Pages',
      },
      {
        path: '/admin/page/:id',
        component: () => import('../views/admin/PageEdit.vue'),
        name: 'PageEdit',
      },
    ],
  },
  {
    path: '/:permalink',
    name: 'Page',
    component: () => import('../views/client/Page.vue'),
  },
];


const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;
