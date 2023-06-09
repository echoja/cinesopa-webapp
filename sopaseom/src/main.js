import '@babel/polyfill';
import 'mutationobserver-shim';
import Vue from 'vue';
// import './plugins/bootstrap-vue';
import './plugins/veevalidate';
import './plugins/vue-page-title';
import './plugins/vue-bootstrap';
import './plugins/custom-style.scss';
import './plugins/vue-fontawesome';
import './plugins/vue-load-script';
import './plugins/tailwind.css';
import App from './App.vue';
import router from './router';
import store from './store';

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
