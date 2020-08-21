const { enumPostStatus } = require('./enum');

const autoIdSetter = require('./auto-id-setter');

module.exports = function (mongoose) {
  const schema = new mongoose.Schema({
    title: String,
    content: String,
    excerpt: String,
    permalink: String,
    status: {
      type: String,
      enum: enumPostStatus.raw_str_list,
    },
    board: { type: mongoose.Schema.Types.ObjectId, ref: 'Board' },
    c_date: { type: Date, default: Date.now },
    m_date: { type: Date, default: Date.now },
    meta: mongoose.Schema.Types.Mixed,
  });
  autoIdSetter(schema, mongoose, 'post', 'id');
  return schema;
};
