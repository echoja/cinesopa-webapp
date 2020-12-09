const Hangul = require('hangul-js');
const {
  ACCESS_ALL,
  ACCESS_ADMIN,
  ACCESS_AUTH,
  ACCESS_UNAUTH,
  makeResolver,
  db,
} = require('../../loader');

module.exports = {
  Query: {
    product: makeResolver(async (obj, args, context, info) => {
      const { id } = args;
      const prodDoc = db.getProduct(id);
      // private 일 경우는 null 을 리턴함.
      if (prodDoc.status === 'private') return null;
      return prodDoc;
    }).only(ACCESS_ALL),
    productAdmin: makeResolver(async (obj, args, context, info) => {
      const { id } = args;
      return db.getProduct(id);
    }).only(ACCESS_ADMIN),
    products: makeResolver(async (obj, args, context, info) => {
      const { condition } = args;

      // search 한글 해체
      if (typeof condition.search === 'string' && condition.search.length > 0) {
        condition.search = Hangul.disassembleToString(condition.search);
      }
      condition.status = 'public';

      return db.getProducts(condition);
    }).only(ACCESS_ALL),
    productsAdmin: makeResolver(async (obj, args, context, info) => {
      const { condition } = args;
      return db.getProducts(condition);
    }).only(ACCESS_ADMIN),
  },
  Mutation: {
    createProduct: makeResolver(async (obj, args, context, info) => {
      const { input } = args;
      await db.createProduct(input);
      return { success: true };
    }).only(ACCESS_AUTH),
    updateProduct: makeResolver(async (obj, args, context, info) => {
      const { id, input } = args;
      await db.updateProduct(id, input);
      return { success: true };
    }).only(ACCESS_AUTH),
    removeProduct: makeResolver(async (obj, args, context, info) => {
      const { id } = args;
      await db.removeProduct(id);
      return { success: true };
    }).only(ACCESS_AUTH),
  },
};
