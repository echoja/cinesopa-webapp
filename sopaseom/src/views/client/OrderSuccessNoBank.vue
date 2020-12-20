<template>
  <div class="order-success-nobank">
    <div class="congratulations">주문이 성공적으로 접수되었습니다!</div>
    <div class="header">
      <h2>무통장입금 안내사항</h2>
    </div>
    <div class="nobank-notice">
      <ul>
        <li>
          입금자명 혹은 입금액이 다를 경우 입금 확인이 어려워 배송이 지연될 수
          있습니다.
        </li>
        <li>
          주문 후 48시간 이내에 입금하지 않으실 경우 주문이 취소될 수 있습니다.
        </li>
        <!-- <li>기타 문의사항은 이메일로 문의해주시기 바랍니다.</li> -->
      </ul>
    </div>
    <table class="info">
      <tr>
        <td class="col-head">입금자명</td>
        <td class="col-body">{{ order.payer }}</td>
      </tr>
      <tr>
        <td class="col-head">입금액</td>
        <td class="col-body">{{ toPrice(totalPrice) }}</td>
      </tr>
      <tr>
        <td class="col-head">입금하실 곳</td>
        <td class="col-body">
          신협 131-019-316608 (예금주: 영화배급협동조합 씨네소파)
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
import { toPrice } from '@/util';
import { BButton } from 'bootstrap-vue';

const nobankOrderInfoReq = makeSimpleQuery('nobankOrderInfo');

export default {
  title: '주문성공',
  components: {
    BButton,
  },
  data() {
    return {
      order: {
        items: [],
        transport_fee: 0,
      },
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
      console.log('# OrderSuccessNoBank.vue totalProductPrice options');
      console.dir(options);
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
      const { success, code, order } = await nobankOrderInfoReq(
        { id: this.orderId },
        `
          { success code 
            order {
              transport_fee payer items {
                options {
                  count price
                }
              }
            }
          }`,
      );
      // 만약 실패시 창을 옮기고 바로 리턴
      if (!success) {
        this.getFail(code);
        return;
      }
      this.order = order;
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
.info {
  td {
    padding: 5px 20px;
  }
  .col-head {
    font-weight: bold;
    border-right: 1px solid #ddd;
  }
}
.to-home {
  text-align: center;
  margin: 30px 0;
}
</style>

<style scoped></style>

<style></style>
