import Vue from 'vue';

import { BVConfigPlugin, ModalPlugin, VBTogglePlugin } from 'bootstrap-vue';

Vue.use(ModalPlugin);
Vue.use(VBTogglePlugin);
Vue.use(BVConfigPlugin, {
  BCalendar: {
    labelNoDateSelected: '날짜가 선택되지 않았습니다.',
  },
  // BDatePicker: {
  //   labelNoDateSelected: '날짜가 선택되지 않았습니다.',
  // },
  // breakpoints: ['xs', 'sm', 'lg', 'xl', 'xxl'],
  // BAlert: { variant: 'danger' },
  // BButton: { variant: 'primary' }
});
