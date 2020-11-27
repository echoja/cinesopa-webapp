<template>
  <div class="admin-sopakit">
    <header>
      <h2>소파킷 키워드 목록</h2>
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
        {{ item.status === 'show' ? '공개' : '비공개' }}
      </template>
      <template #cell(managing_date)="{ item }">
        {{ formatDate(item.managing_date) }}
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
      <template #row-details="{ item, index }">
        <div class="row-details">
          <form-row title="숫자">
            <b-form-input size="sm" v-model="item.num"></b-form-input>
          </form-row>
          <form-row title="연도">
            <b-form-input
              size="sm"
              v-model="item.year"
              type="number"
              number
            ></b-form-input>
          </form-row>
          <form-row title="이름(제목)">
            <b-form-input size="sm" v-model="item.title"></b-form-input>
          </form-row>
          <form-row title="날짜 (실제 정렬 기준)">
            <b-form-datepicker
              size="sm"
              v-model="item.managing_date"
              value-as-date
            ></b-form-datepicker>
          </form-row>
          <form-row title="설명">
            <b-form-textarea
              size="sm"
              v-model="item.description"
            ></b-form-textarea>
          </form-row>
          <form-row title="목업 이미지">
            <single-file-selector
              :init-fileurl="item.image_url"
              @file-selected="rowImageSelected($event, index)"
            ></single-file-selector>
          </form-row>
          <form-row title="상태">
            <b-form-radio-group v-model="item.status">
              <b-form-radio value="show">공개</b-form-radio>
              <b-form-radio value="hide">비공개</b-form-radio>
            </b-form-radio-group>
          </form-row>
          <hr />
          <div class="button-group" v-if="item.mode === 'new'">
            <loading-button
              :loading="item.processingRequest"
              variant="primary"
              @click="createSopakitConfirmClicked(index)"
              >확인</loading-button
            >
            <b-button @click="createSopakitCancelClicked(index)">취소</b-button>
          </div>
          <div class="button-group" v-else-if="item.mode === 'edit'">
            <loading-button
              :loading="item.processingRequest"
              variant="primary"
              @click="updateSopakitConfirmClicked(index)"
              >변경사항 적용</loading-button
            >
            <b-button @click="updateSopakitCancelClicked(index)">취소</b-button>
          </div>
          <pre>
          {{ item }}

          </pre>
        </div>
      </template>
    </b-table>
    <p v-if="state.processing.get">로딩중입니다.</p>
    <p v-if="!hasData && !state.processing.get">키워드가 없습니다.</p>
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
          {{ items.filter((item) => item.checked === true).length }} 개의
          키워드를 정말로 삭제하시겠습니까?
        </p>
      </b-modal>
      <b-button class="mx-1" variant="primary" @click="createSopakitClicked"
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
  </div>
</template>

<script>
import {
  BButton,
  BFormCheckbox,
  BModal,
  BPaginationNav,
  BTable,
  BFormInput,
  BFormDatepicker,
  BFormTextarea,
  BFormRadioGroup,
  BFormRadio,
} from 'bootstrap-vue';
import moment from 'moment';
import { makeSimpleMutation, makeSimpleQuery } from '@/api/graphql-client';
import SingleFileSelector from '@/components/admin/SingleFileSelector.vue';
import FormRow from '@/components/admin/FormRow.vue';
import LoadingButton from '@/components/LoadingButton.vue';
import { mapActions } from 'vuex';

const removeSopakitOnServer = makeSimpleMutation('removeSopakit');
const createSopakitOnServer = makeSimpleMutation('createSopakit');
const updateSopakitOnServer = makeSimpleMutation('updateSopakit');

