const autoIdSetter = require('./auto-id-setter');
const { enumOrderMethod, enumOrderStatus } = require('./enum');

module.exports = function (mongoose) {
  const schema = new mongoose.Schema({
    product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    option_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product.options' },
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
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
  autoIdSetter(schema, mongoose, 'order', 'id');
  return schema;
};
