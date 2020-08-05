<template>
  <div>
    <validation-observer ref="observer" v-slot="{ handleSubmit }">
      <b-form @submit.stop.prevent="handleSubmit(onSubmit)" @reset="onReset" v-if="show">
        <!-- https://logaretm.github.io/vee-validate/advanced/rules-object-expression.html#defining-rules -->
        <validation-provider
          name="Email"
          :rules="{ required: true, email: true}"
          v-slot="validationContext"
        >
          <b-form-group id="input-email-group" label="이메일 주소" label-for="input-email"
            ><!-- description="회원 가입 완료 후 인증이 필요합니다."
          :invalid-feedback="invalidFeedbackEmail"
          :valid-feedback="validFeedbackEmail"
          :state="stateEmail" -->

            <b-form-input
              id="input-email"
              name="input-email"
              v-model="form.email"
              type="email"
              required
              placeholder="이메일"
              :state="getValidationState(validationContext)"
              trim
            ></b-form-input>
            <b-form-invalid-feedback id="input-email-live-feedback">{{
              validationContext.errors[0]
            }}</b-form-invalid-feedback>
          </b-form-group>
        </validation-provider>
        <validation-provider
          name="비밀번호"
          vid="password"
          :rules="{ required: true, password_min:8}"
          v-slot="validationContext"
        >
          <b-form-group id="input-pass-group" label="비밀번호" label-for="input-password">

            <b-form-input
              id="input-password"
              name="input-password"
              v-model="form.password"
              type="password"
              required
              placeholder="비밀번호"
              :state="getValidationState(validationContext)"
              trim
            ></b-form-input>
            <b-form-invalid-feedback id="input-password-live-feedback">{{
              validationContext.errors[0]
            }}</b-form-invalid-feedback>
          </b-form-group>
        </validation-provider>
        <validation-provider
          name="비밀번호 재입력"
          :rules="{ required: true, password_same: {other: '@password'}}"
          v-slot="validationContext"
        >
          <b-form-group id="input-repass-group" label="비밀번호 재입력" label-for="input-repassword">

            <b-form-input
              id="input-repassword"
              name="input-repassword"
              v-model="form.repassword"
              type="password"
              required
              placeholder=""
              :state="getValidationState(validationContext)"
              trim
            ></b-form-input>
            <b-form-invalid-feedback id="input-repassword-live-feedback">{{
              validationContext.errors[0]
            }}</b-form-invalid-feedback>
          </b-form-group>
        </validation-provider>

        <!-- <b-form-group id="input-group-2" label="Your Name:" label-for="input-2">
          <b-form-input
            id="input-2"
            v-model="form.name"
            required
            placeholder="Enter name"
          ></b-form-input>
        </b-form-group> -->

        <!-- <b-form-group id="input-group-3" label="Food:" label-for="input-3">
          <b-form-select id="input-3" v-model="form.food" :options="foods" required></b-form-select>
        </b-form-group>

        <b-form-group id="input-group-4">
          <b-form-checkbox-group v-model="form.checked" id="checkboxes-4">
            <b-form-checkbox value="me">Check me out</b-form-checkbox>
            <b-form-checkbox value="that">Check that out</b-form-checkbox>
          </b-form-checkbox-group>
        </b-form-group> -->

        <b-button type="submit" variant="primary">Submit</b-button>
        <b-button type="reset" variant="danger">Reset</b-button>
      </b-form>
    </validation-observer>
    <b-card class="mt-3" header="Form Data Result">
      <pre class="m-0">{{ form }}</pre>
    </b-card>
  </div>
</template>

<script>
import {
  BFormInput,
  BButton,
  // BFormSelect,
  // BFormCheckboxGroup,
  // BFormCheckbox,
  BCard,
} from 'bootstrap-vue';
// import graphql from '@/graphql-client';

import {
  ValidationObserver,
  ValidationProvider,
  // extend,
  // localize,
} from 'vee-validate';
// import url from 'url';
// import { graphql, loginQuery } from '../../graphql-client';
// import router from '../../router';

import { createGuest } from '@/graphql-client';

export default {
  name: 'CreateAccount',
  components: {
    'b-form-input': BFormInput,
    // 'b-form-select': BFormSelect,
    'b-button': BButton,
    // 'b-form-checkbox-group': BFormCheckboxGroup,
    // 'b-form-checkbox': BFormCheckbox,
    'b-card': BCard,
    'validation-observer': ValidationObserver,
    'validation-provider': ValidationProvider,
  },
  data() {
    return {
      form: {
        email: '',
        name: '',
        food: null,
        checked: [],
        password: '',
        repassword: '',
      },
      foods: [{ text: 'Select One', value: null }, 'Carrots', 'Beans', 'Tomatoes', 'Corn'],
      show: true,
      email: '',
      pwd: '',
      text: '',
    };
  },
  methods: {
    onSubmit() {
      // event.preventDefault();
      createGuest({
        email: this.form.email,
        pwd: this.form.password,
      }).then((result) => {
        console.log(result);
      }).catch((error) => {
        console.log(error);
      });
      // const obj = {
      //   "email": "eszqsc112@naver.com",
      //   "pwd": "13241324"
      // };
      alert(JSON.stringify(this.form));
    },
    getValidationState({ dirty, validated, valid = null }) {
      return dirty || validated ? valid : null;
    },
    async onReset() {
      // event.preventDefault();
      // Reset our form values
      this.form.email = '';
      this.form.name = '';
      this.form.password = '';
      this.form.repassword = '';
      this.form.food = null;
      this.form.checked = [];
      // Trick to reset/clear native browser form validation state
      this.show = false;
      this.$nextTick(() => {
        this.$refs.observer.reset();
        this.show = true;
      });
    },

    greet() {
      console.log(`Hello ${this.name}!`);
    },
  },
};
</script>
<style></style>
