// eslint-disable-next-line no-unused-vars
const { Mongoose } = require("mongoose");

/**
 * 
 * @param {Mongoose} mongoose 
 */
module.exports = function (mongoose) {
  const schema = new mongoose.Schema({
    name: { type: String, default: '' },
    address: { type: String, default: '' },
    address_detail: { type: String, default: '' },
    phone: { type: String, default: '' },
    request: { type: String, default: '' },
  });
  return schema;
};
