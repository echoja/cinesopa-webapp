<template>
  <div class="change-password">
    <page-header class="page-header">
      <div class="page-header-inner-wrapper">
        <h1>비밀번호 변경</h1>
      </div>
    </page-header>
    <div class="router-wrapper">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
export default {
  components: {
    PageHeader: () => import('@/components/PageHeader'),
  },
  title: '비밀번호 변경',
};
</script>

<style lang="scss" scoped>
.router-wrapper {
  max-width: 600px;
  margin: 50px auto 0;
}
</style>
<style></style>
