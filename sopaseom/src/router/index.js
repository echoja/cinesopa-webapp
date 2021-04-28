import Vue from 'vue';

import VueRouter from 'vue-router';
import adminRoutes from './admin';
import publicRoutes from './public';
import { globalBeforeEach, myBeforeEnter } from './nav-guard';

Vue.use(VueRouter);

let routes = [];
routes.push({
  path: '/test',
  name: 'Test',
  component: () => import('../views/Test.vue'),
});
routes = routes.concat(adminRoutes);
routes = routes.concat(publicRoutes);
routes.push({
  path: '*',
  component: () => import('../views/client/404.vue'),
  beforeEnter(to, from, next) {
    next({ name: '404' });
  },
});

const routesFinal = routes;
// console.dir(routesFinal);
const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: routesFinal,
});

globalBeforeEach(router);

// makeRouterScrollToTopIfSamePage(router);

export default router;
