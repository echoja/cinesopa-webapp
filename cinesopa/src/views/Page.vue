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
  name: 'Page',
  title: (context) => context.page.title,
  computed: {
    permalink() {
      return this.$route.params.permalink;
    },
  },
  props: [
    'page',
  ],
  data() {
    return {
      // page: {
      //   title: '빈 페이지',
      //   content: '',
      // },
    };
  },
  async created() {
    const res = await graphql(getPageQuery, { permalink: this.permalink, belongs_to: 'cinesopa' });
    if (res?.data?.page === null) {
      this.$router.replace({ name: '404' });
      return;
    }
    // this.content = res?.data?.page?.content;
    console.log(res);
  },
};
</script>

<style></style>
