import { PassportContext } from 'graphql-passport';
import mongoose, { Document, ObjectId } from 'mongoose';
import {
  enumSiteOptionType,
  enumProductType,
  enumAuthmap,
  AuthType,
  OrderStatus,
} from './db/schema/enum';
import { db } from './loader';
import { Express } from 'express';
import { make as dbMaker } from './db/model';
import { Session } from 'express-session';

export * from '@/db/schema/enum';
export type ModelWrapper = ReturnType<typeof dbMaker>;

export interface MailGate {
  senderName?: string;
  senderEmail?: string;
  recipientName?: string;
  recipientEmail?: string;
}

export interface CancelPaymentArgs {
  price?: number;
  name?: string;
  reason?: string;
}

export interface PaymentData {
  card_name: string; //    ex): 하나,
  card_no: string; //    ex): 94308100****4569,
  card_quota: string; //    ex): 00,
  card_auth_no: string; //    ex): 09286221,
  receipt_id: string; //    ex): 5df6e67d4f74b4002a77e0eb,
  n: string; //    ex): 테스트결제,
  p: number; //    ex): 3000,
  tid: string; //    ex): 48585753,
  pg: string; //    ex): 페이앱,
  pm: string; //    ex): 카드정기결제(REST),
  pg_a: string; //    ex): payapp,
  pm_a: string; //    ex): card_rebill_rest,
  o_id: string; //    ex): 1576461949,
  p_at: string; //    ex): 2019-12-16 11:05:50,
  s: number; //    ex): 1,
  g: number; //    ex): 2
}

export interface Paymentinfo {
  receipt_id: string; // ex): 5df6e67d4f74b4002a77e0eb,
  order_id: string; // ex): 1576461949,
  name: string; // ex): 테스트결제,
  price: number; // ex): 3000,
  tax_free: number; // ex): 1500,
  remain_price: number; // ex): 3000,
  remain_tax_free: number; // ex): 1500,
  cancelled_price: number; // ex): 0,
  cancelled_tax_free: number; // ex): 0,
  receipt_url: string; // ex): https://app.bootpay.co.kr/bill/ZVN3cXdRNTlEbTYzVi8xNmIyWCtFS0VrcWJncXkweFBoT200WXRPQkgzVC9u%0AZz09LS1KNU1MRW5JdGNMa3RMZDRLLS1lWkhFaTFkMmVnVkR0SmRTMUxUNXdR%0APT0=%0A,
  unit: string; // ex): krw,
  pg: string; // ex): payapp,
  method: string; // ex): card_rebill_rest,
  pg_name: string; // ex): 페이앱,
  method_name: string; // ex): 카드정기결제(REST),
  payment_data: PaymentData; //
  requested_at: string; // ex) : 2019-12-16 11:05:50,
  purchased_at: string; // ex) : 2019-12-16 11:05:50,
  status: number; // ex): 1,
  status_en: string; // ex): complete,
  status_ko: string; // ex): 결제완료
}
export interface GetActualPaymentInfoResult {
  success: boolean;
  code?: string;
  info?: Paymentinfo;
}

export interface GetTokenResult {
  success: boolean;
  code?: string;
  token?: string;
}

export interface CancelPaymentArgs {
  price?: number;
  name?: string;
  reason?: string;
}

export interface CancelPaymentResult {
  success: boolean;
  code?: string;
}

/** verifyPayment 함수의 리턴 값 */
export interface VerifyPaymentResult {
  success: boolean;
  code?: string;
  info?: Paymentinfo;
}
/**
 *
 * @typedef {Object} VerifyPaymentResult
 * @property {boolean} success
 * @property {string=} code
 * @property {PaymentInfo=} info
 */

// export DBManager

// /*
// 데이터베이스
//  */

// /**
//  * @typedef {import("mongoose").Document<any, {}>} Applicationinfo
//  * @property {string} host  주최
//  * @property {Date} c_date  만든 일시
//  * @property {Date} m_date  수정된 일시
//  * @property {string} film_title  작품명
//  * @property {number} charge  상영료 (부가세 포함)
//  * @property {Date} start_date  상영 시작일시
//  * @property {Date} end_date  상영 종료일시
//  * @property {number} session_count  상영회차
//  * @property {string} format  상영 포맷
//  * @property {string} applicant_name  신청자 이름
//  * @property {string} applicant_phone  신청자 연락처
//  * @property {string} applicant_email  신청자 이메일
//  * @property {string} destination  상영본 받을 주소
//  * @property {string} transport_company  배송 업체
//  * @property {string} transport_number  송장 번호
//  * @property {string} transport_status  배송 상태
//  * @property {string} doc_status  서류 상태
//  * @property {string} money_status  정산 및 입금 상태
//  * @property {string} receipt_status  세금계산서 상태
//  * @property {string} business_license_filename 사업자등록증 파일명
//  * @property {string} business_license_url  사업자등록증 url
//  * @property {Date} deposit_date  입금 예상일
//  * @property {Date} receipt_date  세금계산서 발행 날짜
//  * @property {string} receipt_email  세금계산서 발행 이메일
//  * @property {string} receipt_etc_req  세금계산서 관련 기타 요청
//  * @property {string} reqdoc_token  서류 요청 토큰
//  * @property {Date} reqdoc_expire_date  서류 요청 url 기한
//  * @property {string} search  검색 필드
//  * @property {string} etc_req  기타 요청
//  * @property {string} memo  메모
//  * @property {boolean} memo_unremarked  메모 강조 표시를 해제함.
//  * @property {object} meta
//  */

