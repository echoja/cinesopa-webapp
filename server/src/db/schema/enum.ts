export const enumAuthmap = ['ADMIN', 'GUEST', 'ANYONE'] as const;

export type AuthType = typeof enumAuthmap[number];

export const enumPeopleRoleType = ['director', 'actor', 'staff'] as const;
export type PeopleRoleType = typeof enumPeopleRoleType[number];

export const enumMenuType = [
  'link',
  'page',
  'board',
  'nouse',
  'post',
  'file',
] as const;
export type MenuType = typeof enumMenuType[number];
export const enumOrderStatus = [
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
] as const;
export type OrderStatus = typeof enumOrderStatus[number];
export const enumOrderMethod = [
  'card',
  'phone',
  'nobank',
  'bank',
  'vbank',
  'auth',
  'card_rebill',
  'easy',
  'npay',
  'kakao',
] as const;
export type OrderMethod = typeof enumOrderMethod[number];
export const enumProductType = ['sopakit'] as const;
export type ProductType = typeof enumProductType[number];
export const enumTokenPurpose = [
  'email_verification',
  'change_password',
] as const;
export type TokenPurpose = typeof enumTokenPurpose[number];
export const enumPageRole = ['cinesopa', 'sopaseom', 'sopakit'] as const;
export type PageRole = typeof enumPageRole[number];
export const enumPageBelongsTo = ['cinesopa', 'sopaseom'] as const;
export type PageBelongsTo = typeof enumPageBelongsTo[number];
export const enumPostStatus = ['public', 'private'] as const;
export type PostStatus = typeof enumPostStatus[number];
export const enumFilmWatchGrade = [
  '전체관람가',
  '12세관람가',
  '15세관람가',
  '청소년관람불가',
  '제한상영가',
] as const;
export type FilmWatchGrade = typeof enumFilmWatchGrade[number];
export const enumFilmTypeName = [
  '극영화',
  '실험영화',
  '다큐멘터리',
  '애니메이션',
] as const;
export type FilmTypeName = typeof enumFilmTypeName[number];
export const enumFilmStatus = ['public', 'private'] as const;
export type FilmStatus = typeof enumFilmStatus[number];
export const enumSiteOptionType = ['file', 'string'] as const;
export type SiteOptionType = typeof enumSiteOptionType[number];
export const enumFilmAvailableSubtitle = [
  '무자막',
  '영문자막',
  '한글자막',
  '배리어프리자막',
] as const;
export type FilmAvailableSubtitle = typeof enumFilmAvailableSubtitle[number];
export const enumSopakitStatus = ['show', 'hide'] as const;
export type SopakitStatus = typeof enumSopakitStatus[number];
export const enumCartItemUsage = ['normal', 'instant_payment'] as const;
export type CartItemUsage = typeof enumCartItemUsage[number];
export const enumTransportCompany = [
  'kr.epost', // 우체국택배
  'kr.cjlogistics', // cj 대한통운
  'kr.lotte', // 롯데택배
] as const;
export type TransportCompany = typeof enumTransportCompany[number];

export const enumApplicationTransportStatus = [
  'online', // 해당없음 (온라인 전송 as const
  'yet_to_delivery', // 발송 대기중
  'delivery_complete', // 발송 완료
  'return_complete', // 회수 완료
] as const;
export type ApplicationTransportStatus = typeof enumApplicationTransportStatus[number];
/** 세금계산서 관련 */
export const enumApplicationReceiptStatus = [
  'not_applicable', // 해당없음 (온라인 전송 as const
  'pending', // 발행 대기중
  'done', // 발행 완료
] as const;
export type ApplicationReceiptStatus = typeof enumApplicationReceiptStatus[number];
export const enumApplicationMoneyStatus = [
  'not_applicable', // 해당없음
  'peinding_deposit', // 입금 대기중
  'deposit_checked', // 입금 확인됨
  'document_done', // 정산시트기입 완료
  'invoice_done', // 정산 오완료
] as const;
export type ApplicationMoneyStatus = typeof enumApplicationMoneyStatus[number];
/** 서류 상태 */
export const enumApplicationDocStatus = [
  'not_applicable', // 해당없음
  'pending', // 필요 서류 확인중
  'request_sended', // 서류 요청 보냄
  'request_not_sended', // 서류 요청 보내지 않음
] as const;
export type ApplicationDocStatus = typeof enumApplicationDocStatus[number];
