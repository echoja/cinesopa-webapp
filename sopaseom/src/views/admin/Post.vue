<template>
  <div>
    <header class="Tmb-3">
      <h2 class="header Tmb-1">
        <span>글 목록</span>
      </h2>
      <span> 글을 수정하려면 <b>행</b>을 클릭하세요 </span>
    </header>
    <b-table
      :items="items"
      :fields="fields"
      @row-clicked="rowClicked"
      hover
      class="width-auto"
    >
      <template #head(permalink)="{ label }">
        <!-- test -->
        <span class="mr-2">{{ label }}</span>
        <info
          >숫자 형태로 자동으로 생성됩니다. url 을 구성할 때 사용됩니다. (예:
          cinesopa.kr/post/숫자 )</info
        >
      </template>
      <template #head(title_excerpt)="{ label }">
        <!-- test -->
        <span>{{ label }}</span>
      </template>
      <template #head(boardTitle)="{ label }">
        <span class="mr-2">{{ label }}</span>
        <info> 속해 있는 게시판입니다. </info>
      </template>
      <template #head(c_date)="{ label }">
        <!-- test -->
        <span>{{ label }}</span>
      </template>
      <template #head(m_date)="{ label }">
        <!-- test -->
        <span>{{ label }}</span>
      </template>
      <template #cell(checkbox)="row">
        <b-form-checkbox v-model="row.item.checked"></b-form-checkbox>
      </template>
      <template #cell(permalink)="row">
        <div class="text-monospace">
          {{ row.item.id }}
        </div>
      </template>
      <template #cell(title_excerpt)="row">
        <p class="m-0">
          {{ row.item.title }}
          <!-- <b-link :to="{ name: 'PostEdit', params: { id: row.item.id } }">

          </b-link> -->
        </p>
      </template>
      <template #cell(c_date)="row">
        {{ formatSimpleDate(row.value) }}
      </template>
      <template #cell(m_date)="row">
        <div>
          {{ formatDateFromNow(row.value) }}
        </div>
        <div class="Ttext-xs Ttext-gray-400">
          {{ formatDate(row.value) }}
        </div>
      </template>
    </b-table>

    <template v-if="state.processing.get">
      <div class="Tflex Titems-center">
        <small-spinner class="Tmr-2"></small-spinner><span>로딩중입니다.</span>
      </div>
    </template>
    <p v-if="!hasData && !state.processing.get">글이 없습니다.</p>
    <hr />
    <b-button
      class="mx-1"
      :disabled="!checkedAtleastOne"
      variant="danger"
      @click="removePost"
      >삭제</b-button
    >
    <b-button class="mx-1" variant="primary" :to="{ name: 'PostNew' }"
      >새로 추가</b-button
    >
    <hr />
    <div class="pagination-wrapper">
      <b-pagination-nav
        :link-gen="linkGen"
        :number-of-pages="totalPages"
        align="center"
        :value="pageNav"
        use-router
      ></b-pagination-nav>
    </div>

    <!-- <p>페이지: {{ page }}</p> -->
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import { BButton, BFormCheckbox, BTable, BPaginationNav } from 'bootstrap-vue';
import moment from 'moment';
import { queryString, graphql } from '@/loader';
import Info from '@/components/admin/Info.vue';
import { makeSimpleQuery } from '@/api/graphql-client';

const postsAdminReq = makeSimpleQuery('postsAdmin');

moment.locale('ko');

export default {
  name: 'Post',
  components: {
    BButton,
    BPaginationNav,
    BFormCheckbox,
    BTable,
    Info,
    SmallSpinner: () => import('@/components/SmallSpinner'),
  },
  props: ['belongs_to'],
  data() {
    return {
      total: 0,
      state: {
        processing: {
          get: false,
        },
      },
      perpage: 20,
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
          label: '제목',
        },
        {
          key: 'boardTitle',
          label: '게시판',
        },
        {
          key: 'c_date',
          label: '작성일',
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
  watch: {
    $route(to) {
      this.fetchData();
    },
  },
  computed: {
    /** @returns {boolean} */
    hasData() {
      return this.items.length !== 0;
    },
    /** @returns {number} */
    pageNav() {
      return this.page + 1;
    },
    /**
     * params 가 일단 1 이상의 양수로 정의됨.
     * @returns {number}
     * */
    page() {
      const { page } = this.$route.params;
      return page ? parseInt(page, 10) - 1 : 0;
    },
    /** @returns {boolean} */
    checkedAtleastOne() {
      return this.items.findIndex((item) => item.checked === true) !== -1;
    },
    totalPages() {
      const o = Math.ceil(this.total / this.perpage);
      if (o === 0) return 1;
      // console.log('# Orders totalPages o');
      // console.log(o);
      return o;
    },
  },
  async mounted() {
    await this.boardData();
    this.fetchData();

    // console.log('# post mounted');
    // console.log(`${this.belongs_to}, ${this.page}`);
  },
  methods: {
    pushMessage: mapActions(['pushMessage']).pushMessage,
    formatDateFromNow(date) {
      return moment(date).fromNow();
    },
    formatSimpleDate(date) {
      return moment(date).format('YYYY-MM-DD');
    },
    formatDate(date) {
      return moment(date).format('YYYY-MM-DD HH:mm:ss');
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
    async fetchData() {
      this.state.processing.get = true;
      this.items = [];

      // 서버로부터 데이터를 가져옵니다.
      const res = await postsAdminReq(
        {
          condition: {
            page: this.page,
            perpage: this.perpage,
          },
        },
        `{total list {
          id title content excerpt permalink status board c_date
          m_date meta featured_image featured_image_link
        }}`,
      );

      // console.log('# Post.vue fetchData res');
      // console.log(res);

      const { total, list } = res;
      this.total = total;

      const items = [];
      for (const post of list) {
        items.push({
          ...post,
          checked: false,
          boardTitle: this.boards[post.board],
        });
      }
      // console.log(items);
      this.items = items;
      this.state.processing.get = false;
    },
    async removePost() {
      const removing = this.items.filter((item) => item.checked === true);
      // console.log(removing);
      // this.pushMessage({
      //   type: 'info',
      //   msg: JSON.
      //   id: 'removePost'
      // }
      const promises = [];
      removing.forEach((item) => {
        promises.push(
          graphql(queryString.post.removePostMutation, { id: item.id }),
        );
      });
      const result = await Promise.allSettled(promises);
      // console.log(result);

      const completed = result.every(
        (promise) => promise.status === 'fulfilled',
      );

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
      this.fetchData();
    },
    rowClicked(item) {
      this.$router.push({ name: 'PostEdit', params: { id: item.id } });
    },
    linkGen(pageNum) {
      return {
        name: 'AdminPostPaged',
        params: { page: pageNum },
      };
    },
  },
};
</script>

<style lang="scss" scoped>
h2.header {
  font-size: 18px;
  font-weight: bold;
}
.description {
  font-size: 14px;
}
</style>

<style></style>