interface ApplicationinfoBase {
  host?: string; //   주최
  c_date?: Date; //   만든 일시
  m_date?: Date; //   수정된 일시
  film_title?: string; //   작품명
  charge?: number; //   상영료 (부가세 포함)
  start_date?: Date; //   상영 시작일시
  end_date?: Date; //   상영 종료일시
  session_count?: number; //   상영회차
  format?: string; //   상영 포맷
  applicant_name?: string; //   신청자 이름
  applicant_phone?: string; //   신청자 연락처
  applicant_email?: string; //   신청자 이메일
  destination?: string; //   상영본 받을 주소
  transport_company?: string; //   배송 업체
  transport_number?: string; //   송장 번호
  transport_status?: string; //   배송 상태
  doc_status?: string; //   서류 상태
  money_status?: string; //   정산 및 입금 상태
  receipt_status?: string; //   세금계산서 상태
  business_license_filename?: string; //  사업자등록증 파일명
  business_license_url?: string; //   사업자등록증 url
  deposit_date?: Date; //   입금 예상일
  receipt_date?: Date; //   세금계산서 발행 날짜
  receipt_email?: string; //   세금계산서 발행 이메일
  receipt_etc_req?: string; //   세금계산서 관련 기타 요청
  reqdoc_token?: string; //   서류 요청 토큰
  reqdoc_expire_date?: Date; //   서류 요청 url 기한
  search?: string; // 검색 필드
  etc_req?: string; // 기타 요청
  memo?: string; // 메모
  memo_unremarked?: boolean; // 메모 강조 표시를 해제함.
  meta?: object; //
}

export interface IApplication extends ApplicationinfoBase, Document {}

export interface Applicationinfo extends ApplicationinfoBase, IIdOption {}

export interface ApplicationInput extends ApplicationinfoBase {}

export interface ApplicationSearch {
  start_sd: Date;
  end_sd: Date;
  search: string;
}

// /**
//  * @typedef {Object} Optioninfo
//  * @property {string}   id : String,
//  * @property {string} content : String,
//  * @property {number} left : Number,
//  * @property {number} price : Number,
//  */

export interface Optioninfo {
  id?: string;
  content?: string;
  left?: number;
  price?: number;
}

export interface ProductSearch {
  product_type?: typeof enumProductType[number]; //
  status?: string; //
  page?: number; //
  perpage?: number; //
  search?: string;
}

interface ProductinfoBase {
  product_type?: typeof enumProductType[number]; // : { type : String, enum : enumProductType },
  status?: string; // 공개 여부
  featured_image_url?: string; // : String,
  featured_image_alt?: string; // : String,
  content_main?: string; // : String,
  content_sub?: string; // : String,
  side_phrase?: string; // : String,
  notice?: string; // : String,
  is_notice_default?: boolean; // : Boolean,
  name?: string; // : String,
  options?: Optioninfo[]; // : [Option],
  c_date?: Date; // : { type : Date, default : Date.now },
  related_film?: number; //  : [{ type : mongoose.Schema.Types.ObjectId, ref : 'Film' }], // 영화 정보는 기본적으로 여기서 전부 가지고 온다.
  related_cartitems?: number[]; // : 관련된 카트 아이템.
  meta?: object; // : mongoose.Schema.Types.Mixed,
  kit_id?: number; //: Number,
  search?: string; // : String,
}

export interface IProduct extends ProductinfoBase, Document {}

export interface Productinfo extends Omit<ProductinfoBase, 'related_film'> {
  kit?: Sopakitinfo;
  related_film?: Filminfo;
}

export interface SiteOptioninfo {
  name?: string;
  type?: typeof enumSiteOptionType[number];
  value?: string | Array<any> | object; // 파일일 경우 그냥 filename 을 저장함. 나중에 getFileBySiteOption 등으로 할 때 처리됨.
}

