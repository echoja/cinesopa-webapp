import Vue from 'vue';
// import App from './App'
import { library } from '@fortawesome/fontawesome-svg-core';
import { faUserSecret, faBars, faSearch } from '@fortawesome/free-solid-svg-icons';
import { faClock } from '@fortawesome/free-regular-svg-icons';
import { faFacebook, faInstagram } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

library.add(faUserSecret, faFacebook, faInstagram, faBars, faSearch, faClock);

Vue.component('font-awesome-icon', FontAwesomeIcon);
