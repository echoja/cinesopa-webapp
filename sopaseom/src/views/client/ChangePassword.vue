<template>
  <div class="change-password">
    <page-header class="page-header">
      <div class="page-header-inner-wrapper">
        <h1>비밀번호 재설정</h1>
      </div>
    </page-header>

    <div class="router-wrapper">
      <div class="Tflex Tjustify-center">
        <div
          class="Tflex Tjustify-center Titems-center Tpb-4 Tborder-b Tmb-7 Ttext-gray-300"
        >
          <template v-for="(header, index) in headers">
            <span
              class="Ttext-base lg:Ttext-lg Tfont-bold Tpx-3 lg:Tpx-5"
              :class="{ 'Ttext-gray-600': $route.name === header.routeName }"
              :key="`${header.routeName}`"
              >{{ header.label }}</span
            >
            <span
              v-if="index !== headers.length - 1"
              class="Tw-3 Ttext-xl"
              :key="`${header.routeName}-next`"
              >&gt;</span
            >
          </template>
        </div>
      </div>
      <div>
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  components: {
    PageHeader: () => import('@/components/PageHeader'),
  },
  data() {
    return {
      vuePageTitle: '',
      headers: [
        {
          routeName: 'ChangePasswordRequest',
          label: '이메일로 링크 받기',
        },
        {
          routeName: 'ChangePasswordAuth',
          label: '비밀번호 재설정',
        },
        {
          routeName: 'ChangePasswordSuccess',
          label: '변경 완료',
        },
      ],
    };
  },
  mounted() {
    this.vuePageTitle = '비밀번호 재설정';
  },
};
</script>

<style lang="scss" scoped>
.router-wrapper {
  max-width: 600px;
  margin: 50px auto 0;
}
</style>
<style></style>