export interface ISiteOption extends SiteOptioninfo, Document {}

// /**
//  * 키워드 정보를 담는 객체
//  * @typedef {Object} Sopakitinfo
//  * @property {string} num : String, // 숫자
//  * @property {string} title : String, // 제목
//  * @property {number} year : Number, // 년도
//  * @property {Date} managing_date : 관리용 날짜 정보
//  * @property {string} description : String, // 설명
//  * @property {string} image_url : String, // 이미지 url
//  * @property {string} image_alt : String, // 이미지 설명
//  * @property {string} status : { type: String, enum: enumSopakitStatus },
//  */

interface SopakitinfoBase {
  num?: string; // : String, // 숫자
  title?: string; // : String, // 제목
  year?: number; // : Number, // 년도
  managing_date?: Date; // : 관리용 날짜 정보
  description?: string; // : String, // 설명
  image_url?: string; // : String, // 이미지 url
  image_alt?: string; // : String, // 이미지 설명
  status?: string; // : { type: String, enum: enumSopakitStatus },
}

export interface Sopakitinfo extends SopakitinfoBase {}

export interface ISopakit extends Document, SopakitinfoBase {
  num?: string; // : String, // 숫자
  title?: string; // : String, // 제목
  year?: number; // : Number, // 년도
  managing_date?: Date; // : 관리용 날짜 정보
  description?: string; // : String, // 설명
  image_url?: string; // : String, // 이미지 url
  image_alt?: string; // : String, // 이미지 설명
  status?: string; // : { type: String, enum: enumSopakitStatus },
}

export interface SopakitSearch {
  page?: number; // // 0이 1페이지를 의미함.
  perpage?: number; //
  status?: string; //
}

export interface Destinfo {
  name?: string; //
  address?: string; //
  address_detail?: string; //
  phone?: string; //
  request?: string; //
}

export interface CartitemProductinfo {
  product_type?: string; // : { type: String, enum: enumProductType },
  name?: string; // : String,
  featured_image_url?: string; // : String,
  featured_image_alt?: string; // : String,
}

export interface CartitemOptioninfo {
  id?: string; //  식별자
  disabled?: boolean; //  비활성화 여부
  content?: string; // : String,
  price?: number; // : Number,
  count?: number; // : Number,
}

export interface FmtCartitemOptioninfo
  extends Omit<CartitemOptioninfo, 'price'> {
  price?: string;
}

interface CartiteminfoBase {
  user?: string; // : String, // 유저 이메일
  added?: Date; // : { type: Date, default: Date.now },
  modified?: Date; // : { type: Date, default: Date.now },
  usage?: string; // 용도. 즉시 구매용 구분용.
  product_id?: number; //
  product?: CartitemProductinfo; // : CartitemProduct,
  options?: CartitemOptioninfo[];
  meta?: object; // : mongoose.Schema.Types.Mixed,
}

export interface ICartitem extends Document, CartiteminfoBase {}

export interface FmtCartiteminfo extends Omit<Cartiteminfo, 'options'> {
  options?: FmtCartitemOptioninfo[];
  productRoute?: {
    name: string;
    params: {
      id: number | string;
    };
  };
}
export interface Cartiteminfo extends CartiteminfoBase, IIdOption {}

export interface CartiteminfoSearch {
  usage: string;
}

//  /**
//   * @typedef {Object} CartitemInput
//   * @property {string}   user: String # 유저 이메일
//   * @property {Date} added: DateTime
//   * @property {Date} modified: DateTime
//   * @property {number} product_id: Int
//   * @property {string} product: CartitemProductInput
//   * @property {string} options: [CartitemOptionInput]
//   * @property {Object} meta: JSON
//   */

interface OrderinfoBase {
  user?: string; // 유저의 이메일
  status?: string; //
  method?: string; //
  c_date?: Date; //
  expected_date?: Date; //
  cancelled_date?: Date; //
  return_req_date?: Date; //
  cash_receipt?: string; //
  transport_number?: string; //
  transport_company?: string; //
  transport_fee?: number; //
  bootpay_id?: string; //
  payer?: string; //
  meta?: object; //
  dest?: Destinfo; //
}

export type GetOrderCountGroupedByStatusResult = GetOrderCountGroupedByStatusResultItem[];

export interface GetOrderCountGroupedByStatusResultItem {
  _id: OrderStatus;
  count: number;
}

export interface Orderinfo extends OrderinfoBase, IIdOption {
  items?: Cartiteminfo[];
}
export interface IOrder extends OrderinfoBase, Document {
  items: ICartitem[];
}

