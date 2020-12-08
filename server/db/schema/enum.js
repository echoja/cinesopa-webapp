const { makeEnum } = require('../../util');

const enumAuthmap = makeEnum(['ADMIN', 'GUEST', 'ANYONE']);
const enumPeopleRoleType = makeEnum(['director', 'actor', 'staff']);
const enumMenuType = makeEnum([
  'link',
  'page',
  'board',
  'nouse',
  'post',
  'file',
]);
const enumOrderStatus = makeEnum([
  'order_received', // "주문접수",
  'payment_confirming', // "결제확인중",
  'payment_success', // "결제완료",
  'product_loading', // "상품준비중",
  'transport_preparing', // "배송준비중",
  'transporting', // "배송중",
  'transport_success', // "배송완료",
  'deal_success', // "거래완료",
  'returning', // "반송중",
  'order_cancelling', // "주문취소중",
  'order_cancelled', // "주문취소",
]);
const enumOrderMethod = makeEnum([
  'card',
  'phone',
  'nobank',
  'bank',
  'vbank',
  'auth',
  'card_rebill',
  'easy',
]);
const enumProductType = makeEnum(['sopakit']);
const enumTokenPurpose = makeEnum(['email_verification', 'change_password']);
const enumPageRole = makeEnum(['cinesopa', 'sopaseom', 'sopakit']);
const enumPageBelongsTo = makeEnum(['cinesopa', 'sopaseom']);
const enumPostStatus = makeEnum(['public', 'private']);
const enumFilmWatchGrade = makeEnum([
  '전체관람가',
  '12세관람가',
  '15세관람가',
  '청소년관람불가',
  '제한상영가',
]);
const enumFilmTypeName = makeEnum([
  '극영화',
  '실험영화',
  '다큐멘터리',
  '애니메이션',
]);
const enumFilmStatus = makeEnum(['public', 'private']);
const enumSiteOptionType = makeEnum(['file', 'string']);
const enumFilmAvailableSubtitle = makeEnum([
  '무자막',
  '영문자막',
  '한글자막',
  '배리어프리자막',
]);
const enumSopakitStatus = makeEnum(['show', 'hide']);
const enumCartItemUsage = makeEnum(['normal', 'instant_payment']);
const enumTransportCompany = makeEnum([
  'kr.epost', // 우체국택배
  'kr.cjlogistics', // cj 대한통운
  'kr.lotte', // 롯데택배
]);
module.exports = {
  enumAuthmap,
  enumPeopleRoleType,
  enumMenuType,
  enumOrderMethod,
  enumOrderStatus,
  enumTokenPurpose,
  enumProductType,
  enumPageBelongsTo,
  enumPageRole,
  enumPostStatus,
  enumFilmWatchGrade,
  enumFilmTypeName,
  enumFilmStatus,
  enumSiteOptionType,
  enumFilmAvailableSubtitle,
  enumSopakitStatus,
  enumCartItemUsage,
  enumTransportCompany,
};
