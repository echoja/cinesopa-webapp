<template>
  <article class="container-fluid">
    <h1>{{ post.title }}</h1>
    <div class="meta">
      <font-awesome-icon :icon="['far', 'clock']"></font-awesome-icon
      ><span class="date">{{ formatDate(post.c_date) }}</span>
    </div>
    <div class="content" v-html="post.content"></div>
  </article>
</template>

<script>
import moment from 'moment';

export default {
  name: 'Post',
  title: (vm) => vm.post.title,
  props: ['id'],
  data() {
    return {
      post: {
        title: '게시글 예시 제목입니다.',
        c_date: new Date('2020-12-24'),
        content: '<p>안녕하십니까, 이것은 예시 내용입니다. </p>',
      },
    };
  },
  methods: {
    formatDate(date) {
      return moment(date).format('YYYY.MM.DD');
    },
  },
};
</script>

<style lang="scss" scoped>
.meta {
  color:#767676;
  & .date {
    padding-left: 10px;
  }
}
.content {
  padding-top: 20px;
  border-top: 2px solid #2b3e4a;
  margin: 30px 0 100px;
}
</style>
