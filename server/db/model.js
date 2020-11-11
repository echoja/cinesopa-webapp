const { MongooseDocument, Model, Mongoose } = require('mongoose');

const schemaBuilder = {};
schemaBuilder.Page = require('./schema/page');
schemaBuilder.User = require('./schema/user');
schemaBuilder.Login = require('./schema/login');
schemaBuilder.File = require('./schema/file');
schemaBuilder.Board = require('./schema/board');
schemaBuilder.Film = require('./schema/film');
schemaBuilder.Menu = require('./schema/menu');
schemaBuilder.Post = require('./schema/post');
schemaBuilder.Product = require('./schema/product');
schemaBuilder.Cartitem = require('./schema/cartitem')
schemaBuilder.Token = require('./schema/token');
schemaBuilder.SiteOption = require('./schema/site-option');

/**
 * 모델을 만들어 반환합니다.
 */
function makeModule(mongoose) {
  /**
   * @type {Object.<string, Model<MongooseDocument, {}>>} mongoose Model 딕셔너리
   */
  const model = {};
  Object.keys(schemaBuilder).forEach((key) => {
    // console.log(key);
    model[key] = mongoose.model(key, schemaBuilder[key](mongoose));
  });
  // for (const key in schemaBuilder) {
  //   model[key] = mongoose.model(key, schemaBuilder[key](mongoose));
  // }
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
