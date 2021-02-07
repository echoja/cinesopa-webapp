/**
 * @file 신청서 관련된 정보를 저장하는 스키마
 */

const { makeSchemaHaveSearch } = require('./tool');
const {
  enumApplicationTransportStatus,
  enumApplicationDocStatus,
  enumApplicationMoneyStatus,
  enumApplicationReceiptStatus,
} = require('./enum');

const autoIdSetter = require('./auto-id-setter');

/**
 * @param {Mongoose} mongoose
 */
module.exports = function (mongoose) {
  const schema = new mongoose.Schema({
    host: String, // 주최
    c_date: { type: Date, default: Date.now }, // 만든 일시
    m_date: { type: Date, default: Date.now }, // 수정된 일시
    film_title: String, // 작품명
    charge: Number, // 상영료
    start_date: Date, // 상영 시작일시
    end_date: Date, // 상영 종료일시
    session_count: Number, // 상영회차
    format: String, // 상영 포맷
    applicant_name: String, // 신청자 이름
    applicant_phone: String, // 신청자 연락처
    applicant_email: String, // 신청자 이메일
    destination: String, // 상영본 받을 주소
    transport_company: String, // 배송 업체
    transport_number: String, // 송장 번호
    transport_status: {
      type: String,
      enum: enumApplicationTransportStatus.raw_str_list,
    }, // 배송 상태
    doc_status: { type: String, enum: enumApplicationDocStatus.raw_str_list }, // 서류 상태
    money_status: {
      type: String,
      enum: enumApplicationMoneyStatus.raw_str_list,
    }, // 정산 및 입금 상태
    receipt_status: {
      type: String,
      enum: enumApplicationReceiptStatus.raw_str_list,
    }, // 세금계산서 상태
    business_license_url: String, // 사업자등록증 url
    receipt_date: Date, // 세금계산서 발행 날짜
    receipt_email: String, // 세금계산서 발행 이메일
    receipt_etc_req: String, // 세금계산서 관련 기타 요청

    reqdoc_token: String, // 서류 요청 토큰
    reqdoc_expire_date: Date, // 서류 요청 url 기한

    search: String, // 검색 필드
    etc_req: String, // 기타 요청
    memo: String, // 메모
    play_memo_down: String, // 메모 강조 표시를 해제함.
    meta: mongoose.Schema.Types.Mixed,
  });
  autoIdSetter(schema, mongoose, 'application', 'id');

  makeSchemaHaveSearch(schema, 'search', [
    'host',
    'film_title',
    'applicant_name',
    'applicant_phone',
    'applicant_email',
    'destination',
    'memo',
    'etc_req',
  ]);

  // 변경 날짜 갱신
  schema.pre('save', function () {
    this.m_date = new Date();
  });

  return schema;
};
