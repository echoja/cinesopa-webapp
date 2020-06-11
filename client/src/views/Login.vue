<template>
  <div>
    <b-form-input type="email" v-model="email" placeholder="이메일"></b-form-input>
    <b-form-input type="password" v-model="pwd" placeholder="패스워드"></b-form-input>
    <b-button v-on:click="login">로그인</b-button>
    <p> {{ text }} </p>
  </div>
</template>

<script>
import { BFormInput, BButton } from 'bootstrap-vue';
import { graphql } from '../graphql-client';

const exampleQuery = `
{
  users {
    id
    email
  }
}
`;

export default {
  name: 'Login',
  components: {
    'b-form-input': BFormInput,
    'b-button': BButton,
  },
  data() {
    return {
      email: '',
      pwd: '',
      text: '',
    };
  },
  methods: {
    async login() {
      const result = await graphql(exampleQuery, {});
      this.text = result;
    },
    // login() {
    //   const self = this;
    //   graphql(exampleQuery, {}).then(
    //     (result) => {
    //       self.text = result;
    //     },
    //   ).catch((error) => {
    //     console.log(error);
    //   });
    // },
    greet(event) {
      // 메소드 안에서 사용하는 `this` 는 Vue 인스턴스를 가리킵니다
      console.log(`Hello ${this.name}!`);
      // `event` 는 네이티브 DOM 이벤트입니다
      if (event) {
        alert(event.target.tagName);
      }
    },
  },
};
</script>
<style></style>
