<template>
  <div class="admin-orders">
    <header>
      <h2>주문 목록</h2>
      <p>행을 클릭하면 바로 편집합니다.</p>
    </header>
    <div class="filter">
      <div class="fliter-date">
        <h3>날짜</h3>
        <div class="filter-date-row">
          <b-form-datepicker
            class="filter-datepicker"
            value-as-date
            v-model="conditionInput.date_gte"
          ></b-form-datepicker>
          부터
        </div>
        <div class="filter-date-row">
          <b-form-datepicker
            class="filter-datepicker"
            value-as-date
            v-model="conditionInput.date_lte"
          ></b-form-datepicker>
          까지
        </div>
      </div>
      <div class="filter-user">
        <h3>유저</h3>
        <div class="user-search-form">
          <b-form-input
            class="user-search-input"
            size="sm"
            v-model="userFilterInput"
            placeholder="이메일 입력"
          ></b-form-input>
          <b-button size="sm" @click="userFilterInputClicked"
            >유저 검색</b-button
          >
        </div>
        <b-form-select
          :options="userFilterOptions"
          v-model="conditionInput.user"
        ></b-form-select>
      </div>
      <div class="filter-status">
        <h3>상태</h3>
        <b-form-select
          :options="orderStatusOptions"
          v-model="conditionInput.status"
        >
        </b-form-select>
      </div>
      <div class="filter-method">
        <h3>결제 수단</h3>
        <b-form-select :options="methodOptions" v-model="conditionInput.method">
        </b-form-select>
      </div>
      <div class="filter-action">
        <b-button @click="filterClicked" variant="primary">
          <span class="font-weight-bold" >검색</span>
        </b-button>
      </div>
    </div>
    <!-- <pre class="test">
      {{ conditionInput }}
    </pre> -->
    <b-table hover :items="items" :fields="fields" @row-clicked="rowClicked">
      <template #cell(checkbox)="row">
        <b-form-checkbox v-model="row.item.checked"></b-form-checkbox>
      </template>

      <!-- <template #cell(status)="{ item }">
        {{ item.status === 'show' ? '공개' : '비공개' }}
      </template> -->
      <template #cell(c_date)="{ item }">
        <span class="text-break">
          {{ formatDate(item.c_date) }}
        </span>
      </template>
      <template #cell(user)="{ item }">
        <span class="text-break">
          {{ item.user }}
        </span>
      </template>
      <template #cell(status)="{ item }">
        {{ statusMap[item.status] || '-' }}
      </template>
      <!-- 상품 모든 이름 -->
      <template #cell(product_name)="{ item: order }">
        {{
          order.items
            .map((item) => {
              return `${item.product.name}(${item.options
                .map((option) => option.content)
                .join(', ')})`;
            })
            .join(', ')
        }}
      </template>
      <!-- 상품 총 수량 -->
      <template #cell(product_count)="{ item: order }">
        {{
          order.items.reduce(
            (itemAcc, item) =>
              itemAcc +
              item.options.reduce(
                (optionAcc, option) => optionAcc + option.count,
                0,
              ),
            0,
          )
        }}
      </template>
      <!--- 주소행 -->
      <template #cell(dest_name)="{ item: order }">
        <span class="text-break">
          {{ order.dest.name }}
        </span>
      </template>
      <template #cell(dest_phone)="{ item: order }">
        <span class="text-break">
          {{ order.dest.phone }}
        </span>
      </template>
      <template #cell(dest_address)="{ item: order }">
        {{ order.dest.address }} {{ order.dest.address_detail }}
      </template>

      <!--- row details -->
      <template #row-details="{ item, index }">
        <div class="row-details">
          <h2>결제 및 일반 정보</h2>
          <form-row title="유저">
            <p>현재 유저: {{ item.user }}</p>
            <div class="user-search-form">
              <b-form-input
                class="user-search-input"
                size="sm"
                v-model="userSearch"
                placeholder="이메일 입력"
              ></b-form-input>
              <b-button size="sm" @click="userSearchClicked">검색</b-button>
            </div>
            <b-form-select
              :options="userOptions"
              v-model="editing.user"
            ></b-form-select>
            <!-- todo -->
          </form-row>
          <form-row title="상태">
            <b-form-select
              :options="orderStatusOptions"
              v-model="editing.status"
            ></b-form-select>
          </form-row>
          <form-row title="결제 수단">
            {{ paymentMethodMap[editing.method] }}
          </form-row>
          <form-row title="부트페이 영수증 번호">
            {{ editing.bootpay_id || '-' }}
            <b-button v-if="editing.bootpay_id">
              영수증 정보 확인하기
              <!-- todo -->
            </b-button>
          </form-row>
          <form-row title="주문일">
            <b-form-datepicker
              v-model="editing.c_date"
              value-as-date
            ></b-form-datepicker>
          </form-row>
          <form-row title="예상 도착일">
            <b-form-datepicker
              v-model="editing.expected_date"
              value-as-date
            ></b-form-datepicker>
          </form-row>
          <form-row title="주문취소일">
            <b-form-datepicker
              v-model="editing.cancelled_date"
              value-as-date
            ></b-form-datepicker>
          </form-row>
          <form-row title="교환/반품 요청일">
            <b-form-datepicker
              v-model="editing.return_req_date"
              value-as-date
            ></b-form-datepicker>
          </form-row>
          <form-row title="현금영수증 번호"> </form-row>
          <form-row title="택배사"> </form-row>
          <form-row title="송장번호">
            <b-form-input v-model="editing.transport_number"> </b-form-input>
          </form-row>
          <form-row title="배송비">
            {{ toPrice(editing.transport_fee) }}
            <!-- <b-form-input v-model=""> </b-form-input> -->
          </form-row>
          <hr />
          <h2>상품 정보</h2>

          <table>
            <tr>
              <th>상품 이름</th>
              <th>옵션 이름</th>
              <th>수량</th>
              <th>단가</th>
              <th>계</th>
            </tr>
            <template v-for="(item, itemIndex) in editing.items">
              <tr
                v-for="(option, optionIndex) in item.options"
                :key="`$line${item.id}-${optionIndex}`"
              >
                <td :rowspan="item.options.length" v-if="optionIndex === 0">
                  {{ item.product.name }}
                </td>
                <td>{{ option.content }}</td>
                <td>{{ option.count }}</td>
                <td>{{ toPrice(option.price) }}</td>
                <td>{{ toPrice(option.price * option.count) }}</td>
              </tr>
            </template>
            <tr>
              <td class="font-weight-bold">계</td>
              <td>-</td>
              <td>{{ getAllCount(editing) }}</td>
              <td>-</td>
              <td>{{ toPrice(getProductsPrice(editing)) }}</td>
            </tr>
          </table>
          <h2>배송지 정보</h2>
          <form-row title="수취인 이름">
            <b-form-input v-model="editing.dest.name"> </b-form-input>
          </form-row>
          <form-row title="주소">
            <b-form-input v-model="editing.dest.address"> </b-form-input>
          </form-row>
          <form-row title="상세 주소">
            <b-form-input v-model="editing.dest.address_detail"> </b-form-input>
          </form-row>
          <form-row title="연락처">
            <b-form-input v-model="editing.dest.phone"> </b-form-input>
          </form-row>
          <form-row title="요청사항">
            <b-form-input v-model="editing.dest.request"> </b-form-input>
          </form-row>
          <hr />

          <div class="button-group" v-if="editing.mode === 'edit'">
            <loading-button
              :loading="editing.processingRequest"
              variant="primary"
              @click="updateOrderConfirmClicked(index)"
              >변경사항 적용</loading-button
            >
            <b-button @click="updateOrderCancelClicked(index)">취소</b-button>
          </div>
          <pre>
            {{ editing }}
          </pre>
        </div>
      </template>
    </b-table>
    <p v-if="state.processing.get">로딩중입니다.</p>
    <p v-if="!hasData && !state.processing.get">주문이 없습니다.</p>
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
          {{ items.filter((item) => item.checked === true).length }} 개의 주문을
          정말로 삭제하시겠습니까? 다시는 복구할 수 없습니다! 기록은 계속
          남겨놓는 게 좋으며, 유효하지 않은 주문만 삭제해 주세요.
        </p>
      </b-modal>
      <!-- <b-button class="mx-1" variant="primary" @click="createOrderClicked"
        >새로 추가</b-button
      > -->
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
  BFormSelect,
} from 'bootstrap-vue';
import moment from 'moment';
import { makeSimpleMutation, makeSimpleQuery } from '@/api/graphql-client';
import SingleFileSelector from '@/components/admin/SingleFileSelector.vue';
import FormRow from '@/components/admin/FormRow.vue';
import LoadingButton from '@/components/LoadingButton.vue';
import { mapActions } from 'vuex';
import { statusMap, toPrice, paymentMethodMap } from '@/util';

