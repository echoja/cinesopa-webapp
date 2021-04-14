// require('@/typedef');

const { Orderinfo, Cartiteminfo, FmtCartiteminfo } = require('@/typedef');
const { toPrice } = require('@/util');

const statusMap = {
  order_received: '주문접수',
  payment_confirming: '결제확인중',
  payment_success: '결제완료',
  product_loading: '상품준비중',
  transport_preparing: '배송준비중',
  transporting: '배송중',
  transport_success: '배송완료',
  deal_success: '거래완료',
  returning: '반송중',
  order_cancelling: '주문취소중',
  order_cancelled: '주문취소',
};

const paymentMethodMap = {
  card: '신용카드',
  nobank: '무통장입금',
  bank: '계좌이체',
  phone: '휴대폰결제',
  npay: '네이버페이',
  kakao: '카카오페이',
};

const transportCompanyMap = {
  'kr.epost': '우체국택배',
  'kr.cjlogistics': 'CJ 대한통운',
  'kr.lotte': '롯데택배',
};

class TemplateArgsRefiner {
  /**
   * order를 args에 맞게 바꿔줍니다.
   * @param {Orderinfo} order
   */
  createPaymentSuccessArgs(order) {
    const itemsFormatted = order.items.map((cartitem) => {
      /** @type {FmtCartiteminfo} */
      const result = { ...cartitem, options: null };
      result.options = cartitem.options.map((option) => ({
        ...option,
        price: toPrice(option.price),
      }));
      result.productRoute = {
        name: 'SopakitDetail',
        params: { id: cartitem.product_id },
      };
      return result;
    });
    const transportFeeFormatted = toPrice(order.transport_fee);
    const fullAddress = `${order.dest?.address ?? ''} ${
      order?.dest?.address_detail ?? ''
    }`;
    const options = order.items.map((cartitem) => cartitem.options).flat();
    const totalProductPrice = options.reduce(
      (acc, now) => acc + now.count * now.price,
      0,
    );
    const totalProductPriceFormatted = toPrice(totalProductPrice);
    const totalPrice = totalProductPrice + order.transport_fee;
    const totalPriceFormatted = toPrice(totalPrice);
    const totalCount = options.reduce((acc, now) => acc + now.price, 0);
    const paymentMethod = paymentMethodMap[order.method];
    const { dest } = order;
    const detailsLink =
      process.env.NODE_ENV === 'production'
        ? `https://sopaseom.com/my/ordered?showDetails=${order.id}`
        : `http://localhost:8080/my/ordered?showDetails=${order.id}`;
    return {
      totalProductPrice,
      totalProductPriceFormatted,
      totalPrice,
      totalPriceFormatted,
      totalCount,
      fullAddress,
      dest,
      itemsFormatted,
      transportFeeFormatted,
      paymentMethod,
      detailsLink,
    };
  }
}

module.exports = {
  TemplateArgsRefiner,
  make: () => new TemplateArgsRefiner(),
};
