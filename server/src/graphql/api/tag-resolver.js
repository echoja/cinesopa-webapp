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
    tags: makeResolver(async (obj, args, context, info) => {
      const { condition } = args;
      return db.getTags(condition);
    }).only(ACCESS_ALL),
  },
};
