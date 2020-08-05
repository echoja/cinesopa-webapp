
<template>
  <div>
    <b-form @submit="onSubmit" @reset="onReset" v-if="show">
      <b-form-group
        id="input-group-1"
        label="Email address:"
        label-for="input-1"
        description="We'll never share your email with anyone else."
      >
        <b-form-input
          id="input-1"
          v-model="form.email"
          type="email"
          required
          placeholder="이메일"
        ></b-form-input>
      </b-form-group>

      <b-form-group id="input-group-2" label="Your Name:" label-for="input-2">
        <b-form-input
          id="input-2"
          v-model="form.name"
          required
          placeholder="Enter name"
        ></b-form-input>
      </b-form-group>

      <b-form-group id="input-group-3" label="Food:" label-for="input-3">
        <b-form-select
          id="input-3"
          v-model="form.food"
          :options="foods"
          required
        ></b-form-select>
      </b-form-group>

      <b-form-group id="input-group-4">
        <b-form-checkbox-group v-model="form.checked" id="checkboxes-4">
          <b-form-checkbox value="me">Check me out</b-form-checkbox>
          <b-form-checkbox value="that">Check that out</b-form-checkbox>
        </b-form-checkbox-group>
      </b-form-group>

      <b-button type="submit" variant="primary">Submit</b-button>
      <b-button type="reset" variant="danger">Reset</b-button>
    </b-form>
    <b-card class="mt-3" header="Form Data Result">
      <pre class="m-0">{{ form }}</pre>
    </b-card>
  </div>
</template>

<script>
import {
  BFormInput, BButton, BFormSelect, BFormCheckboxGroup, BFormCheckbox, BCard,
} from 'bootstrap-vue';
// import url from 'url';
// import { graphql, loginQuery } from '../../graphql-client';
// import router from '../../router';


export default {
  name: 'CreateAccount',
  components: {
    'b-form-input': BFormInput,
    'b-form-select': BFormSelect,
    'b-button': BButton,
    'b-form-checkbox-group': BFormCheckboxGroup,
    'b-form-checkbox': BFormCheckbox,
    'b-card': BCard,
  },
  data() {
    return {
      form: {
        email: '',
        name: '',
        food: null,
        checked: [],
      },
      foods: [{ text: 'Select One', value: null }, 'Carrots', 'Beans', 'Tomatoes', 'Corn'],
      show: true,
      email: '',
      pwd: '',
      text: '',
    };
  },
  methods: {
    async onSubmit(event) {
      event.preventDefault();
      alert(JSON.stringify(this.form));
    },
    async onReset(event) {
      event.preventDefault();
      // Reset our form values
      this.form.email = '';
      this.form.name = '';
      this.form.food = null;
      this.form.checked = [];
      // Trick to reset/clear native browser form validation state
      this.show = false;
      this.$nextTick(() => {
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
