import Vue from 'vue';
// import App from './App'
import { library } from '@fortawesome/fontawesome-svg-core';
import { faUserSecret, faBars } from '@fortawesome/free-solid-svg-icons';
import { faFacebook, faInstagram } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

library.add(faUserSecret, faFacebook, faInstagram, faBars);

Vue.component('font-awesome-icon', FontAwesomeIcon);
