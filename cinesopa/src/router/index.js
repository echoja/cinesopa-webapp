import Vue from 'vue';

import VueRouter from 'vue-router';
import { getPageQuery, graphql } from '../graphql-client';

// import { graphql, logoutMeQuery } from '../graphql-client';

Vue.use(VueRouter);

const noPageOneBeforeEnter = (routeName) => (to, from, next) => {
  if (to.params.page === '1') {
    next({ name: routeName });
  } else {
    next();
  }
};

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
    path: '/film-board/:type/:page?',
    name: 'FilmList',
    component: () => import('../views/FilmList.vue'),
    props: true,
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
    path: '/board',
    name: 'Board',
    component: () => import('../views/BoardWrapper.vue'),
    beforeEnter: (to, from, next) => {
      // if (/\/board\/?/.test(to.fullPath)) {
      //   next({ name: '404' });
      // } else {
      //   next();
      // }
      next();
    },
    children: [
      {
        path: 'notice/:board/:page?',
        name: 'BoardNotice',
        component: () => import('../views/Board.vue'),
        props: {
          title: '공지사항',
          boardPermalinks: ['press', 'cooperative'],
          viewType: 'list',
          perpage: 7,
        },
        beforeEnter: noPageOneBeforeEnter('BoardNotice'),
      },
      {
        path: 'archive/:board/:page?',
        name: 'BoardArchive',
        component: () => import('../views/Board.vue'),
        props: {
          title: '아카이브',
          boardPermalinks: ['community', 'study', 'archive-etc'],
          viewType: 'gallery',
          perpage: 6,
        },
        beforeEnter: noPageOneBeforeEnter('BoardArchive'),
      },
      {
        path: ':notFound',
        name: 'BoardNotFound',
        component: () => import('../views/Board.vue'),
        beforeEnter: (to, from, next) => {
          // console.log(to);
          next({ name: '404' });
        },
      },
    ],
  },
  {
    path: '/post/:id',
    name: 'Post',
    component: () => import('../views/Post.vue'),
    props: true,
  },
  {
    path: '/request',
    name: 'Request',
    component: () => import('../views/Request.vue'),
    children: [
      {
        path: 'distribution',
        name: 'Distribution',
        component: () => import('../views/Distribution.vue'),
      },
      {
        path: 'community',
        name: 'Community',
        component: () => import('../views/Community.vue'),
      },
    ],
  },
  {
    path: '/request/success',
    name: 'SuccessRequest',
    component: () => import('../views/SuccessRequest.vue'),
  },

  {
    path: '/sitemap',
    name: 'Sitemap',
    component: () => import('../views/Sitemap.vue'),
    meta: {
      title: '사이트맵',
    },
  },
  {
    path: '/email-refuse',
    name: 'EmailRefuse',
    component: () => import('../views/EmailRefuse.vue'),
    meta: {
      title: '이메일무단수집거부',
    },
  },
  // {
  //   path: '/test',
  //   name: 'Test',
  //   component: () => import('../views/Test.vue'),
  // },
  {
    path: '/:permalink',
    name: 'Page',
    component: () => import('../views/Page.vue'),
    async beforeEnter(to, from, next) {
      // console.log(to.params);
      const { permalink } = to.params;
      const res = await graphql(getPageQuery, { permalink, belongs_to: 'cinesopa' });
      if (res?.data?.page === null) {
        next({ name: '404' });
      } else {
        next();
      }
    },
  },
  {
    path: '/404',
    name: '404',
    component: () => import('../views/404.vue'),
    meta: {
      title: '404',
    },
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

// const DEFAULT_TITLE = '영화배급협동조합 씨네소파';
// router.afterEach((to, from) => {
//   // Use next tick to handle router history correctly
//   // see: https://github.com/vuejs/vue-router/issues/914#issuecomment-384477609
//   Vue.nextTick(() => {
//     const { title } = to.meta;
//     if (title) document.title = `${title} - ${DEFAULT_TITLE}`;
//     else document.title = DEFAULT_TITLE;
//     // document.title = to.meta.title || DEFAULT_TITLE;
//   });
// });

// router.afterEach((to, from, next) => {
//   window.scrollTo({
//     behavior: 'auto',
//     left: 0,
//     top: 0,
//   });
//   next();
// });

export default router;
