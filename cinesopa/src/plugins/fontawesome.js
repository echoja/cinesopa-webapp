import Vue from 'vue';

import { library } from '@fortawesome/fontawesome-svg-core';
import { faUserSecret, faBars, faSearch, faCalendar } from '@fortawesome/free-solid-svg-icons';
import { faClock } from '@fortawesome/free-regular-svg-icons';
import { faFacebook, faInstagram } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

library.add(faUserSecret, faFacebook, faInstagram, faBars, faSearch, faClock, faCalendar);

Vue.component('font-awesome-icon', FontAwesomeIcon);
