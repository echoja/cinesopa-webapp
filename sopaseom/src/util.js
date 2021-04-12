// import url from 'url';
import axios from 'axios';
import { makeSimpleQuery } from './api/graphql-client';

export const numberWithCommas = (x) => {
  if (typeof x === 'number') {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }
  return '-';
};

export const toPrice = (x) => `￦ ${numberWithCommas(x)}`;

/**
 * @param {any} item
 * @param {string[]} keys
 * @returns {{[key: string]: Date}[]}
 */
export const getSeoulDates = (item, keys) => {
  const obj = {};
  keys.forEach((key) => {
    if (item[key]) {
      obj[key] = new Date(item[key]);
    }
  });
  return obj;
};

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
  kakao: '카카오페이',
};

/** 배송 관련 */
export const applicationTransportStatusMap = {
  online: '온라인 전송',
  yet_to_delivery: '상영본 발송 대기중',
  delivery_complete: '상영본 발송 완료',
  return_complete: '상영본 회수 완료',
};

/** 세금계산서 관련 */
export const applicationReceiptStatusMap = {
  not_applicable: '세금계산서 발행 안함',
  pending: '세금계산서 발행 대기중',
  done: '세금계산서 발행 완료',
};

/** 정산 관련 */
export const applicationMoneyStatusMap = {
  not_applicable: '입금/정산 안함',
  pending_deposit: '입금 대기중',
  deposit_checked: '입금 확인됨',
  document_done: '정산시트기입 완료',
  invoice_done: '정산 완료',
};

/** 서류 상태 */
export const applicationDocStatusMap = {
  not_applicable: '서류 해당 없음',
  pending: '필요 서류 확인중',
  request_sended: '서류 요청 보냄',
  request_not_sended: '서류 요청 보내지 않음',
};

let rawDeliveryData = null;

export const getDeliveryRawData = async () => {
  if (rawDeliveryData) return rawDeliveryData;
  const res = await axios.get('https://apis.tracker.delivery/carriers');
  // console.log("# util.js getDeliveryRawData");
  // console.dir(res);
  rawDeliveryData = res.data;
  return rawDeliveryData;
};
export const getDeliveryOptions = async () => {
  const raw = await getDeliveryRawData();
  const options = raw.map((delivery) => ({
    value: delivery.id,
    text: delivery.name,
  }));
  options.unshift({ value: null, text: '-- 선택하세요 --' });
  return options;
};
export const getDeliveryMap = async () => {
  const raw = await getDeliveryRawData();
  const map = raw.reduce((prev, current) => {
    prev[current.id] = current.name;
    return prev;
  }, {});
  return map;
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

// export const kobisApiKey = '54cf71a4a9c956205be55e754cf99ad5';
// export const kobisRestUrl = 'http://www.kobis.or.kr/kobisopenapi/webservice/rest/movie/searchMovieList.json?key=54cf71a4a9c956205be55e754cf99ad5';
// // export const kobisQueryKeyname = 'key';
// export const kobisUrl = new url.URL('http://www.kobis.or.kr/kobisopenapi/webservice/rest/movie/searchMovieList.json?key=54cf71a4a9c956205be55e754cf99ad5');
export const makeSearchMovieListUrl = () =>
  new URL(
    'https://www.kobis.or.kr/kobisopenapi/webservice/rest/movie/searchMovieList.json?key=54cf71a4a9c956205be55e754cf99ad5&itemPerPage=20',
  );
export const makeSearchMovieInfoUrl = () =>
  new URL(
    'https://www.kobis.or.kr/kobisopenapi/webservice/rest/movie/searchMovieInfo.json?key=54cf71a4a9c956205be55e754cf99ad5',
  );

/**
 * 영화 리스트를 뽑아옵니다.
 * @param {string} filmName 검색할 영화 이름
 */
export const getMovieList = async (filmName) => {
  try {
    const reqUrl = makeSearchMovieListUrl();
    reqUrl.searchParams.set('movieNm', filmName);
    const result = await axios.get(reqUrl.href);
    console.log('# util.js getMovieList result');
    console.log(result);
    return { success: true, code: 'normal', list: result.data.movieListResult.movieList };
  } catch (e) {
    console.log('# util.js getMovieList failed');
    console.error(e);
    return { success: false, code: e.message, list: null };
  }
};

// movieList 결과
// {
//   movieListResult: {
//     totCnt: 80074
//     source: "영화진흥위원회"
//     movieList: [
//       {
//         movieCd: "20200511"
//         movieNm: "무릎 꿇어 너희 다"
//         movieNmEn: "Sextape"
//         prdtYear: "2018"
//         openDt: ""
//         typeNm: "장편"
//       }
//       ...
//     ]
//   }
// }

export const getMovieInfo = async (movieCd) => {
  try {
    const reqUrl = makeSearchMovieInfoUrl();
    reqUrl.searchParams.set('movieCd', movieCd);
    const result = await axios.get(reqUrl.href);
    console.log('# util.js getMovieList result');
    console.log(result);
    return { success: true, code: 'normal', info: result.data.movieInfoResult.movieInfo };
  } catch (e) {
    console.log('# util.js getMovieInfo failed');
    console.error(e);
    return { success: false, code: e.message, info: null };
  }
};

export const getOptionsFromServer = async (...names) => {
  const req = makeSimpleQuery('siteOptions');
  const optionResults = await req(
    {
      names,
    },
    `{
    name value success code
  }`,
  );
  return optionResults;
};
