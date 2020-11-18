export const numberWithCommas = (x) => {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
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
