const { enumPageBelongsTo, enumPageRole } = require("./enum");

module.exports = function (mongoose) {
  return new mongoose.Schema({
    title: String,
    content: String,
    permalink: String,
    // author: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    c_date: { type: Date, default: Date.now },
    m_date: { type: Date, default: Date.now },
    role: {
      type: String,
      enum: enumPageRole.raw_str_list,
    },
    belongs_to: {
      type: String,
      enum: enumPageBelongsTo.raw_str_list,
    },
    meta: mongoose.Schema.Types.Mixed,
  });
};
