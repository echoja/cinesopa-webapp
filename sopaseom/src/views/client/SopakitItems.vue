<template>
  <div>
    <page-header>
      <div class="sopakit-items-title">
        <h1>소파킷</h1>
        <span class="seperator">|</span>
        <b-link>상품 목록</b-link>
        <div class="search-box">2123123</div>
      </div>
    </page-header>
    <div>소파킷 아이템</div>
    <div>소파킷 아이템</div>
    <div>소파킷 아이템</div>
    <div>소파킷 아이템</div>
    <div>소파킷 아이템</div>
    <div>소파킷 아이템</div>
    <div>소파킷 아이템</div>
    <div>소파킷 아이템</div>
    <div>소파킷 아이템</div>
    <div>소파킷 아이템</div>
    <div>소파킷 아이템</div>
  </div>
</template>

<script>
import { BLink } from 'bootstrap-vue';

export default {
  title: '소파킷',
  components: {
    PageHeader: () => import('@/components/PageHeader.vue'),
    BLink,
    // BodyFixedFooter: () => import('@/views/layout/BodyFixedFooter.vue'),
  },
};
</script>

<style lang="scss" scoped>
h1 {
  font-size: 24px;
  font-weight: bold;
  margin:0;
}

.search-box {
  margin-left: auto;
  height: 100%;
  border-left: 2px solid #000;
}
.sopakit-items-title {
  display: flex;
  align-items: center;
  height: 100%;
}
</style>

<style scoped></style>

<style></style>
