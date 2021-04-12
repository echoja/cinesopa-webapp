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
  ModelWrapper,
} from '@/typedef';

import mongoose, { model, Document, Mongoose } from 'mongoose';

/** @typedef {import('@/typedef').Applicationinfo} Applicationinfo */
/** @typedef {import('@/typedef').Postinfo} Postinfo */

import Page from './schema/page';
import User from './schema/user';
import Login from './schema/login';
import File from './schema/file';
import Board from './schema/board';
import Film from './schema/film';
import Post from './schema/post';
import Product from './schema/product';
import Cartitem from './schema/cartitem';
import Token from './schema/token';
import SiteOption from './schema/site-option';
import Sopakit from './schema/sopakit';
import Order from './schema/order';
import Tag from './schema/tag';
import Application from './schema/application';

// const schemaBuilder = {
//   Page: require('./schema/page'),
//   User: require('./schema/user'),
//   Login: require('./schema/login'),
//   File: require('./schema/file'),
//   Board: require('./schema/board'),
//   Film: require('./schema/film'),
//   Menu: require('./schema/menu'),
//   Post: require('./schema/post'),
//   Product: require('./schema/product'),
//   Cartitem: require('./schema/cartitem'),
//   Token: require('./schema/token'),
//   SiteOption: require('./schema/site-option'),
//   Sopakit: require('./schema/sopakit'),
//   Order: require('./schema/order'),
//   Tag: require('./schema/tag'),
//   Application: require('./schema/application'),
// };

/** @typedef {typeof schemaBuilder} schemaBuilderType */

/**
 * 모델을 만들어 반환합니다.
 *
 * @param {Mongoose} mongoose
 */

/** @returns mongoose Model 딕셔너리 */

function makeModule(mongoose: Mongoose): ModelWrapper {
  const modelMap = {
    Page: model<IPage>('Page', Page(mongoose)),
    User: model<IUser>('User', User(mongoose)),
    Login: model<ILogin>('Login', Login(mongoose)),
    File: model<IFile>('File', File(mongoose)),
    Board: model<IBoard>('Board', Board(mongoose)),
    Film: model<IFilm>('Film', Film(mongoose)),
    Post: model<IPost>('Post', Post(mongoose)),
    Product: model<IProduct>('Product', Product(mongoose)),
    Cartitem: model<ICartitem>('Cartitem', Cartitem(mongoose)),
    Token: model<IToken>('Token', Token(mongoose)),
    SiteOption: model<ISiteOption>('SiteOption', SiteOption(mongoose)),
    Sopakit: model<ISopakit>('Sopakit', Sopakit(mongoose)),
    Order: model<IOrder>('Order', Order(mongoose)),
    Tag: model<ITag>('Tag', Tag(mongoose)),
    Application: model<IApplication>('Application', Application(mongoose)),
  };
  /** @type {Object.<string, Model<import('mongoose').Document<any, {}>, {}>>} */
  // const model = {};

  /** @type {(keyof schemaBuilderType)[]} */
  // @ts-ignore
  // const keys = Object.keys(schemaBuilder);

  // const modelMap = keys.map((key) => ({
  //   // /** @type {modelTypeMap[typeof key]} */
  //   [key]: model<IApplication>(key, schemaBuilder[key](mongoose)),
  // }));

  return modelMap;
}

export const make = (mongoose: Mongoose) => makeModule(mongoose);

// module.exports = {
//   /**
//    * @param {Mongoose} mongoose
//    */
//   make(mongoose) {
//     return makeModule(mongoose);
//   },
// };
