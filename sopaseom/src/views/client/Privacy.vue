<template>
  <div class="privacy">
    <page-header>
      <div class="page-header-inner-wrapper">
        <h1>{{ page.title }}</h1>
      </div>
    </page-header>

    <div class="content" v-html="page.content"></div>
  </div>
</template>

<script>
import { makeSimpleQuery } from '@/api/graphql-client';
import PageHeader from '@/components/PageHeader.vue';

const getPageReq = makeSimpleQuery('page');

export default {
  title: '개인정보처리방침',
  components: {
    PageHeader,
  },
  data() {
    return {
      page: {
        title: '',
        content: '',
      },
    };
  },
  async mounted() {
    this.fetchData();
  },
  methods: {
    async fetchData() {
      const page = await getPageReq(
        { permalink: 'privacy', belongs_to: 'sopaseom' },
        `
      { 
        id title content permalink c_date m_date role belongs_to meta_json
      }
      `,
      );
      console.log('# Privacy fetchData page');
      console.log(page);
      this.page = page;
    },
  },
};
</script>

<style lang="scss" scoped>
</style>

<style scoped></style>

<style lang="scss">
.content {
  max-width: 700px;
  margin: 30px auto;  
  font-size: 14px;
  h1 {
    font-size: 24px;
    font-weight: bold;
  }
  h2 {
    font-size: 21px;
    font-weight: bold;
  }
  h3 {
    font-size: 18px;
    font-weight: bold;
  }
  h4 {
    font-size: 17px;
    font-weight: bold;
  }
  h5 {
    font-size: 16px;
    font-weight: bold;
  }
  h6 {
    font-size: 15px;
    font-weight: bold;
  }
}
</style>

<style></style>