export interface OrderInput {
  user?: string; // 유저의 이메일
  status?: string; //
  method?: string; //
  c_date?: Date; //
  expected_date?: Date; //
  cancelled_date?: Date; //
  return_req_date?: Date; //
  cash_receipt?: string; //
  transport_number?: string; //
  transport_company?: string; //
  transport_fee?: string; //
  bootpay_id?: string; //
  bootpay_payment_info?: object; //
  meta?: object; //
  items?: number[]; //    카트아이템 id 목록
  dest?: Destinfo; //
}

export interface OrderSearch {
  date_gte?: Date; //
  date_lte?: Date; //
  status?: string; //
  method?: string; //
  page?: number; //
  perpage?: number; //
  user?: string; // 유저 이메일
}

export interface UserAgreedinfo {
  privacy?: boolean; // : Boolean,
  policy?: boolean; // : Boolean,
  advertisement?: boolean; // : Boolean,
}

interface UserinfoBase {
  email?: string; //
  has_pwd?: boolean;
  default_dest?: Destinfo;
  c_date?: Date;
  wrong_pwd_count?: number;
  blocked_date?: Date;
  blocked_count?: number;
  role?: AuthType;
  kakao_access_token?: string;
  kakao_refresh_token?: string;
  kakao_id?: string;
  verified?: boolean;
  user_agreed?: UserAgreedinfo;
}

interface IIdOption {
  id?: number;
}

export interface Userinfo extends UserinfoBase, IIdOption {}

export interface IUser extends UserinfoBase, Document {}

export interface UserSearch {
  page?: number;
  perpage?: number;
  email?: string;
}

interface PageinfoBase {
  title?: string; // - 제목
  content?: string; // - 내용(html)
  permalink?: string; // - 주소
  c_date?: Date; // - 생성일
  m_date?: Date; // - 수정일
  role?: string; // - 페이지의 역할
  belongs_to?: string; // - cinesopa.kr, sopaseom.com 중 어느 곳에 속하는지
  meta?: Object; // - 기타 정보
}

export interface Pageinfo extends PageinfoBase, IIdOption {}

export interface IPage extends PageinfoBase, Document {}

export interface Logininfo {
  email?: string; // 이메일
  pwd?: string; // 비밀번호
  salt?: string; // scrypt 용 salt
}

export interface ILogin extends Document, Logininfo {}

/**
 * 암호화된 비밀번호 객체
 */
export interface Encrypted {
  pwd: String;
  salt: String;
}

/**
 * 파일을 얻을 때 쓰는 조건 객체
 */
export interface FileCondition {
  page?: number; // 1페이지를 얻고 싶다면 0을 해야 함.
  perpage?: number; // 페이지당 파일 개수
  managed?: boolean; // managed 되는 것들만 받아오겠다는 것.
}

interface FileinfoBase {
  c_date?: Date; //
  encoding?: string; //
  mimetype?: string; //
  filename?: string; // 실제 저장되는 파일 이름 (multer에 의해 생성)
  origin?: string; // 본래 파일 이름
  description?: string; //
  label?: string; //
  alt?: string; //
  path?: string; // 전체 경로
  size?: number; // 사이즈(바이트)
  owner?: string; //
  public?: boolean; //
  managed?: boolean; //
  width?: number; //
  height?: number; //
}

/**
 * 파일 정보를 담는 객체
 */
export interface IFile extends FileinfoBase, Document {}

export interface Fileinfo extends FileinfoBase, IIdOption {}

/**
 * 영화의 사람 정보를 담는 객체
 */
export interface Personinfo {
  role_type?: string; //
  name?: string; //
  name_en?: string; //
  role?: string; //
}

/**
 * 영화의 회사 정보를 담는 객체
 */
export interface Companyinfo {
  name?: string; //
  name_en?: string; //
  role?: string; //
}

/**
 * 영화의 리뷰 정보를 담는 객체
 */
export interface Reviewinfo {
  title?: string; //
  url?: string; //
  source?: string; //
  author?: string; //
}

/** 영화의 영상 정보를 담는 객체 (유튜브 연결) */
export interface Videoinfo {
  youtube_iframe?: string; //
  title?: string; //
}

interface FilminfoBase {
  title?: string;
  title_en?: string;
  kobis_code?: string;
  genres?: string[];
  show_time?: number;
  type_name?: string;
  prod_date?: Date;
  open_date?: Date;
  is_opened?: boolean;
  people?: Personinfo[];
  companies?: Companyinfo[];
  watch_grade?: string;
  reviews?: string;
  star_naver?: number;
  star_daum?: number;
  star_cine21?: number;
  poster?: string;
  photos?: string[];
  videos?: Videoinfo[];
  synopsis?: string;
  note?: string;
  tags?: Taginfo[];
  is_featured?: boolean;
  featured_poster?: string;
  badge_text?: string;
  badge_color?: string;
  status?: string;
  available_subtitles?: string[];
  meta?: object;
  search?: string;
}

