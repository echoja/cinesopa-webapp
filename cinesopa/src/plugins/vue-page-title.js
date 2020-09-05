import Vue from 'vue';
import VuePageTitle from 'vue-page-title';
import router from '../router';

Vue.use(VuePageTitle, {
  // prefix: 'My App - ',

  suffix: '- 영화배급협동조합 씨네소파',
  router,
});
