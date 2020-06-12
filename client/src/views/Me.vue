<template>
<div>
<p>This is Special!!! wow~</p>
<p>email : {{ email }}</p>
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
  data() {
    return {
      email: '',
    };
  },

};
</script>

<style>

</style>
