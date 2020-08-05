<template>
  <b-container>
    <b-row>
      <b-col>
        <div id="nav">
          <router-link to="/">Home</router-link>
          |
          <router-link to="/login">Login</router-link>
          |
          <router-link to="/logout">Logout</router-link>
          |
          <router-link to="/join">계정 만들기</router-link>
        </div>
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <main>
          <slot></slot>
        </main>
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <footer>
          이것은 새 레이아웃이라구요~
        </footer>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import {
  // BFormInput, BButton, BFormSelect, BFormCheckboxGroup, BFormCheckbox, BCard,
  BContainer,
  BCol,
  BRow,
} from 'bootstrap-vue';

export default {
  name: 'LayoutClient',
  components: {
    'b-container': BContainer,
    'b-col': BCol,
    'b-row': BRow,
  },
};
</script>

<style>

</style>
