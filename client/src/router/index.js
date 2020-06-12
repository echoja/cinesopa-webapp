import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '../views/Home.vue';
import Login from '../views/Login.vue';
import Me from '../views/Me.vue';
import { graphql, checkAuthQuery } from '../graphql-client';

Vue.use(VueRouter);

const requireAuth = async (from, to, next) => {
  const result = await graphql(checkAuthQuery, { redirectLink: document.location.href });
  console.log(result);
  if (result?.data?.checkAuth === 'LOGIN_REQUIRED') {
    next({ name: 'Login' });
  } else {
    next();
  }
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
];


const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;
