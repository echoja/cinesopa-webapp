import Vue from 'vue';
// import VuePageTitle from 'vue-page-title';
// import router from '../router';

// Vue.use(VuePageTitle, {
//   // prefix: 'My App - ',

//   suffix: '- 영화배급협동조합 씨네소파',
//   router,
// });

const suffix = ' - 영화배급협동조합 씨네소파';

const pageTitle = {
  created() {
    const { title } = this.$options;
    if (typeof title === 'string') {
      document.title = `${title}${suffix}`;
    } else if (typeof title === 'function') {
      document.title = `${title.call(this, this)}${suffix}`;
    } else {
      // document.title = '영화배급협동조합 씨네소파';
    }
  },
};

Vue.mixin(pageTitle);
