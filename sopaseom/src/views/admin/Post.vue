<template>
  <div>
    <header class="p-3">
      <h2>글 목록</h2>
    </header>
    <b-table :items="items" :fields="fields">
      <template #cell(checkbox)="row">
        <b-form-checkbox v-model="row.item.checked"></b-form-checkbox>
      </template>
      <template #cell(permalink)="row">
        <div class="text-monospace">
          {{ row.item.id }}
        </div>
      </template>
      <template #cell(title_excerpt)="row">
        <!-- <p class="m-0"> -->
        <b-link :to="{ name: 'PostEdit', params: { id: row.item.id } }">
          {{ row.item.title }}
        </b-link>
        <!-- </p> -->
      </template>
      <template #cell(c_date)="row">
        <div class="text-monospace">
          {{ formatDate(row.value) }}
        </div>
      </template>
      <template #cell(m_date)="row">
        <div class="text-monospace">
          {{ formatDate(row.value) }}
        </div>
      </template>
    </b-table>
    <p v-if="state.processing.get">로딩중입니다.</p>
    <p v-if="!hasData && !state.processing.get">글이 없습니다.</p>
    <hr />
    <b-button class="mx-1" :disabled="!checkedAtleastOne" variant="danger" @click="removePost"
      >삭제</b-button
    >
    <b-button class="mx-1" variant="primary" :to="{ name: 'PostNew' }">새로 추가</b-button>

    <!-- <p>페이지: {{ page }}</p> -->
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import { BButton, BFormCheckbox, BLink } from 'bootstrap-vue';
import moment from 'moment';
import { queryString, graphql } from '@/loader';

moment.locale('ko');

export default {
  name: 'Post',
  components: {
    BButton, BFormCheckbox, BLink,
  },
  data() {
    return {
      total: 0,
      state: {
        processing: {
          get: false,
        },
      },
      boards: {},
      fields: [
        // {
        //   key: 'id',
        //   label: 'id',
        // },
        {
          key: 'checkbox',
          label: '선택',
        },
        {
          key: 'permalink',
          label: '링크',
        },
        {
          key: 'title_excerpt',
          label: '내용',
        },
        {
          key: 'boardTitle',
          label: '게시판',
        },
        {
          key: 'c_date',
          label: '생성일',
        },
        {
          key: 'm_date',
          label: '최근 수정',
        },
      ],
      items: [
        {
          id: 999,
          permalink: 13241324,
          title: '제목',
          excerpt: '이것은 내용 요약입니다. 우짜고저짜고',
          c_date: new Date(),
          m_date: new Date(),
          checked: false,
        },
      ],
    };
  },
  computed: {
    hasData() {
      return this.items.length !== 0;
    },
    page() {
      return this.$route.params.page;
    },
    checkedAtleastOne() {
      return this.items.findIndex((item) => item.checked === true) !== -1;
    },
  },
  async mounted() {
    await this.boardData();
    this.setDataFromServer();
  },
  methods: {
    ...mapActions(['pushMessage']),
    formatDate(date) {
      return moment(date).format('YY-MM-DD hh:mm:ss');
    },
    async boardData() {
      let boards = await graphql(queryString.board.boardsQuery);
      boards = boards.data.boards;
      // console.log(boards);
      boards.forEach((value) => {
        // eslint-disable-next-line no-underscore-dangle
        this.boards[value._id] = value.title;
      });
    },
    async setDataFromServer() {
      this.state.processing.get = true;
      this.items = [];
      const res = await graphql(queryString.post.postsAdminQuery, {
        condition: {
          page: this.page,
          perpage: 10,
        },
      });

      const {
        postsAdmin: { total, posts },
      } = res.data;

      this.total = total;

      const items = [];
      for (const post of posts) {
        items.push({
          ...post,
          checked: false,
          boardTitle: this.boards[post.board],
        });
      }
      console.log(items);
      this.items = items;
      this.state.processing.get = false;
    },
    async removePost() {
      const removing = this.items.filter((item) => item.checked === true);
      console.log(removing);
      // this.pushMessage({
      //   type: 'info',
      //   msg: JSON.
      //   id: 'removePost'
      // }
      const promises = [];
      removing.forEach((item) => {
        promises.push(graphql(queryString.post.removePostMutation, { id: item.id }));
      });
      const result = await Promise.allSettled(promises);
      console.log(result);

      const completed = result.every((promise) => promise.status === 'fulfilled');

      // const row = this.removingRow;
      // const res = await graphql(queryString.post.removePostMutation, { id: row.item.id });
      if (completed) {
        this.pushMessage({
          type: 'success',
          msg: '게시글 삭제가 성공했습니다.',
          id: 'successRemovePost',
        });
      } else {
        const no = result.filter((prom) => prom.status !== 'fulfilled');
        const msg = JSON.stringify(no.map((prom) => prom.value));
        this.pushMessage({
          type: 'warning',
          msg,
          id: 'failRemovePost',
        });
      }
      this.setDataFromServer();
    },
  },
};
</script>

<style></style>
