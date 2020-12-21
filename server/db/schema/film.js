const Hangul = require('hangul-js');

const { Mongoose } = require('mongoose');
const { getFilmSearchStr, makeSchemaHaveSearch } = require('./tool');
const {
  enumPeopleRoleType,
  enumFilmWatchGrade,
  enumFilmTypeName,
  enumFilmStatus,
  enumFilmAvailableSubtitle,
} = require('./enum');
const tagSchemaMaker = require('./tag');

const autoIdSetter = require('./auto-id-setter');

/**
 *
 * @param {Mongoose} mongoose
 */
module.exports = function (mongoose) {
  const Tag = tagSchemaMaker(mongoose, false);

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
    is_main_trailer: Boolean,
    youtube_iframe: String,
    title: String,
  });

  const Award = new mongoose.Schema({
    festival_name: String,
    year: Number,
    person_name: String,
    award_name: String,
    award_type: String,
  });

  const Photo = new mongoose.Schema({
    mongo_file_id: { type: mongoose.Schema.Types.ObjectId, ref: 'File' },
    filename: String,
    preview_url: String,
    alt: String,
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
    poster_url: String,
    poster_alt: String,
    photos: [Photo],
    // id: Number, AutoIncrement 로 인해서 명시적으로 적어줄 필요 없음.
    videos: [Video],
    awards: [Award],
    synopsis: String,
    note: String,
    tags: [Tag],
    is_featured: Boolean,
    is_opened: Boolean,
    featured_steel: String, // 주소
    featured_color: String,
    featured_synopsis: String,
    badge_text: String,
    badge_color: String,
    status: {
      type: String,
      enum: enumFilmStatus.raw_str_list,
      default: 'public',
    },
    available_subtitles: [
      { type: String, enum: enumFilmAvailableSubtitle.raw_str_list },
    ],
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

  // schema.index({ search: 'text' });
  makeSchemaHaveSearch(schema, 'search', [
    'title',
    'title_en',
    'people.name',
    'people.name_en',
  ]);

  // schema.pre('save', function () {
  //   console.log('++film save middleware 호출되었슴');
  //   // this.prod_date.setHours(0, 0, 0);
  //   // this.open_date.setHours(0, 0, 0);
  //   this.search = getFilmSearchStr(this);
  // });

  // // const updateSearch = async (query) => {
  // //   const docToUpdate = await query.model.findOne(query.getFilter());
  // //   // console.log(docToUpdate._doc);
  // //   docToUpdate.search = getFilmSearchStr(docToUpdate);
  // // };

  // schema.post('updateOne', async function () {
  //   console.log('++film updateOne middleware 호출되었슴');
  //   const docToUpdate = await this.model.findOne(this.getFilter());
  //   if (docToUpdate) await docToUpdate.save();
  // });

  // schema.on('index', function (err) {
  //   if (err) {
  //     console.error('User index error: %s', err);
  //   } else {
  //     console.info('User indexing complete');
  //   }
  // });

  autoIdSetter(schema, mongoose, 'film', 'id');

  schema.index({ open_date: 1, 'tags.name': 1 });
  // schema.index({  }, { sparse: true });
  return schema;
};
