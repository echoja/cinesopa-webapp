const { Mongoose } = require('mongoose');
const { enumProductType } = require('./enum');
const autoIdSetter = require('./auto-id-setter');

/**
 * 
 * @param {Monboose} mongoose 
 * @param {boolean} setId auto-id-setter 로 id 필드를 설정할 건지를 결정. 
 */
module.exports = function (mongoose, setId = true) {
  const CartItemProduct = new mongoose.Schema({
    product_type: { type: String, enum: enumProductType.raw_str_list },
    name: String,
    featured_image_url: String,
    featured_image_alt: String,
  });

  const CartItemOption = new mongoose.Schema({
    id: String,
    content: String,
    price: Number,
    count: Number,
  });

  const CartItem = new mongoose.Schema({
    user: String, // 유저 이메일
    added: { type: Date, default: Date.now },
    modified: { type: Date, default: Date.now },
    product_id: Number,
    // product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    product: CartItemProduct,
    options: [CartItemOption],
    meta: mongoose.Schema.Types.Mixed,
  });

  if (setId) {
    autoIdSetter(CartItem, mongoose, 'cartitem', 'id');
  }

  CartItem.index({ user: 1 });
  CartItem.index({ id: 1 });

  return CartItem;
};
