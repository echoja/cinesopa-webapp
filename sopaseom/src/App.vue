<template>
  <div id="app">
    <component :is="layout">
      <router-view :key="$route.fullPath" />
    </component>
  </div>
</template>
<script>
import 'bootstrap-vue';
// BFormInput, BButton, BFormSelect, BFormCheckboxGroup, BFormCheckbox, BCard,
import LayoutClient from '@/views/layout/LayoutClient.vue';
import LayoutAdmin from '@/views/layout/LayoutAdmin.vue';

export default {
  name: 'LayoutWrapper',
  components: {
    LayoutClient,
    LayoutAdmin,
  },
  computed: {
    // 레이아웃 기본 값은 LayoutClient 임. 
    // 어드민 같은 경우에는 헬퍼 함수를 통해 meta에 LayoutAdmin을 전달하고 있음.
    layout() {
      return this.$route.meta.layout || LayoutClient;
    },
  },
  methods: {
    // async successMsg(msg) {
    //   alert(`"유후~~" ${msg}`);
    // },
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /* text-align: center; */
  color: #2c3e50;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
