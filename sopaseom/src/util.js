export const numberWithCommas = (x) => {
  if (typeof x === 'number') {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }
  return '-';
};

export const toPrice = (x) => `￦ ${numberWithCommas(x)}`;

export const statusMap = {
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

export const paymentMethodMap = {
  card: '신용카드',
  nobank: '무통장입금',
  bank: '계좌이체',
  phone: '휴대폰결제',
  // npay: '네이버페이',
  // kakao: '카카오페이',
};

export const transportCompanyMap = {
  'kr.epost': '우체국택배',
  'kr.cjlogistics': 'CJ 대한통운',
  'kr.lotte': '롯데택배',
};

export const groupBy = (array, keyFinder) => {
  const result = {};
  array.forEach((item) => {
    const key = keyFinder(item);
    if (!result[key]) result[key] = [];
    result[key].push(item);
  });
  return result;
};

// order 를 포맷 및 출력용 데이터를 만들어주는 녀석입니다.
export const getOrderInfo = (order) => {
  if (!order) {
    return null;
  }
  const itemsFormatted = order.items.map((cartitem) => {
    const result = { ...cartitem };
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
  const fullAddress = `${order.dest?.address ?? ''} ${order?.dest?.addressDetail ?? ''}`;
  const options = order.items.map((cartitem) => cartitem.options).flat();
  const totalProductPrice = options.reduce((acc, now) => acc + now.count * now.price, 0);
  const totalProductPriceFormatted = toPrice(totalProductPrice);
  const totalPrice = totalProductPrice + order.transport_fee;
  const totalPriceFormatted = toPrice(totalPrice);
  const totalCount = options.reduce((acc, now) => acc + now.price, 0);
  return {
    totalProductPrice,
    totalProductPriceFormatted,
    totalPrice,
    totalPriceFormatted,
    totalCount,
    fullAddress,
    itemsFormatted,
    transportFeeFormatted,
  };
};
