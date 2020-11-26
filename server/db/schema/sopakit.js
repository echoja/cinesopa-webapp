const { Mongoose } = require('mongoose');
const autoIdSetter = require('./auto-id-setter');
const { enumSopakitStatus } = require('./enum');

/**
 *
 * @param {Mongoose} mongoose
 */
module.exports = function (mongoose) {

  const schema = new mongoose.Schema({
    num: String, // 숫자
    title: String, // 제목
    year: Number, // 년도
    managing_date: { type: Date, default: Date.now }, // 관리 및 정렬용 날짜 정보
    description: String, // 설명
    image_url: String, // 이미지 url
    image_alt: String, // 이미지 설명
    status: { type: String, enum: enumSopakitStatus.raw_str_list },
  });
  autoIdSetter(schema, mongoose, 'sopakit', 'id');
  schema.index({ id: 1 });
  schema.index({ managing_date: 1 });

  return schema;
};
