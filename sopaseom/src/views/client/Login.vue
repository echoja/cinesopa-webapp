<template>
  <login-form hide-logo @login-success="loginSuccess"></login-form>
</template>

<script>
import { BFormInput, BButton } from 'bootstrap-vue';
import { mapMutations } from 'vuex';
// import { makeProcessingMixin } from '@/mixins/tool';

const component = {
  name: 'Login',
  components: {
    LoginForm: () => import('@/components/LoginForm.vue'),
    'b-form-input': BFormInput,
    'b-button': BButton,
  },
  mounted() {
    if (this.$store.state.currentUser) {
      this.$router.push('/');
    }
  },
  methods: {
    ...mapMutations(['setRouteWhereLoginSuccess']),
    loginSuccess() {
      const to = this.$store.state.routeWhereLoginSuccess;
      if (to) {
        // console.log('# Login.vue loginSuccess yes routeWhereLoginSuccess');
        this.setRouteWhereLoginSuccess(null);
        return this.$router.push(to);
      }
      // console.log('# Login.vue loginSuccess no routeWhereLoginSuccess');
      return this.$router.push('/');
    },
  },
};

export default component;
</script>
<style></style>
