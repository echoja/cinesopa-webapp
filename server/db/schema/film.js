const Hangul = require('hangul-js');

const { Mongoose } = require('mongoose');
const { getFilmSearchStr } = require('./tool');
const {
  enumPeopleRoleType,
  enumFilmWatchGrade,
  enumFilmTypeName,
} = require('./enum');

const autoIdSetter = require('./auto-id-setter');

/**
 *
 * @param {Mongoose} mongoose
 */
module.exports = function (mongoose) {
  const Person = new mongoose.Schema({
    role_type: { type: String, enum: enumPeopleRoleType.raw_str_list },
    name: String,
    name_en: String,
    role: String,
  });

  const Company = new mongoose.Schema({
    name: String,
    name_en: String,
    role: String,
  });

  const Review = new mongoose.Schema({
    title: String,
    url: String,
    source: String,
    author: String,
  });

  const Video = new mongoose.Schema({
    youtube_id: String,
    title: String,
  });

  const schema = new mongoose.Schema({
    title: String,
    title_en: String,
    kobis_code: String,
    genres: [String],
    show_time: Number, // 초 단위
    type_name: {
      type: String,
      enum: enumFilmTypeName.raw_str_list,
    },
    prod_date: Date,
    open_date: Date,
    people: [Person],
    companies: [Company],
    watch_grade: {
      type: String,
      enum: enumFilmWatchGrade.raw_str_list,
    },
    reviews: [Review],
    star_naver: Number,
    star_daum: Number,
    star_cine21: Number,
    poster: { type: mongoose.Schema.Types.ObjectId, ref: 'File' },
    photos: [{ type: mongoose.Schema.Types.ObjectId, ref: 'File' }],
    // id: Number, AutoIncrement 로 인해서 명시적으로 적어줄 필요 없음.
    videos: [Video],
    synopsis: String,
    note: String,
    tags: [String],
    meta: mongoose.Schema.Types.Mixed,
    search: String,
  });

  // const getFilmSearchStr = (FilmDoc) => {
  //   const strArray = [];
  //   strArray.push(FilmDoc.title);
  //   strArray.push(FilmDoc.title_en);
  //   FilmDoc.people.forEach((person) => {
  //     strArray.push(person.name);
  //     strArray.push(person.name_en);
  //   });
  //   return Hangul.disassembleToString(strArray.join('').replace(/ /g, ''));
  // };

  schema.index({ search: 'text' });

  schema.pre('save', function () {
    console.log('++film save middleware 호출되었슴');
    // this.prod_date.setHours(0, 0, 0);
    // this.open_date.setHours(0, 0, 0);
    this.search = getFilmSearchStr(this);
  });

  const updateSearch = async (query) => {
    const docToUpdate = await query.model.findOne(query.getFilter());
    // console.log(docToUpdate._doc);
    docToUpdate.search = getFilmSearchStr(docToUpdate);
  };

  schema.post('updateOne', async function () {
    console.log('++film updateOne middleware 호출되었슴');
    const docToUpdate = await this.model.findOne(this.getFilter());
    if (docToUpdate) await docToUpdate.save();
  });
  schema.on('index', function (err) {
    if (err) {
      console.error('User index error: %s', err);
    } else {
      console.info('User indexing complete');
    }
  });

  autoIdSetter(schema, mongoose, 'film', 'id');
  return schema;
};
