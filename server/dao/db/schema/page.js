const page_role = ["cinesopa", "sopaseom", "sopakit"];
const page_belongs_to = ["cinesopa", "sopaseom"];

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
      enum: page_role,
    },
    belongs_to: {
      type: String,
      enum: page_belongs_to,
    },
    meta: mongoose.Schema.Types.Mixed,
  });
};
