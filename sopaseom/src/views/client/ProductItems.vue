<template>
  <div class="product-list">
    <div class="container-fluid">
      <div class="row">
        <div
          v-for="(product, productIndex) in products"
          :key="product.id"
          class="col-lg-4 col-md-6 col-sm-12"
        ></div>
      </div>
      <div class="row">
        <div class="col">
          <!-- 페이지네이션 -->
          <b-pagination-nav
            :link-gen="linkGen"
            :number-of-pages="totalPages"
            align="center"
            :value="page"
            use-router
          ></b-pagination-nav>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { makeSimpleQuery } from '@/api/graphql-client';
import { BPaginationNav } from 'bootstrap-vue';

const productsReq = makeSimpleQuery('products');

export default {
  title: '상품 목록',
  components: {
    BPaginationNav,
  },
  props: ['productType', 'page'],
  data() {
    return {
      products: [],
      perpage: 20,
    };
  },
  computed: {
    totalPages() {
      return 12;
    },
  },
  async mounted() {
    await this.fetchData();
  },
  methods: {
    async fetchData() {
      const res = await productsReq(
        {
          condition: {
            page: parseInt(this.page, 10),
            perpage: this.perpage,
            product_type: 'sopakit',
          },
        },
        `{
          total list {
            id featured_image_url featured_image_alt name
            kit {
              num year title
            }
            related_film {
              title
            }
          }
        }`,
      );

      console.log('# ProductItems fetchData');
      console.log(res);
    },
    linkGen(pageNum) {
      return {
        name: 'SopakitAllItems',
        params: { page: pageNum },
        props: {
          productType: 'sopakit',
        },
      };
    },
  },
};
</script>

<style lang="scss" scoped>
</style>

<style scoped></style>

<style></style>
