<template>
  <div>
    <h2>이것은 페이지입니다.</h2>

    <article class="content" v-html="content"></article>
  </div>
</template>

<script>
import { graphql, getPageQuery } from '../../api/graphql-client';

export default {
  name: 'Page',
  computed: {
    permalink() {
      return this.$route.params.permalink;
    },
  },
  data() {
    return {
      title: '',
      m_date: '',
      content: '',
      loaded: 'false',
    };
  },
  async created() {
    const res = await graphql(getPageQuery, { permalink: this.permalink, belongs_to: 'sopaseom' });
    this.content = res?.data?.page?.content;
  },
};
</script>

<style></style>
