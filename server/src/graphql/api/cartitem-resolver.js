const Hangul = require('hangul-js');
const {
  ACCESS_ALL,
  ACCESS_ADMIN,
  ACCESS_AUTH,
  ACCESS_UNAUTH,
  makeResolver,
  db,
} = require('@/loader');
require('@/typedef');

module.exports = {
  Query: {
    cartitems: makeResolver(async (obj, args, context, info) => {
      const { email } = context.getUser();
      // console.log('cartiemsResolver!!');
      // console.log(email);
      return db.getCartitems(email);
    }).only(ACCESS_AUTH),
    cartitemById: makeResolver(async (obj, args, context, info) => {
      const { email } = context.getUser();
      const { ids } = args;
      // console.log('cartiemsResolver!!');
      // console.log(email);
      const all = await db.getCartitems(email, { usage: null });
      const filtered = all.filter((cartitem) => ids.includes(cartitem.id));

      // 필터된 것과 ids 의 길이가 다르다면,
      // 즉 ids 에 이 유저의 것이 아닌 다른 이상한 cartitem id 가 포함되어 있을 경우
      if (filtered.length !== ids.length) {
        return { success: false, code: 'invalid_id' };
      }

      return { success: true, code: 'normal', list: filtered };
    }).only(ACCESS_AUTH),
  },
  Mutation: {
    addCartitem: makeResolver(async (obj, args, context, info) => {
      const { email } = context.getUser();
      const { input } = args;
      input.user = email;
      input.modified = new Date();
      return db.addCartitem(input);
    }).only(ACCESS_AUTH),
    updateOptionCount: makeResolver(async (obj, args, context, info) => {
      const { id, optionId, count } = args;
      const { email } = context.getUser();
      // 원래 클라이언트에서 current date 값을 받아서 사용하려고 했으나,
      // 올바르지 않은 Date가 올 가능성이 있으므로 그냥 서버에서 처리하도록 함.
      const serverCurrent = new Date();
      // console.log('# cartitem-resolver updateOptionCount');
      // console.log(id);
      // console.log(optionId);
      // console.log(count);
      // console.log(email);

      return db.updateCartitemOption(id, optionId, count, serverCurrent, email);
    }).only(ACCESS_AUTH),
    removeCartitem: makeResolver(async (obj, args, context, info) => {
      const { id } = args;
      return db.removeCartitem(id);
    }).only(ACCESS_AUTH),
    makeInstancePaymentCartitem: makeResolver(
      async (obj, args, context, info) => {
        // 기존에 오래된 것 삭제
        await db.removeOldInstantPaymentCartitem();

        const { email } = context.getUser();
        const { input } = args;
        input.user = email;
        input.modified = new Date();
        input.usage = 'instant_payment';
        return db.addCartitem(input);
      },
    ).only(ACCESS_AUTH),
  },
};