export interface Filminfo extends FilminfoBase, IIdOption {}

export interface IFilm extends FilminfoBase, Document {}

/**
 * unpack promise settled type
 */
export type Fulfilled<T> = T extends PromiseFulfilledResult<infer U>
  ? PromiseFulfilledResult<U>
  : never;

let o: Fulfilled<PromiseFulfilledResult<string> | PromiseRejectedResult>;

interface TaginfoBase {
  name?: string;
  related_films?: TagFilminfo[];
}

export interface ITag extends TaginfoBase, Document {}

export interface Taginfo extends TaginfoBase {}

export interface TagFilminfo {
  title?: string; //
  id?: number; //
}

export interface TagSearch {
  limit?: number;
}

/**
 * 토큰 정보를 담는 객체
 */

export interface IToken extends Document, Tokeninfo {}
export interface Tokeninfo {
  email?: string; //
  token?: string; //
  ttl?: number; // 유효 시간 (초)
  c_date?: Date; //
  purpose?: string; //
}

interface BoardinfoBase {
  title?: string; //
  description?: string; //
  permalink?: string; //
  belongs_to?: string; //
  board_type?: string; //
  meta?: object; //
}
/**
 * 게시판 정보를 담는 객체
 */
export interface IBoard extends BoardinfoBase, Document {}

export interface Boardinfo extends BoardinfoBase, IIdOption {}

export interface BoardSearch {
  id?: number; //
  permalink?: string; //
  belongs_to?: string; //
}

interface PostinfoBase {
  title?: string; //
  content?: string; //
  excerpt?: string; //
  permalink?: string; //
  status?: string; // ['public', 'private']
  board?: string; // 게시판에 대한 ObjectId
  featured_image?: string; // 이미지에 대한 ObjectId
  c_date?: Date; //
  m_date?: Date; //
  search?: string; //
  meta?: object; //
}
/**
 * 게시물 정보를 담는 객체
 */
export interface IPost extends PostinfoBase, Document {}

export interface PostinfoOutput extends Postinfo {
  featured_image_link?: string;
  featured_image_alt?: string;
}

export type GetPostsResult = {
  total: number;
  list: PostinfoOutput[];
};

export interface Postinfo extends PostinfoBase, IIdOption {}

/**
 * 게시물 검색 정보를 담는 객체
 */
export interface PostSearch {
  page?: number; // 0이 1페이지임.
  perpage?: number; //
  date_gte?: Date; //
  date_lte?: Date; //
  search?: string; //
  board_permalinks?: string[];
  board_belongs_to?: string; //
}

/* 
api
 */

/**
 * 실제로 사용되는 PassportContext 타입 정의
 */
export type CustomPassportContext = PassportContext<
  Userinfo,
  { email: string; password: string } | Userinfo
>;

/**
 * resolver의 기본 형태
 */
export type Resolver = (
  obj: any,
  args: any,
  context: CustomPassportContext,
  info: any,
) => Promise<any>;

export type AuthTypes = AuthType[];

/**
 * passport 에서 deserializeUser에 쓰이는 함수
 * @param email 이메일 주소
 * @returns 유저 정보
 */
export type UserFinder = (email: string) => Promise<Userinfo>;

/**
 * passport 에서 GraphQLLocalStrategy 에 쓰이는 함수
 * @param email
 * @param pwd
 * @return 유저 정보
 */
export type UserGetterByAuth = (
  email: string,
  pwd: string,
) => Promise<Userinfo>;

/**
 * passport kakao 에서 새롭게 유저를 만드는 데 쓰는 함수
 *
 * @param userinfo 유저 정보
 */
export type UserCreator = (userinfo: Userinfo) => Promise<void>;

// /**
//  * @typedef {UserGetterByAuth} UserGetterByAuth
//  */

export { AuthValidator } from './auth/validator';

export type AuthmapLevel = {
  [key in AuthType]: number;
};

export { DBManager } from './manager/db';

export { MailManager } from './manager/mail';
// import {MailManager as MailManagerClass} from './manager/mail';

// export type MailManager = typeof MailManagerClass;

export { BootpayManager } from './manager/bootpay';

import FilManagerImported from './manager/file';

export type FileManager = typeof FilManagerImported;

export { TemplateArgsRefiner } from './mail-template/template-args-refiner';

export type MailRendererWrapperArg = {
  [key: string]: string;
};
export type MailRendererWrapper = (
  args: MailRendererWrapperArg,
) => Promise<string>;

