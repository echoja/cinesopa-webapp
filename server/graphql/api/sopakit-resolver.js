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
    sopakits: makeResolver(async (obj, args, context, info) => {
      const { condition } = args;
      condition.status = 'show';
      return db.getSopakits(condition);

    }).only(ACCESS_ALL),
    sopakitsAdmin: makeResolver(async (obj, args, context, info) => {
      const { condition } = args;
      return db.getSopakits(condition);
    }).only(ACCESS_ADMIN),
  },
  Mutation: {
    createSopakit: makeResolver(async (obj, args, context, info) => {
      const { input } = args;
      await db.createSopakit(input);
      return { success: true };
    }).only(ACCESS_ADMIN),
    updateSopakit: makeResolver(async (obj, args, context, info) => {
      const { id, input } = args;
      await db.updateSopakit(id, input);
      return { success: true };
    }).only(ACCESS_ADMIN),
    removeSopakit: makeResolver(async (obj, args, context, info) => {
      const { id } = args;
      await db.removeSopakit(id);
      return { success: true };
    }).only(ACCESS_ADMIN),
  },
};
