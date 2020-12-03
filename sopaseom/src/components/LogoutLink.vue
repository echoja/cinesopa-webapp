<template>
  <b-link @click="logout">로그아웃</b-link>
</template>

<script>
import { BLink } from 'bootstrap-vue';
import { doLogout } from '@/api/graphql-client';
import { mapActions } from 'vuex';

export default {
  components: {
    BLink,
  },
  methods: {
    ...mapActions(['pushMessage']),
    async logout() {
      await doLogout();
      this.pushMessage({
        type: 'success',
        msg: '성공적으로 로그아웃 하였습니다.',
        id: 'logoutSuccess',
      });
      this.$router.push({ name: 'Home' });
    },
  },
};
</script>

<style>
</style>