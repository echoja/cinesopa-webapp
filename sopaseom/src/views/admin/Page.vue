<template>
  <div>
    <!-- field settings required -->
    <header>
      <h2>{{ belongs_to }}의 페이지 목록</h2>
    </header>
    <div class="actions">
      <b-button :to="{ name: newPageName }">새 페이지</b-button>
    </div>
    <b-table
      hover
      :fields="pageFields"
      :items="pages"
      @row-clicked="rowClicked"
      class="page-table"
    ></b-table>
    <p v-show="!state.dataLoaded">
      <b-spinner label="Spinning" />데이터를 불러오는 중입니다.
    </p>
    <p v-show="hasNoData">해당하는 페이지가 없습니다.</p>
  </div>
</template>

<script>
import { BButton, BSpinner, BTable } from 'bootstrap-vue';
import { dataGraphql, getPagesQuery } from '@/api/graphql-client';
import router from '@/router';

export default {
  name: 'Pages',
  // beforeRouteEnter(to, from, next) {
  //   console.log('Enter!! -');
  //   next();
  // },
  // beforeRouteUpdate(to, from, next) {
  //   console.log(`Update!! - ${this.belongs_to}`);
  //   next();
  // },
  // beforeRouteLeave(to, from, next) {
  //   console.log(`Leave!! - ${this.belongs_to}`);
  //   next();
  // },
  // async beforeRouteUpdate() {

  // },
  async created() {
    await this.getData(this.belongs_to, 0, 10);
  },
  props: ['belongs_to'],
  components: {
    BTable,
    BButton,
    BSpinner,
  },
  computed: {
    /** @returns {string} */
    newPageName() {
      if (this.belongs_to === 'cinesopa') return 'CinesopaNewPage';
      return 'SopaseomNewPage';
    },
    /** @returns {boolean} */
    hasNoData() {
      return this.state.dataLoaded && this.pages.length === 0;
    },
  },
  watch: {
    async belongs_to(newVal) {
      this.pages = [];
      this.state.dataLoaded = false;
      await this.getData(newVal, 0, 10);
    },
  },
  data() {
    return {
      state: {
        dataLoaded: false,
      },
      pages: [],
      pageFields: [
        {
          key: 'checkbox',
          label: '선택',
        },
        {
          key: 'id',
          label: '식별자',
        },
        {
          key: 'permalink',
          label: '식별이름',
        },
        {
          key: 'title',
          label: '제목',
        },
      ],
    };
  },
  methods: {
    async getData(belongsTo, page, perpage) {
      // console.log(`getData - ${belongsTo}`);
      const { pages } = await dataGraphql(getPagesQuery, {
        belongs_to: belongsTo,
        page,
        perpage,
      });
      this.pages = pages;
      this.state.dataLoaded = true;
    },
    rowClicked(item /* , index, event */) {
      // console.log('hi');
      // console.log(this);
      // console.log(item);
      router.push({
        name: 'PageEdit',
        params: { id: item.id, belongs_to: this.belongs_to },
        // props: {  },
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.page-table {
  width: auto;
}
</style>
<style></style>
