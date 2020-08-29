const { enumFileUsage } = require('./enum');
const autoIdSetter = require('./auto-id-setter');

/**
 * @param {Mongoose} mongoose
 */
module.exports = function (mongoose) {
  const schema = new mongoose.Schema({
    encoding: String,
    mimetype: String,
    filename: String,
    origin: String,
    description: String,
    label: String,
    alt: String,
    path: String,
    size: Number,
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    public: Boolean,
    managed: Boolean,
  });
  autoIdSetter(schema, mongoose, 'file', 'id');
  return schema;
};
