import { enumTokenPurpose } from "./enum";

export default function (mongoose) {
  const Token = new mongoose.Schema({
    email: String,
    token: String,
    ttl: Number,
    c_date: { type: Date, default: Date.now },
    purpose: { type: String, enum: enumTokenPurpose },
    appl_id: Number,
  });
  Token.index({ token: 1 });
  Token.index({ appl_id: 1 });
  return Token;
};
