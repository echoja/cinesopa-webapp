const Hangul = require('hangul-js');
const { model } = require('mongoose');
const {
  ACCESS_ALL,
  ACCESS_ADMIN,
  ACCESS_AUTH,
  ACCESS_UNAUTH,
  makeResolver,
  db,
} = require('../../loader');
require('../../typedef');

module.exports = {
  Query: {
    orderAdmin: makeResolver(async (obj, args, context, info) => {
      const { id } = args;
      return db.getOrder(id);
    }).only(ACCESS_ADMIN),
    ordersAdmin: makeResolver(async (obj, args, context, info) => {
      const { condition } = args;
      return db.getOrders(condition);
    }).only(ACCESS_ADMIN),
    myOrders: makeResolver(async (obj, args, context, info) => {
      const { condition } = args;
      const { email } = context.getUser();
      condition.user = email;
      return db.getOrders(condition);
    }).only(ACCESS_AUTH),
  },
  Mutation: {
    // 결제 성공시의 요청 endpoint
    createOrderFromCart: makeResolver(async (obj, args, context, info) => {
      const { email } = context.getUser();
      const { input } = args;
      // 우선 cartitem id 가 전부 자신의 소유가 맞는지 검증
      const promises = input.items_id.map((id) => db.getCartitem(id));
      const results = await Promise.allSettled(promises);

      // 만약 하나라도 status 가 rejected 이거나 일치하지 않는 user가 나오면 검증 실패이므로
      // 아무런 작업도 하지 않고 바로 리턴.
      if (
        results.some(({ status, value: cartitem }) => {
          return status === 'rejected' || !cartitem || cartitem.user !== email;
        })
      ) {
        return { success: false, code: 'cartitem_not_owned_by_user' };
      }
      // todo: bootpay_id(receipt_id) 검증. 단, payment_method가 무통장입금(nobank)일 때에는 바로 그냥 주문 만들기.

      // order 생성.
      const cartitems = results.map(({ value: cartitem }) => {
        if (cartitem) {
          delete cartitem._id;
        }
        return cartitem;
      });
      // console.log('# order-resolver cartitems');
      // console.log(cartitems);
      // delete cartitems._id;

      // items와 dest 의 _id 가 겹치는 문제가 있지만, 패스. warning
      await db.createOrder({
        user: email,
        items: cartitems,
        status:
          input.method !== 'nobank' ? 'payment_success' : 'payment_confirming',
        method: input.method,
        dest: input.dest,
        transport_fee: input.transport_fee,
      });

      // 해당 cartitem 삭제
      const removePromises = cartitems.map((cartitem) =>
        db.removeCartitem(cartitem.id),
      );
      await Promise.allSettled(removePromises);
      return { success: true, code: 'normal' };
    }).only(ACCESS_AUTH),
    reqCancelOrder: makeResolver(async (obj, args, context, info) => {
      const { id } = args;
    }).only(ACCESS_AUTH),
  },
};
