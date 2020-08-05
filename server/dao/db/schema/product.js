const autoIncrement = require("mongoose-auto-increment");
const enumProductType = ["sopakit"];

module.exports = function (mongoose) {
  const Option = new mongoose.Schema({
    content: String,
    left: Number,
    price: Number,
  });

  const result = new mongoose.Schema({
    product_type: { type: String, enum: enumProductType },
    id: Number,
    content: String,
    notice: String,
    name: String,
    options: [Option],
    c_date: { type: Date, default: Date.now },
    related_films: [{ type: mongoose.Schema.Types.ObjectId, ref: "Film" }],
    meta: mongoose.Schema.Types.Mixed,
  });
  // result.plugin(autoIncrement.plugin, {
  //   model: "Product",
  //   field: "id", // auto-increment할 field
  //   startAt: 0, // 0에서 부터
  //   increment: 1, // 1씩 증가
  // });
  return result;
};
