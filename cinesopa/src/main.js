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
import './plugins/vue-skip-to';
import './plugins/vue-plugin-load-script';
import './plugins/vue-parallax';
import App from './App.vue';
import router from './router';
import store from './store';
import './util.scss';
import 'aos/dist/aos.css';
import 'swiper/swiper-bundle.css';

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
