<template>
  <div class="my-ordered">
    <h2>주문내역</h2>
    <div class="my-ordered-inner-wrapper">
      <div class="header-wrapper">
        <div class="header">
          <div class="transporting-count">
            <span class="tr-notice bas">배송중</span>
            <span class="tr-extra">{{ transportingCount }}</span>
            <span class="tr-notice">개</span>
          </div>
          <div class="search-condition">
            <div class="predefined-date">
              <!-- @click="items[0].order_date = new Date()" -->
              <b-button class="condition">올해</b-button>
              <b-button class="condition">지난달</b-button>
              <b-button class="condition">이번달</b-button>
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
                v-model="condition.gt_date"
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
                v-model="condition.lt_date"
              >
                <!-- /          <template #button-content>ㅎ하 </template> -->
              </b-form-datepicker>
            </div>
            <div class="order-status-select">
              <b-form-select
                class="condition"
                v-model="condition.order_status"
                :options="orderStatusOptions"
              >
                <!-- <b-form-select-option v-for=""></b-form-select-option> -->
              </b-form-select>
            </div>
            <div class="search-button">
              <b-button class="condition" @click="searchClicked">
                <font-awesome-icon
                  class="search-icon"
                  :icon="['fas', 'search']"
                >
                </font-awesome-icon
                ><span>검색</span>
              </b-button>
            </div>
          </div>
        </div>
      </div>
      <div class="order-list">
        <div
          class="order-list-item-wrapper"
          v-for="(orderItem, orderIndex) in items"
          :key="orderIndex"
        >
          <div class="order-list-item">
            <div class="order-summary">
              <div
                class="order-summary-item"
                v-for="(product, productIndex) in orderItem.products"
                :key="productIndex"
              >
                <div class="order-summary-left">
                  <div class="preview-box">
                    <div
                      class="preview"
                      :style="{
                        'background-image': `url(${product.featued_image_url})`,
                      }"
                    ></div>
                  </div>
                </div>
                <div class="order-summary-right">
                  <div
                    class="order-summary-content"
                    v-if="product.option_type === 'no_option'"
                  >
                    <div class="product-name">
                      {{ product.name }}
                    </div>
                    <div class="product-count">
                      {{ product.options[0].count }}개
                    </div>
                  </div>
                  <div
                    class="order-summary-content"
                    v-else-if="product.option_type === 'has_options'"
                  >
                    <div class="product-name">
                      {{ product.name }}
                    </div>
                    <div class="option-table">
                      <div
                        class="option-row"
                        v-for="(option, optionIndex) in product.options"
                        :key="optionIndex"
                      >
                        <div class="option-cell name">{{ option.name }}</div>
                        <div class="option-cell count">
                          {{ option.count }}개
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="order-actions">
              <div class="info-wrapper">
                <div class="info-row">
                  <div class="info-cell head">주문일</div>
                  <div class="info-cell body">
                    {{ formatDate(orderItem.order_date) }}
                  </div>
                </div>
                <div class="info-row">
                  <div class="info-cell head">주문금액</div>
                  <div class="info-cell body">
                    {{ toPrice(orderItem.order_amount) }}
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
                <b-button>상세정보</b-button>
                <b-button>배송조회</b-button>
                <b-button>교환/반품 신청</b-button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  BButton,
  BFormDatepicker,
  BFormSelect,
  BFormSelectOption,
} from 'bootstrap-vue';
import moment from 'moment';

import { toPrice, statusMap } from '@/util';

export default {
  title: '주문 목록',
  components: { BButton, BFormDatepicker, BFormSelect, BFormSelectOption },
  data() {
    const today = new Date();
    const oneMonthBefore = new Date();
    oneMonthBefore.setMonth(oneMonthBefore.getMonth() - 1);

    return {
      a: 0,
      condition: {
        gt_date: oneMonthBefore,
        lt_date: today,
        order_status: [],
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
        { value: [], text: '전체상태' },
        { value: ['payment_success'], text: '결제완료' },
        { value: ['transporting'], text: '배송중' },
        { value: ['transport_success'], text: '배송완료' },
        { value: ['cancelled'], text: '취소/반품/교환' },
      ],
      items: [
        {
          products: [
            {
              // featured_image_url: require('@/assets/ex1.jpg');
              name: '소파킷 고독 - 기억할 만한 지나침',
              featured_image_url: '',
              option_type: 'has_options',
              options: [
                {
                  name: 'A옵션',
                  count: 2,
                },
                {
                  name: 'B옵션',
                  count: 3,
                },
              ],
            },
            {
              name: '소파킷 파워',
              featured_image_url: '',
              option_type: 'no_option',
              options: [
                {
                  count: 5,
                },
              ],
            },
          ],
          order_date: new Date(),
          order_amount: 347000,
          status: 'transporting',
        },
        {
          products: [
            {
              // featured_image_url: require('@/assets/ex1.jpg');
              name: '소파킷 고독',
              featured_image_url: '',
              option_type: 'has_options',
              options: [
                {
                  name: 'A옵션',
                  count: 2,
                },
                {
                  name: 'B옵션',
                  count: 3,
                },
              ],
            },
            {
              name: '소파킷 파워',
              featured_image_url: '',
              option_type: 'no_option',
              options: [
                {
                  count: 5,
                },
              ],
            },
          ],
          order_date: new Date(),
          order_amount: 347000,
          status: 'transporting',
        },
      ],
    };
  },

  computed: {
    transportingCount() {
      return 1;
    },
    // formatDate() {
    //   console.log('# Myinfo formatDate called');
    //   return (date) => {
    //     console.log(`# Myinfo formatDate actually returning value >> ${Date}`);
    //     return moment(date).format('YYYY. MM. DD');
    //   };
    // },
  },
  methods: {
    searchClicked() {},
    formatDate(date) {
      console.log(
        `# Myinfo formatDate actually returning value MTEHOD >> ${date}`,
      );
      return moment(date).format('YYYY. MM. DD');
    },
    toPrice,
    statusString(status) {
      return statusMap[status];
    },
  },
};
</script>

<style lang="scss" scoped>
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
}

/** header */

.header-wrapper {
  display: flex;
  margin-bottom: 50px;
}

.header {
  display: flex;
  align-items: flex-end;
  padding: 10px 0 20px;
  // padding-bottom: 20px;
  border-bottom: 2px solid #000;
}

.transporting-count {
  line-height: 1;
  padding-right: 30px;
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
.predefined-date,
.search-condition {
  display: flex;
  align-items: stretch;
}

.search-condition {
  padding-left: 30px;
  border-left: 2px solid #000;
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

.order-summary {
  flex: 0 0 500px;
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

.preview-box {
  width: 100px;
  margin-right: 20px;
}
.preview {
  padding-bottom: 100%;
  background-color: #ddd;
}

.product-name {
  font-weight: 500;
}

.option-row,
.product-count {
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
</style>

<style scoped></style>

<style></style>
