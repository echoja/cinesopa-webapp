<template>
  <div class="payment">
    <div class="delivery-info-wrapper">
      <div class="delivery-info">
        <div class="header">
          <h2>배송정보</h2>
        </div>

        <div class="select-delivery-place">
          <b-form-radio-group
            v-model="selectDeliveryPlace"
            @change="selectDeliveryPlaceChanged"
          >
            <b-form-radio :value="'default'"> 기본 배송지 </b-form-radio>
            <b-form-radio :value="'manual'"> 직접 입력 </b-form-radio>
          </b-form-radio-group>
        </div>
        <hr />
        <div class="form-item name">
          <div class="form-title">이름</div>
          <div class="form-content">
            <b-form-input
              size="sm"
              v-model="form.name"
              @update="nameUpdated"
              :state="validate.name.status"
              ref="name"
            ></b-form-input>
            <div class="input-error-msg" v-if="validate.name.status === false">
              {{ validate.name.msg }}
            </div>
          </div>
        </div>
        <div class="form-item address">
          <!-- <div class="form-address-title-wrapper"> -->
          <div class="form-title">주소</div>

          <!-- </div> -->

          <div class="form-content">
            <finding-address-button
              @address-loaded="addressLoaded"
              class="load-address-button"
            >
              주소 찾기
            </finding-address-button>
            <div class="finding-address-but"></div>
            <b-form-input
              size="sm"
              disabled
              v-model="form.address"
              class="address-new"
              :state="validate.address.status"
              ref="address"
              @update="addressUpdated"
            ></b-form-input>
            <div v-if="addressOld" class="address-old">
              지번: {{ addressOld }}
            </div>
            <div
              class="input-error-msg"
              v-if="validate.address.status === false"
            >
              {{ validate.address.msg }}
            </div>
          </div>
        </div>
        <div class="form-item address">
          <div class="form-title">상세 주소</div>
          <div class="form-content">
            <b-form-input
              size="sm"
              v-model="form.address_detail"
              @update="addressDetailUpdated"
              :state="validate.address_detail.status"
              ref="address_detail"
            ></b-form-input>
            <div
              class="input-error-msg"
              v-if="validate.address_detail.status === false"
            >
              {{ validate.address_detail.msg }}
            </div>
          </div>
        </div>
        <div class="form-item phone">
          <div class="form-title">전화번호</div>
          <div class="form-content">
            <b-form-input
              size="sm"
              v-model="form.phone"
              @update="phoneUpdated"
              :state="validate.phone.status"
              ref="phone"
            ></b-form-input>
            <div class="input-error-msg" v-if="validate.phone.status === false">
              {{ validate.phone.msg }}
            </div>
            <span class="form-example">예: 010-1234-5678</span>
          </div>
        </div>

        <div class="form-item request">
          <div class="form-title">배송시 요청사항</div>
          <div class="form-content">
            <b-form-textarea
              size="sm"
              v-model="form.request"
              @update="requestUpdated"
            ></b-form-textarea>
          </div>
        </div>
        <!-- todo: 위 정보를 기본 배송지로 설정합니다. (선택) -->
        <div class="header">
          <h2>주문내역</h2>
        </div>
        <div class="order-list-table">
          <div class="order-row head">
            <div class="order-cell name">상품</div>
            <div class="order-cell count">수량</div>
            <div class="order-cell price">금액</div>
          </div>
          <div class="order-row loading" v-if="orderList.length === 0">
            <b-spinner class="spinner"></b-spinner>
            상품 정보를 가져오는 중입니다.
          </div>
          <div
            class="order-row"
            v-for="(order, orderIndex) in orderList"
            :key="orderIndex"
          >
            <!-- 옵션이 하나 두개 이상일 때 여러개의 옵션을 보여주고 각각에 대한 가격을 표시 -->
            <div class="has-option-wrapper" v-if="order.options.length > 1">
              <div class="order-has-options-title">
                {{ order.name }}
              </div>
              <div
                class="order-row-inner-wrapper"
                v-for="(option, optionIndex) in order.options"
                :key="optionIndex"
              >
                <div class="order-cell name option">{{ option.content }}</div>
                <div class="order-cell count option">{{ option.count }}</div>
                <div class="order-cell price option">
                  {{ toPrice(option.count * option.price) }}
                </div>
              </div>
            </div>
            <!-- 옵션이 오직 하나일 경우 옵션 이름은 패스하고 그냥 가격만 표시 -->
            <div class="order-row-inner-wrapper" v-else>
              <div class="order-cell name">{{ order.name }}</div>
              <div class="order-cell count">{{ order.options[0].count }}</div>
              <div class="order-cell price">
                {{ toPrice(order.options[0].count * order.options[0].price) }}
              </div>
            </div>
          </div>
        </div>
        <div class="header">
          <h2>결제 방법</h2>
        </div>
        <div
          class="input-error-msg"
          v-if="validate.paymentMethod.status === false"
        >
          {{ validate.paymentMethod.msg }}
        </div>
        <!-- 결제 방법 -->
        <div class="payment-method row" ref="paymentMethod" tabindex="-1">
          <div class="col-6 payment-method-option">
            <div class="option-inner-wrapper">
              <b-button
                @click="setPaymentMethod('card', $event)"
                :class="{ selected: form.paymentMethod === 'card' }"
              >
                신용카드
              </b-button>
            </div>
          </div>
          <div class="col-6 payment-method-option">
            <div class="option-inner-wrapper">
              <b-button
                @click="setPaymentMethod('bank', $event)"
                :class="{ selected: form.paymentMethod === 'bank' }"
              >
                계좌이체
              </b-button>
            </div>
          </div>
          <div class="col-6 payment-method-option">
            <div class="option-inner-wrapper">
              <b-button
                @click="setPaymentMethod('nobank', $event)"
                :class="{ selected: form.paymentMethod === 'nobank' }"
              >
                무통장입금
              </b-button>
            </div>
          </div>
          <div class="col-6 payment-method-option">
            <div class="option-inner-wrapper">
              <b-button
                @click="setPaymentMethod(null, $event)"
                :class="{ selected: form.paymentMethod === null }"
              >
                휴대폰결제
              </b-button>
            </div>
          </div>
        </div>
        <template v-if="form.paymentMethod === 'nobank'">
          <div class="form-item payer">
            <div class="form-title">입금자명</div>
            <div class="form-content">
              <b-form-input
                size="sm"
                v-model="form.payer"
                @update="payerUpdated"
                :state="validate.payer.status"
                ref="payer"
              ></b-form-input>
              <div
                class="input-error-msg"
                v-if="validate.payer.status === false"
              >
                {{ validate.payer.msg }}
              </div>
            </div>
          </div>
          <div class="header">
            <h2>무통장입금 안내사항</h2>
          </div>
          <div class="nobank-notice">
            <ul>
              <li>
                입금자명 혹은 입금액이 다를 경우 입금 확인이 어려워 배송이
                지연될 수 있습니다.
              </li>
              <li>
                주문 후 48시간 이내에 입금하지 않으실 경우 주문이 취소될 수
                있습니다.
              </li>
              <!-- <li>기타 문의사항은 이메일로 문의해주시기 바랍니다.</li> -->
            </ul>
          </div>
          <!-- <div class="form-item ">
            <div class="form-title">입금액</div>
            <div class="form-content">
              {{ toPrice(totalPrice) }}
            </div>
          </div> -->
        </template>
      </div>
      <pre>

      {{ bootpayArgs }}
      </pre>
    </div>
    <div class="payment-info-wrapper">
      <div class="payment-info">
        <div class="header">
          <h2>결제 정보</h2>
        </div>
        <div class="payment-table">
          <div class="payment-table-row">
            <div class="payment-table-cell head">총 상품 가격</div>
            <div class="payment-table-cell price">
              {{ toPrice(totalProductPrice) }}
            </div>
          </div>
          <div class="payment-table-row">
            <div class="payment-table-cell head">배송비</div>
            <div class="payment-table-cell price">
              {{ toPrice(transportationFee) }}
            </div>
          </div>
          <div class="payment-table-row">
            <div class="payment-table-cell head">총 주문 수량</div>
            <div class="payment-table-cell price">
              {{ totalCount }}
            </div>
          </div>
          <hr />

          <div class="payment-table-row">
            <div class="payment-table-cell head">총 결제 금액</div>
            <div class="payment-table-cell total-price">
              {{ toPrice(totalPrice) }}
            </div>
          </div>
        </div>
        <div class="last-notice">위 주문 내용으로 결제에 동의합니다.</div>
        <!-- 주문 내용을 확인 하였으며, 회원 본인은 결제에 동의합니다.
         -->
        <div class="go-payment-wrapper">
          <oval-button @click="paymentClicked" class="go-payment"
            >결제하기</oval-button
          >
          <!-- {{ paymentProductName }} -->
        </div>
      </div>
      <!-- <div class="test">
        <b-link :to="{ name: 'Cart' }">이전</b-link>
      </div> -->
    </div>
  </div>
