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
import { BLink } from 'bootstrap-vue';

export default {
  components: {
    CinesopaLogo: () => import('../components/CinesopaLogo.vue'),
  },
};
</script>

<style lang="scss" scoped>
@import '../common';

$gray-c1: #585858;
$gray-c2: #7a7a7a;

.site-footer-wrapper {
  padding: 0 $desktop-min-x-margin;
  position: relative;
  background-color: #fff;
}

@include max-with(sm) {
  .site-footer-wrapper {
    padding: 0 $mobile-min-x-margin;
  }
}

.center-wrapper {
  border-top: 2px solid black;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: -10px;
  padding: 10px 0;
  pointer-events: none;
}

.center {
  display: flex;
  align-items: flex-end;
  color: $cinesopa-logo-color;
}

.by {
  display: block;
  font-size: 17px;
  font-weight: 500;
  margin: 6px 10px 0 -20px;
}

.cineesopa-logo {
  width: 80px;
  display: block;
  transform: translateY(-4px);
}
</style>

<style>
</style>
