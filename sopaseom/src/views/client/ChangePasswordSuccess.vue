<template>
  <div class="Ttext-center">
    <p class="Ttext-5xl Tfont-bold Tleading-tight Tmt-10 Tmb-10">
      비밀번호 변경이<br />완료되었습니다!
    </p>
    <p class="Ttext-2xl Tfont-medium Tmb-10">다시 한번 즐겨볼까요?</p>
    <oval-button class="Tmx-auto" :to="{name: 'Home'}"> 홈으로 </oval-button>
  </div>
</template>

<script>
import OvalButton from '@/components/OvalButton.vue';
export default {
  components: {
    OvalButton,
  },
  data() {
    return {
      vuePageTitle: '',
    };
  },
  mounted() {
    this.vuePageTitle = '비밀번호 재설정 성공';
  },
};
</script>

<style lang="scss" scoped></style>

<style scoped></style>

<style></style>
