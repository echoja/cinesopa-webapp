import Vue from 'vue';

import { BVConfigPlugin, ModalPlugin, VBTogglePlugin } from 'bootstrap-vue';

Vue.use(ModalPlugin);
Vue.use(VBTogglePlugin);
Vue.use(BVConfigPlugin, {
  BCalendar: {
    labelNoDateSelected: '날짜가 선택되지 않았습니다.',
    labelHelp: '방향키를 사용해 날짜를 변경하세요.',
  },
  BFormFile: {
    browseText: '파일 선택 ...',
    placeholder: '파일이 선택되지 않았습니다.',
  },
  // BFormDatepicker: {
  // },
  // BDatePicker: {
  //   labelNoDateSelected: '날짜가 선택되지 않았습니다.',
  // },
  // breakpoints: ['xs', 'sm', 'lg', 'xl', 'xxl'],
  // BAlert: { variant: 'danger' },
  // BButton: { variant: 'primary' }
});
