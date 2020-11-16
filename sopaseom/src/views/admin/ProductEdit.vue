<template>
  <div>
    <h2>소파킷 상품 {{ mode === 'new' ? '새로 추가' : '편집' }}</h2>
    <h3>기본 사항</h3>
    <hr />
    <form-row title="이름">
      <b-form-input size="sm" v-model="product.name"></b-form-input>
    </form-row>
    <form-row title="종류">
      <b-form-select size="sm" v-model="product.product_type">
        <b-form-select-option value="sopakit">소파킷</b-form-select-option>
      </b-form-select>
    </form-row>
    <form-row title="소파킷 키워드"></form-row>
    <!-- 가나다 순 -->
    <form-row title="연관 영화">
      <b-form-select
        v-for="(film, index) in films"
        :key="index"
      ></b-form-select>
    </form-row>
    <form-row title="공개 여부">
      <b-form-radio-group v-model="product.status">
        <b-form-radio :value="'public'">공개</b-form-radio>
        <b-form-radio :value="'private'">비공개</b-form-radio>
      </b-form-radio-group>
    </form-row>
    <hr />
    <h3>상세 사항</h3>
    <hr />

    <form-row title="대표 이미지">
      <single-file-selector
        :initObj="{
          fileurl: product.featured_image_url,
          label: product.featured_image_alt,
        }"
        @file-selected="featuredImageSelected"
      ></single-file-selector>
      <!-- featured_image_url featured_image_alt -->
    </form-row>
    <form-row title="옵션">
      <b-table :fields="optionFields" :items="product.options">
        <template #cell(id)="{ item }">
          <b-form-input v-model="item.id"></b-form-input>
        </template>
        <template #cell(content)="{ item }">
          <b-form-input v-model="item.content"></b-form-input>
        </template>
        <template #cell(left)="{ item }">
          <b-form-input type="number" number v-model="item.left"></b-form-input>
        </template>
        <template #cell(price)="{ item }">
          <b-form-input
            type="number"
            number
            v-model="item.price"
          ></b-form-input>
        </template>
        <template #cell(remove)="{ index }">
          <b-button @click="removeOptionClicked(index)">&times;</b-button>
        </template>
      </b-table>
      <b-button size="sm" @click="addOptionClicked">옵션 추가</b-button>
    </form-row>
    <!-- <pre>{{ product.options }}</pre> -->
    <form-row title="상단 콘텐츠">
      <!-- :initContent="'<p>1234</p>'"  -->
      <common-editor v-model="product.content_sub" height="600"></common-editor>
      <!-- <div>product.content_sub{{ product.content_sub }}</div> -->
    </form-row>
    <form-row title="하단 콘텐츠">
      <!-- :initContent="'<p>1234</p>'" -->
      <common-editor
        v-model="product.content_main"
        height="600"
      ></common-editor>
      <!-- <div>{{ product.content_main }}</div> -->
    </form-row>
    <form-row title="좌측 사이드 구절">
      <b-form-input v-model="product.side_phrase"> </b-form-input>
    </form-row>
    <form-row title="안내사항 기본값으로 사용">
      <b-form-radio-group v-model="product.is_notice_default">
        <b-form-radio :value="true">예</b-form-radio>
        <b-form-radio :value="false">아니오, 직접 작성</b-form-radio>
      </b-form-radio-group>
    </form-row>
    <form-row v-show="!product.is_notice_default" title="안내사항">
      <common-editor v-model="product.notice" height="600"></common-editor>
      <!-- <div>{{ product.notice }}</div> -->
    </form-row>
    <hr />

    <b-button v-if="mode === 'edit'" @click="updateProductClicked"
      >변경 사항을 적용합니다</b-button
    >
    <b-button v-else-if="mode === 'new'" @click="createProductClicked"
      >새 상품을 추가합니다</b-button
    >
  </div>
</template>

<script>
import {
  BFormInput,
  BFormSelect,
  BFormSelectOption,
  BFormRadioGroup,
  BFormRadio,
  BButton,
  BTable,
} from 'bootstrap-vue';
import { mapActions } from 'vuex';
import { makeRequest } from '@/api/graphql-client';

