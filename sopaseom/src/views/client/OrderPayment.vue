<template>
  <div class="payment">
    <div class="delivery-info-wrapper">
      <div class="delivery-info">
        <div class="header">
          <h2>배송정보</h2>
        </div>

        <div class="select-delivery-place">
          <b-form-radio-group>
            <b-form-radio :value="'default'"> 기본 배송지 </b-form-radio>
            <b-form-radio :value="'manual'"> 직접 입력 </b-form-radio>
          </b-form-radio-group>
        </div>
        <hr />
        <div class="form-item name">
          <div class="form-title">이름</div>
          <div class="form-content">
            <b-form-input size="sm" v-model="form.name"></b-form-input>
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
              v-model="addressNew"
              class="address-new"
            ></b-form-input>
            <div v-if="addressOld" class="address-old">
              지번: {{ addressOld }}
            </div>
          </div>
        </div>
        <div class="form-item address">
          <div class="form-title">상세 주소</div>
          <div class="form-content">
            <b-form-input
              size="sm"
              v-model="form.detailedAddress"
            ></b-form-input>
          </div>
        </div>
        <div class="form-item phone">
          <div class="form-title">전화번호</div>
          <div class="form-content">
            <b-form-input size="sm" v-model="form.phone"></b-form-input>
            <span class="form-example">예: 010-1234-5678</span>
          </div>
        </div>

        <div class="form-item request">
          <div class="form-title">배송시 요청사항</div>
          <div class="form-content">
            <b-form-textarea size="sm" v-model="form.request"></b-form-textarea>
          </div>
        </div>
        <div class="header">
          <h2>주문내역</h2>
        </div>
        <div class="order-list-table">
          <div class="order-row head">
            <div class="order-cell name">상품</div>
            <div class="order-cell count">수량</div>
            <div class="order-cell price">금액</div>
          </div>
          <div
            class="order-row"
            v-for="(order, orderIndex) in orderList"
            :key="orderIndex"
          >
            <div
              class="has-option-wrapper"
              v-if="order.option_type === 'has_options'"
            >
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
        <div class="payment-method row">
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
                @click="setPaymentMethod('phone', $event)"
                :class="{ selected: form.paymentMethod === 'phone' }"
              >
                휴대폰결제
              </b-button>
            </div>
          </div>
        </div>
      </div>
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
        <div class="go-payment-wrapper">
          <oval-button class="go-payment">결제하기</oval-button>
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
} from 'bootstrap-vue';
import { toPrice } from '@/util';

export default {
  title: '주문결제',
  components: {
    BLink,
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
      // addressNew: '',
      // addressOld: '',
      form: {
        name: '',
        address: {},
        detailedAddress: '',
        phone: '',
        request: '',
        paymentMethod: '',
      },
      orderList: [
        {
          name: '소파킷 고독',
          option_type: 'has_options',
          options: [
            {
              id: '123',
              content: 'a옵션',
              count: 3,
              price: 30000,
            },
            {
              id: '456',
              content: 'B옵션',
              count: 2,
              price: 20000,
            },
          ],
        },
        {
          name: '소파킷 파워',
          option_type: 'no_options',
          options: [
            {
              id: '123',
              content: 'a옵션',
              count: 5,
              price: 34000,
            },
          ],
        },
      ],
    };
  },
  computed: {
    totalProductPrice() {
      return 500000;
    },
    transportationFee() {
      return 3000;
    },
    totalCount() {
      return 2;
    },
    totalPrice() {
      return this.totalProductPrice + this.transportationFee;
    },
    addressNew() {
      if (this.form.address.roadAddress) {
        return `${this.form.address.roadAddress} (${this.form.address.bname})`;
      }
      return '';
    },
    addressOld() {
      return this.form.address.jibunAddress;
    },
  },
  methods: {
    toPrice,
    addressLoaded(data) {
      console.log('# OrderPayment addressLoaded');
      console.log(data);
      this.form.address = data;
      this.form.detailedAddress = data.buildingName;
      // self.addressNew = `${data.roadAddress} (${data.bname})`;
      // self.addressOld = data.jibunAddress;
      // self.form.addressDetailed = data.buildingName;
    },
    setPaymentMethod(method, event) {
      this.form.paymentMethod = method;
      event.target.blur();
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
  :hover {
  }
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

@include prevent-break-top0(".payment-info");

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
</style>

<style scoped></style>

<style></style>
