import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '../views/client/Home.vue';
import Login from '../views/client/Login.vue';
import Me from '../views/client/Me.vue';
// import Logout from '../views/client/Logout.vue';

import Page from '../views/client/Page.vue';
import Admin from '../views/admin/Admin.vue';
import Pages from '../views/admin/Pages.vue';
import PageEdit from '../views/admin/PageEdit.vue';


import { graphql, checkAuthQuery, logoutMeQuery } from '../graphql-client';

Vue.use(VueRouter);

const requireAuth = async (from, to, next) => {
  const result = await graphql(checkAuthQuery, { redirectLink: document.location.href });
  if (result?.data?.checkAuth === 'LOGIN_REQUIRED') {
    next({ name: 'Login' });
  } else {
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
    component: Home,
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
    component: Login,
  },
  {
    path: '/me',
    name: 'Me',
    component: Me,
    beforeEnter: requireAuth,
  },
  {
    path: '/admin',
    name: 'Admin',
    component: Admin,
    children: [
      {
        path: '/admin/pages',
        component: Pages,
        name: 'Pages',
      },
      {
        path: '/admin/page/:id',
        component: PageEdit,
        name: 'PageEdit',
      },
    ],
  },
  {
    path: '/:permalink',
    name: 'Page',
    component: Page,
  },
];


const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;
