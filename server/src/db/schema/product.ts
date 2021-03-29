import { Mongoose } from "mongoose";
import autoIdSetter from "./auto-id-setter";
import { enumProductType, enumFilmStatus } from "./enum";
import { makeSchemaHaveSearchByGetter, getProductSearchStr } from "./tool";

/**
 *
 * @param {Mongoose} mongoose
 */
module.exports = function (mongoose) {
  const Option = new mongoose.Schema({
    id: String,
    disabled: { type: Boolean, default: 'false' },
    content: String,
    left: Number,
    price: Number,
  });

  const schema = new mongoose.Schema({
    product_type: { type: String, enum: enumProductType },
    status: {
      type: String,
      enum: enumFilmStatus,
      default: 'public',
    }, // 일반 사람들에게 공개할 건지 여부
    featured_image_url: String,
    featured_image_alt: String,
    content_main: String,
    content_sub: String,
    side_phrase: String,
    notice: String,
    is_notice_default: Boolean,
    name: String,
    options: [Option],
    c_date: { type: Date, default: Date.now },
    // related_film: { type: mongoose.Schema.Types.ObjectId, ref: 'Film' }, // 영화 정보는 기본적으로 여기서 전부 가지고 온다.
    related_film: Number, // 영화 정보는 기본적으로 여기서 전부 가지고 온다.
    related_cartitems: [Number], // 영화 정보는 기본적으로 여기서 전부 가지고 온다. cartitem id.
    // related_cartitems: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Cartitem' }], // 영화 정보는 기본적으로 여기서 전부 가지고 온다.
    meta: mongoose.Schema.Types.Mixed,
    kit_id: Number,
    search: String,
  });
  autoIdSetter(schema, mongoose, 'product', 'id');
  schema.index({ id: 1 });

  makeSchemaHaveSearchByGetter(schema, 'search', getProductSearchStr);

  return schema;
};
