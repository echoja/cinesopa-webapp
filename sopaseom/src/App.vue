<template>
  <div id="app">
    <component :is="layout">
      <router-view />
    </component>
  </div>
</template>
<script>
import // BFormInput, BButton, BFormSelect, BFormCheckboxGroup, BFormCheckbox, BCard,
'bootstrap-vue';
import LayoutClient from '@/views/layout/LayoutClient.vue';
import LayoutAdmin from '@/views/layout/LayoutAdmin.vue';

export default {
  name: 'LayoutWrapper',
  components: {
    LayoutClient,
    LayoutAdmin,
  },
  computed: {
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