export default {
  components: {
    BPaginationNav,
    BModal,
    BButton,
    BTable,
    BFormCheckbox,
    BFormInput,
    BFormDatepicker,
    BFormTextarea,
    SingleFileSelector,
    FormRow,
    LoadingButton,
    BFormRadioGroup,
    BFormRadio,
  },
  data() {
    return {
      page: 1,
      perpage: 4,
      total: 0,
      state: {
        processing: {
          get: false,
        },
      },
      fields: [
        {
          key: 'checkbox',
          label: '선택',
        },
        {
          key: 'year',
          label: '년도',
        },
        {
          key: 'num',
          label: '숫자',
        },
        {
          key: 'title',
          label: '제목',
        },
        {
          key: 'managing_date',
          label: '날짜 (실제 정렬 기준)',
        },
        {
          key: 'status',
          label: '상태',
        },
      ],
      items: [
        {
          year: 2020,
          num: '01',
          title: '고독',
          'managing-date': new Date('2020-01-01'),
          status: 'show',
          checked: false,
        },
      ],
    };
  },
  computed: {
    // page() {
    //   return this.$route.params.page ?? 0;
    // },
    checkedAll() {
      return this.items.every((value) => value.checked === true);
    },
    checkedAtleastOne() {
      return this.items.some((value) => value.checked === true);
    },
    totalPages() {
      const o = Math.ceil(this.total / this.perpage);
      if (o === 0) return 1;
      // console.log(o);
      return o;
    },
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
    if (page) this.page = page;

    // 값 받아오기
    await this.fetchData();
  },

  methods: {
    ...mapActions(['pushMessage']),
    rowClicked(item, index) {
      console.log('# Sopakit rowClicked item');
      console.log(item);
      this.items[index]._showDetails = !this.items[index]._showDetails;
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
    formatDate(date) {
      return moment(date).format('YYYY.MM.DD');
    },
    linkGen(pageNum) {
      return { name: 'AdminSopakitPaged', params: { page: pageNum } };
    },
    async fetchData() {
      this.state.processing.get = true;
      const fetchFromServer = makeSimpleQuery('sopakitsAdmin');
      const res = await fetchFromServer(
        { condition: { page: this.page - 1, perpage: 10 } },
        `{
        total list { id num title year managing_date description image_url image_alt status}
      }`,
      );
      // const result = await graphql(productsQuery, {
      //   condition: {
      //     product_type: 'sopakit',
      //     page: parseInt(this.page, 10) - 1,
      //     perpage: parseInt(this.perpage, 10),
      //   },
      // });
      this.total = res.total;
      const mappedSopakit = res.list.map((sopakit) => ({
        ...sopakit,
        checked: false,
        mode: 'edit',
        processingRequest: false,
        managing_date: new Date(sopakit.managing_date),
        _showDetails: false,
      }));
      this.items = mappedSopakit;
      // console.log('# Sopakit fetchData res');
      // console.log(res);
      this.state.processing.get = false;
    },
    async removeClicked() {
      const promises = this.items
        .filter((item) => item.checked === true)
        .map((item) =>
          removeSopakitOnServer({ id: item.id }, '{success code}'),
        );
      const results = await Promise.allSettled(promises);
      // console.log('# Sopakit.vue removeClicked');
      // console.log(results);
      if (results.some((result) => result.status === 'rejected')) {
        this.pushMessage({
          type: 'danger',
          msg: '소파킷 삭제 도중 오류가 발생했습니다. (로그 확인 필요)',
          id: 'removeSopakitFail',
        });
      } else {
        this.pushMessage({
          type: 'success',
          msg: `${results.length} 개의 소파킷을을 성공적으로 삭제했습니다.`,
          id: 'removeSopakitSuccess',
        });
      }
      this.fetchData();
    },
    async createSopakitClicked() {
      const num = this.items.push({
        checked: false,
        _showDetails: true,
        mode: 'new',
      });
      console.log('# Sopakit createSopakitClicked num');
      console.log(num);
    },
    async rowImageSelected(file, index) {
      console.log('# Sopakit rowImageSelected file');
      console.log(file);
      this.items[index].image_url = file.fileurl;
      this.items[index].image_alt = file.alt;

      // todo
    },
    async createSopakitConfirmClicked(index) {
      const item = this.items[index];
      item.processingRequest = true;
      const {
        num = '',
        title = '',
        year = 0,
        managing_date = new Date(),
        description = '',
        image_url = '',
        image_alt = '',
        status = 'show',
      } = item;
      const res = await createSopakitOnServer(
        {
          input: {
            num,
            title,
            year,
            managing_date,
            description,
            image_url,
            image_alt,
            status,
          },
        },
        `{
        success code
      }`,
      );
      // console.log('# Sopakit createSopakitConfirmClicked res');
      // console.log(res);

      await this.fetchData();
      item.processingRequest = false;
    },
    async createSopakitCancelClicked(index) {
      await this.fetchData();
    },
    async updateSopakitConfirmClicked(index) {
      const item = this.items[index];
      item.processingRequest = true;
      const {
        id,
        num = '',
        title = '',
        year = 0,
        managing_date = new Date(),
        description = '',
        image_url = '',
        image_alt = '',
        status = 'show',
      } = item;

      if (typeof id !== 'number') {
        console.error(
          '# Sopakit updateSopakitConfirmClicked id가 존재하지 않습니다.',
        );
        this.pushMessage({
          type: 'danger',
          msg: 'Sopakit id가 존재하지 않습니다.',
          id: 'updateSopakitNoIdError',
        });
        return;
      }

      const res = await updateSopakitOnServer(
        {
          id,
          input: {
            num,
            title,
            year,
            managing_date,
            description,
            image_url,
            image_alt,
            status,
          },
        },
        '{success code}',
      );
      if (res.success) {
        this.pushMessage({
          type: 'success',
          msg: '소파킷 업데이트에 성공했습니다.',
          id: 'updateSopakitSuccess',
        });
      }
      await this.fetchData();
      item.processingRequest = false;
    },
    async updateSopakitCancelClicked(index) {
      await this.fetchData();
    },
  },
};
</script>

<style lang="scss" scoped>
.table {
  width: auto;
  min-width: 700px;
}
.row-details {
  border: 1px solid #ddd;
}
</style>

<style lang="scss">
.table-hover tbody .b-table-details:hover {
  background-color: inherit;
  color: currentColor;
}
</style>

<style>
</style>
