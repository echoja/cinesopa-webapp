<template>
  <div>
    <h2>이것은 페이지입니다.</h2>
    <div>
      <div class="content-wrapper" v-html="content"></div>
      내용: {{ content }}
      {{ permalink }}
    </div>

  </div>
</template>

<script>

import { graphql, getPageQuery } from '../graphql-client';

export default {
  computed: {
    permalink() {
      return this.$route.params.permalink;
    },
  },
  data() {
    return {
      content: '',
    };
  },
  async created() {
    const res = await graphql(getPageQuery, { permalink: this.permalink });
    this.content = res?.data?.page?.content;
  },


};
</script>

<style>

</style>
