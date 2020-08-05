const enumTokenPurpose = ["email_verification", "find_password"];

/**
 * 
 * @param {Mongoose} mongoose 
 */
module.exports = function (mongoose) {
  return new mongoose.Schema({
    email: String,
    token: String,
    ttl: Number,
    c_date: { type: Date, default: Date.now },
    purpose: { type: String, enum: enumTokenPurpose },

  });
};
