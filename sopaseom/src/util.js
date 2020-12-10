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
