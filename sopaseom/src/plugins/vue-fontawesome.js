import Vue from 'vue';
import { library } from '@fortawesome/fontawesome-svg-core';
import * as fas from '@fortawesome/free-solid-svg-icons';
import * as far from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

library.add(
  far.faEdit,
  far.faEye,
  fas.faRing,
  fas.faExclamationCircle,
  fas.faBars,
  fas.faSearch,
  far.faPlusSquare,
  far.faQuestionCircle,
  far.faFileExcel,
  fas.faDownload,
  fas.faUpload,
  fas.faTruck,
  far.faCalendar,
  far.faFile,
  fas.faFileInvoiceDollar,
  fas.faWonSign,
);

Vue.component('font-awesome-icon', FontAwesomeIcon);
