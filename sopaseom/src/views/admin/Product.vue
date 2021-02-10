<template>
  <div class="admin-product">
    <!-- <div class="test">
      페이지:{{ page }} routename: {{ $route.name }} params: {{ $route.params }}
    </div> -->
    <header>
      <h2>소파킷 상품 목록</h2>
      <p>행을 클릭하면 바로 편집합니다.</p>
    </header>
    <b-table hover :items="items" :fields="fields" @row-clicked="rowClicked">
      <template #cell(checkbox)="row">
        <b-form-checkbox v-model="row.item.checked"></b-form-checkbox>
      </template>
      <!-- <template #cell(permalink)="row">
        <div class="text-monospace">
          {{ row.item.id }}
        </div>
      </template> -->
      <template #cell(status)="{ item }">
        {{ item.status === 'public' ? '공개' : '비공개' }}
      </template>
      <!-- <template #cell(c_date)="row">
        <div class="text-monospace">
          {{ formatDate(row.value) }}
        </div>
      </template>
      <template #cell(m_date)="row">
        <div class="text-monospace">
          {{ formatDate(row.value) }}
        </div>
      </template> -->
    </b-table>
    <p v-if="state.processing.get">로딩중입니다.</p>
    <p v-if="!hasData && !state.processing.get">상품이 없습니다.</p>
    <hr />
    <div class="buttons">
      <b-button @click="allCheckClicked">모두 선택</b-button>
      <b-button
        :disabled="!checkedAtleastOne"
        variant="danger"
        @click="$bvModal.show('remove-products-modal')"
        >삭제</b-button
      >
      <b-modal
        id="remove-products-modal"
        @ok="removeClicked"
        title="삭제 확인"
        ok-title="삭제"
        ok-variant="danger"
        cancel-title="취소"
      >
        <p>
          {{ items.filter((item) => item.checked === true).length }} 개의 상품을
          정말로 삭제하시겠습니까?
        </p>
      </b-modal>
      <b-button class="mx-1" variant="primary" :to="{ name: 'AdminProductNew' }"
        >새로 추가</b-button
      >
    </div>
    <div class="pagination-wrapper">
      <b-pagination-nav
        :link-gen="linkGen"
        :number-of-pages="totalPages"
        align="center"
        :value="page"
        use-router
      ></b-pagination-nav>
    </div>

    <!-- <p>페이지: {{ page }}</p> -->
  </div>
</template>

<script>
import { BTable, BButton, BPaginationNav, BFormCheckbox } from 'bootstrap-vue';
import moment from 'moment';
import { graphql, makeRequest } from '@/api/graphql-client';
import { mapActions } from 'vuex';

const productsQuery = `
query productsQuery($condition: ProductSearch!) {
  products(condition: $condition) {
    total
    list {
    id
    status
    kit { num title }
    #  product_type
    #  featured_image_url
    #  featured_image_alt
    #  content_main
    #  content_sub
    #  side_phrase
    #  notice
    name
    #  options {
    #    id
    #    content
    #    left
    #    price
    #  }
    related_film {
    #    poster_url
      title
    #    title_en
    #    prod_date
    #    open_date
    #    genres
    #    show_time
    #    people {
    #      role_type
    #      name
    #      role
    #    }
    #    watch_grade
    #    synopsis
      }
    }
  }
}`;

const removeProductAtServer = makeRequest('removeProduct', {
  type: 'mutation',
  paramList: [
    {
      varName: 'id',
      typeName: 'Int!',
    },
  ],
  resultString: '{success, code}',
});

export default {
  name: 'Product',
  components: {
    BTable,
    BButton,
    BPaginationNav,
    BFormCheckbox,
  },
  data() {
    return {
      page: 1,
      perpage: 4,
      total: 0,
      fields: [
        {
          key: 'checkbox',
          label: '선택',
        },
        {
          key: 'id',
          label: '식별자',
        },
        {
          key: 'name',
          label: '이름',
        },
        {
          key: 'kit',
          label: '키워드',
        },
        {
          key: 'related_film',
          label: '관련 영화',
        },
        {
          key: 'status',
          label: '공개 여부',
        },
      ],
      items: [],
      state: {
        processing: {
          get: false,
        },
      },
    };
  },
  computed: {
    /** @returns {boolean} */
    checkedAll() {
      return this.items.every((value) => value.checked === true);
    },
    /** @returns {boolean} */
    checkedAtleastOne() {
      return this.items.some((value) => value.checked === true);
    },
    /** @returns {number} */
    totalPages() {
      const o = Math.ceil(this.total / this.perpage);
      if (o === 0) return 1;
      // console.log(o);
      return o;
    },
    /** @returns {boolean} */
    hasData() {
      return this.items.length !== 0;
    },
  },
  watch: {
    $route(value) {
      this.page = value.params.page;
      this.fetchData();
    },
  },
  async mounted() {
    // 페이지 설정
    const { page } = this.$route.params;
    if (page) this.page = parseInt(page, 10);

    // 값 받아오기
    await this.fetchData();
  },
  methods: {
    pushMessage: mapActions(['pushMessage']).pushMessage,
    formatDate(date) {
      return moment(date).format('YY-MM-DD hh:mm:ss');
    },
    linkGen(pageNum) {
      return { name: 'AdminProductPaged', params: { page: pageNum } };
    },
    allCheckClicked() {
      if (this.checkedAll) {
        this.items.forEach((item) => {
          item.checked = false;
        });
      } else {
        this.items.forEach((item) => {
          item.checked = true;
        });
      }
    },
    async removeClicked() {
      const promises = this.items
        .filter((item) => item.checked === true)
        .map((item) => removeProductAtServer({ id: item.id }));
      const results = await Promise.allSettled(promises);
      console.log('# Product.vue removeClicked');
      console.log(results);
      this.pushMessage({
        type: 'success',
        msg: `${results.length} 개의 상품을 성공적으로 삭제했습니다.`,
        id: 'removeProductSuccess',
      });
      this.fetchData();
    },
    async fetchData() {
      this.state.processing.get = true;
      const result = await graphql(productsQuery, {
        condition: {
          product_type: 'sopakit',
          page: this.page - 1,
          perpage: this.perpage,
        },
      });
      console.log('# Product fetchData');
      console.log(result);
      const { products } = result.data;
      // 만약 데이터가 없으면 바로 리턴
      if (!products) return;

      // 받아온 Product 데이터 적용
      this.total = products.total;
      const mappedProducts = products.list.map((product) => {
        product.checked = false;
        product.related_film = product?.related_film?.title;
        product.kit = `${product?.kit?.num ?? ''} ${product?.kit?.title ?? ''}`;
        return product;
      });
      this.items = mappedProducts;
      this.state.processing.get = false;
    },
    rowClicked(item) {
      this.$router.push({ name: 'AdminProductEdit', params: { id: item.id } });
    },
  },
};
</script>

<style lang="scss" scoped>
.table {
  width: auto;
}
</style>

<style>
</style>
