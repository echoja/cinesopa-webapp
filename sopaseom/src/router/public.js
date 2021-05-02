import BodyFixedFooter from '@/views/layout/BodyFixedFooter.vue';
import BodyFooter from '@/views/layout/BodyFooter.vue';
import BodyNoFooter from '@/views/layout/BodyNoFooter.vue';

import {
  // emailVerifyBeforeEnter,
  logoutBeforeEnter,
  onlyNoLoginBeforeEnter,
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
    path: '/advertisement',
    name: 'Advertisement',
    component: () => import('@/views/client/Page.vue'),
    props: {
      permalink: 'advertisement',
    },
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
    name: 'Sitemap',
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
    // beforeEnter: myBeforeEnter,
    beforeEnter(to, from, next) {
      console.log(from);
      if (from.name === 'MyInfo') {
        // console.log('hohofsdofhd');
        return next(false);
      }
      if (to.fullPath === '/my') {
        return next({ name: 'MyInfo' });
      }
      return next();
    },
    meta: { ...BodyFixedFooterMeta },
    children: [
      {
        path: 'info',
        name: 'MyInfo',
        component: () => import('@/views/client/MyInfo.vue'),
        beforeEnter: requireAuth({ role: 'guest' }),
        meta: { ...BodyFixedFooterMeta },
      },
      {
        path: 'ordered/:page?',
        name: 'MyOrdered',
        component: () => import('@/views/client/MyOrdered.vue'),
        beforeEnter: requireAuth({ role: 'guest' }),
        meta: { ...BodyFixedFooterMeta },
      },
      {
        path: 'application',
        name: 'MyApplication',
        component: () => import('@/views/client/MyApplication.vue'),
        beforeEnter: requireAuth({ role: 'guest' }),
        meta: { ...BodyFixedFooterMeta },
      },
      {
        path: '*',
        name: 'MyRedirection',
        component: () => import('@/views/client/MyApplication.vue'),
        beforeEnter(to, from, next) {
          next({ name: 'MyInfo' });
        },
      },
    ],
  },
  {
    path: '/order',
    name: 'Order',
    component: () => import('@/views/client/Order.vue'),
    meta: { ...BodyFixedFooterMeta },
    children: [
      {
        path: 'cart',
        name: 'Cart',
        component: () => import('@/views/client/OrderCart.vue'),
        beforeEnter: requireAuth({ role: 'guest' }),
        meta: { ...BodyFixedFooterMeta },
      },
      {
        path: 'payment/:ids',
        name: 'Payment',
        component: () => import('@/views/client/OrderPayment.vue'),
        beforeEnter: requireAuth({ role: 'guest', shouldVerified: 'true' }),
        meta: { ...BodyFixedFooterMeta },
      },
      {
        path: 'success',
        name: 'PaymentSuccess',
        component: () => import('@/views/client/OrderSuccess.vue'),
        beforeEnter: requireAuth({ role: 'guest', shouldVerified: 'true' }),
        meta: { ...BodyFixedFooterMeta },
      },
      {
        path: 'success-nobank',
        name: 'PaymentSuccessNoBank',
        component: () => import('@/views/client/OrderSuccessNoBank.vue'),
        beforeEnter: requireAuth({ role: 'guest', shouldVerified: 'true' }),
        meta: { ...BodyFixedFooterMeta },
      },
      {
        path: 'fail/:reason?',
        name: 'PaymentFail',
        component: () => import('@/views/client/OrderFail.vue'),
        beforeEnter: requireAuth({ role: 'guest', shouldVerified: 'true' }),
        meta: { ...BodyFixedFooterMeta },
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
      // console.log("public.js Join beforeEnter");
      // console.log(to.fullPath);
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
        meta: BodyFixedFooterMeta,
      },
    ],
  },
  {
    path: '/join/only-agreement',
    name: 'JoinOAuthUser',
    component: () => import('@/views/client/JoinOAuthUser.vue'),
    meta: BodyFooterMeta,
  },
  {
    path: '/verify-email-required',
    name: 'VerifyEmailRequired',
    component: () => import('@/views/client/VerifyEmailRequired.vue'),
    beforeEnter: requireAuth({ role: 'guest', shouldNotVerified: true }),
  },
  {
    path: '/verify-email',
    name: 'VerifyEmail',
    component: () => import('@/views/client/VerifyEmail.vue'),
    beforeEnter: requireAuth({ role: 'guest', shouldNotVerified: true }),
  },
  {
    path: '/continuous-fail',
    name: 'ContinuousFail',
    component: () => import('@/views/client/ContinuousFail.vue'),
  },
  {
    path: '/change-password',
    name: 'ChangePassword',
    component: () => import('@/views/client/ChangePassword.vue'),
    children: [
      {
        path: 'request',
        name: 'ChangePasswordRequest',
        component: () => import('@/views/client/ChangePasswordRequest.vue'),
      },
      {
        path: 'auth',
        name: 'ChangePasswordAuth',
        component: () => import('@/views/client/ChangePasswordAuth.vue'),
      },
      {
        path: 'success',
        name: 'ChangePasswordSuccess',
        component: () => import('@/views/client/ChangePasswordSuccess.vue'),
      },
      {
        path: 'expired',
        name: 'ChangePasswordExpired',
        component: () => import('@/views/client/ChangePasswordExpired.vue'),
      },
    ],
  },
  {
    path: '/request-tax-info',
    name: 'RequestTaxInfo',
    component: () => import('@/views/client/RequestTaxInfo.vue'),
    meta: {
      layout: () => import('@/views/layout/LayoutPlain.vue'),
    },
  },
  {
    path: '/request-tax-info-gate',
    name: 'RequestTaxInfoGate',
    component: () => import('@/views/client/RequestTaxInfoGate.vue'),
    meta: {
      layout: () => import('@/views/layout/LayoutPlain.vue'),
    },
  },
  {
    path: '/policy',
    name: 'Policy',
    component: () => import('@/views/client/Policy.vue'),
  },
  {
    path: '/privacy',
    name: 'Privacy',
    component: () => import('@/views/client/Privacy.vue'),
  },
  // {
  //   path: '/:permalink',
  //   name: 'Page',
  //   component: () => import('@/views/client/Page.vue'),
  // },
];
