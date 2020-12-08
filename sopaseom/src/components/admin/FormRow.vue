<template>
  <div class="form-row-wrapper">
    <div class="form-row">
      <div class="form-header">
        <span>{{ title }}</span>
      </div>
      <div class="form-content">
        <slot></slot>
        <div class="description">
          {{ description }}
        </div>
      </div>
    </div>
    <div class="form-row fake">
      <div class="form-header"></div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['title', 'description'],
};
</script>

<style lang="scss" scoped>
@import '@/common';

.form-row {
  display: flex;
  flex-wrap: nowrap;
  // margin: 40px 0;
}

.form-header {
  flex: 0 0 200px;
  display: flex;
  justify-content: flex-end;
  align-items: stretch;
  border-right: 1px solid #ddd;
  padding: 0 30px;
  margin-right: 30px;
  font-weight: bold;
}

.description {
  font-size: 14px;
  color: #777;
}

.form-row.fake .form-header {
  padding: 10px;
  flex: 0 0 200px;
}
</style>

<style>
</style>