const ordersOnServer = makeSimpleQuery('ordersAdmin');
const removeOrderOnServer = makeSimpleMutation('removeOrder');
const updateOrderOnServer = makeSimpleMutation('updateOrder');
const usersReq = makeSimpleQuery('users');

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
    BFormSelect,
  },
  data() {
    const now = new Date();
    const beforeOneMonth = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate(),
    );
    return {
      userFilterInput: '', // 필터 상에서 검색하는 유저 v-model
      userFilterOptions: [
        {
          value: null,
          text: '검색 후 유저 선택',
        },
      ],
      userSearch: '', // 주문 상세에서 수정할 때 검색하는 유저 v-model
      userOptions: [
        {
          value: null,
          text: '검색 후 유저 선택',
        },
      ],
      conditionInput: {
        date_gte: beforeOneMonth,
        date_lte: now,
        status: null,
        method: null,
        user: null,
      },
      statusMap,
      paymentMethodMap,
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
          key: 'c_date',
          label: '주문일',
        },
        {
          key: 'user',
          label: '유저 이메일',
        },
        {
          key: 'status',
          label: '상태',
        },
        {
          key: 'transport_company',
          label: '택배사',
        },
        {
          key: 'transport_number',
          label: '송장 번호',
        },
        {
          key: 'product_name',
          label: '주문한 물건',
        },
        {
          key: 'product_count',
          label: '총 수량',
        },
        {
          key: 'dest_name',
          label: '수취자 이름',
        },
        {
          key: 'dest_phone',
          label: '수취자 전화번호',
        },
        {
          key: 'dest_address',
          label: '수취자 주소',
        },
      ],
      items: [
        // {
        //   year: 2020,
        //   num: '01',
        //   title: '고독',
        //   'managing-date': new Date('2020-01-01'),
        //   status: 'show',
        //   checked: false,
        // },
      ],
      editing: {
        items: [],
        dest: {},
      },
    };
  },
  computed: {
    page() {
      return this.$route.query.page ?? 1;
    },
    checkedAll() {
      return this.items.every((value) => value.checked === true);
    },
    checkedAtleastOne() {
      return this.items.some((value) => value.checked === true);
    },
    totalPages() {
      const { perpage } = this.receivedCondition;
      const o = Math.ceil(this.total / perpage);
      if (o === 0) return 1;
      console.log('# Orders totalPages o');
      console.log(o);
      return o;
    },
    hasData() {
      return this.items.length !== 0;
    },
    orderStatusOptions() {
      const result = Object.keys(this.statusMap).map((key) => ({
        value: key,
        text: this.statusMap[key],
      }));
      result.push({
        value: null,
        text: '모두',
      });
      return result;
    },
    methodOptions() {
      const result = Object.keys(this.paymentMethodMap).map((key) => ({
        value: key,
        text: this.paymentMethodMap[key],
      }));
      result.push({
        value: null,
        text: '모두',
      });
      return result;
    },
    receivedCondition() {
      const {
        page = 1,
        method = null,
        status = null,
        user = null,
        date_gte = 0,
        date_lte = new Date().getTime(),
      } = this.$route.query;
      const date_lte_added = new Date(date_lte);
      date_lte_added.setDate(date_lte_added.getDate() + 1);
      return {
        page: page - 1,
        method,
        status,
        user,
        date_gte: new Date(date_gte),
        date_lte: date_lte_added,
        perpage: 20,
      };
    },
  },
  watch: {
    $route() {
      this.fetchData();
    },
  },
  async mounted() {
    // 페이지 설정
    // const { page } = this.$route.params;
    // if (page) this.page = page;

    // 값 받아오기
    await this.fetchData();
  },

  methods: {
    ...mapActions(['pushMessage']),
    toPrice,
    getProductsPrice(order) {
      return order.items.reduce(
        (cartitemAcc, cartitem) =>
          cartitemAcc +
          cartitem.options.reduce(
            (optionAcc, option) => optionAcc + option.price * option.count,
            0,
          ),
        0,
      );
    },
    getAllCount(order) {
      return order.items.reduce(
        (cartitemAcc, cartitem) =>
          cartitemAcc +
          cartitem.options.reduce(
            (optionAcc, option) => optionAcc + option.count,
            0,
          ),
        0,
      );
    },
    rowClicked(item, index) {
      console.log('# Orders rowClicked item');
      console.log(item);
      const origin = this.items[index]._showDetails;
      this.items.forEach((itemInLoop) => {
        itemInLoop._showDetails = false;
      });
      this.items[index]._showDetails = !origin;
      if (this.items[index]._showDetails === true) {
        this.editing = { ...this.items[index] };
        this.editing.dest = { ...this.items[index].dest };
      }
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
      return {
        name: 'AdminOrders',
        query: { ...this.$route.query, page: pageNum },
      };
    },
    async userSearchClicked() {
      const { total, list } = await usersReq(
        { condition: { email: this.userSearch } },
        '{total list {email role}}',
      );
      console.log('# Orders usersEarchClicked');
      console.log({ total, list });
      this.userOptions = list.map((user) => ({
        value: user.email,
        text: user.email,
      }));
    },
    async userFilterInputClicked() {
      const { total, list } = await usersReq(
        { condition: { email: this.userFilterInput } },
        '{total list {email role}}',
      );
      console.log('# Orders userFilterInputClicked');
      console.log({ total, list });
      this.userFilterOptions = list.map((user) => ({
        value: user.email,
        text: user.email,
      }));
      this.userFilterOptions.push({
        value: null,
        text: list.length === 0 ? '검색 결과가 없습니다.' : '선택해주세요',
      });
    },

    async filterClicked() {
      const date_lte = this.conditionInput.date_lte
        ? this.conditionInput.date_lte.toISOString()
        : null;
      const date_gte = this.conditionInput.date_gte
        ? this.conditionInput.date_gte.toISOString()
        : null;
      this.$router.push({
        name: 'AdminOrders',
        query: {
          ...this.conditionInput,
          date_lte,
          date_gte,
        },
      });
    },

    async fetchData() {
      this.state.processing.get = true;
      // const { a } = this.$route.query;
      console.log('# Orders fetchData this.receivedCondition');
      console.log(this.receivedCondition);
      const res = await ordersOnServer(
        { condition: this.receivedCondition },
        `{
          total
          list { 
            id user status method c_date expected_date cancelled_date return_req_date 
            cash_receipt transport_number transport_company transport_fee bootpay_id meta 
            items {
              id user added modified product_id usage
              product {
                product_type name featured_image_url featured_image_alt
              }
              options {
                id content price count
              }
            }
            dest {
              name address address_detail phone request
            }
          }
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
      const mappedOrder = res.list.map((order) => ({
        ...order,
        checked: false,
        mode: 'edit',
        processingRequest: false,
        managing_date: new Date(order.managing_date),
        _showDetails: false,
        expected_date: new Date(order.expected_date),
        c_date: new Date(order.c_date),
        cancelled_date: new Date(order.cancelled_date),
        return_req_date: new Date(order.return_req_date),
      }));
      this.items = mappedOrder;
      console.log('# Orders fetchData res');
      console.log(res);
      // console.log(a);
      this.state.processing.get = false;
    },
    async removeClicked() {
      const promises = this.items
        .filter((item) => item.checked === true)
        .map((item) => removeOrderOnServer({ id: item.id }, '{success code}'));
      const results = await Promise.allSettled(promises);
      // console.log('# Orders.vue removeClicked');
      // console.log(results);
      if (results.some((result) => result.status === 'rejected')) {
        this.pushMessage({
          type: 'danger',
          msg: '주문 삭제 도중 오류가 발생했습니다. (로그 확인 필요)',
          id: 'removeOrderFail',
        });
      } else {
        this.pushMessage({
          type: 'success',
          msg: `${results.length} 개의 주문을 성공적으로 삭제했습니다.`,
          id: 'removeOrderSuccess',
        });
      }
      this.fetchData();
    },
    // async createOrderClicked() {
    //   const num = this.items.push({
    //     checked: false,
    //     _showDetails: true,
    //     mode: 'new',
    //   });
    //   console.log('# Orders createOrderClicked num');
    //   console.log(num);
    // },
    // async rowImageSelected(file, index) {
    //   console.log('# Orders rowImageSelected file');
    //   console.log(file);
    //   this.items[index].image_url = file.fileurl;
    //   this.items[index].image_alt = file.alt;

    //   // todo
    // },
    async updateOrderConfirmClicked(index) {
      const item = this.items[index];
      item.processingRequest = true;

      // editing 으로부터 복사
      const { id } = item;
      const inputKeys = [
        'user',
        'status',
        'method',
        'c_date',
        'expected_date',
        'cancelled_date',
        'return_req_date',
        'cash_receipt',
        'transport_number',
        'transport_company',
        'transport_fee',
        'bootpay_id',
      ];

      const input = {};

      inputKeys.forEach((key) => {
        input[key] = this.editing[key];
      });
      input.dest = { ...this.editing.dest };

      // id 타입체크
      if (typeof id !== 'number') {
        console.error(
          '# Orders updateOrderConfirmClicked id가 존재하지 않습니다.',
        );
        this.pushMessage({
          type: 'danger',
          msg: 'Order id가 존재하지 않습니다.',
          id: 'updateOrderNoIdError',
        });
        return;
      }

      const res = await updateOrderOnServer(
        {
          id,
          input,
        },
        '{success code}',
      );
      if (res.success) {
        this.pushMessage({
          type: 'success',
          msg: '주문 업데이트에 성공했습니다.',
          id: 'updateOrderSuccess',
        });
      }
      await this.fetchData();
      item.processingRequest = false;
    },
    async updateOrderCancelClicked(index) {
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
  padding: 30px;
  h2 {
    font-size: 18px;
    border-bottom: 1px solid #ddd;
    padding-bottom: 10px;
    margin-bottom: 20px;
    font-weight: bold;
  }
}
.filter {
  display: flex;
  padding-bottom: 30px;
  // border-bottom: 1px solid #ddd;
  margin-bottom: 30px;
  h3 {
    font-size: 16px;
    font-weight: bold;
  }
  > div {
    margin-right: 15px;
  }
}
.filter-date-row {
  display: flex;
  align-items: center;
}
.filter-datepicker {
  flex: 1;
}
.user-search-form {
  display: flex;
}
.user-search-input {
  flex: 1;
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