const getProductFromServer = makeRequest('product', {
  type: 'query',
  paramList: [
    {
      varName: 'id',
      typeName: 'Int!',
    },
  ],
  resultString: `{
  product_type
  status
  featured_image_url
  featured_image_alt
  content_main
  content_sub
  side_phrase
  is_notice_default
  notice
  name
  options {
    id
    content
    left
    price
  }
  related_film {
    id
#    poster_url
#    title
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
}`,
});

const createProductToServer = makeRequest('createProduct', {
  type: 'mutation',
  paramList: [
    {
      varName: 'input',
      typeName: 'ProductInput!',
    },
  ],
  resultString: '{success, code}',
});

const updateProductToServer = makeRequest('updateProduct', {
  type: 'mutation',
  paramList: [
    {
      varName: 'id',
      typeName: 'Int!',
    },
    {
      varName: 'input',
      typeName: 'ProductInput!',
    },
  ],
  resultString: '{success, code}',
});

// console.log('# productEdit test');
// console.log(getProductFromServer);

export default {
  name: 'ProductEdit',
  components: {
    BFormInput,
    BFormSelect,
    BFormSelectOption,
    BFormRadioGroup,
    BFormRadio,
    BButton,
    BTable,
    FormRow: () => import('@/components/admin/FormRow'),
    CommonEditor: () => import('@/components/admin/CommonEditor'),
    SingleFileSelector: () => import('@/components/admin/SingleFileSelector'),
  },
  props: {
    mode: {
      type: String,
      default: 'edit',
    },
  },
  data() {
    return {
      optionFields: [
        {
          key: 'id',
          label: '식별 코드',
        },
        {
          key: 'content',
          label: '옵션 이름',
        },
        {
          key: 'left',
          label: '재고',
        },
        {
          key: 'price',
          label: '가격',
        },
        {
          key: 'remove',
          label: '삭제',
        },
      ],
      films: {},
      product: {
        name: '',
        status: 'public',
        product_type: 'sopakit',
        featured_image_url: '',
        featured_image_alt: '',
        content_main: '',
        content_sub: '',
        side_phrase: '',
        is_notice_default: true,
        notice: '',
        options: [],
      },
    };
  },

  computed: {
    id() {
      return parseInt(this.$route.params.id, 10);
    },
  },

  async mounted() {
    if (this.mode === 'edit') {
      await this.fetchData(this.id);
    }
  },

  methods: {
    ...mapActions(['pushMessage']),
    featuredImageSelected(file) {
      this.product.featured_image_url = file.fileurl;
      const alt = file.alt ? file.alt : file.label;
      this.product.featured_image_alt = alt;
    },
    async updateProductClicked() {
      const result = await updateProductToServer({
        id: this.id,
        input: this.product,
      });
      console.log('# ProductEdit updateProductClicked');
      console.log(result);
      if (result.success) {
        this.pushMessage({
          type: 'success',
          msg: '성공적으로 업데이트 되었습니다.',
          id: 'createProductSuccess',
        });
      } else {
        this.pushMessage({
          type: 'danger',
          msg: `상품을 업데이트 하는 도중 오류가 발생했습니다. > ${result.code}`,
          id: 'updateProductFail',
        });
      }
    },
    async createProductClicked() {
      const result = await createProductToServer({ input: this.product });
      // console.log('# ProductEdit createProductClicked');
      // console.log(result);
      if (result.success) {
        this.$router.push({name: 'AdminProduct' });
        this.pushMessage({
          type: 'success',
          msg: '성공적으로 생성되었습니다.',
          id: 'createProductSuccess',
        });
      } else {
        this.pushMessage({
          type: 'danger',
          msg: `상품을 생성하는 도중 오류가 발생했습니다. > ${result.code}`,
          id: 'createProductFail',
        });
      }
    },
    addOptionClicked() {
      this.product.options.push({});
    },
    removeOptionClicked(index) {
      this.product.options.splice(index, 1);
    },

    async fetchData(id) {
      const product = await getProductFromServer({ id });
      console.log('# ProductEdit fetchData');
      console.log(product);
      if (product) this.product = product;
    },
  },
};
</script>


<style lang="scss" scoped>
h2 {
  margin-bottom: 20px;
}
</style>
<style>
</style>
