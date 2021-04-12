const { enumTokenPurpose } = require('./enum');

module.exports = function (mongoose) {
  const Token = new mongoose.Schema({
    email: String,
    token: String,
    ttl: Number,
    c_date: { type: Date, default: Date.now },
    purpose: { type: String, enum: enumTokenPurpose },
  });
  Token.index({ token: 1 });
  return Token;
};
