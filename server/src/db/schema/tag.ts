import { Mongoose } from "mongoose";
import autoIdSetter from "./auto-id-setter";
import { enumSopakitStatus } from "./enum";

/**
 *
 * @param {Mongoose} mongoose
 */
export default function (mongoose, hasId = true) {
  const Film = new mongoose.Schema({
    title: String,
    id: Number,
  });
  const schema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
      // unique: true // `name` must be unique
    }, // 숫자
    related_films: [Film],
  });
  if (hasId) {
    autoIdSetter(schema, mongoose, 'tag', 'id');
  }
  schema.index({ name: 1, 'related_films.id': 1 });
  return schema;
};