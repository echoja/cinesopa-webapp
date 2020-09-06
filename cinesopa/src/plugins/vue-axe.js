import Vue from 'vue';
import ko from 'axe-core/locales/ko.json';

if (process.env.NODE_ENV === 'development') {
  // eslint-disable-next-line global-require
  const VueAxe = require('vue-axe').default;
  Vue.use(VueAxe, {
    delay: 2000,
    config: {
      locale: ko,
    },
    // customResultHandler: (error, results) => {
    //   console.log(results);
    //   results.violations.forEach((violation) => console.log(violation));
    // },
  });
}
