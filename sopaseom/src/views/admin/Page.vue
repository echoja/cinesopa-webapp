<template>
  <div>
    <!-- field settings required -->
    <b-table hover :items="pages" @row-clicked="rowClicked"></b-table>
    <p>{{ belongs_to }}의 페이지 목록</p>
    <b-button :to="{name: newPageName}">새 페이지</b-button>

  </div>
</template>

<script>
import { BButton, BTable } from 'bootstrap-vue';
import { dataGraphql, getPagesQuery } from '../../graphql-client';

export default {
  name: 'Pages',
  async created() {
    const { pages } = await dataGraphql(getPagesQuery, {
      belongs_to: 'sopaseom',
      page: 0,
      perpage: 10,
    });
    this.pages = pages;
    console.log('ho');
    console.log(pages);
  },
  props: [
    'belongs_to',
  ],
  components: {
    'b-table': BTable,
    'b-button': BButton,
  },
  computed: {
    newPageName() {
      if (this.belongs_to === 'cinesopa') return 'CinesopaNewPage';
      return 'SopaseomNewPage';
    },
  },
  data() {
    return {
      pages: [],
    };
  },
  methods: {
    rowClicked(item/* , index, event */) {
      console.log('hi');
      console.log(this);
      this.$router.push({ name: 'PageEdit', params: { id: item.id } });
    },
  },

};
</script>

<style>

</style>
