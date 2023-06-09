import { enumMenuType } from "./enum";

module.exports = function (mongoose) {
  return new mongoose.Schema({
    menu_type: { type: String, enum: enumMenuType },
    label: String,
    parent: { type: mongoose.Schema.Types.ObjectId, ref: 'Menu' },
    link_url: String,
    board_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Board' },
    post_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Post' },
    page_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Page' },
    file_id: { type: mongoose.Schema.Types.ObjectId, ref: 'File' },
  });
};
