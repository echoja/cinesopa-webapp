<template>
  <div class="my-ordered">
    <h2 class="my-ordered-head">
      진행 중인 주문
      <!--<small class="pl-2 head-small">최근 3주 기준</small>-->
    </h2>

    <div class="Tblock lg:Tflex Tjustify-between Titems-stretch Tw-full Tmb-16">
      <!-- count summary -->
      <div class="Tauto-cols-max Tgrid Tauto-rows-max Tgrid-cols-7 Tmb-3">
        <template v-for="(countHeader, countHeaderIndex) in summaryGrid">
          <div
            class="summary-grid-item Tfont-medium Tmb-3"
            :key="`head-${countHeader.key}`"
          >
            {{ countHeader.label }}
          </div>
          <div
            v-if="countHeaderIndex !== summaryGrid.length - 1"
            class="summary-grid-item"
            :key="`blank-${countHeader.key}`"
          ></div>
        </template>

        <template v-for="(countHeader, countHeaderIndex) in summaryGrid">
          <div class="summary-grid-item" :key="`count-${countHeader.key}`">
            <!-- 숫자 링크 (누르면 필터링됨) -->
            <b-link
              class="Tfont-bold Ttext-4xl"
              @click="statusCountClicked(countHeader.key)"
            >
              <template v-if="countMap[countHeader.key] === 0">
                {{ countMap[countHeader.key] }}
              </template>
              <u v-else>{{ countMap[countHeader.key] }}</u>
            </b-link>
          </div>
          <div
            v-if="countHeaderIndex !== summaryGrid.length - 1"
            class="summary-grid-item"
            :key="`arrow-${countHeader.key}`"
          >
            <svg-next :style="{ width: '20px' }"></svg-next>
          </div>
        </template>
      </div>
    </div>

    <h2 class="my-ordered-head">주문/결제내역</h2>
    <div class="my-ordered-inner-wrapper">
      <div class="Tmb-4 lg:Tflex">
        <div class="Tborder-b-2 Tborder-black">
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
                locale="ko-KR"
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
                locale="ko-KR"
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
      <div class="order-list Tmb-4">
        <div
          class="order-list-item-wrapper no-result"
          v-if="!loading && orders.length === 0"
        >
          결과가 없습니다.
        </div>
        <div
          class="Tmb-5 Tborder-b"
          v-for="(orderItem, orderIndex) in orders"
          :key="orderIndex"
        >
          <div class="Tblock lg:Tflex lg:Tjustify-between Tmb-3 lg:Tmb-0">
            <!-- why not? -->
            <!-- 각 항목 왼쪽 -->
            <div
              class="Tflex Tmb-5"
              v-for="(cartitem, cartitemIndex) in orderItem.items"
              :key="cartitemIndex"
            >
              <!-- 미리보기 이미지 -->
              <div class="order-summary-left Tflex Titems-center">
                <div class="preview-box">
                  <div
                    class="pb-full Tbg-gray-200 Tbg-cover Tbg-center"
                    :style="{
                      'background-image': `url(${cartitem.product.featured_image_url})`,
                    }"
                  ></div>
                </div>
              </div>
              <div class="order-summary-right">
                <div class="order-summary-content">
                  <!-- 제목 -->
                  <div class="Tfont-medium">
                    <b-link
                      :to="{
                        name: 'SopakitDetail',
                        params: { id: cartitem.product_id },
                      }"
                    >
                      {{ cartitem.product.name }}
                    </b-link>
                  </div>
                  <!-- 옵션 -->
                  <div class="Tmb-1">
                    <!-- 옵션 하나 -->
                    <div class="" v-if="cartitem.options.length <= 1">
                      {{ cartitem.options[0].count }}개
                    </div>
                    <!-- 옵션 여러개 -->
                    <div
                      class="option-table"
                      v-else-if="cartitem.options.length > 1"
                    >
                      <div
                        class="Tflex Ttext-sm"
                        v-for="(option, optionIndex) in cartitem.options"
                        :key="optionIndex"
                      >
                        <div class="Tpr-2">{{ option.content }}</div>
                        <div>{{ option.count }}개</div>
                      </div>
                    </div>
                  </div>
                  <div class="Ttext-sm Ttext-gray-500">
                    {{ formatDate(orderItem.c_date) }}
                  </div>
                  <div class="Ttext-sm Ttext-gray-500">
                    {{ toPrice(orderItem.amount) }}
                  </div>
                </div>
              </div>
            </div>

            <!-- 각 항목 오른쪽 -->
            <div class="Ttext-sm Tflex Titems-center lg:Tblock">
              <div class="lg:Tmb-2 Tfont-medium Tmr-2 lg:Tmr-0 Ttext-center">
                {{ statusString(orderItem.status) }}
              </div>
              <div class="buttons-wrapper Tblock lg:Tgrid">
                <b-button @click="showDetailClicked(orderIndex)"
                  >상세정보</b-button
                >
                <delivery-tracker-button
                  v-if="orderItem.showTransportSearchButton"
                  :carrier-id="orderItem.transport_company"
                  :transport-number="orderItem.transport_number"
                  button-text="배송조회"
                  :button-classes="[]"
                  :button-style="{ fontSize: '12px' }"
                  size="sm"
                >
                  배송조회
                </delivery-tracker-button>
                <!-- <b-button
                  v-if="orderItem.showTransportSearchButton"
                  @click="showTrackClicked(orderIndex)"
                >
                  배송조회
                </b-button> -->
                <b-button
                  v-if="orderItem.showReqExchange"
                  @click="reqExchangeClicked(orderIndex)"
                >
                  교환/반품
                </b-button>
                <b-button
                  v-if="orderItem.showModifyCancel"
                  @click="modifyOrCancelClicked(orderIndex)"
                >
                  변경/취소
                </b-button>
                <b-modal
                  :id="`modify-order-modal-${orderIndex}`"
                  hide-header
                  hide-footer
                  ok-variant="danger"
                >
                  <template #default="{ hide }">
                    <div class="Trelative">
                      <custom-modal-close-button :hide="hide">
                      </custom-modal-close-button>
                      <!-- 주문 변경 -->
                      <h2 class="Ttext-lg Tfont-bold Tmb-2 Tpt-4">주문 변경</h2>

                      <b-form-group
                        :label-for="`input-modifying-${id}`"
                        v-for="(form, id) in modifyingDest"
                        :key="id"
                        :label="form.label"
                        label-class="Tfont-bold"
                      >
                        <finding-address-button
                          @address-loaded="modifyingAddressLoaded($event)"
                          v-if="id === 'address'"
                          size="sm"
                          class="Tmb-2"
                          >주소 검색</finding-address-button
                        >
                        <b-form-input
                          :id="`input-modifying-${id}`"
                          v-model="form.value"
                        ></b-form-input>
                      </b-form-group>
                      <loading-button
                        variant="primary"
                        :loading="modifyingLoading"
                        @click="updateOrderClicked(orderIndex)"
                      >
                        주문을 변경합니다.
                      </loading-button>
                      <hr class="Tborder-black" />

                      <!-- 주문 취소 -->
                      <h2 class="Ttext-lg Tfont-bold Tmb-2 Tpt-4">주문 취소</h2>
                      <b-form-group
                        label="취소 사유 (선택)"
                        label-class="Tfont-bold"
                        label-for="cancel-reason"
                      >
                        <b-form-textarea
                          placeholder="예: 단순 변심"
                          v-model="cancelReason"
                          id="cancel-reason"
                        ></b-form-textarea>
                      </b-form-group>
                      <loading-button
                        :loading="cancellingLoading"
                        variant="danger"
                        @click="
                          $bvModal.show(`cancel-order-modal-${orderIndex}`)
                        "
                      >
                        주문을 취소합니다.
                      </loading-button>
                    </div>
                  </template>
                </b-modal>
                <b-modal
                  ok-variant="danger"
                  :id="`cancel-order-modal-${orderIndex}`"
                  ok-title="예"
                  cancel-title="아니오"
                  @ok="cancelOrderClicked(orderIndex)"
                  hide-header
                >
                  주문을 정말로 취소하시겠습니까?
                </b-modal>
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
    </div>

    <!-- 상세 정보 modal -->
    <b-modal
      id="order-detail"
      title="주문 상세 정보"
      size="lg"
      hide-header
      hide-footer
    >
      <template #default="{ hide }">
        <div class="Trelative lg:Tmy-4 lg:Tmx-6">
          <!-- 닫기 버튼 -->
          <button class="Tborder-0 Tabsolute Tright-0" @click="hide">
            <svg-close></svg-close>
          </button>

          <h2 class="modal-head Tmb-7">주문 상세 정보</h2>

          <!-- <pre>{{detail}}</pre> -->
          <!-- 상품 정보 -->
          <h2
            class="modal-head Tborder-b Tborder-black Tpb-1 Tmb-5 Tleading-none"
          >
            <span class="Tmr-2">상품 정보</span>
            <span class="Ttext-sm Tfont-medium"
              >주문일 | {{ formatDate(detail.c_date) }}</span
            >
          </h2>
          <!-- 상품 상세 정보들 -->
          <div class="Tmb-4 Ttext-base">
            <!-- 각각의 상품 -->
            <div
              class="Tpb-5 Tborder-b last:Tborder-black"
              v-for="(cartitem, cartitemIndex) in detail.items"
              :key="cartitemIndex"
            >
              <div class="Tflex Tjustify-between">
                <div class="Tflex Titems-center">
                  <!-- 이미지 -->
                  <div class="Tw-28 Tmr-6">
                    <div
                      class="pb-full Tbg-gray-200"
                      :style="{
                        'background-image': `url('${cartitem.product.featured_image_url}?size=file_preview')`,
                      }"
                    ></div>
                  </div>
                  <!-- 상품 이름 -->
                  <div>
                    <h2>
                      <b-link
                        class="Ttext-lg Tfont-bold"
                        :to="{
                          name: 'SopakitDetail',
                          params: { id: cartitem.product_id },
                        }"
                      >
                        {{ cartitem.product.name }}
                      </b-link>
                    </h2>
                  </div>
                </div>
                <!-- 옵션에 따른 가격 -->
                <div
                  class="option-grid-cols Ttext-gray-600 Tgrid Tauto-cols-auto Tself-end"
                >
                  <template v-for="(option, optionIndex) in cartitem.options">
                    <div :key="`${optionIndex}-content`" class="Tpx-2">
                      {{ option.content }}
                    </div>
                    <div :key="`${optionIndex}-count`" class="Tpx-2">
                      {{ option.count }}개
                    </div>
                    <div
                      :key="`${optionIndex}-price`"
                      class="Ttext-right Tmb-1 Tpl-2 Tml-10"
                    >
                      {{ toPrice(option.price * option.count) }}
                    </div>
                  </template>
                </div>
              </div>
            </div>
          </div>

          <!-- 총 가격 -->
          <div class="Tflex Tjustify-end Ttext-base Tmb-4">
            <div
              class="Ttext-gray-600 Tgrid Tauto-cols-max Tgrid-cols-2 Tauto-rows-max Tml-auto"
            >
              <div class="detail-price-head">주문금액</div>
              <div class="Ttext-right lg:Tw-48">
                {{ toPrice(detail.productsPrice || 0) }}
              </div>
              <div class="detail-price-head">배송비</div>
              <div class="Ttext-right">
                {{ toPrice(detail.transport_fee || 0) }}
              </div>
              <hr class="Tborder-gray-500 Tcol-span-2 Tmy-3" />
              <div class="detail-price-head">결제금액</div>
              <div
                class="Ttext-right Ttext-2xl Ttext-black Tfont-bold Tmb-3 Ttext-black"
              >
                {{ toPrice(detail.amount || 0) }}
              </div>
              <div class="detail-price-head">결제수단</div>
              <div class="Ttext-right">
                <span>
                  {{ paymentMethodsLabel(detail.method) }}
                </span>
                <span v-if="detail.bootpay_payment_info">
                  <b-link
                    class="Tml-3 Ttext-sm Tpx-2 Tpy-1 Tborder Tborder-black hover:Tno-underline Tbg-white Ttext-black Tleading-none Ttransition-all Tfont-bold Trounded hover:Topacity-60"
                    target="_blank"
                    :href="detail.bootpay_payment_info.receipt_url"
                    >영수증</b-link
                  >
                </span>
              </div>
            </div>
          </div>
          <!-- 받으실 분 -->
          <h2 class="modal-head Tborder-black Tpb-1 Tborder-b Tmb-4">
            받으실 분
          </h2>
          <div
            class="Tinline-grid Ttext-base"
            :style="{ gridTemplateColumns: 'auto auto' }"
          >
            <template v-for="dest in detailDestItems">
              <div :key="`${dest.title}-title`" class="Tp-2 Tpl-0 Tpr-10">
                <b>{{ dest.title }}</b>
              </div>
              <div :key="`${dest.title}-content`" class="Tp-2">
                {{ dest.content }}
              </div>
            </template>
          </div>
          <!-- <pre>
        {{ detail }}
        </pre> -->
        </div>
      </template>
    </b-modal>
  </div>
