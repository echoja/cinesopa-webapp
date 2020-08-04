<template>
<div>
<p>This is Special!!! wow~</p>
<p>email : {{ user.email }}</p>
<p>role: {{user.role}} </p>
<p>name: {{user.name}} </p>
<p>c_date: {{user.c_date}} </p>

<router-link :to="{ name: 'Logout'}" tag='b-button'>로그아웃</router-link>


</div>
</template>

<script>
import { BButton } from 'bootstrap-vue';

export default {
  name: 'Me',
  component: {
    'b-button': BButton,
  },
  // data() {
  //   return {
  //     user: {},
  //   };
  // },
  computed: {
    user() {
      const { user } = this.$store.state;
      console.log(user);
      return user;
    },
  },

};
</script>

<style>

</style>
