import Vue from 'vue';

import VueRouter from 'vue-router';
import adminRoutes from './admin';
import publicRoutes from './public';
// import { makeRouterScrollToTopIfSamePage } from './nav-guard';

Vue.use(VueRouter);

let routes = [];
routes.push({
  path: '/test',
  name: 'Test',
  component: () => import('../views/Test.vue'),
});
routes = routes.concat(adminRoutes);
routes = routes.concat(publicRoutes);

const routesFinal = routes;
// console.dir(routesFinal);
const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: routesFinal,
});

// makeRouterScrollToTopIfSamePage(router);

export default router;
