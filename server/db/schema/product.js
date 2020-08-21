const autoIdSetter = require('./auto-id-setter');
const { enumProductType } = require('./enum');

module.exports = function (mongoose) {
  const Option = new mongoose.Schema({
    content: String,
    left: Number,
    price: Number,
  });

  const schema = new mongoose.Schema({
    product_type: { type: String, enum: enumProductType.raw_str_list },
    content: String,
    notice: String,
    name: String,
    options: [Option],
    c_date: { type: Date, default: Date.now },
    related_films: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Film' }],
    meta: mongoose.Schema.Types.Mixed,
  });
  autoIdSetter(schema, mongoose, 'product', 'id');
  return schema;
};
