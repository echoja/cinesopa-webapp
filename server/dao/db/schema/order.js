const autoIncrement = require("mongoose-auto-increment");
const enumOrderStatus = [
  "주문접수",
  "결제확인중",
  "결제완료",
  "상품준비중",
  "배송준비중",
  "배송중",
  "배송완료",
  "거래완료",
  "반송중",
  "주문취소중",
  "주문취소",
];
const enumOrderMethod = [
  "card",
  "phone",
  "bank",
  "vbank",
  "auth",
  "card_rebill",
  "easy",
];

module.exports = function (mongoose) {
  const result = new mongoose.Schema({
    product_id: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
    option_id: { type: mongoose.Schema.Types.ObjectId, ref: "Product.options" },
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    id: Number,
    name: String,
    content: String,
    price: Number,
    status: { type: String, enum: enumOrderStatus },
    method: { type: String, enum: enumOrderMethod },
    c_date: { type: Date, default: Date.now },
    address: String,
    cash_receipt: String,
    transport_number: String,
    transport_company: String,
    meta: mongoose.Schema.Types.Mixed,
  });
  // result.plugin(autoIncrement.plugin, {
  //   model: "Order",
  //   field: "id", // auto-increment할 field
  //   startAt: 0, // 0에서 부터
  //   increment: 1, // 1씩 증가
  // });
  return result;
};