export type TemplateMap = Map<string, MailRendererWrapper>;

declare global {
  namespace Express {
    export interface User {
      role?: string;
    }
  }
  namespace session {
    export interface SessionData {
      redirectLink: string;
    }
  }
}

declare module 'express-session' {
  export interface SessionData {
    redirectLink: string;
  }
}

// eslint-disable-next-line
//  @typedef {Object.<string, import('mongoose').Model<import('mongoose').MongooseDocument, {}>>} ModelWrapper */

// eslint-disable-next-line
//  @typedef {import("graphql-passport/lib/types").PassportContext<Userinfo,{},{},Express.Request>} PassportContext */

// module.exports  {};

// /**
//  * 소파킷을 찾을 때 쓰는 조건 객체
//  * @typedef {Object} SopakitSearch
//  * @property {number} page // 0이 1페이지를 의미함.
//  * @property {number} perpage
//  * @property {String} status
//  *
//  */

// /**
//  * 목적지 정보를 담는 객체
//  * @typedef {Object} Destinfo
//  *  @property {string} name
//  *  @property {string} address
//  *  @property {string} address_detail
//  *  @property {string} phone
//  *  @property {string} request
//  */

// /**
//  * 카트의 제품 정보를 담는 객체
//  * @typedef {Object} CartitemProductinfo
//  * @property {string}  product_type : { type: String, enum: enumProductType },
//  * @property {string}  name : String,
//  * @property {string}  featured_image_url : String,
//  * @property {string}  featured_image_alt : String,
//  *
//  */

// /**
//  * 카트의 옵션을 담는 객체
//  * @typedef {Object} CartitemOptioninfo
//  * @property {string} id  식별자
//  * @property {boolean} disabled  비활성화 여부
//  * @property {string} content : String,
//  * @property {number} price : Number,
//  * @property {number} count : Number,
//  *
//  */

// /**
//  * 카트 아이템을 담는 객체
//  * @typedef {Object} Cartiteminfo
//  * @property {number}  id : id 값
//  * @property {string}  user : String, // 유저 이메일
//  * @property {Date}  added : { type: Date, default: Date.now },
//  * @property {Date}  modified : { type: Date, default: Date.now },
//  * @property {string}  usage 용도. 즉시 구매용 구분용.
//  * @property {number}  product_id
//  * @property {CartitemProductinfo}  product : CartitemProduct,
//  * @property {CartitemOptioninfo[]}  options : [CartitemOption],
//  * @property {object}  meta : mongoose.Schema.Types.Mixed,
//  */

// //  /**
// //   * @typedef {Object} CartitemInput
// //   * @property {string}   user: String # 유저 이메일
// //   * @property {Date} added: DateTime
// //   * @property {Date} modified: DateTime
// //   * @property {number} product_id: Int
// //   * @property {string} product: CartitemProductInput
// //   * @property {string} options: [CartitemOptionInput]
// //   * @property {Object} meta: JSON
// //   */

// /**
//  * 주문 정보를 담는 객체
//  * @typedef {Object} Orderinfo
//  * @property {number}   id 고유번호
//  * @property {string}   user 유저의 이메일
//  * @property {string}   status
//  * @property {string}   method
//  * @property {Date}   c_date
//  * @property {Date}   expected_date
//  * @property {Date}   cancelled_date
//  * @property {Date}   return_req_date
//  * @property {string}   cash_receipt
//  * @property {string}   transport_number
//  * @property {string}   transport_company
//  * @property {number}   transport_fee
//  * @property {string}   bootpay_id
//  * @property {string}   payer
//  * @property {object}   meta
//  * @property {Cartiteminfo[]}   items
//  * @property {Destinfo}   dest
//  */

// /**
//  * 주문 정보를 담는 객체
//  * @typedef {Object} OrderInput
//  * @property {string}   user 유저의 이메일
//  * @property {string}   status
//  * @property {string}   method
//  * @property {Date}   c_date
//  * @property {Date}   expected_date
//  * @property {Date}   cancelled_date
//  * @property {Date}   return_req_date
//  * @property {string}   cash_receipt
//  * @property {string}   transport_number
//  * @property {string}   transport_company
//  * @property {string}   transport_fee
//  * @property {string}   bootpay_id
//  * @property {object} bootpay_payment_info
//  * @property {object}   meta
//  * @property {number[]}   items 카트아이템 id 목록
//  * @property {Destinfo}   dest
//  */

// /**
//  * 주문 검색을 담는 객체
//  * @typedef {Object} OrderSearch
//  * @property {Date}   date_gte
//  * @property {Date}   date_lte
//  * @property {string}   status
//  * @property {string}   method
//  * @property {number}   page
//  * @property {number}   perpage
//  * @property {string}   user 유저 이메일
//  */

