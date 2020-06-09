<template>
  <div>
    <b-form-input type="email" v-model="email" placeholder="이메일"></b-form-input>
    <b-form-input type="password" v-model="pwd" placeholder="패스워드"></b-form-input>
    <b-button>로그인</b-button>
  </div>
</template>

<script>
export default {
  name: 'Login',
  components: {},
  data() {
    return {
      email: '',
      pwd: '',
    };
  },
};
</script>
<style></style>
