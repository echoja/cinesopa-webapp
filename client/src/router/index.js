import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '../views/Home.vue';
import Login from '../views/Login.vue';
import Me from '../views/Me.vue';
import Logout from '../views/Logout.vue';
import Admin from '../views/Admin.vue';
import PageEdit from '../views/PageEdit.vue';
import Page from '../views/Page.vue';
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
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue'),
  },
  {
    path: '/logout',
    name: 'Logout',
    component: Logout,
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
        path: '/admin/page',
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
