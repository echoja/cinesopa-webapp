import { adminRoute } from './tool';

export default [
  /** common */
  {
    ...adminRoute('/admin/statistics', 'Statistics'),
    component: () => import('@/views/admin/Statistics.vue'),
  },
  {
    ...adminRoute('/admin', 'Admin'),
    component: () => import('@/views/admin/Admin.vue'),
  },

  /** cinesopa - board, post */
  {
    ...adminRoute('/admin/cinesopa/board', 'Board'),
    component: () => import('@/views/admin/Board.vue'),
    props: { belongs_to: 'cinesopa' },
  },
  {
    ...adminRoute('/admin/cinesopa/post', 'AdminPost'),
    component: () => import('@/views/admin/Post.vue'),
  },
  {
    ...adminRoute('/admin/cinesopa/post/new', 'PostNew'),
    component: () => import('@/views/admin/PostEdit.vue'),
    props: { mode: 'new', belongs_to: 'cinesopa' },
  },
  {
    ...adminRoute('/admin/post/:id', 'PostEdit'),
    component: () => import('@/views/admin/PostEdit.vue'),
  },

  /** cinesopa - film */
  {
    ...adminRoute('/admin/cinesopa/film', 'AdminFilm'),
    component: () => import('@/views/admin/Film.vue'),
    props: { belongs_to: 'cinesopa' },
  },
  {
    ...adminRoute('/admin/cinesopa/film/new', 'FilmNew'),
    component: () => import('@/views/admin/FilmEdit.vue'),
    props: { mode: 'new', belongs_to: 'cinesopa' },
  },
  {
    ...adminRoute('/admin/cinesopa/film/:id', 'FilmEdit'),
    component: () => import('@/views/admin/FilmEdit.vue'),
    props: { belongs_to: 'cinesopa' },
  },

  /** sopaseom - user */
  {
    ...adminRoute('/admin/sopaseom/user', 'AdminUser'),
    component: () => import('@/views/admin/User.vue'),
  },
  {
    ...adminRoute('/admin/sopaseom/user/:email', 'AdminUserEdit'),
    component: () => import('@/views/admin/UserEdit.vue'),
  },

  /** sopaseom - product and application */
  {
    ...adminRoute('/admin/sopaseom/product', 'AdminProduct'),
    component: () => import('@/views/admin/Product.vue'),
  },
  {
    ...adminRoute('/admin/sopaseom/product/:id', 'AdminProductEdit'),
    component: () => import('@/views/admin/ProductEdit.vue'),
  },
  {
    ...adminRoute('/admin/sopaseom/application', 'AdminApplication'),
    component: () => import('@/views/admin/Application.vue'),
  },
  {
    ...adminRoute('/admin/sopaseom/application/:id', 'AdminApplicationEdit'),
    component: () => import('@/views/admin/ApplicationEdit.vue'),
  },


  /** design */
  {
    ...adminRoute('/admin/cinesopa/design', 'DesignCinesopa'),
    component: () => import('@/views/admin/Design.vue'),
    props: { belongs_to: 'cinesopa' },
  },
  {
    ...adminRoute('/admin/sopaseom/design', 'DesignSopaseom'),
    component: () => import('@/views/admin/Design.vue'),
    props: { belongs_to: 'sopaseom' },
  },


  /** page */
  {
    ...adminRoute('/admin/cinesopa/page', 'CinesopaPages'),
    component: () => import('@/views/admin/Page.vue'),
    props: { belongs_to: 'cinesopa' },
  },
  {
    ...adminRoute('/admin/cinesopa/page/new', 'CinesopaNewPage'),
    component: () => import('@/views/admin/PageEdit.vue'),
    props: { mode: 'new', belongs_to: 'cinesopa' },
  },
  {
    ...adminRoute('/admin/sopaseom/page', 'SopaseomPages'),
    component: () => import('@/views/admin/Page.vue'),
    props: { belongs_to: 'sopaseom' },
  },
  {
    ...adminRoute('/admin/sopaseom/page/new', 'SopaseomNewPage'),
    component: () => import('@/views/admin/PageEdit.vue'),
    props: { mode: 'new', belongs_to: 'sopaseom' },
  },
  {
    ...adminRoute('/admin/:belongs_to/page/:id', 'PageEdit'),
    component: () => import('@/views/admin/PageEdit.vue'),
    props: true,
  },


  /** site */
  {
    ...adminRoute('/admin/cinesopa/site', 'SiteCinesopa'),
    component: () => import('@/views/admin/Site.vue'),
    props: { belongs_to: 'cinesopa' },
  },
  {
    ...adminRoute('/admin/sopaseom/site', 'SiteSopaseom'),
    component: () => import('@/views/admin/Site.vue'),
    props: { belongs_to: 'sopaseom' },
  },

  /** menu */

  {
    ...adminRoute('/admin/cinesopa/menu', 'MenuCinesopa'),
    component: () => import('@/views/admin/Menu.vue'),
    props: { belongs_to: 'cinesopa' },
  },
  {
    ...adminRoute('/admin/sopaseom/menu', 'AdminMenuSopaseom'),
    component: () => import('@/views/admin/Menu.vue'),
    props: { belongs_to: 'sopaseom' },
  },


];