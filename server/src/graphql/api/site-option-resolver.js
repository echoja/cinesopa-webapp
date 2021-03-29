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
      // 성공시
      if (option) {
        return { name: option.name, value: option.value, success: true };
      }
      // 실패시
      return {
        name,
        value: null,
        success: false,
        code: 'no_option',
      };
    }).only(ACCESS_ALL),

    // 악의성 유저가 공격할 우려가 있음...
    siteOptions: makeResolver(async (obj, args, context, info) => {
      /** @type {string[]} */
      const names = args.names;
      // names 가 존재하지 않는다면 바로 종료.
      if (!names) return [];
      // console.log(names);
      const promises = names.map((name) => db.getSiteOption(name));
      // console.log(promises);
      const results = await Promise.allSettled(promises);
      // console.log(results);
      const refined = results.map((result, index) => {
        // 옵션 찾기 성공시
        if (result.status === 'fulfilled') {
          const option = result.value;
          return {
            name: option.name,
            value: option.value,
            success: true,
          };
        }
        // 옵션 찾기 실패시
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
      /** @type {any[]} */
      const inputs = args.inputs;
      const promises = inputs.map((input) => {
        const { name, value } = input;
        return db.setSiteOption(name, value, 'string');
      });
      const results = await Promise.allSettled(promises);
      const refined = results
        .filter((result) => result.status === 'fulfilled')
        .map((promResult) => {
          if (promResult.status === 'fulfilled') {
            return promResult.value;
          }
          return null;
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
