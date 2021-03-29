import { Mongoose } from "mongoose";

export default function (mongoose: Mongoose) {
  const schema = new mongoose.Schema({
    name: { type: String, default: '' },
    address: { type: String, default: '' },
    address_detail: { type: String, default: '' },
    phone: { type: String, default: '' },
    request: { type: String, default: '' },
  });
  return schema;
}
