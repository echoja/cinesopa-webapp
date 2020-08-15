const Mongoose = require('mongoose');
/**
 * 
 * @param {Mongoose} mongoose 
 */
module.exports = function (mongoose) {
  return new mongoose.Schema({
    title: String,
    description: String,
    permalink: String,
    meta: mongoose.Schema.Types.Mixed,
  });
};
