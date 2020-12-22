<template>
  <div class="order-success">
    <div class="congratulations">결제가 성공적으로 완료되었습니다!</div>
    <!-- <div class="header">
      <h2>결제 내용</h2>
    </div> -->
    <!-- <div class="notice">
      <ul>
        <li>
          입금자명 혹은 입금액이 다를 경우 입금 확인이 어려워 배송이 지연될 수
          있습니다.
        </li>
        <li>
          주문 후 48시간 이내에 입금하지 않으실 경우 주문이 취소될 수 있습니다.
        </li>
      </ul>
    </div> -->
    <table class="info">
      <tr>
        <td class="col-head">배송지 정보</td>
        <td class="col-body">
          <div>
            <p>{{ order.dest.name }}</p>
            <p>{{ order.dest.phone }}</p>
            <p>{{ order.dest.address }} {{ order.dest.address_detail }}</p>
          </div>
        </td>
      </tr>
      <tr>
        <td class="col-head">결제 금액 <br /><small>(배송비 포함)</small></td>
        <td class="col-body">{{ toPrice(totalPrice) }}</td>
      </tr>
      <tr>
        <td class="col-head">주문 내용</td>
        <td class="col-body">
          <div class="order-details">
            <div
              class="item"
              v-for="(item, itemIndex) in orderInfo.itemsFormatted"
              :key="itemIndex"
            >
              <div class="featured_image">
                <b-link :to="item.productRoute">
                  <b-img
                    :src="item.product.featured_image_url"
                    :alt="item.product.featured_image_alt"
                  ></b-img>
                </b-link>
              </div>
              <div class="options">
                <div class="product-name">
                  <b-link :to="item.productRoute">
                    {{ item.product.name }}
                  </b-link>
                </div>
                <div
                  class="option"
                  v-for="option in item.options"
                  :key="option.id"
                >
                  <span class="option-content">{{ option.content }}</span>
                  <span class="option-seperator"></span>
                  <span class="option-count">{{ option.count }}개</span>
                </div>
              </div>
            </div>
          </div>
        </td>
      </tr>
    </table>
    <div class="to-home">
      <b-button :to="{ name: 'Home' }"> 홈으로 </b-button>
    </div>
  </div>
</template>

<script>
import { makeSimpleQuery } from '@/api/graphql-client';
import { getOrderInfo, toPrice } from '@/util';
import { BButton, BImg, BLink } from 'bootstrap-vue';

const myOrderReq = makeSimpleQuery('myOrder');

export default {
  title: '주문성공',
  components: {
    BButton,
    BImg,
    BLink,
  },
  data() {
    return {
      order: {
        items: [],
        dest: {},
        transport_fee: 0,
      },
      orderInfo: {},
    };
  },
  computed: {
    orderId() {
      return parseInt(this.$route.query.orderId, 10) ?? null;
    },
    totalPrice() {
      return this.totalProductPrice + this.order.transport_fee;
    },
    totalProductPrice() {
      const options = this.order.items
        .map((cartitem) => cartitem.options)
        .flat();
      // console.log('# OrderSuccess.vue totalProductPrice options');
      // console.dir(options);
      const sum = options.reduce((acc, now) => acc + now.count * now.price, 0);
      return sum;
    },
  },
  async mounted() {
    if (this.orderId === null) {
      this.$router.push({ name: '401' });
    }
    this.fetchData();
  },
  methods: {
    toPrice,
    async fetchData() {
      const order = await myOrderReq(
        { id: this.orderId },
        `
          { 
            transport_fee payer items {
              options {
                id count price content
              }
              product_id
              product { name featured_image_url featured_image_alt }
            }
            dest { name phone address address_detail }
          }`,
      );
      console.log('# OrderSuccess fetchData order');
      console.log(order);
      // 만약 실패시 창을 옮기고 바로 리턴
      if (!order) {
        this.getFail();
        return;
      }
      this.order = order;
      this.orderInfo = getOrderInfo(order);
      console.log('# OrderSuccess fetchData orderInfo');
      console.log(this.orderInfo);
    },
    getFail(reason = '') {
      this.$router.push({ name: 'PaymentFail', params: { reason } });
    },
  },
};
</script>

<style lang="scss" scoped>
.congratulations {
  font-size: 30px;
  text-align: center;
  margin-bottom: 30px;
}
h2 {
  font-size: 18px;
  font-weight: bold;
}
p {
  margin: 0;
}
.info {
  td {
    padding: 10px 20px;
    vertical-align: top;
  }
  .col-head {
    font-weight: bold;
    border-right: 1px solid #000;
  }
}
.to-home {
  text-align: center;
  margin: 30px 0;
}
.item {
  display: flex;
  margin-bottom: 15px;
}
.featured_image {
  margin-right: 20px;
}

.featured_image a {
  display: block;
  width: 100px;
  height: 100px;
}
.featured_image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  // object-position: center;
}
.options {
  flex: 1;
}
.option {
  font-size: 14px;
  color: #777;
}
.option-seperator {
  padding: 0 3px;
}
</style>

<style scoped></style>

<style></style>
