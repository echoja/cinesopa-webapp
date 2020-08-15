const { enumPostStatus } = require("./enum");

module.exports = function (mongoose) {
  const result = new mongoose.Schema({
    id: Number,
    title: String,
    content: String,
    excerpt: String,
    permalink: String,
    status: {
      type: String,
      enum: enumPostStatus.raw_str_list,
    },
    board: { type: mongoose.Schema.Types.ObjectId, ref: "Board" },
    c_date: { type: Date, default: Date.now },
    m_date: { type: Date, default: Date.now },
    meta: mongoose.Schema.Types.Mixed,
  });
  return result;
};