</template>

<script>
import {
  BFormInput,
  BLink,
  BFormRadio,
  BFormRadioGroup,
  BFormTextarea,
  BButton,
  BSpinner,
} from 'bootstrap-vue';
import { toPrice } from '@/util';
import { makeSimpleMutation, makeSimpleQuery } from '@/api/graphql-client';
import { mapActions } from 'vuex';
import BootPay from 'bootpay-js';

const cartitemsByIdsReq = makeSimpleQuery('cartitemById');
const siteOptionsReq = makeSimpleQuery('siteOptions');
const createOrderFromCartReq = makeSimpleMutation('createOrderFromCart');

export default {
  title: '주문결제',
  components: {
    BLink,
    BSpinner,
    BButton,
    BFormInput,
    BFormRadio,
    BFormRadioGroup,
    BFormTextarea,
    FindingAddressButton: () => import('@/components/FindingAddressButton'),
    OvalButton: () => import('@/components/OvalButton'),
  },
  data() {
    return {
      transportationFee: 123,
      selectDeliveryPlace: 'default',
      cartitemFetched: false,
      // addressNew: '',
      // addressOld: '',
      addressObj: {},
      orderId: null,
      form: {
        name: '',
        address: '',
        address_detail: '',
        phone: '',
        request: '',
        paymentMethod: '',
        payer: '',
      },
      validate: {
        name: {
          status: null,
          msg: '',
          validateFunction: (value) => {
            if (value !== '') return { status: true };
            return { status: false, msg: '필수 입력사항 입니다.' };
          },
        },
        address: {
          status: null,
          msg: '',
          validateFunction: (value) => {
            if (value !== '') return { status: true };
            return { status: false, msg: '필수 입력사항 입니다.' };
          },
        },
        address_detail: {
          status: null,
          msg: '',
          validateFunction: (value) => {
            if (value !== '') return { status: true };
            return { status: false, msg: '필수 입력사항 입니다.' };
          },
        },
        phone: {
          status: null,
          msg: '',
          validateFunction: (value) => {
            if (value !== '') return { status: true };
            return { status: false, msg: '필수 입력사항 입니다.' };
          },
        },
        paymentMethod: {
          status: null,
          msg: '',
          validateFunction: (value) => {
            if (value !== '') return { status: true };
            return { status: false, msg: '하나를 반드시 선택해주세요.' };
          },
        },
        payer: {
          status: null,
          msg: '',
          validateFunction: (value) => {
            // nobank 가 아니면 상관이 없으므로 바로 리턴.
            if (this.form.paymentMethod !== 'nobank') {
              return { status: true };
            }
            // nobank 일 때 값이 있어야 함.
            if (value !== '') {
              return { status: true };
            }
            return { status: false, msg: '필수 사항입니다' };
          },
        },
      },
      orderList: [
        // {
        //   name: '소파킷 고독',
        //   // option_type: 'has_options',
        //   options: [
        //     {
        //       id: '123',
        //       content: 'a옵션',
        //       count: 3,
        //       price: 30000,
        //     },
        //     {
        //       id: '456',
        //       content: 'B옵션',
        //       count: 2,
        //       price: 20000,
        //     },
        //   ],
        // },
        // {
        //   name: '소파킷 파워',
        //   // option_type: 'no_options',
        //   options: [
        //     {
        //       id: '123',
        //       content: 'a옵션',
        //       count: 5,
        //       price: 34000,
        //     },
        //   ],
        // },
      ],
    };
  },
  watch: {
    formAddress() {
      // this.cancelDefaultDeliveryPlace();
      this.resetStatus('address');
    },
  },
  computed: {
    formAddress() {
      return this.form.address;
    },
    totalProductPrice() {
      const options = this.orderList.map((cartitem) => cartitem.options).flat();
      // console.log('# OrderPayment.vue totalProductPrice options');
      // console.dir(options);
      const sum = options.reduce((acc, now) => acc + now.count * now.price, 0);
      return sum;
    },
    totalCount() {
      const options = this.orderList.map((cartitem) => cartitem.options).flat();
      // console.log('# OrderPayment.vue totalProductPrice options');
      // console.dir(options);
      const count = options.reduce((acc, now) => acc + now.count, 0);
      return count;
    },
    totalPrice() {
      return this.totalProductPrice + this.transportationFee;
    },
    addressNew() {
      if (this.addressObj.roadAddress) {
        return `${this.addressObj.roadAddress} (${this.addressObj.bname})`;
      }
      return '';
    },
    addressOld() {
      return this.addressObj.jibunAddress;
    },
    cartitems() {
      const { ids } = this.$route.params;
      if (ids) return ids.split(',').map((item) => parseInt(item, 10));
      return [];
    },
    // 결제창에서 보여질 이름
    paymentProductName() {
      const options = this.orderList.map((cartitem) => cartitem.options).flat();
      if (options.length === 0) {
        return '';
      }
      if (options.length === 1) {
        return `${this.orderList[0].name} - ${options[0].content}`;
      }
      return `${this.orderList[0].name} - ${options[0].content} 외 ${
        options.length - 1
      }건`;
    },

    // 결제창에서 넣을 items
    paymentItems() {
      return this.orderList
        .map((cartitem) =>
          cartitem.options.map((option) => ({
            item_name: `${cartitem.name} - ${option.content}`,
            qty: option.count,
            unique: `${cartitem.id}-${option.id}`,
            price: option.price,
            cat1: '소파킷',
          })),
        )
        .flat();
    },

    // bootpay 결제 request 에 넣을 args
    bootpayArgs() {
      return {
        price: this.totalPrice, // 실제 결제되는 가격
        application_id: '5eb4c78702f57e00291ee0e3',
        name: this.paymentProductName, // 결제창에서 보여질 이름
        pg: 'kcp',
        method: this.form.paymentMethod, // 결제수단, 입력하지 않으면 결제수단 선택부터 화면이 시작합니다.
        show_agree_window: 0, // 부트페이 정보 동의 창 보이기 여부
        items: this.paymentItems,
        // items: [
        //   {
        //     item_name: '나는 아이템', // 상품명
        //     qty: 1, // 수량
        //     unique: '123', // 해당 상품을 구분짓는 primary key
        //     price: 1000, // 상품 단가
        //     cat1: 'TOP', // 대표 상품의 카테고리 상, 50글자 이내
        //     cat2: '티셔츠', // 대표 상품의 카테고리 중, 50글자 이내
        //     cat3: '라운드 티', // 대표상품의 카테고리 하, 50글자 이내
        //   },
        // ],
        user_info: {
          username: this.form.name,
          email: this.$store.state.currentUser.email,
          addr: `${this.form.address} ${this.form.address_detail}`,
          phone: this.form.phone,
        },
        order_id: this.orderId, // 고유 주문번호로, 생성하신 값을 보내주셔야 합니다.
        params: {
          callback1: '그대로 콜백받을 변수 1',
          callback2: '그대로 콜백받을 변수 2',
          customvar1234: '변수명도 마음대로',
        },
        // account_expire_at: '2020-10-25', // 가상계좌 입금기간 제한 ( yyyy-mm-dd 포멧으로 입력해주세요. 가상계좌만 적용됩니다. )
        extra: {
          // start_at: '2019-05-10', // 정기 결제 시작일 - 시작일을 지정하지 않으면 그 날 당일로부터 결제가 가능한 Billing key 지급
          // end_at: '2022-05-10', // 정기결제 만료일 -  기간 없음 - 무제한
          vbank_result: 1, // 가상계좌 사용시 사용, 가상계좌 결과창을 볼지(1), 말지(0), 미설정시 봄(1)
          quota: '0,2,3', // 결제금액이 5만원 이상시 할부개월 허용범위를 설정할 수 있음, [0(일시불), 2개월, 3개월] 허용, 미설정시 12개월까지 허용,
          theme: 'purple', // [ red, purple(기본), custom ]
          // custom_background: '#00a086', // [ theme가 custom 일 때 background 색상 지정 가능 ]
          // custom_font_color: '#ffffff', // [ theme가 custom 일 때 font color 색상 지정 가능 ]
        },
      };
    },
  },
  async mounted() {
    this.fetchCartitemData();
    this.fetchDefaultDest();
    this.fetchTransportationFee();
  },

  methods: {
    ...mapActions(['getCurrentUser']),
    toPrice,
    async fetchCartitemData() {
      // 만약 cartitem 의 길이가 0이라면, 유효하지 않은 cartitem 이므로 실패 처리.
      if (this.cartitems.length === 0) {
        this.getFail('결제할 대상 데이터가 없습니다.');
        return;
      }
      if (this.cartitems.some((item) => Number.isNaN(item))) {
        this.getFail('유효한 상품 코드가 아닙니다.');
        return;
      }
      // 데이터 가져오기
      const res = await cartitemsByIdsReq(
        { ids: this.cartitems },
        `{
      success code
      list { id user added modified product_id usage
        product { 
          product_type name featured_image_url featured_image_alt
        }
        options {
          id content price count
        }      
      }
    }`,
      );
      console.log('# OrderPayment mounted res');
      console.log(res);
      // 실패 했을 때 처리
      if (!res.success) {
        if (res.code === 'invalid_id') {
          this.getFail('상품 코드를 찾을 수 없거나 권한이 없습니다.');
        }
        return;
      }
      this.orderList = res.list.map((cartitem) => ({
        name: cartitem.product.name,
        id: cartitem.product_id,
        options: cartitem.options,
      }));
      // this.orderList = [];
      this.cartitemFetched = true;
    },
    async fetchDefaultDest() {
      const user = await this.getCurrentUser();
      const dest = user?.default_dest;
      if (dest) {
        Object.keys(dest).forEach((destInfoKey) => {
          this.form[destInfoKey] = dest[destInfoKey];
        });
      }
    },
    addressLoaded(data) {
      console.log('# OrderPayment addressLoaded');
      console.log(data);
      this.addressObj = data;
      this.form.address = this.addressNew;
      this.form.address_detail = data.buildingName;
      // self.addressNew = `${data.roadAddress} (${data.bname})`;
      // self.addressOld = data.jibunAddress;
      // self.form.addressDetailed = data.buildingName;
    },
    setPaymentMethod(method, event) {
      this.form.paymentMethod = method;
      event.target.blur();
      this.resetStatus('paymentMethod');
      // 무통장 입금일 경우 입금자 input 에 focus 하기.
      if (method === 'nobank') {
        this.$nextTick(() => {
          this.$refs.payer.focus();
        });
      }
    },
    getFail(reason = '') {
      this.$router.push({ name: 'PaymentFail', params: { reason } });
    },
    selectDeliveryPlaceChanged(value) {
      // console.log('# OrderPayment selectDeliveryPlaceChanged value')
      // console.log(value);
      if (value === 'default') {
        this.fetchDefaultDest();
      } else {
        this.form.name = '';
        this.form.address = '';
        this.form.address_detail = '';
        this.form.phone = '';
        this.form.request = '';
      }
    },
    nameUpdated() {
      this.cancelDefaultDeliveryPlace();
      this.resetStatus('name');
    },
    addressUpdated() {
      this.cancelDefaultDeliveryPlace();
      this.resetStatus('address');
    },
    addressDetailUpdated() {
      this.cancelDefaultDeliveryPlace();
      this.resetStatus('address_detail');
    },
    phoneUpdated() {
      this.cancelDefaultDeliveryPlace();
      this.resetStatus('phone');
    },
    payerUpdated() {
      this.cancelDefaultDeliveryPlace();
      this.resetStatus('payer');
    },
    requestUpdated() {
      this.cancelDefaultDeliveryPlace();
    },
    cancelDefaultDeliveryPlace() {
      this.selectDeliveryPlace = 'manual';
    },
    async resetStatus(formName) {
      const validateObj = this.validate[formName];
      validateObj.status = null;
    },
    async fetchTransportationFee() {
      const res = await siteOptionsReq(
        {
          names: ['transportation_fee'],
        },
        '{ name value success code }',
      );
      console.log('# OrderPayment fetchTransporationFee res');
      console.log(res);
      if (res[0].success) {
        this.transportationFee = res[0].value;
      }
    },
    async validateInputs() {
      // validate 할 데이터에 대한 의존성 존재.
      const dataNames = [
        'name',
        'address',
        'address_detail',
        'phone',
        'paymentMethod',
        'payer',
      ];
      let validated = true;
      for (const dataName of dataNames) {
        if (this.validate[dataName] !== undefined) {
          // console.log(`# OrderPayment validateInputs ${dataName}`);
          const validateObj = this.validate[dataName];
          const { validateFunction } = validateObj;

          // this.form 에 대한 의존성 존재. 데이터를 불러오는 것에 대한 의존성이 있음.
          const data = this.form[dataName];

          // validate 결과를 적용
          const { status, msg } = validateFunction(data);
          // console.dir({ status, msg });
          validateObj.status = status ? null : false;
          validateObj.msg = msg;

          // 최초로 status 가 false 인 것에 대해 focus 해준다.
          if (validated && status === false) {
            this.$nextTick(() => {
              this.$refs[dataName].focus();
              console.log(this.$refs[dataName]);
              // console.log('focuessed!!!!');
            });
          }

          // 전부 true 여야 최종 validated 가 true 일 수 있도록 && 연산을 먹여줌.
          validated = validated && status;
        }
      }
      return validated;
    },

    async setValidateMessage() {
      // todo: 이거 뭐하는 거더라?
    },

    async paymentClicked() {
      const validated = await this.validateInputs();
      console.log('# OrderPayment paymentClicked validated');
      console.log(validated);

      // 만약 validated 되지 않았다면, 즉시 종료.
      if (!validated) {
        this.setValidateMessage();
        return;
      }

      // 일단 order 생성한다. (bootpay 에 order id 를 넘겨주기 위해 일단 생성해야 함.)
      // todo: 무조건 결제 상태를 결제 대기 상태로 만들어야 함.
      const dest = { ...this.form };
      delete dest.paymentMethod;
      delete dest.payer;
      const res = await createOrderFromCartReq(
        {
          input: {
            items_id: this.cartitems,
            method: this.form.paymentMethod,
            dest,
            transport_fee: this.transportationFee,
          },
          payer: this.form.payer,
        },
        `{
        success code order_id
      }`,
      );
      console.log('# OrderPayment paymentClicked res');
      console.log(res);
      this.orderId = res.order_id;

      // nobank 가 아닐 경우 결제창으로 결제!
      if (this.form.paymentMethod !== 'nobank') {
        this.requestPayment();
      }
      // 무통장 입금이고, 그냥 order 만드는 게 성공했을 때
      // 다음 화면으로 넘어간다.
      else if (res.success) {
        this.$router.push({
          name: 'PaymentSuccessNoBank',
          query: { orderId: res.order_id },
        });
      }
      // 결제하게 되면, bootpay에 넘겨주는 콜백으로 모든 결과를 처리하게 됨.
      // 그러므로 이 함수는 이제 역할을 다 함.

      // // 결제에 성공했을 경우 다음 페이지 전환
      // if (res.success) {
      //   // 무통장 입금일 경우
      //   if (this.form.paymentMethod === 'nobank') {
      //     // ...PaymentSuccessNoBank
      //   }

      //   // 그 외 결제일 경우
      //   else {
      //     this.$router.push({ name: 'PaymentSuccess' });
      //   }
      // }
      // // 결제에 실패했을 경우
      // else {
      //   this.getFail(res.code);
      // }
    },
    requestPayment() {
      // 실제 복사하여 사용시에는 모든 주석을 지운 후 사용하세요
      BootPay.request(this.bootpayArgs)
        .error((data) => {
          // 결제 진행시 에러가 발생하면 수행됩니다.
          console.log('# Bootpay error');
          console.log(data);
        })
        .cancel((data) => {
          // 결제가 취소되면 수행됩니다.
          console.log('# Bootpay cancel');
          console.log(data);
        })
        .ready((data) => {
          // 가상계좌 입금 계좌번호가 발급되면 호출되는 함수입니다.
          console.log('# Bootpay ready');
          console.log(data);
        })
        .confirm((data) => {
          // 결제가 실행되기 전에 수행되며, 주로 재고를 확인하는 로직이 들어갑니다.
          // 주의 - 카드 수기결제일 경우 이 부분이 실행되지 않습니다.
          // 그냥 무조건 승인 처리 한다음에, 뭐 안되면 그냥 승인 취소하는 방향으로 가자.
          console.log('# Bootpay confirm');
          console.log(data);
          const enable = true; // 재고 수량 관리 로직 혹은 다른 처리
          if (enable) {
            BootPay.transactionConfirm(data); // 조건이 맞으면 승인 처리를 한다.
          } else {
            BootPay.removePaymentWindow(); // 조건이 맞지 않으면 결제 창을 닫고 결제를 승인하지 않는다.
          }
        })
        .close((data) => {
          // 결제창이 닫힐때 수행됩니다. (성공,실패,취소에 상관없이 모두 수행됨)
          console.log('# Bootpay close');
          console.log(data);
        })
        .done((data) => {
          // 결제가 정상적으로 완료되면 수행됩니다
          // 비즈니스 로직을 수행하기 전에 결제 유효성 검증을 하시길 추천합니다.
          // todo: 진행한 후 bootpay 에서 receipt_id 를 이용해 검증 및 order 생성
          console.log('# Bootpay done');
          console.log(data);
          this.$router.push({ name: 'PaymentSuccess' });
        });
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/common';

.payment {
  display: flex;
}
.delivery-info-wrapper {
  flex: 1;
  margin-right: 150px;
}

.header:not(:first-child) {
  margin-top: 50px;
}

.header {
  margin-bottom: 15px;
}

.header h2 {
  font-size: 19px;
  font-weight: bold;
}

.form-content input {
  max-width: 300px;
  border-color: #000;
}

.form-content textarea {
  border-color: #000;
  max-width: 400px;
}

.form-item {
  margin-bottom: 20px;
}

.form-example {
  font-size: 13px;
  color: #aaa;
}

/** address */

.load-address-button {
  // margin-left: 20px;
  background-color: #9b9b9b;
  color: #fff;
  border: 0;
  padding: 3px 15px;
  font-size: 14px;
}

.form-address-title-wrapper {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.address-new:disabled {
  background-color: inherit;
}

.address-old {
  font-size: 13px;
  color: #585858;
}

/** order list */

.order-row.loading {
  align-items: center;
  justify-content: center;
  .spinner {
    width: 20px;
    height: 20px;
    margin-right: 10px;
  }
}

.order-row {
  display: flex;
  padding-bottom: 10px;
  border-bottom: 1px solid #000;
  margin-bottom: 10px;
}

.order-row.head {
  color: #585858;
}

.order-row-inner-wrapper {
  display: flex;
  align-items: center;
  flex: 0 0 100%;
}
.order-cell.name {
  flex: 0 0 50%;
  text-align: left;
}

.order-cell.name.option {
  font-size: 14px;
  color: #585858;
}

.order-cell.count {
  flex: 0 0 25%;
  text-align: center;
}
.order-cell.price {
  flex: 0 0 25%;
  text-align: right;
}

.has-option-wrapper {
  display: flex;
  flex-direction: column;
  flex: 0 0 100%;
}

/** payment method */

.payment-method {
  margin: 0 -8px;
}

.payment-method .btn {
  width: 100%;
  border: 2px solid transparent;
  &.selected {
    border-color: #000;
    font-weight: bold;
  }
}

.payment-method-option {
  padding: 8px;
}

.option-inner-wrapper {
  border: 1px solid #000;
}

/** payment info */

.payment-info-wrapper {
  position: relative;
  flex: 0 0 300px;
  padding: 0 0 0 40px;
  border-left: 2px solid #000;
}

$content-margin-top: 30px;

.payment-info {
  position: sticky;
  top: $content-margin-top + 2px + $desktop-header-height +
    $desktop-subheader-height;
}

@include prevent-break-top0('.payment-info');

.payment-info hr {
  border-color: #000;
  border-width: 2px;
}

.payment-table {
  margin: 20px 0 40px;
}

.payment-table-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 10px;
}

.payment-table-cell {
  color: #585858;
  &.total-price {
    color: #000;
    font-size: 21px;
    font-weight: bold;
  }
}

.last-notice {
  font-size: 13px;
  text-align: center;
  margin-bottom: 15px;
}

.go-payment-wrapper {
  text-align: center;
}
.btn.go-payment {
  border-width: 1px;
}

.input-error-msg {
  font-size: 13px;
  color: $red;
  font-weight: bold;
}
</style>

<style scoped></style>

<style></style>
