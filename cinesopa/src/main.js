import 'core-js/stable';
import 'regenerator-runtime/runtime';
import 'intersection-observer'; // Optional
import 'mutationobserver-shim';
import Vue from 'vue';
import './plugins/bootstrap-vue';
import './plugins/vuescrollactive';
import './plugins/affix';
import './plugins/vue-scrollto';
import './plugins/fontawesome';
import './plugins/vue-page-title';
import './plugins/vue-axe';
import App from './App.vue';
import router from './router';
import store from './store';

Vue.config.productionTip = false;
// console.log(`vue-axe environment: ${process.env.NODE_ENV}`);
// if (process.env.NODE_ENV === 'development') {
//   // eslint-disable-next-line import/no-extraneous-dependencies, global-require
//   const VueAxe = require('vue-axe').default;
//   Vue.use(VueAxe, {
//     delay: 2000,
//   });
// }

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
