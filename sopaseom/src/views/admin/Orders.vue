<template>
  <div class="admin-orders">
    <header class="Tmb-3">
      <h2 class="Tmb-1">주문 목록</h2>
      <p>행을 클릭하면 자세한 내용 열람 및 편집이 가능합니다.</p>
    </header>
    <div class="Tflex Tflex-wrap Titems-center Tmb-2">
      <!-- 날짜 필터 -->
      <div class="Tmr-2">
        <div class="filter-date-row">
          <b-form-datepicker
            size="sm"
            locale="ko-KR"
            class="filter-datepicker"
            value-as-date
            v-model="conditionInput.date_gte"
          ></b-form-datepicker>
          <span class="Tmx-3 Tfont-bold"> ~ </span>
          <b-form-datepicker
            size="sm"
            locale="ko-KR"
            class="filter-datepicker"
            value-as-date
            v-model="conditionInput.date_lte"
          ></b-form-datepicker>
        </div>
      </div>
      <!-- 회원 검색 -->
      <div class="Tmr-2">
        <b-dropdown size="sm">
          <template #button-content>
            <font-awesome-icon
              class="Tmr-1"
              :icon="['fas', 'user']"
            ></font-awesome-icon>
            <span> {{ conditionInput.user || '회원 검색' }}</span>
          </template>
          <template #default="{ hide }">
            <b-dropdown-form>
              <user-select
                v-model="conditionInput.user"
                @change="hide"
              ></user-select>
            </b-dropdown-form>
          </template>
        </b-dropdown>
      </div>
      <!-- 상태 필터 -->
      <div class="Tflex Titems-center Tmr-2">
        <!-- <font-awesome-icon
          class="Tmr-2"
          :icon="['fas', 'ring']"
        ></font-awesome-icon> -->
        <b-form-select
          size="sm"
          :options="orderStatusOptions"
          v-model="conditionInput.status"
        >
        </b-form-select>
      </div>
      <!-- 결제수단 필터 -->
      <div class="Tflex Titems-center Tmr-2">
        <!-- <font-awesome-icon
          class="Tmr-2"
          :icon="['fas', 'won-sign']"
        ></font-awesome-icon> -->
        <b-form-select
          size="sm"
          :options="methodOptions"
          v-model="conditionInput.method"
        >
        </b-form-select>
      </div>
      <!-- id 일치 -->
      <div class="Tmr-2">
        <b-form-input
          size="sm"
          :style="{ maxWidth: '120px' }"
          placeholder="주문번호 입력"
          v-model="conditionInput.id"
          number
          type="number"
          @keydown.enter="filterClicked"
        >
        </b-form-input>
      </div>
      <!-- 검색 버튼 -->
      <div class="filter-action">
        <b-button size="sm" @click="filterClicked" variant="primary">
          <span class="font-weight-bold">검색</span>
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
      <template #cell()="{ value }">
        <span class="text-break">
          {{ value }}
        </span>
      </template>
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
      <template #cell(transport_company)="{ item }">
        <span class="text-break">
          {{ deliveryMap[item.transport_company] }}
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
          {{ order.dest ? order.dest.name : '' }}
        </span>
      </template>
      <template #cell(dest_phone)="{ item: order }">
        <span class="text-break">
          {{ order.dest ? order.dest.phone : '' }}
        </span>
      </template>
      <template #cell(dest_address)="{ item: order }">
        <div class="Tflex Titems-center">
          <span class="Ttruncate Tblock" :style="{ maxWidth: '200px' }">
            {{ order.dest ? order.dest.address : '' }}
            {{ order.dest ? order.dest.address_detail : '' }}
          </span>
          <copy-button
            :content="`${order.dest ? order.dest.address : ''} ${
              order.dest ? order.dest.address_detail : ''
            }`"
          ></copy-button>
        </div>
      </template>
      <template #cell(action)="{ item }">
        <div class="Tflex Titems-center">
          <loading-button
            class="Ttext-sm Tp-1 Trounded-md"
            variant="danger"
            :disabled="!item.canBeCancelled"
            @click="cancelPaymentClicked(item)"
            >결제취소</loading-button
          >
        </div>
      </template>

      <!--- row details -->
      <template #row-details="{ item, index }">
        <div class="row-details">
          <h2>결제 및 일반 정보</h2>
          <form-row title="회원">
            <span class="Tmr-2">
              {{ editing.user }}
            </span>
            <b-dropdown
              class="Tinline-block"
              size="sm"
              @click="$bvModal.show('editing-change-user-modal')"
            >
              <template #button-content> 회원 변경 </template>
              <template #default="{ hide }">
                <b-dropdown-form>
                  <!-- <b-button @click="hide">숨기기</b-button> -->
                  <user-select
                    v-model="editing.user"
                    @change="hide"
                  ></user-select>
                </b-dropdown-form>
              </template>
            </b-dropdown>

            <b-modal id="editing-change-user-modal"> </b-modal>

            <!-- <div class="user-search-form">
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
            ></b-form-select> -->
          </form-row>
          <!-- 상태 -->
          <form-row title="상태">
            <b-form-select
              :options="orderStatusOptions"
              v-model="editing.status"
            ></b-form-select>
          </form-row>
          <!-- 취소 사유 -->
          <form-row
            v-if="
              editing.status === 'order_cancelling' ||
              editing.status === 'order_cancelled'
            "
            title="취소 사유"
          >
            <b-form-textarea v-model="editing.cancel_reason"></b-form-textarea>
          </form-row>
          <form-row title="결제 수단">
            {{ paymentMethodMap[editing.method] }}
          </form-row>
          <form-row title="총 결제액">
            <template #info>
              이미 결제가 완료된 총 결제액입니다. 무통장 입금의 경우 입금해야
              하는 금액을 나타냅니다.
            </template>

            {{ toPrice(bpPrice) }}
          </form-row>
          <!-- v-if="editing.cancelled_fee" -->
          <form-row title="취소된 결제액">
            <template #info>
              결제액의 일부 혹은 전부가 취소되었을 때 얼마만큼 취소되었는지를
              나타냅니다.
            </template>
            {{ toPrice(editing.cancelled_fee) }}
          </form-row>
          <form-row title="부트페이 영수증 번호">
            <template #info>
              부트페이는 결제모듈 서비스의 이름입니다. 부트페이에서 별도로
              관리하는 영수증 번호입니다
            </template>
            {{ editing.bootpay_id || '-' }}
            <b-button
              size="sm"
              :href="bpReceipt_url"
              target="_blank"
              v-if="editing.bootpay_id"
              class="ml-2"
            >
              영수증 정보 확인하기
            </b-button>
          </form-row>
          <form-row title="주문일">
            <b-form-datepicker
              locale="ko-KR"
              v-model="editing.c_date"
              value-as-date
            ></b-form-datepicker>
          </form-row>
          <form-row title="예상 도착일">
            <b-form-datepicker
              locale="ko-KR"
              v-model="editing.expected_date"
              value-as-date
            ></b-form-datepicker>
          </form-row>
          <form-row title="주문취소일">
            <b-form-datepicker
              locale="ko-KR"
              v-model="editing.cancelled_date"
              value-as-date
            ></b-form-datepicker>
          </form-row>
          <form-row title="교환/반품 요청일">
            <b-form-datepicker
              locale="ko-KR"
              v-model="editing.return_req_date"
              value-as-date
            ></b-form-datepicker>
          </form-row>
          <form-row title="현금영수증 번호"> </form-row>
          <form-row title="택배사">
            <b-form-select
              :options="deliveryOptions"
              v-model="editing.transport_company"
            ></b-form-select>
          </form-row>
          <form-row title="송장번호">
            <b-form-input v-model="editing.transport_number"> </b-form-input>
            <delivery-tracker-button
              :carrier-id="editing.transport_company"
              :transport-number="editing.transport_number"
            ></delivery-tracker-button>
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
            <template v-for="item in editing.items">
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

          <!-- <div class="button-group" v-if="editing.mode === 'edit'"> -->
          <apply-button-set
            @ok="updateOrderConfirmClicked(index)"
            @cancel="updateOrderCancelClicked(index)"
            :loading="editing.processingRequest"
          >
          </apply-button-set>
          <!-- </div> -->
          <!-- <pre> -->
          <!-- {{ editing }} -->
          <!-- </pre> -->
        </div>
      </template>
    </b-table>
    <!-- 결제취소 모달 -->
    <b-modal id="cancel-payment-modal" title="결제 취소" hide-footer>
      <div class="Tgrid Tgrid-cols-2 Tmb-4">
        <template v-for="item in cancelPaymentModalGridItems">
          <div class="Tfont-bold Tmb-2" :key="`title-${item.title}`">
            {{ item.title }}
          </div>
          <div :key="`value-${item.title}`">{{ item.value }}</div>
        </template>
      </div>
      <hr />
      <!-- 모든 금액을 취소합니다. -->
      <b-form-checkbox class="Tmb-3" v-model="cancelPaymentAll"
        >모든 금액을 취소합니다.</b-form-checkbox
      >
      <!-- 취소 금액 -->
      <div v-if="!cancelPaymentAll" class="Tmb-3">
        <label class="Tfont-bold" for="cancel-payment-input"
          >취소하고자 하는 금액</label
        >
        <b-form-input
          id="cancel-payment-input"
          type="number"
          v-model="cancelPaymentInput"
          number
          @change="validateCancelPayment"
        >
        </b-form-input>
      </div>
      <!-- 취소 사유 -->
      <label for="cancel-payment-reason" class="Tfont-bold">취소 사유</label>
      <b-form-textarea
        ref="cancel-payment-reason"
        class="Tmb-3"
        id="cancel-payment-reason"
        v-model="cancelPaymentReason"
      >
      </b-form-textarea>

      <!-- 취소 버튼 -->
      <div class="Ttext-right">
        <loading-button
          @click="startCancelPayment"
          variant="danger"
          :loading="cancelPaymentLoading"
        >
          결제취소
        </loading-button>
      </div>
    </b-modal>
    <p v-if="state.processing.get">로딩중입니다.</p>
    <p v-if="!hasData && !state.processing.get">주문이 없습니다.</p>
    <hr />
    <div class="buttons">
      <b-button class="Tmr-2 Tfont-bold" @click="allCheckClicked"
        >모두 선택</b-button
      >
      <b-button
        class="Tmr-2 Tfont-bold"
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
          정말로 삭제하시겠습니까? 다시는 복구할 수 없습니다! 유효하지 않은
          주문만 삭제해 주세요.
        </p>
      </b-modal>
      <b-button variant="primary" class="Tfont-bold" @click="createOrderClicked"
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
  BFormSelect,
  BFormTextarea,
  BDropdown,
  BDropdownForm,
} from 'bootstrap-vue';
import moment from 'moment';
import { makeSimpleMutation, makeSimpleQuery } from '@/api/graphql-client';
import FormRow from '@/components/admin/FormRow.vue';
import { mapActions } from 'vuex';
import {
  statusMap,
  toPrice,
  paymentMethodMap,
  handleSimpleResult,
} from '@/util';
import axios from 'axios';

const ordersOnServer = makeSimpleQuery('ordersAdmin');
const createOrderReq = makeSimpleMutation('createOrder');
const removeOrderOnServer = makeSimpleMutation('removeOrder');
const updateOrderOnServer = makeSimpleMutation('updateOrder');
const usersReq = makeSimpleQuery('users');
const cancelPaymentReq = makeSimpleMutation('cancelPayment');

export default {
  components: {
    BPaginationNav,
    BModal,
    BButton,
    BTable,
    BFormCheckbox,
    BFormInput,
    BFormDatepicker,
    FormRow,
    BFormSelect,
    BFormTextarea,
    BDropdown,
    BDropdownForm,
    DeliveryTrackerButton: () =>
      import('@/components/DeliveryTrackerButton.vue'),
    UserSelect: () => import('@/components/admin/UserSelect'),
    CopyButton: () => import('@/components/admin/CopyButton'),
    ApplyButtonSet: () => import('@/components/admin/button/ApplyButtonSet'),
    LoadingButton: () => import('@/components/LoadingButton'),
  },
  data() {
    const now = new Date();
    const beforeOneMonth = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate(),
    );
    return {
      cancelPaymentItem: {},
      cancelPaymentModalGridItems: [],
      cancelPaymentLoading: false,
      cancelPaymentMax: 0,
      cancelPaymentMin: 0,
      cancelPaymentAll: false,
      cancelPaymentInput: 0,
      cancelPaymentReason: '',
      userFilterInput: '', // 필터 상에서 검색하는 회원 v-model
      userFilterOptions: [
        {
          value: null,
          text: '검색 후 회원 선택',
        },
      ],
      userSearch: '', // 주문 상세에서 수정할 때 검색하는 회원 v-model
      userOptions: [
        {
          value: null,
          text: '검색 후 회원 선택',
        },
      ],
      conditionInput: {
        /** @type {number} */
        id: null,
        date_gte: beforeOneMonth,
        date_lte: now,
        /** @type {string} */
        status: null,
        /** @type {string} */
        method: null,
        /** @type {string} */
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
          tdClass: 'Ttruncate',
        },
        {
          key: 'c_date',
          label: '주문일',
          tdClass: 'Ttruncate',
        },
        {
          key: 'user',
          label: '회원 이메일',
          tdClass: 'Ttruncate',
        },
        {
          key: 'status',
          label: '상태',
          tdClass: 'Ttruncate',
        },
        {
          key: 'transport_company',
          label: '택배사',
          tdClass: 'Ttruncate',
        },
        {
          key: 'transport_number',
          label: '송장 번호',
          tdClass: 'Ttruncate',
        },
        {
          key: 'product_name',
          label: '주문한 물건',
          tdClass: 'Ttruncate',
        },
        // {
        //   key: 'product_count',
        //   label: '총 수량',
        // },
        {
          key: 'dest_name',
          label: '수취자 이름',
          tdClass: 'Ttruncate',
        },
        {
          key: 'dest_phone',
          label: '수취자 전화번호',
          tdClass: 'Ttruncate',
        },
        {
          key: 'dest_address',
          label: '수취자 주소',
        },
        {
          key: 'payer',
          label: '입금자명',
          tdClass: 'Ttruncate',
        },
        {
          key: 'action',
          label: '행동',
          tdClass: 'Ttruncate',
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
      rawDeliveryOptions: [],
    };
  },
  computed: {
    /** @returns {number} */
    page() {
      const { page } = this.$route.query;
      return page ? parseInt(page, 10) : 1;
    },
    /** @returns {object[]} */
    deliveryOptions() {
      const options = this.rawDeliveryOptions.map((delivery) => ({
        value: delivery.id,
        text: delivery.name,
      }));
      options.unshift({ value: null, text: '-- 선택하세요 --' });
      return options;
    },
    /** @returns {object[]} */
    deliveryMap() {
      const map = this.rawDeliveryOptions.reduce((prev, current) => {
        prev[current.id] = current.name;
        return prev;
      }, {});
      return map;
    },
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
      const { perpage } = this.receivedCondition;
      const o = Math.ceil(this.total / perpage);
      if (o === 0) return 1;
      // console.log('# Orders totalPages o');
      // console.log(o);
      return o;
    },
    /** @returns {boolean} */
    hasData() {
      return this.items.length !== 0;
    },
    /** @returns {object[]} */
    orderStatusOptions() {
      const result = Object.keys(this.statusMap).map((key) => ({
        value: key,
        text: this.statusMap[key],
      }));
      result.unshift({
        value: null,
        text: '모든 상태',
      });
      return result;
    },
    /** @returns {object[]} */
    methodOptions() {
      const result = Object.keys(this.paymentMethodMap).map((key) => ({
        value: key,
        text: this.paymentMethodMap[key],
      }));
      result.unshift({
        value: null,
        text: '모든 결제 수단',
      });
      return result;
    },
    /** @returns {object} */
    receivedCondition() {
      const oneYearAgo = new Date();
      oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
      const {
        page = 1,
        method = null,
        status = null,
        user = null,
        date_gte = oneYearAgo.getTime(),
        date_lte = new Date().getTime(),
        id = null,
      } = this.$route.query;
      const date_lte_added = new Date(date_lte);
      date_lte_added.setDate(date_lte_added.getDate() + 1);
      return {
        page: parseInt(page, 10),
        method,
        status,
        user,
        id: parseInt(id, 10),
        date_gte: new Date(date_gte),
        date_lte: date_lte_added,
        perpage: 20,
      };
    },
    /** @returns {number} */
    bpPrice() {
      return (
        this.editing.bootpay_payment_info?.price ||
        this.getProductsPrice(this.editing) + this.editing.transport_fee
      );
    },
    /** @returns {string} */
    bpReceipt_url() {
      return this.editing.bootpay_payment_info?.receipt_url;
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

    // 택배사 정보 받아오기
    await this.fetchDeliveryData();
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
    async fetchDeliveryData() {
      const res = await axios.get('https://apis.tracker.delivery/carriers');
      this.rawDeliveryOptions = res.data;
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
      // console.log('# Orders rowClicked item');
      // console.log(item);
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
    // async userSearchClicked() {
    //   const { total, list } = await usersReq(
    //     { condition: { email: this.userSearch } },
    //     '{total list {email role}}',
    //   );
    //   console.log('# Orders usersEarchClicked');
    //   console.log({ total, list });
    //   this.userOptions = list.map((user) => ({
    //     value: user.email,
    //     text: user.email,
    //   }));
    // },
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
      // 현재 조건들을 receivedCondition 에 맞추는 작업
      this.conditionInput = this.receivedCondition;

      // 서버로부터 데이터 가져오기 (페이지 값 보정)
      const res = await ordersOnServer(
        {
          condition: {
            ...this.receivedCondition,
            page: this.receivedCondition.page - 1,
          },
        },
        `{
          total
          list {
            id user status method c_date expected_date cancelled_date return_req_date payer
            cash_receipt transport_number transport_company transport_fee bootpay_id meta
            bootpay_payment_info cancel_reason cancelled_fee
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
        canBeCancelled:
          // 결제가 완료된 상태일 경우
          !['order_received', 'payment_confirming'].includes(order.status) &&
          // 결제수단이 무통장입금이 아닐 경우
          order.method !== 'nobank' &&
          // 취소가능한 금액이 1,000원 보다 크거나 같을 경우
          this.getProductsPrice(order) +
            (order.transport_fee ?? 0) -
            (order.cancelled_fee ?? 0) >=
            1000,
        _showDetails: false,
        expected_date: order.expected_date
          ? new Date(order.expected_date)
          : null,
        c_date: order.c_date ? new Date(order.c_date) : null,
        cancelled_date: order.cancelled_date
          ? new Date(order.cancelled_date)
          : null,
        return_req_date: order.return_req_date
          ? new Date(order.return_req_date)
          : null,
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

    async createOrderClicked() {
      const res = await createOrderReq(
        {
          input: {
            user: '임의 생성 주문',
          },
        },
        '{success code}',
      );
      handleSimpleResult(
        res,
        'createOrder',
        '성공적으로 주문을 생성했습니다.',
        '주문을 생성하는 데 실패했습니다.',
      );
      await this.fetchData();
    },

    // 편집할 때 값들이 유효한지 체크하는 함수
    validate() {
      const wrongCodes = [];
      if (
        this.editing.transport_company !== null &&
        !this.editing.transport_number
      ) {
        wrongCodes.push(
          '택배사가 정해져있으면 반드시 송장 번호가 있어야 합니다',
        );
      }
      if (wrongCodes.length !== 0) {
        return { success: false, code: wrongCodes.join(', ') };
      }
      return { success: true };
    },

    async updateOrderConfirmClicked(index) {
      const item = this.items[index];
      item.processingRequest = true;

      // 먼저 값들이 유효한지 체크합니다.
      const validateResult = this.validate();
      if (!validateResult.success) {
        this.pushMessage({
          msg: `입력을 확인해주세요 - ${validateResult.code}`,
          type: 'danger',
          id: 'wrongOrderEditInput',
        });
        return;
      }

      // editing 으로부터 필요한 것만 복사
      const { id } = item;
      const inputKeys = [
        'user',
        'status',
        'method',
        'c_date',
        'expected_date',
        'cancelled_date',
        'cancel_reason',
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
    async updateOrderCancelClicked() {
      await this.fetchData();
    },
    checkBootpayReceiptClicked() {},
    /** 결제취소 모달을 띄우는 함수. */
    async cancelPaymentClicked(item) {
      const min = 1000;
      const max =
        this.getProductsPrice(item) +
        (item.transport_fee ?? 0) -
        (item.cancelled_fee ?? 0);
      this.cancelPaymentModalGridItems = [
        {
          title: '주문번호',
          value: item.id,
        },
        {
          title: '총 결제 금액',
          value: toPrice(this.getProductsPrice(item) + item.transport_fee),
        },
        {
          title: '취소 가능한 최소 금액',
          value: toPrice(min),
        },
        {
          title: '취소 가능한 최대 금액',
          value: toPrice(max),
        },
      ];
      this.cancelPaymentMin = min;
      this.cancelPaymentMax = max;
      this.cancelPaymentItem = item;
      this.$bvModal.show('cancel-payment-modal');
    },

    /** 결제취소 모달에서 결제취소 버튼을 눌렀을 때 실행됨 */
    async startCancelPayment() {
      // 검사 & 검증
      if (this.cancelPaymentMax < parseInt(this.cancelPaymentInput, 10)) {
        this.pushMessage({
          type: 'danger',
          id: 'validationFailCancelPayment',
          msg: '취소 금액은 최대 가능한 금액보다 작아야 합니다.',
        });
        return;
      }
      if (this.cancelPaymentMin > parseInt(this.cancelPaymentInput, 10)) {
        this.pushMessage({
          type: 'danger',
          id: 'validationFailCancelPayment',
          msg: '취소 금액은 최소 가능한 금액보다 커야 합니다.',
        });
        return;
      }
      if (this.cancelPaymentReason === '') {
        this.pushMessage({
          type: 'danger',
          id: 'validationFailCancelPayment',
          msg: '취소 사유가 반드시 기입되어야 합니다.',
        });
        this.$refs['cancel-payment-reason'].focus();
        return;
      }

      // 수행
      this.cancelPaymentLoading = true;
      const arg = {
        id: this.cancelPaymentItem.id,
        cancel_reason: this.cancelPaymentReason,
      };
      if (!this.cancelPaymentAll) {
        arg.price = parseInt(this.cancelPaymentInput, 10);
      }
      const res = await cancelPaymentReq(arg, '{success code cancelled_price}');
      handleSimpleResult(
        res,
        'cancelPayment',
        '결제 취소를 성공했습니다.',
        '결제 취소 도중 오류가 발생했습니다.',
      );
      if (res.success) {
        await this.fetchData();
        this.$bvModal.hide('cancel-payment-modal');
      }
      this.cancelPaymentLoading = false;
    },
    /** 취소 금액이 적절한지 검사하는 함수. onChange 때 호출됨. */
    async validateCancelPayment() {
      const price = parseInt(this.cancelPaymentInput, 10) ?? 0;
      if (price < this.cancelPaymentMin) {
        this.cancelPaymentInput = this.cancelPaymentMin;
      } else if (price > this.cancelPaymentMax) {
        this.cancelPaymentInput = this.cancelPaymentMax;
      }
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

.filter-date-row {
  display: flex;
  align-items: center;
}
.filter-datepicker {
  flex: 1;
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
