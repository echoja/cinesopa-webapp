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
    siteOption: makeResolver(async (obj, args, context, info) => {
      const { name } = args;
      const option = await db.getSiteOption(name);
      return option.value;
    }).only(ACCESS_ALL),
  },
  Mutation: {
    setSiteOption: makeResolver(async (obj, args, context, info) => {
      const { name, value } = args;
      return db.setSiteOption(name, value, 'string');
    }).only(ACCESS_ADMIN),
    setSiteFileOption: makeResolver(async (obj, args, context, info) => {
      const { name, filename } = args;
      return db.setSiteOption(name, filename, 'file');
    }).only(ACCESS_ADMIN),
    removeSiteOption: makeResolver(async (obj, args, context, info) => {
      const { name } = args;
      return db.removeSiteOption(name);
    }).only(ACCESS_ADMIN),
  },
};
