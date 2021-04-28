import { Mongoose, Schema } from 'mongoose';

export default function (mongoose: Mongoose): Schema {
  return new mongoose.Schema({
    email: String,
    pwd: String,
    salt: String,
  });
}
