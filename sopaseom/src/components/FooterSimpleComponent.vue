<template>
  <footer class="site-footer-wrapper">
    <div class="center-wrapper">
      <div class="center">
        <span class="by"> by. </span
        ><cinesopa-logo class="cineesopa-logo"></cinesopa-logo>
      </div>
    </div>
  </footer>
</template>

<script>
// import { BLink } from 'bootstrap-vue';

export default {
  components: {
    CinesopaLogo: () => import('../components/CinesopaLogo.vue'),
  },
};
</script>

<style lang="scss" scoped>
@use '../style/common';
@use '../style/breakpoint';


$gray-c1: #585858;
$gray-c2: #7a7a7a;

.site-footer-wrapper {
  padding: 0 common.$desktop-min-x-margin;
  position: relative;
  background-color: #fff;
}

@include breakpoint.max-with(sm) {
  .site-footer-wrapper {
    padding: 0 common.$mobile-min-x-margin;
  }
}

.center-wrapper {
  border-top: 2px solid black;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px 0;
  pointer-events: none;
  height: common.$desktop-simple-footer-height;
}

.center {
  display: flex;
  align-items: flex-end;
  color: common.$cinesopa-logo-color;
}

.by {
  display: block;
  font-size: 14px;
  font-weight: 500;
  margin-right:5px;
  // margin: 6px 10px 0 -20px;
}

.cineesopa-logo {
  width: 55px;
  display: block;
  transform: translateY(-2px);
}
</style>

<style>
</style>
