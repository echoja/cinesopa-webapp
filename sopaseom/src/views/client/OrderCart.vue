<template>
  <div class="cart">
    <div class="cartitem-list">
      <div
        class="cartitem-wrapper"
        v-for="(cartitem, cartitemIndex) in cartitems"
        :key="cartitemIndex"
      >
        <div class="cartitem">
          <div class="preview-wrapper">
            <div
              class="preview"
              :style="{
                'background-image': `url('${cartitem.product.featured_image_url}')`,
              }"
            ></div>

            <!-- <img
              :src="cartitem.product.featured_image_url"
              :alt="cartitem.product.featured_image_alt"
              class="preview"
            /> -->
          </div>
          <div class="title-wrapper">
            <h2 class="title">{{ cartitem.product.name }}</h2>
          </div>
          <div class="options">
            <div
              class="option"
              v-for="(option, index) in cartitem.options"
              :key="index"
            >
              <div class="option-name">{{ option.content }}</div>
              <div class="count-box">
                <number-controller v-model="option.count"></number-controller>
              </div>
              <div class="count-and-price-blank"></div>
              <div class="price">{{ toPrice(option.price) }}</div>
            </div>
          </div>
          <div class="remove-button-wrapper">
            <b-button @click="$bvModal.show('remove-cartitem-modal')">
              &times;
            </b-button>
          </div>
          <b-modal
            id="remove-cartitem-modal"
            hide-footer
            @ok="removeCartitem(cartitemIndex)"
          >
            정말로 삭제하시겠습니까?
          </b-modal>
        </div>
      </div>
    </div>
    <div class="total-wrapper">
      <div class="total">
        <div class="total-row">
          <div class="total-cell header">주문금액</div>
          <div class="total-cell price">
            {{ toPrice(totalProductPrice) }}
          </div>
        </div>
        <div class="total-row">
          <div class="total-cell header">배송비</div>
          <div class="total-cell price">
            {{ toPrice(totalTransportationFee) }}
          </div>
        </div>
        <hr />
        <div class="total-row">
          <div class="total-cell header">결제금액</div>
          <div class="total-cell total-payment">
            {{ toPrice(totalPayment) }}
          </div>
        </div>
      </div>
    </div>
    <div class="button-box">
      <!-- <oval-button>둘러보기</oval-button> -->
      <oval-button :to="{ name: 'Payment' }">주문하기</oval-button>
    </div>
    <!-- {{ totalTransportationFee }} -->
    <!-- <div class="test">
      <b-link :to="{ name: 'Payment' }">다음</b-link>
    </div> -->
  </div>
</template>

<script>
import { BLink, BButton } from 'bootstrap-vue';
import { toPrice } from '@/util';

export default {
  title: '장바구니',

  components: {
    BLink,
    BButton,
    NumberController: () => import('@/components/NumberController'),
    OvalButton: () => import('@/components/OvalButton'),
  },
  data() {
    return {
      cartitems: [
        {
          id: 1,
          user: 'eszqsc112@naver.com', // 유저 이메일
          added: new Date('2020-10-12'),
          modified: new Date('2020-10-13'),
          product: {
            product_type: 'sopakit',
            name: '소파킷 - 고독',
            featured_image_url: 'https://sopaseom.com/upload/5d55a90942e7e191f1a5225c62ee4f3a',
            featured_image_alt: '이미지 설명',
          },
          options: [
            {
              id: 'hello',
              content: '키트',
              price: 500000,
              count: 4,
            },
          ],
          meta: {},
        },
      ],
    };
  },
  computed: {
    totalProductPrice() {
      return this.cartitems.reduce(
        (total, current) =>
          total +
          current.options.reduce(
            (optionTotal, option) => optionTotal + option.price * option.count,
            0,
          ),
        0,
      );
    },
    totalTransportationFee() {
      return this.cartitems.reduce(
        (total, cartitem) =>
          total + cartitem.transportationFee ? cartitem.transportationFee : 0,
        0,
      );
    },
    totalPayment() {
      return this.totalProductPrice + this.totalTransportationFee;
    },
  },
  methods: {
    toPrice,
    removeCartitem(index) {
      console.log('# OrderCart removeCartiten');
      console.log(index);
    },
  },
};
</script>

<style lang="scss" scoped>
.cartitem-wrapper {
  padding-bottom: 30px;
  border-bottom: 1px solid #000;
  margin-bottom: 30px;
}
.cartitem {
  display: flex;
  position: relative;
  align-items: center;
}

.title-wrapper {
  flex: 1;
}
.options {
  position: absolute;
  width: 100%;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: flex-end;
}

h2.title {
  font-size: 18px;
  font-weight: bold;
  padding-left: 35px;
}

.option {
  width: 80%;
  display: flex;
  justify-content: flex-end;
}

.count-and-price-blank {
  width: 20%;
}

.option-name {
  padding: 0 20px 0 0;
}

.count-box {
  display: flex;
}

.remove-button-wrapper {
  position: absolute;
  top: 0;
  right: 0;
}

.price {
  color: #585858;
}

.preview-wrapper {
  min-width: 120px;
  width: 15%;
}

.preview {
  width: 100%;
  padding-bottom: 100%;
  background-position: center;
  background-size: cover;
}

// .preview {
//   width: 120px;
// }

.total-wrapper {
  display: flex;
  justify-content: flex-end;
}

.total {
  flex: 1;
  max-width: 380px;
  hr {
    border-color: #000000;
  }
}

.total-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.total-cell.header {
  color: #585858;
}

.total-cell {
}

.total-payment {
  font-size: 18px;
  font-weight: bold;
}

.button-box {
  max-width: 300px;
  width: 100%;
  display: flex;
  justify-content: space-around;
  margin: 0 auto;
  .btn {
    border-width: 1px;
  }
}
</style>

<style scoped></style>

<style></style>
