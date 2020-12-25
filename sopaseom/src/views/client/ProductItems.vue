<template>
  <div class="product-list">
    <page-header>
      <div class="page-header-inner-wrapper">
        <h1>상품 목록</h1>
        <div class="search-box">
          <b-form-input
            @keyup.enter="searchEnterKeyupped"
            class="search-input"
            placeholder="검색"
            v-model="search"
          ></b-form-input>
          <b-button class="search-button" @click="searchButtonClicked">
            <font-awesome-icon class="search-icon" :icon="['fas', 'search']">
            </font-awesome-icon>
          </b-button>
        </div>
      </div>
    </page-header>
    <div class="container-fluid">
      <div class="row" v-if="dataFetching">
        <div class="col"><small-spinner></small-spinner> 로딩 중입니다.</div>
      </div>
      <div class="row" v-if="!dataFetching && products.length === 0">
        <div class="col">상품을 찾을 수 없습니다.</div>
      </div>
      <div class="row products-row">
        <div
          v-for="product in products"
          :key="product.id"
          class="col col-12 col-xl-3 col-lg-4 col-md-6 item"
        >
          <div class="featured-image">
            <b-link :to="{ name: 'SopakitDetail', params: { id: product.id } }">
              <b-img
                :src="`${product.featured_image_url}?size=featured`"
                :alt="product.featured_image_alt"
              >
              </b-img>
            </b-link>
          </div>
          <div class="text">
            <p class="title">
              <b-link
                :to="{ name: 'SopakitDetail', params: { id: product.id } }"
              >
                {{ product.name }}
              </b-link>
            </p>
            <p class="meta">
              {{ product.kit ? product.kit.year : '' }}
              {{ product.kit ? product.kit.title : '' }}
            </p>
          </div>
        </div>
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
import {
  BPaginationNav,
  BImg,
  BLink,
  BButton,
  BFormInput,
} from 'bootstrap-vue';
import PageHeader from '@/components/PageHeader.vue';
import SmallSpinner from '@/components/SmallSpinner.vue';

const productsReq = makeSimpleQuery('products');

export default {
  title: '상품 목록',
  components: {
    PageHeader,
    BPaginationNav,
    BImg,
    BLink,
    BButton,
    BFormInput,
    SmallSpinner,
  },
  props: ['productType'],
  data() {
    return {
      search: '',
      dataFetching: false,
      products: [],
      perpage: 30,
      total: 0,
    };
  },
  computed: {
    totalPages() {
      const o = Math.ceil(this.total / this.perpage);
      if (o === 0) return 1;
      return o;
    },
    page() {
      return this.$route.params.page ?? 1;
    },
  },

  watch: {
    $route() {
      this.fetchData();
    },
  },
  async mounted() {
    this.setSearchString();

    await this.fetchData();
  },

  methods: {
    async fetchData() {
      this.dataFetching = true;
      const condition = {
        page: this.page ? parseInt(this.page, 10) - 1 : 0,
        perpage: this.perpage,
        product_type: 'sopakit',
        search: this.search,
      };
      console.log('# ProductItems fetchData condition');
      console.log(condition);
      const res = await productsReq(
        {
          condition,
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
      // console.log('# ProductItems fetchData');
      // console.log(res);
      this.products = res.list;
      this.total = res.total;
      this.dataFetching = false;
    },
    setSearchString() {
      const { search } = this.$route.query;
      this.search = search ?? '';
    },
    searchEnterKeyupped() {
      this.searchProcess();
    },
    searchButtonClicked() {
      this.searchProcess();
    },
    searchProcess() {
      try {
        this.$router
          .push({
            name: 'SopakitAllItems',
            query: {
              search: this.search,
            },
          })
          .catch((err) => {
            console.log('ho');
            console.dir(err);
            this.fetchData();
          });
      } catch (e) {
        console.dir(e);
        this.fetchData();
      }
    },
    linkGen(pageNum) {
      return {
        name: 'SopakitAllItems',
        params: { page: pageNum },
        query: { search: this.search },
      };
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/common';

.container-fluid {
  margin-top: 50px;
}

@include min-with(md) {
  .container-fluid {
    padding: 0;
  }
}

.search-box {
  margin-left: auto;
  height: 100%;
  border-left: 2px solid #000;
  display: flex;
  align-items: center;
}

.search-button.btn-secondary {
  display: inline-block;
  border: 0;
  height: 100%;
}

.search-input.form-control {
  width: 300px;
  height: 100%;
  display: inline-block;
  border: 0;
}

@include max-with(md) {
  .search-input.form-control {
    width: 150px;
  }
}

.featured-image {
  position: relative;
  height: 0;
  width: 100%;
  padding-bottom: 60%;
  img {
    position: absolute;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

// list
p {
  margin: 0;
}

.title a {
  font-size: 18px;
  font-weight: bold;
}

.meta {
  color: #666;
}

.row.products-row {
  margin-bottom: 60px;
  margin-left: -30px;
  margin-right: -30px;
  .col.item {
    margin-bottom: 20px;
    padding-left: 30px;
    padding-right: 30px;
  }
}
</style>

<style scoped></style>

<style></style>
