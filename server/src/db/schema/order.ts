import { Mongoose, Schema } from 'mongoose';
import { enumAuthmap, enumOrderMethod, enumOrderStatus } from './enum';
import makeCartItem from './cartitem';
import makeDestinfo from './destinfo';
import autoIdSetter from './auto-id-setter';

export default (mongoose: Mongoose): Schema => {
  const CartItem = makeCartItem(mongoose, false, false);
  const Destinfo = makeDestinfo(mongoose);
  const Order = new mongoose.Schema({
    user: { type: String, required: true }, // 유저의 이메일
    status: { type: String, enum: enumOrderStatus },
    method: { type: String, enum: enumOrderMethod },
    c_date: { type: Date, default: Date.now }, // 주문일
    expected_date: Date, // 도착 예정일
    cancelled_date: Date, // 주문 취소일
    return_req_date: Date, // 반품 신청일
    cash_receipt: String, // 현금영수증 번호
    transport_number: String, // 송장 번호
    transport_company: String, // 택배 회사 (코드)
    transport_fee: Number,
    cancelled_fee: Number,
    bootpay_id: String, // 부트페이 검증용 id
    bootpay_payment_info: mongoose.Schema.Types.Mixed,
    meta: mongoose.Schema.Types.Mixed,
    items: [CartItem],
    dest: Destinfo,
    cancel_reason: String,
    payer: String, // 무통장 입금시 입금자명
  });

  Order.index({ user: 1, c_date: -1 });
  Order.index({ id: 1 });

  autoIdSetter(Order, mongoose, 'order', 'id');

  return Order;
};
