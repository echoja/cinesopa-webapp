import Vue from 'vue';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faExclamationCircle, faBars, faSearch } from '@fortawesome/free-solid-svg-icons';
import { faQuestionCircle } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

library.add([faExclamationCircle, faBars, faSearch, faQuestionCircle]);

Vue.component('font-awesome-icon', FontAwesomeIcon);
