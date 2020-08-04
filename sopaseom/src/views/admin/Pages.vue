<template>
  <div>
    <!-- field settings required -->
    <b-table hover :items="pages" @row-clicked="rowClicked"></b-table>


  </div>
</template>

<script>
import { dataGraphql, getPagesQuery } from '../../graphql-client';

export default {
  name: 'Pages',
  async created() {
    const { pages } = await dataGraphql(getPagesQuery); // pagination required
    this.pages = pages;
    console.log(pages);
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
