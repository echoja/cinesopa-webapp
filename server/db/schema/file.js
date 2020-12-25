const { enumFileUsage } = require('./enum');
const autoIdSetter = require('./auto-id-setter');

/**
 * @param {Mongoose} mongoose
 */
module.exports = function (mongoose) {
  const schema = new mongoose.Schema({
    c_date: { type: Date, default: Date.now },
    encoding: String,
    mimetype: String,
    filename: String, // 실제 저장되는 파일의 이름
    fileurl: String,
    extension: String, // 원래 파일의 확장자 (변경되지 않음)
    origin: String, // 원래 이름 (확장자 포함, 변경되지 않음)
    description: String, // 설명 (관리자용)
    label: String, // 파일 다운로드시 나타날 이름 (확장자 제외, 변경가능)
    alt: String, // 파일 대체 텍스트 및 설명
    path: String, // 실제 저장되는 파일의 경로
    size: Number, // 파일 사이즈 (바이트)
    owner: String, // 파일을 소유하고 있는 유저의 이메일
    public: Boolean, // 권한이 없는 상태에서 접근할 수 있는지의 여부. (sopaseom 에서 필요함)
    managed: Boolean, // 관리자 창에서 뜸. (유저들이 올린 것들은 굳이 관리자가 관리할 필욘 없음)
    width: Number, // 이미지일 경우, 가로 사이즈
    height: Number, // 이미지일 경우, 세로 사이즈
  });
  
  schema.index({ filename: 1 });
  schema.index({ c_date: -1 });

  autoIdSetter(schema, mongoose, 'file', 'id');
  return schema;
};
