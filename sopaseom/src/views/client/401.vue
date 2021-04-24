<template>
  <div class="Tpt-10 Ttext-center">
    <p class="Ttext-xl Tfont-bold Tmb-7">권한이 없습니다.</p>
    <oval-button class="Tmx-auto" :to="{ name: 'Home' }"> 홈으로 </oval-button>
  </div>
</template>

<script>
export default {
  name: 'NoPermission',
  components: {
    OvalButton: () => import('@/components/OvalButton'),
  },
  data() {
    return {
      vuePageTitle: '',
    };
  },
  mounted() {
    this.vuePageTitle = '401';
  },
};
</script>

<style></style>
