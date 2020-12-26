// import url from 'url';
import axios from 'axios';

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

// export const kobisApiKey = '54cf71a4a9c956205be55e754cf99ad5';
// export const kobisRestUrl = 'http://www.kobis.or.kr/kobisopenapi/webservice/rest/movie/searchMovieList.json?key=54cf71a4a9c956205be55e754cf99ad5';
// // export const kobisQueryKeyname = 'key';
// export const kobisUrl = new url.URL('http://www.kobis.or.kr/kobisopenapi/webservice/rest/movie/searchMovieList.json?key=54cf71a4a9c956205be55e754cf99ad5');
export const makeSearchMovieListUrl = () =>
  new URL(
    'http://www.kobis.or.kr/kobisopenapi/webservice/rest/movie/searchMovieList.json?key=54cf71a4a9c956205be55e754cf99ad5&itemPerPage=20',
  );
export const makeSearchMovieInfoUrl = () =>
  new URL(
    'http://www.kobis.or.kr/kobisopenapi/webservice/rest/movie/searchMovieInfo.json?key=54cf71a4a9c956205be55e754cf99ad5',
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
