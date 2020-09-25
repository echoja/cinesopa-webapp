import Vue from 'vue';

import {
  // BootstrapVue,
  ButtonPlugin,
  CalendarPlugin,
  CarouselPlugin,
  FormPlugin,
  FormGroupPlugin,
  FormCheckboxPlugin,
  FormDatepickerPlugin,
  FormInputPlugin,
  FormRadioPlugin,
  FormSelectPlugin,
  FormTextareaPlugin,
  ImagePlugin,
  LayoutPlugin,
  LinkPlugin,
  ModalPlugin,
  PaginationNavPlugin,
  SidebarPlugin,
  TablePlugin,
  VBVisiblePlugin,
} from 'bootstrap-vue';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import 'bootstrap-vue/dist/bootstrap-vue.css';
import './bootstrap-vue-custom-style.scss';
// import { ButtonPlugin } from 'bootstrap-vue'
Vue.use(ButtonPlugin);

// Vue.use(BootstrapVue);
// Vue.use(BootstrapVueIcons);

Vue.use(CalendarPlugin);
Vue.use(CarouselPlugin);
Vue.use(FormPlugin);
Vue.use(FormGroupPlugin);
Vue.use(FormCheckboxPlugin);
Vue.use(FormDatepickerPlugin);
Vue.use(FormInputPlugin);
Vue.use(FormRadioPlugin);
Vue.use(FormSelectPlugin);
Vue.use(FormTextareaPlugin);
Vue.use(ImagePlugin);
Vue.use(LayoutPlugin);
Vue.use(LinkPlugin);
Vue.use(ModalPlugin);
Vue.use(PaginationNavPlugin);
Vue.use(SidebarPlugin);
Vue.use(TablePlugin);
Vue.use(VBVisiblePlugin);
