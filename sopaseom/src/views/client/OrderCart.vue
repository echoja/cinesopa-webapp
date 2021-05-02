<template>
  <div class="cart">
    <div class="cartitem-list">
      <div
        v-if="cartitems.length === 0"
        class="blank-cartitems cartitem-wrapper"
      >
        <p class="text-center m-0">장바구니가 비어있습니다.</p>
      </div>
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
                'background-image': `url('${cartitem.product.featured_image_url}?size=file_preview')`,
              }"
            ></div>

            <!-- <img
              :src="cartitem.product.featured_image_url"
              :alt="cartitem.product.featured_image_alt"
              class="preview"
            /> -->
          </div>
          <div class="title-wrapper">
            <h2 class="title">
              <b-link
                :to="{
                  name: 'SopakitDetail',
                  params: { id: cartitem.product_id },
                }"
              >
                {{ cartitem.product.name }}
              </b-link>
            </h2>
          </div>
          <!-- 옵션 데스크탑 -->
          <div class="options desktop">
            <div
              class="option"
              v-for="(option, optionIndex) in cartitem.options"
              :key="optionIndex"
            >
              <div class="option-name">{{ option.content }}</div>
              <div class="count-box">
                <number-controller
                  v-model="option.count"
                  @input="countChanged(cartitemIndex, optionIndex)"
                  :id="`number-controller-${cartitemIndex}-${optionIndex}`"
                ></number-controller>
                <b-tooltip
                  triggers="manual"
                  :target="`number-controller-${cartitemIndex}-${optionIndex}`"
                  :show="option.tooltipShow"
                ></b-tooltip>
              </div>
              <div class="count-and-price-blank"></div>
              <div class="price">{{ toPrice(option.price) }}</div>
            </div>
          </div>
          <div class="remove-button-wrapper">
            <b-button
              @click="$bvModal.show(`remove-cartitem-modal${cartitemIndex}`)"
            >
              &times;
            </b-button>
          </div>
          <b-modal
            :id="`remove-cartitem-modal${cartitemIndex}`"
            @ok="removeCartitem(cartitemIndex)"
            title="장바구니 삭제 확인"
            ok-title="네, 삭제합니다."
            cancel-title="취소"
          >
            정말로 삭제하시겠습니까?
          </b-modal>
        </div>
        <!-- 옵션 모바일 -->
        <div class="options mobile">
          <div
            class="option"
            v-for="(option, optionIndex) in cartitem.options"
            :key="optionIndex"
          >
            <div class="option-name">{{ option.content }}</div>
            <div class="count-box">
              <number-controller
                v-model="option.count"
                @input="countChanged(cartitemIndex, optionIndex)"
                :id="`number-controller-${cartitemIndex}-${optionIndex}`"
              ></number-controller>
              <b-tooltip
                triggers="manual"
                :target="`number-controller-${cartitemIndex}-${optionIndex}`"
                :show="option.tooltipShow"
              ></b-tooltip>
            </div>
            <div class="count-and-price-blank"></div>
            <div class="price">{{ toPrice(option.price) }}</div>
          </div>
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
            {{ toPrice(transportationFee) }}
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
      <oval-button
        :disabled="cartitems.length === 0"
        @click="orderButtonClicked"
        >주문하기</oval-button
      >
    </div>
    <!-- {{ transportationFee }} -->
    <!-- <div class="test">
      <b-link :to="{ name: 'Payment' }">다음</b-link>
    </div> -->
  </div>
</template>

<script>
import { BLink, BButton, BTooltip } from 'bootstrap-vue';
import { toPrice } from '@/util';
import { makeSimpleMutation, makeSimpleQuery } from '@/api/graphql-client';
import { mapActions } from 'vuex';
import { debounce } from 'debounce';

const removeCartitemReq = makeSimpleMutation('removeCartitem');
const updateOptionCountReq = makeSimpleMutation('updateOptionCount');
const siteOptionsReq = makeSimpleQuery('siteOptions');
const debouncedFuncMap = new Map();

