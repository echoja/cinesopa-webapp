<template>
  <article class="container-fluid">
    <h1>{{ post.title }}</h1>
    <div class="meta">
      <div class="d-inline-block pr-4">
        <font-awesome-icon :icon="['far', 'clock']"> </font-awesome-icon>
        <span class="date"> {{ formatDate(post.c_date) }} </span>
      </div>
      <div class="d-inline-block pr-4">
        <font-awesome-icon :icon="['far', 'folder-open']"> </font-awesome-icon>
        <b-link
          :to="{ name: boardWrapper.routerName, params: { board: 'all' } }"
          class="meta-board"
        >
          {{ boardWrapper.name }}
        </b-link>
        <span class="meta-seperator">/</span>
        <b-link
          :to="{
            name: boardWrapper.routerName,
            params: { board: boardPermalink },
          }"
          class="meta-board"
        >
          {{ boardTitle }}
        </b-link>
      </div>
    </div>
    <div class="content" v-html="post.content"></div>
  </article>
</template>

<script>
import moment from 'moment';
import { boardQuery, graphql, postQuery } from '../graphql-client';

const notice = {
  name: '공지사항',
  routerName: 'BoardNotice',
};
const archive = {
  name: '아카이브',
  routerName: 'BoardArchive',
};

const boardWrapperMap = {
  press: notice,
  cooperative: notice,
  community: archive,
  study: archive,
  'archive-etc': archive,
};

export default {
  name: 'Post',
  props: ['id'],
  data() {
    return {
      post: {
        title: '',
        c_date: new Date('2020-12-24'),
        content: '<p>불러오는 중 입니다</p>',
      },
      boardWrapper: {},
      boardTitle: '',
      boardPermalink: '',
      vuePageTitle: '',
    };
  },
  methods: {
    formatDate(date) {
      return moment(date).format('YYYY.MM.DD');
    },
  },
  async mounted() {
    const res = await graphql(postQuery, { id: parseInt(this.id, 10) });
    // console.log(res);
    const post = res?.data?.post;
    if (post === null) {
      this.$router.push({ name: '404' });
      return;
    }

    // console.log('# Post.vue mounted post data');
    // console.log(post);

    this.post = post;
    const boardId = this.post?.board;

    if (boardId) {
      const boardRes = await graphql(boardQuery, {
        condition: {
          id: boardId,
        },
      });
      // console.log(boardRes);
      const {
        permalink: boardPermalink = null,
        title: boardTitle = null,
      } = boardRes?.data?.board;
      this.boardTitle = boardTitle;
      this.boardPermalink = boardPermalink;
      this.boardWrapper = boardWrapperMap[boardPermalink];
    }
    // 페이지 제목 설정
    this.vuePageTitle = `${this.post.title} 내용 - ${this.boardTitle} - ${this.boardWrapper.name}`;
  },
};
</script>

<style lang="scss" scoped>
.meta {
  color: #767676;
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
