const { Mongoose } = require('mongoose');
const { enumSiteOptionType } = require('./enum');
const autoIdSetter = require('./auto-id-setter');

/**
 *
 * @param {Monboose} mongoose
 * @param {boolean} setId auto-id-setter 로 id 필드를 설정할 건지를 결정.
 */
module.exports = function (mongoose) {
  const SiteOption = new mongoose.Schema({
    name: String,
    type: { type: String, enum: enumSiteOptionType.raw_str_list },
    value: mongoose.Schema.Types.Mixed, // 파일일 경우 그냥 filename 을 저장함. 나중에 getFileBySiteOption 등으로 할 때 처리됨.
  });

  autoIdSetter(SiteOption, mongoose, 'option', 'id');

  SiteOption.index({ name: 1 });
  SiteOption.index({ id: 1 });

  return SiteOption;
};