</template>

<script>
import {
  BButton,
  BFormDatepicker,
  BFormGroup,
  BFormInput,
  BFormSelect,
  BFormTextarea,
  BLink,
  BPaginationNav,
} from 'bootstrap-vue';
import moment from 'moment';

import { toPrice, statusMap, addressNew, handleSimpleResult } from '@/util';
import { makeSimpleMutation, makeSimpleQuery } from '@/api/graphql-client';
import LoadingButton from '@/components/LoadingButton.vue';

const myOrdersReq = makeSimpleQuery('myOrders');
const reqCancelOrderReq = makeSimpleMutation('reqCancelOrder');
const updateMyOrderReq = makeSimpleMutation('updateMyOrder');

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
  kakao: '카카오페이',
  npay: '네이버페이',
};

// 'order_received', // "주문접수",
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

/**
 * 결제 확인중: 취소
 * 결제 완료: 결제 취소
 * 배송중: 교환/반품 신청
 * 배송완료: 교환/반품 신청
 *
 */

export default {
  components: {
    BButton,
    BFormInput,
    BFormGroup,
    BFormDatepicker,
    BFormSelect,
    SvgNext: () => import('@/components/SvgNext'),
    SvgClose: () => import('@/components/CloseFigure'),
    CustomModalCloseButton: () => import('@/components/CustomModalCloseButton'),
    FindingAddressButton: () => import('@/components/FindingAddressButton'),
    DeliveryTrackerButton: () => import('@/components/DeliveryTrackerButton'),
    BFormTextarea,
    BLink,
    LoadingButton,
    BPaginationNav,
  },
  data() {
    const today = new Date();
    const oneMonthBefore = new Date();
    oneMonthBefore.setMonth(oneMonthBefore.getMonth() - 1);

    return {
      vuePageTitle: '',
      a: 0,
      total: 0,
      detail: {},
      destFields: [
        {
          isRowHeader: true,
          key: 'title',
          label: '이름',
          class: 'Tp-0',
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
      countMap: {
        order_received: 0,
        payment_confirming: 0,
        payment_success: 0,
        product_loading: 0,
        transport_preparing: 0,
        transporting: 0,
        transport_success: 0,
        deal_success: 0,
        returning: 0,
        order_cancelling: 0,
        order_cancelled: 0,
      },
      summaryGrid: [
        {
          label: '결제완료',
          key: 'payment_success',
        },
        {
          label: '배송준비중',
          key: 'transport_preparing',
        },
        {
          label: '배송중',
          key: 'transporting',
        },
        {
          label: '배송완료',
          key: 'transport_success',
        },
      ],

      orderStatusOptions: [
        { value: '', text: '전체상태' },
        { value: 'payment_confirming', text: '결제확인중' },
        { value: 'payment_success', text: '결제완료' },
        { value: 'transport_preparing', text: '배송준비중' },
        { value: 'transporting', text: '배송중' },
        { value: 'transport_success', text: '배송완료' },
        { value: 'order_cancelling', text: '주문취소중' },
        { value: 'order_cancelled', text: '주문취소' },
      ],
      orders: [],
      modifyingDest: {
        name: { label: '수취인 이름', value: '' },
        address: { label: '주소', value: '' },
        address_detail: { label: '상세 주소', value: '' },
        phone: { label: '연락처', value: '' },
        request: { label: '요청사항', value: '' },
      },
      modifyingLoading: false,
      cancellingLoading: false,
      cancelReason: '',
    };
  },

  computed: {
    /** @returns {object[]} */
    detailDestItems() {
      return Object.keys(this.detail.dest ?? []).map((destKey) => ({
        title: destLabelMap[destKey],
        content: this.detail?.dest?.[destKey],
      }));
    },
    /** @returns {number} */
    totalPages() {
      return this.total > 0
        ? Math.ceil(this.total / this.condition.perpage)
        : 1;
    },
  },
  watch: {
    $route() {
      this.fetchData();
    },
  },
  async mounted() {
    this.fetchData();
    this.vuePageTitle = '주문내역';
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
      const { total, list, transporting, order_count } = await myOrdersReq(
        { condition },
        `{
          transporting total list {
            id user status method c_date expected_date cancelled_date return_req_date cash_receipt
            transport_number transport_fee transport_company bootpay_id bootpay_payment_info cancel_reason
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
          order_count {
            status count
          }
        }`,
      );
      console.log('# MyOrdered fetchData res');
      console.dir({ total, list, transporting, order_count });
      this.total = total;

      // console.log('# MyOrdered fetchData order_count');
      // console.log(order_count);
      Object.keys(this.countMap).forEach((status) => {
        this.countMap[status] = 0;
      });
      order_count.forEach(({ status, count }) => {
        this.countMap[status] = count;
      });

      // 입력값 다듬기
      list.forEach((order) => {
        // 상품들의 가격들을 정리하기.
        order.productsPrice = this.getProductsPrice(order);

        // 배송비가 있다면 추가시켜주기.
        order.amount = order.productsPrice + order.transport_fee ?? 0;

        // 각 버튼들을 보여줘야 하는지 계산하기
        const { status } = order;
        order.showTransportSearchButton = [
          'deal_success',
          'transporting',
          'transport_success',
          'returning',
        ].includes(status);
        order.showReqExchange = [
          'transporting',
          'transport_success',
          'deal_success',
        ].includes(status);
        order.showModifyCancel = [
          'order_received',
          'payment_confirming',
          'payment_success',
          'product_loading',
        ].includes(status);
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
    showDetailClicked(orderIndex) {
      this.detail = { ...this.orders[orderIndex] };
      console.log(this.detail);
      this.$bvModal.show('order-detail');
    },
    reqExchangeClicked(orderIndex) {
      // todo
    },
    async cancelOrderClicked(orderIndex) {
      this.cancellingLoading = true;
      const { id } = this.orders[orderIndex];
      const result = await reqCancelOrderReq(
        { id, cancel_reason: this.cancelReason },
        '{success code}',
      );
      handleSimpleResult(
        result,
        'reqCancelOrder',
        '성공적으로 주문 취소를 요청했습니다.',
        '주문취소 요청 도중 오류가 발생했습니다.',
      );
      if (result.success) {
        this.loading = true;
        await this.fetchData();
        this.loading = false;
      }
      this.$bvModal.hide(`modify-order-modal-${orderIndex}`);
      this.$bvModal.hide(`cancel-order-modal-${orderIndex}`);
      this.cancellingLoading = false;
    },
    async updateOrderClicked(orderIndex) {
      this.modifyingLoading = true;
      const order = this.orders[orderIndex];
      const dest = {};
      Object.entries(this.modifyingDest).forEach(([name, { value }]) => {
        dest[name] = value;
      });
      const result = await updateMyOrderReq(
        {
          id: order.id,
          input: { dest },
        },
        '{success code}',
      );
      handleSimpleResult(
        result,
        'updateOrderDest',
        '성공적으로 주문을 변경했습니다.',
        '주문을 변경하던 도중 오류가 발생했습니다.',
      );
      if (result.success) {
        this.loading = true;
        await this.fetchData();
        this.loading = false;
      }
      this.modifyingLoading = false;
      this.$bvModal.hide(`modify-order-modal-${orderIndex}`);
    },
    linkGen(pageNum) {
      return { name: 'MyOrdered', params: { page: pageNum } };
    },
    async statusCountClicked(status) {
      this.condition.status = status;
      this.loading = true;
      await this.fetchData();
      this.loading = false;
    },
    modifyOrCancelClicked(orderIndex) {
      this.$bvModal.show(`modify-order-modal-${orderIndex}`);
      this.cancelReason = '';
      Object.entries(this.orders[orderIndex].dest).forEach(([key, value]) => {
        this.modifyingDest[key].value = value;
      });
    },
    modifyingAddressLoaded(data) {
      console.log('# MyOrdered modifyingAddressLoaded');
      console.log(data);
      this.modifyingDest.address.value = addressNew(data);
      this.modifyingDest.address_detail.value = data.buildingName;
    },
  },
};
</script>

<style lang="scss" scoped>
@use '../../style/common';
@use '../../style/breakpoint';

$condition-margin: 6px;

.my-ordered-head {
  @apply Ttext-xl Tfont-bold Tleading-none Tmb-4;
}

.head-small {
  font-size: 14px;
  font-weight: bold;
  color: #777;
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

.summary-grid-columns {
  grid-template-columns: 2fr 1fr 2fr 1fr 2fr 1fr 2fr;
}
.summary-grid-item {
  @apply Tflex Titems-center Tjustify-center Tw-full Th-full;
}

.header-wrapper {
  display: flex;
  margin-bottom: 50px;
}

@include breakpoint.max-with(lg) {
  .header-wrapper {
    margin-bottom: 10px;
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

.option-row {
  display: flex;
  font-size: 14px;
  color: #585858;
}

.option-grid-cols {
  grid-template-columns: auto auto auto;
}

.info-row {
  display: flex;
  margin-bottom: 5px;
}

.info-cell.head {
  flex: 0 0 80px;
  font-weight: 500;
}

.buttons-wrapper .btn {
  font-size: 12px;
  padding: 3px 7px 4px;
  margin: 3px 0;
}

@include breakpoint.max-with(lg) {
  .buttons-wrapper {
    flex-direction: row;
    .btn {
      margin-right: 10px;
    }
  }
}

.detail-price-head {
  @apply Tmb-2;
}

@include breakpoint.max-with(md) {
  .detail-payment-info {
    display: block;
  }
}

.modal-head {
  @apply Ttext-xl Tfont-bold;
}

.myordered-pagination {
  align-self: stretch;
}
</style>
