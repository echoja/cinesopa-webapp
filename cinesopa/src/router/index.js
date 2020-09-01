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
    // children: [
    //   { path: '', component: import('../components/film/Default.vue'), name: 'some-route' },
    //   { path: 'foo', component: import('../components/film/Default.vue') },
    //   { path: 'bar', component: import('../components/film/Default.vue') },
    // ],
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
    path: '/request',
    name: 'Request',
    component: () => import('../views/Request.vue'),
    children: [
      {
        path: '/distribution',
        name: 'Distribution',
        component: () => import('../views/Distribution.vue'),
      },
      {
        path: '/community',
        name: 'Community',
        component: () => import('../views/Community.vue'),
      },
    ],
  },

  {
    path: '/sitemap',
    name: 'Sitemap',
    component: () => import('../views/Sitemap.vue'),
  },
  {
    path: '/test',
    name: 'Test',
    component: () => import('../views/Test.vue'),
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

// router.afterEach((to, from, next) => {
//   window.scrollTo({
//     behavior: 'auto',
//     left: 0,
//     top: 0,
//   });
//   next();
// });

export default router;
