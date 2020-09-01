import '@babel/polyfill';
import 'intersection-observer'; // Optional
import 'mutationobserver-shim';
import Vue from 'vue';
import './plugins/bootstrap-vue';
import './plugins/vuescrollactive';
import './plugins/affix';
import './plugins/vue-scrollto';
import App from './App.vue';
import router from './router';
import store from './store';

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