// /**
//  * @typedef {Object} UserAgreedinfo
//  * @property {boolean} privacy : Boolean,
//  * @property {boolean} policy : Boolean,
//  * @property {boolean} advertisement : Boolean,
//  */

// /**
//  * 유저 정보를 담는 객체
//  * @typedef {Object} Userinfo
//  * @property {string} email
//  * @property {boolean} has_pwd
//  * @property {Destinfo} default_dest
//  * @property {Date} c_date:
//  * @property {number} wrong_pwd_count
//  * @property {Date} blocked_date
//  * @property {number} blocked_count
//  * @property {string} role
//  * @property {string} kakao_access_token
//  * @property {string} kakao_refresh_token
//  * @property {string} kakao_id
//  * @property {boolean} verified
//  * @property {UserAgreedinfo} user_agreed
//  */

// /**
//  * @typedef {Object} UserSearch
//  * @property {number} page 0이 1페이지를 뜻함.
//  * @property {number} perpage 페이지 개수
//  * @property {string} email
//  */

// /**
//  * 페이지 정보를 담는 객체
//  * @typedef {Object} Pageinfo
//  * @property {string} title - 제목
//  * @property {string} content - 내용(html)
//  * @property {string} permalink - 주소
//  * @property {Date} c_date - 생성일
//  * @property {Date} m_date - 수정일
//  * @property {string} role - 페이지의 역할
//  * @property {string} belongs_to - cinesopa.kr, sopaseom.com 중 어느 곳에 속하는지
//  * @property {number} id - 자동 증가 id
//  * @property {Object} meta - 기타 정보
//  */

// /**
//  * 로그인 정보를 담는 객체
//  * @typedef {Object} Logininfo
//  * @property {string} email 이메일
//  * @property {string} pwd 비밀번호
//  * @property {string} salt scrypt 용 salt
//  */

// /**
//  * 암호화된 비밀번호 객체
//  *
//  * @typedef {Object} Encrypted
//  * @property {String} pwd
//  * @property {String} salt
//  */

// /**
//  * 파일을 얻을 때 쓰는 조건 객체
//  * @typedef {object} FileCondition
//  * @property {number} page 1페이지를 얻고 싶다면 0을 해야 함.
//  * @property {number} perpage 페이지당 파일 개수
//  * @property {boolean} managed managed 되는 것들만 받아오겠다는 것.
//  */

// /**
//  * 파일 정보를 담는 객체
//  * @typedef {object} Fileinfo
//  * @property {Date} c_date
//  * @property {string} encoding
//  * @property {string} mimetype
//  * @property {string} filename 실제 저장되는 파일 이름 (multer에 의해 생성)
//  * @property {string} origin 본래 파일 이름
//  * @property {string} description
//  * @property {string} label
//  * @property {string} alt
//  * @property {string} path 전체 경로
//  * @property {number} size 사이즈(바이트)
//  * @property {string} owner
//  * @property {boolean} public
//  * @property {boolean} managed
//  * @property {number} width
//  * @property {number} height
//  * @property {number} id
//  */

// /**
//  * 영화의 사람 정보를 담는 객체
//  * @typedef {object} Personinfo
//  * @property {string} role_type
//  * @property {string} name
//  * @property {string} name_en
//  * @property {string} role
//  */

// /**
//  * 영화의 회사 정보를 담는 객체
//  * @typedef {object} Companyinfo
//  * @property {string} name
//  * @property {string} name_en
//  * @property {string} role
//  */

// /**
//  * 영화의 리뷰 정보를 담는 객체
//  * @typedef {object} Reviewinfo
//  * @property {string} title
//  * @property {string} url
//  * @property {string} source
//  * @property {string} author
//  */

// /**
//  * 영화의 영상 정보를 담는 객체 (유튜브 연결)
//  * @typedef {object} Videoinfo
//  * @property {string} youtube_iframe
//  * @property {string} title
//  */

// /**
//  * 영화 정보를 담는 객체
//  * @typedef {object} Filminfo
//  * @property {string} title
//  * @property {string} title_en
//  * @property {string} kobis_code
//  * @property {string[]} genres
//  * @property {number} show_time
//  * @property {string} type_name
//  * @property {Date} prod_date
//  * @property {Date} open_date
//  * @property {boolean} is_opened
//  * @property {Personinfo[]} people
//  * @property {Companyinfo[]} companies
//  * @property {string} watch_grade
//  * @property {string} reviews
//  * @property {number} star_naver
//  * @property {number} star_daum
//  * @property {number} star_cine21
//  * @property {import("mongoose/lib/types/objectid")} poster File
//  * @property {import("mongoose/lib/types/objectid")[]} photos File
//  * @property {number} id
//  * @property {Videoinfo[]} videos
//  * @property {string} synopsis
//  * @property {string} note
//  * @property {Taginfo[]} tags
//  * @property {boolean} is_featured
//  * @property {string} featured_poster
//  * @property {string} badge_text
//  * @property {string} badge_color
//  * @property {string} status
//  * @property {string[]} available_subtitles
//  * @property {object} meta
//  * @property {string} search
//  */

