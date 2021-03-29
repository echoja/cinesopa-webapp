import {
  Pageinfo,
  Userinfo,
  Logininfo,
  Fileinfo,
  Boardinfo,
  Filminfo,
  Postinfo,
  Productinfo,
  Cartiteminfo,
  Tokeninfo,
  IFilm,
  IProduct,
  IUser,
  ISopakit,
  IPage,
  ITag,
  ILogin,
  SiteOptioninfo,
  Taginfo,
  Orderinfo,
  Sopakitinfo,
  Applicationinfo,
  IToken,
  IOrder,
  IFile,
  IBoard,
  IPost,
  ICartitem,
  ISiteOption,
  IApplication,
} from './../typedef';
const { MongooseDocument, Model } = require('mongoose');
const mongoose = require('mongoose');

import { model, Document, Mongoose } from 'mongoose';

/** @typedef {import('../typedef').Applicationinfo} Applicationinfo */
/** @typedef {import('../typedef').Postinfo} Postinfo */

const schemaBuilder = {
  Page: require('./schema/page'),
  User: require('./schema/user'),
  Login: require('./schema/login'),
  File: require('./schema/file'),
  Board: require('./schema/board'),
  Film: require('./schema/film'),
  Menu: require('./schema/menu'),
  Post: require('./schema/post'),
  Product: require('./schema/product'),
  Cartitem: require('./schema/cartitem'),
  Token: require('./schema/token'),
  SiteOption: require('./schema/site-option'),
  Sopakit: require('./schema/sopakit'),
  Order: require('./schema/order'),
  Tag: require('./schema/tag'),
  Application: require('./schema/application'),
};

/** @typedef {typeof schemaBuilder} schemaBuilderType */

/**
 * 모델을 만들어 반환합니다.
 *
 * @param {Mongoose} mongoose
 */

/** @returns mongoose Model 딕셔너리 */

function makeModule(mongoose) {
  const modelMap = {
    Page: model<IPage>('Page', require('./schema/page')(mongoose)),
    User: model<IUser>('User', require('./schema/user')(mongoose)),
    Login: model<ILogin>('Login', require('./schema/login')(mongoose)),
    File: model<IFile>('File', require('./schema/file')(mongoose)),
    Board: model<IBoard>('Board', require('./schema/board')(mongoose)),
    Film: model<IFilm>('Film', require('./schema/film')(mongoose)),
    Post: model<IPost>('Post', require('./schema/post')(mongoose)),
    Product: model<IProduct>(
      'Product',
      require('./schema/product')(mongoose),
    ),
    Cartitem: model<ICartitem>(
      'Cartitem',
      require('./schema/cartitem')(mongoose),
    ),
    Token: model<IToken>('Token', require('./schema/token')(mongoose)),
    SiteOption: model<ISiteOption>(
      'SiteOption',
      require('./schema/siteoption')(mongoose),
    ),
    Sopakit: model<ISopakit>(
      'Sopakit',
      require('./schema/sopakit')(mongoose),
    ),
    Order: model<IOrder>('Order', require('./schema/order')(mongoose)),
    Tag: model<ITag>('Tag', require('./schema/tag')(mongoose)),
    Application: model<IApplication>(
      'Application',
      require('./schema/application')(mongoose),
    ),
  };
  /** @type {Object.<string, Model<import('mongoose').Document<any, {}>, {}>>} */
  // const model = {};

  /** @type {(keyof schemaBuilderType)[]} */
  // @ts-ignore
  const keys = Object.keys(schemaBuilder);

  // const modelMap = keys.map((key) => ({
  //   // /** @type {modelTypeMap[typeof key]} */
  //   [key]: model<IApplication>(key, schemaBuilder[key](mongoose)),
  // }));

  return modelMap;
}

export const make = (mongoose: Mongoose) => {
  return makeModule(mongoose);
}

// module.exports = {
//   /**
//    * @param {Mongoose} mongoose
//    */
//   make(mongoose) {
//     return makeModule(mongoose);
//   },
// };
