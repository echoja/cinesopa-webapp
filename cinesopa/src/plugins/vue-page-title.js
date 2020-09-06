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
      // 이것이 사용자 정의 함수에게 완성된 vm을 전달하는 핵심 방법!
      document.title = `${title.call(this, this)}${suffix}`;
    } else {
      //
    }
  },
};

Vue.mixin(pageTitle);
