var autoIncrement = require("mongoose-auto-increment");
const enumPostStatus = ["public", "private"];

module.exports = function (mongoose) {
  const result = new mongoose.Schema({
    id: Number,
    title: String,
    content: String,
    excerpt: String,
    permalink: String,
    status: {
      type: String,
      enum: enumPostStatus,
    },
    board: { type: mongoose.Schema.Types.ObjectId, ref: "Board" },
    c_date: { type: Date, default: Date.now },
    m_date: { type: Date, default: Date.now },
    meta: mongoose.Schema.Types.Mixed,
  });
  // result.plugin(autoIncrement.plugin, {
  //   model: "Post",
  //   field: "id", // auto-increment할 field
  //   startAt: 0, // 0에서 부터
  //   increment: 1, // 1씩 증가
  // });
  return result;
};
