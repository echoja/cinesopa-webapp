<template>
  <login-form></login-form>
</template>

<script>
import { BFormInput, BButton } from 'bootstrap-vue';
// import { makeProcessingMixin } from '@/mixins/tool';

const component = {
  name: 'Login',
  components: {
    LoginForm: () => import('@/components/LoginForm.vue'),
    'b-form-input': BFormInput,
    'b-button': BButton,
  },
};

export default component;
</script>
<style></style>
