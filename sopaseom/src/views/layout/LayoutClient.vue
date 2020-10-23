<template>
  <div class="layout layout-client">
    <header>
      <nav-menu></nav-menu>
    </header>
    <router-view></router-view>
    <footer-component></footer-component>
  </div>
</template>

<script>
// import {
//   // BFormInput, BButton, BFormSelect, BFormCheckboxGroup, BFormCheckbox, BCard,
//   // BContainer,
//   // BCol,
//   // BRow,
// } from 'bootstrap-vue';

export default {
  name: 'LayoutClient',
  components: {
    FooterComponent: () => import('@/components/FooterComponent.vue'),
    NavMenu: () => import('@/components/NavMenu.vue'),
  },
};
</script>

<style></style>
