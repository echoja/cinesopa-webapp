// eslint-disable-next-line no-unused-vars
const { Mongoose } = require("mongoose");

/**
 * 
 * @param {Mongoose} mongoose 
 */
module.exports = function (mongoose) {
  const schema = new mongoose.Schema({
    name: String,
    address: String,
    address_detail: String,
    phone: String,
    request: String,
  });
  return schema;
};
