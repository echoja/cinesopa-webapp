import Vue from 'vue';
import {
  ValidationObserver,
  ValidationProvider,
  extend,
  localize,
} from 'vee-validate';
import ko from 'vee-validate/dist/locale/ko.json';
import * as rules from 'vee-validate/dist/rules';
import { required, email, min } from 'vee-validate/dist/rules';

Object.keys(rules).forEach((rule) => {
  extend(rule, rules[rule]);
});
localize('ko', ko);


// No message specified.
extend('email', {
  ...email,
  message: '올바른 이메일 형식을 입력해주세요.',
});

extend('password_min', {
  ...min,
  message: '비밀번호는 최소 {length}자 이상이어야 합니다.',
});

// Override the default message.
extend('required', {
  ...required,
  message: '필수 항목입니다.',
});

extend('password_same', {
  params: ['other'],
  validate: (value, { other }) => {
    if (value === other) {
      return true;
    }
    return false;
  },
  message:
    '비밀번호가 일치하지 않습니다.',
});

Vue.component('ValidationObserver', ValidationObserver);
Vue.component('ValidationProvider', ValidationProvider);
