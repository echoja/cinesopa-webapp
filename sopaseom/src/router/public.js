import BodyFixedFooter from '@/views/layout/BodyFixedFooter.vue';
import BodyFooter from '@/views/layout/BodyFooter.vue';
import BodyNoFooter from '@/views/layout/BodyNoFooter.vue';

import {
  // emailVerifyBeforeEnter,
  logoutBeforeEnter,
  onlyNoLoginBeforeEnter,
  myBeforeEnter,
  requireAuth,
} from './nav-guard';

const BodyFixedFooterMeta = {
  footerStyle: BodyFixedFooter,
};
const BodyFooterMeta = {
  footerStyle: BodyFooter,
};
const BodyNoFooterMeta = {
  footerStyle: BodyNoFooter,
};

export default [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/client/Home.vue'),
    meta: {
      ...BodyNoFooterMeta,
    },
  },
  {
    path: '/logout',
    name: 'Logout',
    component: () => import('@/views/client/Blank.vue'),
    beforeEnter: logoutBeforeEnter,
  },
  {
    path: '/sopakit/items/:page?',
    name: 'SopakitItems',
    component: () => import('@/views/client/SopakitItems.vue'),
    meta: BodyFixedFooterMeta,
  },
  {
    path: '/sopakit/search/:str/:page?',
    name: 'SopakitSearch',
    component: () => import('@/views/client/SopakitSearch.vue'),
  },
  {
    path: '/sopakit/:id',
    name: 'SopakitDetail',
    component: () => import('@/views/client/SopakitDetail.vue'),
    meta: BodyFooterMeta,
  },
  {
    path: '/sopakit',
    name: 'Sopakit',
    component: () => import('@/views/client/Blank.vue'),
    beforeEnter: (to, from, next) => {
      next({ name: 'SopakitItems' });
    },
  },
  {
    path: '/sopameet',
    name: 'Sopameet',
    component: () => import('@/views/client/Sopameet.vue'),
  },
  {
    path: '/product/sopakit/:page?',
    name: 'SopakitAllItems',
    component: () => import('@/views/client/ProductItems.vue'),
    props: {
      productType: 'sopakit',
    },
  },
  {
    path: '/product/:page?',
    name: 'AllItems',
    component: () => import('@/views/client/ProductItems.vue'),
  },
  {
    path: '/privacy',
    name: 'Privacy',
    component: () => import('@/views/client/Privacy.vue'),
  },
  {
    path: '/policy',
    name: 'Policy',
    component: () => import('@/views/client/Policy.vue'),
  },
  {
    path: '/404',
    name: '404',
    component: () => import('@/views/client/404.vue'),
  },
  {
    path: '/401',
    name: '401',
    component: () => import('@/views/client/401.vue'),
  },
  {
    path: '/sitemap',
    name: 'sitemap',
    component: () => import('@/views/client/Sitemap.vue'),
  },
  {
    path: '/email-refuse',
    name: 'EmailRefuse',
    component: () => import('@/views/client/EmailRefuse.vue'),
  },
  {
    path: '/application',
    name: 'Application',
    component: () => import('@/views/client/Application.vue'),
  },
  {
    path: '/my',
    name: 'My',
    component: () => import('@/views/client/My.vue'),
    beforeEnter: myBeforeEnter,
    children: [
      {
        path: 'info',
        name: 'MyInfo',
        component: () => import('@/views/client/MyInfo.vue'),
      },
      {
        path: 'ordered',
        name: 'MyOrdered',
        component: () => import('@/views/client/MyOrdered.vue'),
      },
      {
        path: 'application',
        name: 'MyApplication',
        component: () => import('@/views/client/MyApplication.vue'),
      },
    ],
  },
  {
    path: '/order',
    name: 'Order',
    component: () => import('@/views/client/Order.vue'),
    children: [
      {
        path: 'cart',
        name: 'Cart',
        component: () => import('@/views/client/OrderCart.vue'),
        beforeEnter: requireAuth('GUEST'),
      },
      {
        path: 'payment',
        name: 'Payment',
        component: () => import('@/views/client/OrderPayment.vue'),
        beforeEnter: requireAuth('GUEST', true),
      },
      {
        path: 'success',
        name: 'PaymentSuccess',
        component: () => import('@/views/client/OrderSuccess.vue'),
        beforeEnter: requireAuth('GUEST', true),
      },
      {
        path: 'fail',
        name: 'PaymentFail',
        component: () => import('@/views/client/OrderFail.vue'),
        beforeEnter: requireAuth('GUEST', true),
      },
    ],
  },

  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/client/Login.vue'),
    // todo onlyNoLoginBeforeEnter 손댈 필요가 있음.
    beforeEnter: onlyNoLoginBeforeEnter,
  },
  {
    path: '/join',
    name: 'Join',
    component: () => import('@/views/client/Join.vue'),
    beforeEnter: (to, from, next) => {
      console.log(to.fullPath);
      if (to.fullPath === '/join') {
        next({ name: 'JoinPolicy' });
      } else {
        next();
      }
    },
    meta: BodyFixedFooterMeta,
    children: [
      {
        path: 'policy',
        name: 'JoinPolicy',
        component: () => import('@/views/client/JoinPolicy.vue'),
        beforeEnter: onlyNoLoginBeforeEnter,
        meta: BodyFixedFooterMeta,
      },
      {
        path: 'info',
        name: 'JoinInfo',
        component: () => import('@/views/client/JoinInfo.vue'),
        beforeEnter: onlyNoLoginBeforeEnter,
        meta: BodyFixedFooterMeta,
      },
      {
        path: 'success',
        name: 'JoinSuccess',
        component: () => import('@/views/client/JoinSuccess.vue'),
        // beforeEnter: onlyNoLoginBeforeEnter,
        meta: BodyFixedFooterMeta,
      },
    ],
  },
  {
    path: '/should-verify',
    name: 'ShouldVerify',
    component: () => import('@/views/client/ShouldVerify.vue'),
    beforeEnter: onlyNoLoginBeforeEnter,
  },
  {
    path: '/verify-email',
    name: 'VerifyEmail',
    component: () => import('@/views/client/VerifyEmail.vue'),
    children: [
      {
        path: 'auth',
        name: 'VerifyEmailAuth',
        component: () => import('@/views/client/VerifyEmailAuth.vue'),
      },
      {
        path: 'success',
        name: 'VerifyEmailSuccess',
        component: () => import('@/views/client/VerifyEmailSuccess.vue'),
      },
      {
        path: 'expired',
        name: 'VerifyEmailExpired',
        component: () => import('@/views/client/VerifyEmailExpired.vue'),
      },
    ],
  },
  {
    path: '/continuous-fail',
    name: 'ContinuousFail',
    component: () => import('@/views/client/ContinuousFail.vue'),
  },
  {
    path: '/change-password',
    name: 'ChangdPassword',
    component: () => import('@/views/client/ChangdPassword.vue'),
    children: [
      {
        path: 'auth',
        name: 'ChangdPasswordAuth',
        component: () => import('@/views/client/ChangdPasswordAuth.vue'),
      },
      {
        path: 'success',
        name: 'ChangdPasswordSuccess',
        component: () => import('@/views/client/ChangdPasswordSuccess.vue'),
      },
      {
        path: 'expired',
        name: 'ChangdPasswordExpired',
        component: () => import('@/views/client/ChangdPasswordExpired.vue'),
      },
    ],
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
