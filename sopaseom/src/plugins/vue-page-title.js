import Vue from 'vue';
// import VuePageTitle from 'vue-page-title';
// import router from '../router';

// Vue.use(VuePageTitle, {
//   // prefix: 'My App - ',

//   suffix: '- 영화배급협동조합 씨네소파',
//   router,
// });

const suffix = ' - 영화향유플랫폼 소파섬';
const pageTitle = {
  watch: {
    $route() {
      const { title } = this.$options;
      if (typeof title === 'string') {
        document.title = `${title}${suffix}`;
      } else if (typeof title === 'function') {
        document.title = `${title.call(this, this)}${suffix}`;
        // console.log('# vue-page-title watch $route title function');
        // console.log(document.title);
      } else {
        // document.title = '영화배급협동조합 씨네소파';
      }
    },
    vuePageTitle(to) {
      document.title = `${to}${suffix}`;
    },
  },
  mounted() {
    const { title } = this.$options;
    if (typeof title === 'string') {
      document.title = `${title}${suffix}`;
    } else if (typeof title === 'function') {
      document.title = `${title.call(this, this)}${suffix}`;
      // console.log('# vue-page-title title function');
      // console.log(document.title);
    } else {
      // document.title = '영화배급협동조합 씨네소파';
    }
  },
};

Vue.mixin(pageTitle);
