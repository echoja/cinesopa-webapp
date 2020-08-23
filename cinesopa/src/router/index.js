import Vue from 'vue';

import VueRouter from 'vue-router';

// import { graphql, logoutMeQuery } from '../graphql-client';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/Home.vue'),
  },
  {
    path: '/about',
    name: 'About',
    component: () => import('../views/About.vue'),
  },
  {
    path: '/film',
    name: 'FilmList',
    component: () => import('../views/FilmList.vue'),
  },
  {
    path: '/film/:id',
    name: 'IndividualFilm',
    component: () => import('../views/Film.vue'),
  },
  {
    path: '/board/:permalink',
    name: 'Board',
    component: () => import('../views/Board.vue'),
  },
  {
    path: '/post/:id',
    name: 'Post',
    component: () => import('../views/Post.vue'),
  },
  {
    path: '/request/distribution',
    name: 'Distribution',
    component: () => import('../views/Distribution.vue'),
  },
  {
    path: '/request/community',
    name: 'Community',
    component: () => import('../views/Community.vue'),
  },
  {
    path: '/sitemap',
    name: 'Sitemap',
    component: () => import('../views/Sitemap.vue'),
  },
  {
    path: '/:permalink',
    name: 'Page',
    component: () => import('../views/Page.vue'),
  },
  {
    path: '/404',
    name: '404',
    component: () => import('../views/404.vue'),
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;