export default {
  title: '장바구니',

  components: {
    BTooltip,
    BLink,
    BButton,
    NumberController: () => import('@/components/NumberController'),
    OvalButton: () => import('@/components/OvalButton'),
  },
  data() {
    return {
      transportationFee: 0,
      cartitems: [
        // {
        //   id: 1,
        //   user: 'eszqsc112@naver.com', // 회원 이메일
        //   added: new Date('2020-10-12'),
        //   modified: new Date('2020-10-13'),
        //   product: {
        //     product_type: 'sopakit',
        //     name: '소파킷 - 고독',
        //     featured_image_url:
        //       'https://sopaseom.com/upload/5d55a90942e7e191f1a5225c62ee4f3a',
        //     featured_image_alt: '이미지 설명',
        //   },
        //   options: [
        //     {
        //       id: 'hello',
        //       content: '키트',
        //       price: 500000,
        //       count: 4,
        //     },
        //   ],
        //   meta: {},
        // },
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
    totalPayment() {
      return this.totalProductPrice + this.transportationFee;
    },
  },
  async mounted() {
    this.fetchData();
    this.fetchTransportationFee();
  },
  methods: {
    ...mapActions(['pushMessage']),
    toPrice,
    async removeCartitem(index) {
      // console.log('# OrderCart removeCartitem');
      // console.log(index);
      const { id } = this.cartitems[index];
      const result = await removeCartitemReq({ id }, '{success code}');
      // 삭제 성공했을 시
      if (result.success) {
        this.pushMessage({
          type: 'success',
          msg: '장바구니가 성공적으로 삭제되었습니다.',
          id: 'removeCartitemSuccess',
        });
        this.fetchData();
      }
      // 삭제 실패시
      else {
        this.pushMessage({
          type: 'danger',
          msg: `장바구니를 삭제하는 도중 ${result.code}가 발생했습니다.`,
          id: 'removeCartitemFail',
        });
      }
    },
    async fetchData() {
      const req = makeSimpleQuery('cartitems');
      const res = await req(
        {},
        `{id user added modified product_id usage
        product {
          product_type name featured_image_url featured_image_alt
        }
        options {
          id content price count
        }
      }`,
      );
      this.cartitems = res;
      // console.log('# OrderCart fetchData');
      // console.log(res);
    },
    async orderButtonClicked() {
      // console.log('# OrderCart.vue orderButtonClicked');
      this.$router.push({
        name: 'Payment',
        params: {
          ids: this.cartitems.map((cartitem) => cartitem.id).join(','),
        },
      });
    },
    async countChanged(cartitemIndex, optionIndex) {
      // debounced version ... 실패. 원인불명. 자꾸 새롭게 갱신이 안됨.
      // // debounced 된 함수가 없을 경우 새롭게 만듬.
      // const key = `${cartitemIndex}-${optionIndex}`;
      // if (!debouncedFuncMap.has(key)) {
      //   debouncedFuncMap.set(
      //     key,
      //     debounce(this.updateOptionCount, 500),
      //   );
      // }
      // const func = debouncedFuncMap.get(key);
      // func(cartitemIndex, optionIndex);
      // // console.dir(debouncedFuncMap);
      this.updateOptionCount(cartitemIndex, optionIndex);
    },
    async updateOptionCount(cartitemIndex, optionIndex) {
      const cartitem = this.cartitems[cartitemIndex];
      const { options, id: cartitemId } = cartitem;
      const option = options[optionIndex];
      const { id: optionId, count } = option;
      const res = await updateOptionCountReq(
        {
          id: cartitemId,
          optionId,
          count,
          current: new Date(),
        },
        '{success code}',
      );
      // console.log('# OrderCart updateOptionCount');
      // console.log(res);
      // 업데이트 성공시
      if (res.success) {
        // this.pushMessage({
        //   type: 'success',
        //   msg: '장바구니의 개수가 성공적으로 삭제되었습니다.',
        //   id: 'removeCartitemSuccess',
        // });
        // this.fetchData();
      }
      // 업데이트 실패시
      else {
        this.pushMessage({
          type: 'danger',
          msg: `장바구니 개수를 조정하는 도중 ${res.code}가 발생했습니다.`,
          id: 'updateCartitemFail',
        });
      }
    },
    async fetchTransportationFee() {
      const res = await siteOptionsReq(
        {
          names: ['transportation_fee'],
        },
        '{ name value success code }',
      );
      // console.log('# OrderCart fetchTransporationFee res');
      // console.log(res);
      if (res[0].success) {
        this.transportationFee = parseInt(res[0].value, 10);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@use '../../style/common';
@use '../../style/breakpoint';

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
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}
.options.desktop {
  position: absolute;
  right: 0;
  bottom: 0;
}

.options.mobile {
  display: none;
  margin-top: 20px;
}

@include breakpoint.max-with(md) {
  .options.mobile {
    display: flex;
  }

  .options.desktop {
    display: none;
  }
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
