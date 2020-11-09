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
    cartitems: makeResolver(async (obj, args, context, info) => {
      const { email } = context.getUser();
      return db.getCurrentCartitems(email);
    }).only(ACCESS_AUTH),
  },
  Mutation: {
    addCartitem: makeResolver(async (obj, args, context, info) => {}).only(
      ACCESS_AUTH,
    ),
    updateOptionCount: makeResolver(
      async (obj, args, context, info) => {},
    ).only(ACCESS_AUTH),
    removeCartitem: makeResolver(async (obj, args, context, info) => {}).only(
      ACCESS_AUTH,
    ),
  },
};
