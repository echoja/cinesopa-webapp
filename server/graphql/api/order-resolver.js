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
    // 무통장 입금시 정보를 추가적으로 출력해야 하는 페이지에서 사용됨
    nobankOrderInfo: makeResolver(async (obj, args, context, info) => {
      const { id } = args;
      const { email } = context.getUser();
      const order = await db.getOrder(id);
      if (order.user !== email) {
        return { success: false, code: 'no_permission' };
      }
      if (order.method !== 'nobank') {
        return { success: false, code: 'no_nobank' };
      }
      return { success: true, order };
    }).only(ACCESS_AUTH),
  },
  Mutation: {
    // 결제 성공시의 요청 endpoint
    createOrderFromCart: makeResolver(async (obj, args, context, info) => {
      const { email } = context.getUser();
      const { input, payer } = args;

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
      // todo: 지금 시점으론 이미 결제가 완료된 상태인데, 결제하고 있었던 도중
      // product 의 가격 정보가 수정된다면 앞으로 생성될 order에 적힌 product
      // 의 가격과 실제 주문한 가격이 달라짐. (그럴 때는 어케?)

      // bootpay_id(receipt_id) 은 검증 따로 해야 함.

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

      // todo: dest 의 _id 가 겹치는 문제가 있지만, 패스. warning
      const order = await db.createOrder({
        user: email,
        items: cartitems,
        status: 'payment_confirming',
        method: input.method,
        dest: input.dest,
        transport_fee: input.transport_fee,
        payer,
      });

      // 해당 cartitem 삭제 - 일반 결제 모듈은 승인된 이후 삭제해야 하므로 
      // 일단 cartitem 을 삭제하지 않음.
      // 무통장 입금은 바로 삭제하도록 함.
      if (input.method === 'nobank') {
        const removePromises = cartitems.map((cartitem) =>
          db.removeCartitem(cartitem.id),
        );
        await Promise.allSettled(removePromises);
      }
      return { success: true, code: 'normal', order_id: order.id };
    }).only(ACCESS_AUTH),
    reqCancelOrder: makeResolver(async (obj, args, context, info) => {
      const { id } = args;
    }).only(ACCESS_AUTH),
    updateOrder: makeResolver(async (obj, args, context, info) => {
      const { id, input } = args;
      await db.updateOrder(id, input);
      return { success: true };
    }).only(ACCESS_ADMIN),
    removeOrder: makeResolver(async (obj, args, context, info) => {
      const { id } = args;
      await db.removeOrder(id);
      return { success: true };
    }).only(ACCESS_ADMIN),
  },
};
