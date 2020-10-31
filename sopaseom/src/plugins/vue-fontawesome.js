import Vue from 'vue';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

library.add([faExclamationCircle]);

Vue.component('font-awesome-icon', FontAwesomeIcon);
