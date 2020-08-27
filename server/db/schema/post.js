const { Mongoose } = require('mongoose');

const { getPostSearchStr } = require('./tool');
const { enumPostStatus } = require('./enum');

const autoIdSetter = require('./auto-id-setter');

/**
 *
 * @param {Mongoose} mongoose
 */
module.exports = function (mongoose) {
  const schema = new mongoose.Schema({
    title: String,
    content: String,
    excerpt: String,
    permalink: String,
    status: {
      type: String,
      enum: enumPostStatus.raw_str_list,
    },
    board: { type: mongoose.Schema.Types.ObjectId, ref: 'Board' },
    c_date: { type: Date, default: Date.now },
    m_date: { type: Date, default: Date.now },
    search: String,
    meta: mongoose.Schema.Types.Mixed,
  });
  autoIdSetter(schema, mongoose, 'post', 'id');

  schema.pre('save', function () {
    this.search = getPostSearchStr(this);
    this.m_date = new Date();
  });

  // const updateSearch = async (query) => {
  //   const docToUpdate = await query.model.findOne(query.getFilter());
  //   // console.log(docToUpdate._doc);
  //   docToUpdate.search = getFilmSearchStr(docToUpdate);
  // };

  schema.post('updateOne', async function () {
    const docToUpdate = await this.model.findOne(this.getFilter());
    if (docToUpdate) await docToUpdate.save();
  });

  return schema;
};
