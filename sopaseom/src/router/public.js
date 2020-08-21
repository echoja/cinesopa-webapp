import {
  emailVerifyBeforeEnter,
  logoutBeforeEnter,
  onlyNoLoginBeforeEnter,
  requireAuth,
} from './nav-guard';

export default [
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
