const { Mongoose } = require('mongoose');
const { enumProductType } = require('./enum');

/**
 * 
 * @param {Mongoose} mongoose 
 */
module.exports = function (mongoose) {
  const CartItemProduct = new mongoose.Schema({
    product_type: { type: String, enum: enumProductType.raw_str_list },
    product_url_id: Number, // 제품의 링크용
    name: String,
    featured_image_url: String,
  });

  const CartItemOption = new mongoose.Schema({
    content: String,
    price: Number,
    count: Number,
  });
  
  const CartItem = new mongoose.Schema({
    user: String, // 유저 이메일
    added_date: { type: Date, default: Date.now },
    product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    product: CartItemProduct,
    options: [CartItemOption],
    meta: mongoose.Schema.Types.Mixed,
  });

  CartItem.index({ user: 1, product_id: 1 });
  
  return CartItem;
};
