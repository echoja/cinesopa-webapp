import Vue from 'vue';
// eslint-disable-next-line import/no-extraneous-dependencies
import ko from 'axe-core/locales/ko.json';

if (process.env.NODE_ENV === 'development') {
  // eslint-disable-next-line global-require, import/no-extraneous-dependencies
  const VueAxe = require('vue-axe').default;
  Vue.use(VueAxe, {
    delay: 2000,
    clearConsoleOnUpdate: false,
    allowConsoleClears: false,
    config: {
      locale: ko,
    },
    // customResultHandler: (error, results) => {
    //   console.log(results);
    //   results.violations.forEach((violation) => console.log(violation));
    // },
  });
}
