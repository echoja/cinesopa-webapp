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

    // 악의성 유저가 공격할 우려가 있음...
    siteOptions: makeResolver(async (obj, args, context, info) => {
      const { names } = args;
      // names 가 존재하지 않는다면 바로 종료.
      if (!names) return [];
      // console.log(names);
      const promises = names.map((name) => db.getSiteOption(name));
      // console.log(promises);
      const results = await Promise.allSettled(promises);
      // console.log(results);
      const refined = results.map((result, index) => {
        const option = result.value;
        if (option) {
          return {
            name: option.name,
            value: option.value,
            success: true,
          };
        }
        return {
          name: names[index],
          value: null,
          success: false,
          code: 'no_option',
        };
      });

      // console.log(refined);
      return refined;
    }).only(ACCESS_ALL),
  },
  Mutation: {
    setSiteOption: makeResolver(async (obj, args, context, info) => {
      const { name, value } = args;
      return db.setSiteOption(name, value, 'string');
    }).only(ACCESS_ADMIN),
    setSiteOptions: makeResolver(async (obj, args, context, info) => {
      const { inputs } = args;
      const promises = inputs.map((input) => {
        const { name, value } = input;
        return db.setSiteOption(name, value, 'string');
      });
      const results = await Promise.allSettled(promises);
      const refined = results.map((promResult) => {
        const result = promResult.value;
        return result;
      });
      return refined;
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
