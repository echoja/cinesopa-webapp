import { Mongoose } from 'mongoose';
import { enumPageRole, enumPageBelongsTo } from './enum';
import autoIdSetter from './auto-id-setter';

/**
 *
 * @param {Mongoose} mongoose
 */
export default function (mongoose) {
  const schema = new mongoose.Schema({
    title: String,
    content: String,
    permalink: String,
    // id: Number,
    // author: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    c_date: { type: Date, default: Date.now },
    m_date: { type: Date, default: Date.now },
    role: {
      type: String,
      enum: enumPageRole,
    },
    belongs_to: {
      type: String,
      enum: enumPageBelongsTo,
    },
    meta: mongoose.Schema.Types.Mixed,
    dumb: String,
  });
  autoIdSetter(schema, mongoose, 'page', 'id');
  // schema.pre('update', async function () { // update는 사용하지 않음.
  //   console.log('++++++++++++page pre update hook called');
  //   // console.dir(this, { depth: 1 });
  //   // this.dumb = `${this.title}dumbUpdateOne`;
  // });
  // schema.pre('updateOne', async function () { // some Query
  //   const docToUpdate = await this.model.findOne(this.getFilter()); // doc
  //   console.log('++++++++++++page pre updateOne hook called');
  //   docToUpdate.dumb = `${docToUpdate.title} dumbSave`;
  //   console.dir(docToUpdate, { depth: 1 });
  // });
  // schema.pre('save', function () { // doc
  //   console.log('++++++++++++page pre save hook called');
  //   this.dumb = `${this.title} dumbSave`;
  //   console.dir(this._doc, { depth: 1 });
  // });
  // schema.pre('validate', function () {
  //   console.log('++++++++++++page pre falidate hook called');
  //   // console.dir(this, { depth: 1 });
  //   // this.dumb = `${this.title} dumbValidate`;
  // });
  return schema;
}
