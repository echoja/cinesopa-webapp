const autoIncrement = require("mongoose-auto-increment");

const { enumOrderMethod, enumOrderStatus } = require("./enum");

module.exports = function (mongoose) {
  const result = new mongoose.Schema({
    product_id: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
    option_id: { type: mongoose.Schema.Types.ObjectId, ref: "Product.options" },
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    id: Number,
    name: String,
    content: String,
    price: Number,
    status: { type: String, enum: enumOrderStatus.raw_str_list },
    method: { type: String, enum: enumOrderMethod.raw_str_list },
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
