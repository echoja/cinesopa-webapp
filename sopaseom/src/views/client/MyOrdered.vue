<template>
  <div class="my-ordered">
    <h2>주문내역</h2>
    <div class="my-ordered-inner-wrapper">
      <div class="header-wrapper">
        <div class="header">
          <div class="transporting-count">
            <span class="tr-notice bas">배송중</span>
            <span class="tr-extra">{{ transporting }}</span>
            <span class="tr-notice">개</span>
          </div>
          <div class="search-condition">
            <div class="predefined-date">
              <!-- @click="items[0].c_date = new Date()" -->
              <b-button class="condition" @click="lastYearClicked"
                >1년</b-button
              >
              <b-button class="condition" @click="last6MonthClicked"
                >6개월</b-button
              >
              <b-button class="condition" @click="lastMonthClicked"
                >1개월</b-button
              >
            </div>
            <div class="date-select">
              <b-form-datepicker
                class="condition"
                value-as-date
                :date-format-options="{
                  year: 'numeric',
                  month: 'numeric',
                  day: 'numeric',
                }"
                v-model="condition.date_gte"
              >
              </b-form-datepicker>
              <span> ~ </span>
              <b-form-datepicker
                class="condition"
                value-as-date
                :date-format-options="{
                  year: 'numeric',
                  month: 'numeric',
                  day: 'numeric',
                }"
                v-model="condition.date_lte"
              >
                <!-- /          <template #button-content>ㅎ하 </template> -->
              </b-form-datepicker>
            </div>
            <div class="order-status-select">
              <b-form-select
                class="condition"
                v-model="condition.status"
                :options="orderStatusOptions"
              >
                <!-- <b-form-select-option v-for=""></b-form-select-option> -->
              </b-form-select>
            </div>
            <div class="search-button">
              <loading-button
                :loading="loading"
                class="condition"
                @click="searchClicked"
                ref="searchButton"
              >
                <font-awesome-icon
                  class="search-icon"
                  :icon="['fas', 'search']"
                >
                </font-awesome-icon
                ><span>검색</span>
              </loading-button>
            </div>
          </div>
        </div>
      </div>
      <div class="order-list">
        <div
          class="order-list-item-wrapper no-result"
          v-if="!loading && orders.length === 0"
        >
          결과가 없습니다.
        </div>
        <div
          class="order-list-item-wrapper"
          v-for="(orderItem, orderIndex) in orders"
          :key="orderIndex"
        >
          <div class="order-list-item">
            <div class="order-summary">
              <div
                class="order-summary-item"
                v-for="(cartitem, cartitemIndex) in orderItem.items"
                :key="cartitemIndex"
              >
                <div class="order-summary-left">
                  <div class="preview-box">
                    <div
                      class="preview"
                      :style="{
                        'background-image': `url(${cartitem.product.featured_image_url})`,
                      }"
                    ></div>
                  </div>
                </div>
                <div class="order-summary-right">
                  <div class="order-summary-content">
                    <!-- v-if="cartitem.option_type === 'no_option'" -->
                    <div class="cartitem-name">
                      <b-link
                        :to="{
                          name: 'SopakitDetail',
                          params: { id: cartitem.product_id },
                        }"
                      >
                        {{ cartitem.product.name }}
                      </b-link>
                    </div>
                    <!-- 옵션 하나 -->
                    <div
                      class="cartitem-count"
                      v-if="cartitem.options.length <= 1"
                    >
                      {{ cartitem.options[0].count }}개
                    </div>
                    <!-- 옵션 여러개 -->
                    <div
                      class="option-table"
                      v-else-if="cartitem.options.length > 1"
                    >
                      <div
                        class="option-row"
                        v-for="(option, optionIndex) in cartitem.options"
                        :key="optionIndex"
                      >
                        <div class="option-cell name">{{ option.content }}</div>
                        <div class="option-cell count">
                          {{ option.count }}개
                        </div>
                      </div>
                    </div>
                  </div>
                  <!-- <div
                    class="order-summary-content"
                    v-else-if="cartitem.options.length > 1"
                  >
                    <div class="cartitem-name">
                      <b-link
                        :to="{
                          name: 'SopakitDetail',
                          params: { id: cartitem.product_id },
                        }"
                      >
                        {{ cartitem.product.name }}
                      </b-link>
                    </div>
                    <div class="option-table">
                      <div
                        class="option-row"
                        v-for="(option, optionIndex) in cartitem.options"
                        :key="optionIndex"
                      >
                        <div class="option-cell name">{{ option.content }}</div>
                        <div class="option-cell count">
                          {{ option.count }}개
                        </div>
                      </div>
                    </div>
                  </div> -->
                </div>
              </div>
            </div>
            <div class="order-actions">
              <div class="info-wrapper">
                <div class="info-row">
                  <div class="info-cell head">주문일</div>
                  <div class="info-cell body">
                    {{ formatDate(orderItem.c_date) }}
                  </div>
                </div>
                <div class="info-row">
                  <div class="info-cell head">주문금액</div>
                  <div class="info-cell body">
                    {{ toPrice(orderItem.amount) }}
                  </div>
                </div>
                <div class="info-row">
                  <div class="info-cell head">상태</div>
                  <div class="info-cell body">
                    {{ statusString(orderItem.status) }}
                  </div>
                </div>
              </div>
              <div class="buttons-wrapper">
                <b-button @click="showDetailClicked(orderIndex)"
                  >상세정보</b-button
                >
                <b-button
                  v-if="showTransportSearchButton(orderItem.status)"
                  @click="showTrackClicked(orderIndex)"
                  >배송조회</b-button
                >
                <b-button @click="reqExchangeClicked(orderIndex)"
                  >교환/반품 신청</b-button
                >
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 페이지네이션 -->
    <b-pagination-nav
      class="myordered-pagination"
      :link-gen="linkGen"
      :number-of-pages="totalPages"
      align="center"
      :value="condition.page"
      use-router
    ></b-pagination-nav>

    <!-- 상세 정보 modal -->
    <b-modal id="order-detail" title="주문 상세 정보" size="xl" hide-footer>
      <h2>상품 정보</h2>
      <div class="order-summary">
        <div
          class="order-summary-item"
          v-for="(cartitem, cartitemIndex) in detail.items"
          :key="cartitemIndex"
        >
          <div class="order-summary-left">
            <div class="preview-box">
              <div
                class="preview"
                :style="{
                  'background-image': `url(${cartitem.product.featured_image_url})`,
                }"
              ></div>
            </div>
          </div>
          <div class="order-summary-right">
            <div class="order-summary-content">
              <!-- v-if="cartitem.option_type === 'no_option'" -->
              <div class="cartitem-name">
                <b-link
                  :to="{
                    name: 'SopakitDetail',
                    params: { id: cartitem.product_id },
                  }"
                >
                  {{ cartitem.product.name }}
                </b-link>
              </div>
              <!-- 옵션 하나 -->
              <div class="cartitem-count" v-if="cartitem.options.length <= 1">
                {{ cartitem.options[0].count }}개
              </div>
              <!-- 옵션 여러개 -->
              <div class="option-table" v-else-if="cartitem.options.length > 1">
                <div
                  class="option-row"
                  v-for="(option, optionIndex) in cartitem.options"
                  :key="optionIndex"
                >
                  <div class="option-cell name">{{ option.content }}</div>
                  <div class="option-cell count">{{ option.count }}개</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <h2>받는 사람 정보</h2>
      <b-table-lite
        thead-class="sr-only"
        :fields="destFields"
        :items="detailDestItems"
        class="detail-dest-table"
      >
      </b-table-lite>
      <h2>결제 정보</h2>
      <div class="detail-payment-info">
        <div class="payment-method-info">
          <div class="payment-method-content">
            <span class="font-weight-bold"> 결제 수단 </span>
            <br />
            <span> {{ paymentMethodsLabel(detail.method) }} </span>
          </div>
          <div class="payment-buttons">
            <b-button size="sm">거래명세서</b-button>
          </div>
        </div>
        <div class="price-info">
          <div class="info-row">
            <div class="info-cell head">총 상품 금액</div>
            <div class="info-cell body">
              {{ toPrice(detail.productsPrice || 0) }}
            </div>
          </div>
          <div class="info-row">
            <div class="info-cell head">배송비</div>
            <div class="info-cell body">
              {{ toPrice(detail.transport_fee || 0) }}
            </div>
          </div>
          <hr />
          <div class="info-row">
            <div class="info-cell head">총 결제 금액</div>
            <div class="info-cell body bold">
              {{ toPrice(detail.amount || 0) }}
            </div>
          </div>
        </div>
      </div>
      <!-- <pre>
      {{ detail }}
      </pre> -->
    </b-modal>
  </div>
