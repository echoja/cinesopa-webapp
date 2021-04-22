<template>
  <div class="form-row-wrapper">
    <div class="form-row">
      <div class="form-header">
        <span class="form-header-text">{{ title }}</span>
        <info v-once v-if="$slots.info" class="ml-2">
          <slot name="info"> </slot>
        </info>
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
import Info from '@/components/admin/Info.vue';

export default {
  name: 'FormRow',
  props: ['title', 'description'],
  components: {
    Info,
  },
};
</script>

<style lang="scss" scoped>
@use '../../style/common';
@use '../../style/breakpoint';

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

@include breakpoint.max-with(md) {
  .form-row {
    display: block;
    margin: 0 1vw;
  }
  .form-header {
    display: block;
    margin: 0 0 5px;
    padding: 0;
    border: 0;
  }
}
</style>

<style>
</style>
