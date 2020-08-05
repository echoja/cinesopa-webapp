const enumPeopleRoleType = ["director", "actor", "staff"];
const autoIncrement = require("mongoose-auto-increment");

module.exports = function (mongoose) {
  const Person = new mongoose.Schema({
    role_type: { type: String, enum: enumPeopleRoleType },
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

  // const Photo = new mongoose.Schema({

  // });

  const result = new mongoose.Schema({
    title: String,
    title_en: String,
    kobis_code: String,
    genres: [String],
    show_time: String,
    type_name: String,
    prod_year: String,
    open_year: String,
    people: [Person],
    companies: [Company],
    watch_grade: String,
    reviews: [Review],
    star_naver: Number,
    star_daum: Number,
    star_cine21: Number,
    poster: { type: mongoose.Schema.Types.ObjectId, ref: "File" },
    photos: [{ type: mongoose.Schema.Types.ObjectId, ref: "File" }],
    videos: [Video],
    id: Number,
    synopsis: String,
    note: String,
    meta: mongoose.Schema.Types.Mixed,
  });
  // result.plugin(autoIncrement.plugin, {
  //   model: "Film",
  //   field: "id", // auto-increment할 field
  //   startAt: 0, // 0에서 부터
  //   increment: 1, // 1씩 증가
  // });
  return result;
};
