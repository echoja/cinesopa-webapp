const {
  enumAuthmap,
  enumOrderMethod,
  enumOrderStatus,
  enumTransportCompany,
} = require('./enum');
const makeCartItem = require('./cartitem');
const makeDestinfo = require('./destinfo');
const { Mongoose } = require('mongoose');
const autoIdSetter = require('./auto-id-setter');

/**
 *
 * @param {Mongoose} mongoose
 */
module.exports = (mongoose) => {
  const CartItem = makeCartItem(mongoose, false, false);
  const Destinfo = makeDestinfo(mongoose);
  const Order = new mongoose.Schema({
    user: { type: String, required: true }, // 유저의 이메일
    status: { type: String, enum: enumOrderStatus.raw_str_list },
    method: { type: String, enum: enumOrderMethod.raw_str_list },
    c_date: { type: Date, default: Date.now }, // 주문일
    expected_date: Date, // 도착 예정일
    cancelled_date: Date, // 주문 취소일
    return_req_date: Date, // 반품 신청일
    cash_receipt: String, // 현금영수증 번호
    transport_number: String, // 송장 번호
    transport_company: {
      type: String,
      enum: enumTransportCompany.raw_str_list,
    }, // 택배 회사 (코드)
    transport_fee: Number,
    bootpay_id: String, // 부트페이 검증용 id
    meta: mongoose.Schema.Types.Mixed,
    items: [CartItem],
    dest: Destinfo,
    payer: String, // 무통장 입금시 입금자명
  });

  Order.index({ user: 1, c_date: -1 });
  Order.index({ id: 1 });

  autoIdSetter(Order, mongoose, 'order', 'id');

  return Order;
};