// /**
//  * @typedef {object} Taginfo
//  * @property {string} name
//  * @property {Array<TagFilminfo>} related_films
//  */

// /**
//  * @typedef {object} TagFilminfo
//  * @property {string} title
//  * @property {number} id
//  */

// /**
//  * 토큰 정보를 담는 객체
//  * @typedef {object} Tokeninfo
//  * @property {string} email
//  * @property {string} token
//  * @property {number} ttl 유효 시간 (초)
//  * @property {Date} c_date
//  * @property {string} purpose
//  */

// /**
//  * 게시판 정보를 담는 객체
//  * @typedef {object} Boardinfo
//  * @property {number} id
//  * @property {string} title
//  * @property {string} description
//  * @property {string} permalink
//  * @property {string} belongs_to
//  * @property {string} board_type
//  * @property {object} meta
//  */

// /**
//  * 게시판 검색 객체
//  * @typedef {object} BoardSearch
//  * @property {number} id
//  * @property {string} permalink
//  * @property {string} belongs_to
//  */

// /**
//  * 게시물 정보를 담는 객체
//  * @typedef {object} Postinfo
//  * @property {number} id
//  * @property {string} title
//  * @property {string} content
//  * @property {string} excerpt
//  * @property {string} permalink
//  * @property {string} status ['public', 'private']
//  * @property {import("mongoose/lib/types/objectid")} board 게시판에 대한 ObjectId
//  * @property {import("mongoose/lib/types/objectid")} featured_image 이미지에 대한 ObjectId
//  * @property {Date} c_date
//  * @property {Date} m_date
//  * @property {string} search
//  * @property {object} meta
//  */

// /**
//  * 게시물 검색 정보를 담는 객체
//  * @typedef {object} PostSearch
//  * @property {number} page 0이 1페이지임.
//  * @property {number} perpage
//  * @property {Date} date_gte
//  * @property {Date} date_lte
//  * @property {string} search
//  * @property {string[]} board_permalinks
//  * @property {string} board_belongs_to
//  */

// /*
// api
//  */

// /**
//  * resolver의 기본 형태
//  *
//  * @callback Resolver
//  * @param {object} obj
//  * @param {object} args
//  * @param {PassportContext} context
//  * @param {object} info
//  * @returns {Promise<any>}
//  */

// /**
//  * passport 에서 deserializeUser에 쓰이는 함수
//  *
//  * @callback UserFinder
//  * @param {string} email
//  * @return {Promise<Userinfo>} 유저 정보
//  */

// /**
//  * passport 에서 GraphQLLocalStrategy 에 쓰이는 함수
//  * @callback UserGetterByAuth
//  * @param {string} email
//  * @param {string} pwd
//  * @return {Promise<Userinfo>} 유저 정보
//  */

// /**
//  * passport kakao 에서 새롭게 유저를 만드는 데 쓰는 함수
//  *
//  * @callback UserCreator
//  * @param {Userinfo} userinfo
//  * @return {Promise<void>} 유저 정보
//  */

// // /**
// //  * @typedef {UserGetterByAuth} UserGetterByAuth
// //  */

// /** @typedef {import("./auth/validator").AuthValidator} AuthValidator */

// /** @typedef {import("./manager/db").DBManager} DBManager */

// /** @typedef {import("./manager/bootpay").BootpayManager} BootpayManager */

// /** @typedef {import("./manager/file")} FileManager */

// /** @typedef {import('./manager/mail').MailManager} MailManager */

// /** @typedef {import('./mail-template/template-args-refiner').TemplateArgsRefiner} TemplateArgsRefiner */

// /**
//  * @callback MailRendererWrapper
//  * @param {Object.<string, string>} args
//  * @return {Promise<string>} rendered html
//  */

// /** @typedef {Map<string, MailRendererWrapper} TemplateMap */

// // eslint-disable-next-line
// /** @typedef {Object.<string, import('mongoose').Model<import('mongoose').MongooseDocument, {}>>} ModelWrapper */

// // eslint-disable-next-line
// /** @typedef {import("graphql-passport/lib/types").PassportContext<Userinfo,{},{},Express.Request>} PassportContext */

// module.exports  {};
