const { MongooseDocument, Model, Mongoose } = require("mongoose");
const schemaBuilder = {};
schemaBuilder.Page = require("./schema/page.js");
schemaBuilder.User = require("./schema/user.js");
schemaBuilder.Login = require("./schema/login.js");
schemaBuilder.File = require("./schema/file.js");
schemaBuilder.Board = require("./schema/board.js");
schemaBuilder.Film = require("./schema/film.js");
schemaBuilder.Menu = require("./schema/menu.js");
schemaBuilder.Order = require("./schema/order.js");
schemaBuilder.Post = require("./schema/post.js");
schemaBuilder.Product = require("./schema/product.js");
schemaBuilder.Token = require("./schema/token.js");

/**
 * 모델을 만들어 반환합니다.
 */
function makeModule(mongoose) {
  /**
   * @type {Object.<string, Model<MongooseDocument, {}>>} mongoose Model 딕셔너리
   */
  const model = {};
  for (let key in schemaBuilder) {
    model[key] = mongoose.model(key, schemaBuilder[key](mongoose));
  }
  return model;
}

module.exports = {
  /**
   *
   * @param {Mongoose} mongoose
   */
  make(mongoose) {
    return makeModule(mongoose);
  },
};
