const Mongoose = require('mongoose');
// const autoIdSetter = require('./auto-id-setter');
import autoIdSetter from './auto-id-setter';
/**
 *
 * @param {Mongoose} mongoose
 */
module.exports = function (mongoose) {
  const schema = new mongoose.Schema({
    title: String,
    description: String,
    permalink: String,
    belongs_to: String,
    board_type: String, // 어떻게 보여주는지의 방식.
    meta: mongoose.Schema.Types.Mixed,
  });
  autoIdSetter(schema, mongoose, 'board', 'id');
  return schema;
};