</template>

<script>
import {
  BButton,
  BFormDatepicker,
  BFormSelect,
  BFormSelectOption,
  BLink,
  BTableLite,
  BPaginationNav,
} from 'bootstrap-vue';
import moment from 'moment';

import { toPrice, statusMap } from '@/util';
import { makeSimpleQuery } from '@/api/graphql-client';
import LoadingButton from '@/components/LoadingButton.vue';

const myOrdersReq = makeSimpleQuery('myOrders');

const destLabelMap = {
  name: '이름',
  address: '주소',
  address_detail: '상세 주소',
  phone: '연락처',
  request: '요청사항',
};

const paymentMethodLabelMap = {
  card: '신용카드/체크카드',
  nobank: '무통장입금',
  bank: '계좌이체',
  phone: '휴대폰결제',
};

/**
 * 결제 확인중: 취소
 * 결제 완료: 결제 취소
 * 배송중: 교환/반품 신청
 * 배송완료: 교환/반품 신청
 * 
 */

export default {
  title: '주문 목록',
  components: {
    BButton,
    BFormDatepicker,
    BFormSelect,
    BFormSelectOption,
    BTableLite,
    BLink,
    LoadingButton,
    BPaginationNav,
  },
  data() {
    const today = new Date();
    const oneMonthBefore = new Date();
    oneMonthBefore.setMonth(oneMonthBefore.getMonth() - 1);

    return {
      a: 0,
      total: 0,
      detail: {},
      destFields: [
        {
          isRowHeader: true,
          key: 'title',
          label: '이름',
        },
        {
          key: 'content',
          label: '주소',
        },
      ],
      loading: false,
      transporting: 0,
      condition: {
        date_gte: oneMonthBefore,
        date_lte: today,
        status: '',
        page: 1,
        perpage: 10,
      },
      //       'order_received', // "주문접수",
      // 'payment_confirming', // "결제확인중",
      // 'payment_success', // "결제완료",
      // 'product_loading', // "상품준비중",
      // 'transport_preparing', // "배송준비중",
      // 'transporting', // "배송중",
      // 'transport_success', // "배송완료",
      // 'deal_success', // "거래완료",
      // 'returning', // "반송중",
      // 'order_cancelling', // "주문취소중",
      // 'order_cancelled', // "주문취소",

      orderStatusOptions: [
        { value: '', text: '전체상태' },
        { value: 'payment_confirming', text: '결제확인중' },
        { value: 'payment_success', text: '결제완료' },
        { value: 'transporting', text: '배송중' },
        { value: 'transport_success', text: '배송완료' },
        { value: 'cancelled', text: '주문취소' },
      ],
      orders: [
        {
          items: [
            {
              // featured_image_url: require('@/assets/ex1.jpg');
              product: {
                name: '소파킷 고독 - 기억할 만한 지나침',
                featured_image_url: '',
              },
              options: [
                {
                  content: 'A옵션',
                  count: 2,
                },
                {
                  content: 'B옵션',
                  count: 3,
                },
              ],
            },
            {
              product: {
                name: '소파킷 파워',
                featured_image_url: '',
              },
              options: [
                {
                  count: 5,
                },
              ],
            },
          ],
          c_date: new Date(),
          amount: 347000,
          status: 'transporting',
        },
        {
          items: [
            {
              // featured_image_url: require('@/assets/ex1.jpg');
              product: {
                name: '소파킷 고독',
                featured_image_url: '',
              },
              options: [
                {
                  content: 'A옵션',
                  count: 2,
                },
                {
                  content: 'B옵션',
                  count: 3,
                },
              ],
            },
            {
              product: {
                name: '소파킷 파워',
                featured_image_url: '',
              },
              options: [
                {
                  count: 5,
                },
              ],
            },
          ],
          c_date: new Date(),
          amount: 347000,
          status: 'transporting',
        },
      ],
    };
  },

  computed: {
    detailDestItems() {
      return Object.keys(this.detail.dest ?? []).map((destKey) => ({
        title: destLabelMap[destKey],
        content: this.detail?.dest?.[destKey],
      }));
    },
    totalPages() {
      return this.total > 0
        ? Math.ceil(this.total / this.condition.perpage)
        : 1;
    },
    // detailProductPrice() {
    //   console.log('# MyOrdered computed detailProductPrice');
    //   console.log(this.detail.options);
    //   console.log(this.detail);
    //   return (this.detail.options ?? []).reduce(
    //     (acc, option) => acc + option.count * option.price,
    //     0,
    //   );
    // },
    // transportingCount() {
    //   // 문제임. 현재 페이지 기준으로 order를 필터하고 있으므로 페이지 이외에 것이 반영이 안됨.
    //   // 예를 들어 1페이지와 2페이지의 개수가 달라짐.
    //   return this.orders.filter((order) => order.status === 'transporting')
    //     .length;
    //   // return 1;
    // },
    // formatDate() {
    //   console.log('# Myinfo formatDate called');
    //   return (date) => {
    //     console.log(`# Myinfo formatDate actually returning value >> ${Date}`);
    //     return moment(date).format('YYYY. MM. DD');
    //   };
    // },
  },
  watch: {
    $route(to) {
      this.fetchData();
    },
  },
  async mounted() {
    this.fetchData();
  },
  methods: {
    lastYearClicked(event) {
      const lastYear = new Date();
      lastYear.setFullYear(lastYear.getFullYear() - 1);
      this.condition.date_gte = lastYear;
      this.condition.date_lte = new Date();
      this.blurButtonFromEvent(event);
    },
    last6MonthClicked(event) {
      const last6Month = new Date();
      last6Month.setMonth(last6Month.getMonth() - 6);
      this.condition.date_gte = last6Month;
      this.condition.date_lte = new Date();
      this.blurButtonFromEvent(event);
    },
    lastMonthClicked(event) {
      const lastMonth = new Date();
      lastMonth.setMonth(lastMonth.getMonth() - 1);
      this.condition.date_gte = lastMonth;
      this.condition.date_lte = new Date();
      this.blurButtonFromEvent(event);
    },
    blurButtonFromEvent(event) {
      const { target } = event;
      // console.log(target);
      this.$nextTick(() => {
        target.blur();
      });
    },
    async searchClicked() {
      this.loading = true;
      await this.fetchData();
      const e = { target: this.$refs.searchButton.$el };
      this.blurButtonFromEvent(e);
      this.loading = false;
    },
    paymentMethodsLabel(key) {
      return paymentMethodLabelMap[key];
    },
    formatDate(date) {
      // console.log(
      //   `# Myinfo formatDate actually returning value MTEHOD >> ${date}`,
      // );
      return moment(date).format('YYYY. MM. DD');
    },
    toPrice,
    statusString(status) {
      return statusMap[status];
    },
    async fetchData() {
      // 페이지 정보 가져오기.
      this.condition.page = parseInt(this.$route.params.page, 10) || 1;

      // 조건 생성
      const condition = { ...this.condition };
      condition.page -= 1;
      const { total, list, transporting } = await myOrdersReq(
        { condition },
        `{
          transporting total list {
            user status method c_date expected_date cancelled_date return_req_date cash_receipt
            transport_number transport_fee transport_company bootpay_id 
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
      console.log('# MyOrdered fetchData res');
      console.dir({ total, list, transporting });
      this.total = total;

      // 입력값 다듬기
      list.forEach((order) => {
        order.productsPrice = this.getProductsPrice(order);
        order.amount = order.productsPrice + order.transport_fee ?? 0; // 배송비가 있다면 추가시켜주기.
      });

      // observable 데이터와 바인드
      this.orders = list;
      this.transporting = transporting;
    },
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
    showTransportSearchButton(status) {
      return [
        'deal_success',
        'transporting',
        'transport_success',
        'returning',
      ].includes(status);
    },
    showDetailClicked(orderIndex) {
      this.detail = { ...this.orders[orderIndex] };
      this.$bvModal.show('order-detail');
      // todo
    },
    showTrackClicked(orderIndex) {
      // todo
    },
    reqExchangeClicked(orderIndex) {
      // todo
    },
    linkGen(pageNum) {
      return { name: 'MyOrdered', params: { page: pageNum } };
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/common';
// .search-condition {
//   display: flex;
//   align-items: stretch;
// }

// .predefined-date {
//   display: flex;
//   align-items: stretch;
// }

$condition-margin: 6px;

h2 {
  font-size: 20px;
  font-weight: bold;
}

.my-ordered {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.my-ordered-inner-wrapper {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  margin-bottom: 30px;
}

/** header */

.header-wrapper {
  display: flex;
  margin-bottom: 50px;
}

@include max-with(lg) {
  .header-wrapper {
    margin-bottom: 10px;
  }
}

.header {
  // display: flex;
  align-items: flex-end;
  padding: 10px 0 20px;
  // padding-bottom: 20px;
  border-bottom: 2px solid #000;
}

@include max-with(xl) {
  .header {
    display: block;
  }
}

.transporting-count {
  line-height: 1;
  margin-bottom: 15px;
}
.tr-extra {
  font-size: 30px;
  font-weight: bold;
}

.tr-notice {
  font-size: 14px;
}

.tr-notice.bas {
  padding-right: 20px;
}

.search-button,
.predefined-date {
  display: flex;
  align-items: stretch;
}

.search-condition {
  display: flex;
  flex-wrap: wrap;
  align-items: stretch;
  > div {
    padding-bottom: 10px;
  }
  // padding-left: 30px;
  // border-left: 2px solid #000;
  // margin-left: 30px;
}

.date-select {
  display: flex;
}

button.condition {
  font-size: 14px;
  padding: 3px 10px;
}

select.condition {
  font-size: 14px;
  border-color: #000;
  display: block;
  width: 140px;
}

.b-form-datepicker.condition {
  font-size: 13px;
  border-color: #000;
  min-width: 140px;
}

.condition {
  margin: 0 $condition-margin / 2;
}
.search-button .btn {
  font-weight: bold;
}

.search-button .search-icon {
  margin-right: 5px;
}

/** order-list */

.order-list-item-wrapper {
  padding: 20px 0;
  border-bottom: 1px solid #000;
}

.order-list-item {
  display: flex;
}

@include max-with(lg) {
  .order-list-item {
    display: block;
  }
}

.order-summary {
  flex: 0 0 calc(20vw + 100px);
}
.order-summary-item {
  display: flex;
  margin-bottom: 20px;
}

.order-actions {
  padding-left: 20px;
  border-left: 1px solid #aaa;
  flex: 1;
  font-size: 14px;
}

@include max-with(lg) {
  .order-actions {
    padding-left: 0;
    border: 0;
  }
}

.preview-box {
  width: 100px;
  margin-right: 20px;
}
.preview {
  padding-bottom: 100%;
  background-color: #ddd;
  background-size: cover;
  background-position: center;
}

.cartitem-name {
  font-weight: 500;
}

.option-row,
.cartitem-count {
  display: flex;
  font-size: 14px;
  color: #585858;
}

.option-cell.name {
  padding-right: 10px;
}

.info-wrapper {
  margin-bottom: 20px;
}

.info-row {
  display: flex;
  margin-bottom: 5px;
}

.info-cell.head {
  flex: 0 0 80px;
  font-weight: 500;
}

.buttons-wrapper {
  display: flex;
  align-items: flex-start;
  flex-direction: column;
}

.buttons-wrapper .btn {
  font-size: 12px;
  padding: 3px 7px 4px;
  margin: 3px 0;
}

@include max-with(lg) {
  .buttons-wrapper {
    flex-direction: row;
    .btn {
      margin-right: 10px;
    }
  }
}

// details
.detail-payment-info {
  display: flex;
  // justify-content: space-between;
  .info-cell.head {
    flex: 1 1 auto;
    margin-right: 30px;
  }
  .info-cell.bold {
    font-size: 120%;
    font-weight: bold;
  }
  .info-row {
    align-items: center;
  }

  .payment-method-info,
  .price-info {
    padding: 30px;
    // background-color: #f4f4f4;
  }
}

@include max-with(md) {
  .detail-payment-info {
    display: block;
  }
}

.myordered-pagination {
  
  align-self: stretch;
}
</style>

<style scoped></style>

<style></style>
