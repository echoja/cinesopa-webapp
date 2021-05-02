const { unwrap, tryUnwrap } = require('@/util');
const Hangul = require('hangul-js');
const { model } = require('mongoose');
const {
  ACCESS_ALL,
  ACCESS_ADMIN,
  ACCESS_AUTH,
  ACCESS_UNAUTH,
  makeResolver,
  db,
  payment,
  mail,
  templateArgsRefiner,
} = require('@/loader');
require('@/typedef');

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
      const promRes = await Promise.allSettled([
        db.getOrders(condition),
        db.getOrderCountGroupedByStatus({ user: email }),
      ]);
      const orders = tryUnwrap(promRes[0]); // need check
      const counts = tryUnwrap(promRes[1]);

      // const [{ value: orders }, { value: counts }] = await Promise.allSettled([
      //   db.getOrders(condition),
      //   db.getOrderCountGroupedByStatus({ user: email }),
      // ]);

      // console.log('# order-resolver myOrders counts');
      // console.log(counts);

      return {
        ...orders,
        order_count: counts.map((countByStatus) => ({
          status: countByStatus._id,
          count: countByStatus.count,
        })),
      };
    }).only(ACCESS_AUTH),

    // 결제 완료시 기본적으로 보일 정보를 보여주는 곳!
    myOrder: makeResolver(async (obj, args, context, info) => {
      const { id } = args;
      const user = context.getUser();
      const order = await db.getOrder(id);

      if (order.user !== user.email) {
        return null;
      }

      return order;
    }).only(ACCESS_AUTH),

    // 무통장 입금시 정보를 추가적으로 출력해야 하는 페이지에서 사용됨
    nobankOrderinfo: makeResolver(async (obj, args, context, info) => {
      const { id } = args;
      const { email } = context.getUser();
      const order = await db.getOrder(id);
      if (order.user !== email) {
        return { success: false, code: 'no_permission' };
      }
      if (order.method !== 'nobank') {
        return { success: false, code: 'not_nobank' };
      }
      return { success: true, order };
    }).only(ACCESS_AUTH),

    // orderCountGroupedByStatus: makeResolver(async (obj, args, context, info) => {
    //   const { email } = context.getUser();

    //   if(!email) {
    //     return [];
    //   }

    //   const counts = db.getOrderCountGroupedByStatus({user: email});
    //   counts
    //   return { success: true, order };
    // }).only(ACCESS_AUTH),
  },
  Mutation: {
    /** 관리자가 빈 주문을 생성할 때 사용됩니다. */
    createOrder: makeResolver(async (obj, args, context, info) => {
      const { input } = args;
      await db.createOrder(input);
      return { success: true };
    }).only(ACCESS_ADMIN),
    // 우선 결제하기 직전 Order id를 얻기 위해서 무조건 먼저 실행되는 함수.
    // 이 endpoint 에 왔을 때에는 아직까지 주문이 완료되지 않은 상태임.
    createOrderFromCart: makeResolver(async (obj, args, context, info) => {
      const { email } = context.getUser();
      const { input, payer } = args;

      /** @type {{items_id: number[]}} */
      const { items_id } = input;
      console.log('# order-resolver.js mutation createOrderFromCart');
      console.log(args);
      // 우선 cartitem id 가 전부 자신의 소유가 맞는지 검증
      const promises = items_id.map((id) => db.getCartitem(id));
      const results = await Promise.allSettled(promises);

      // cartitem 중 만약 하나라도 status 가 rejected 이거나 일치하지 않는 user가 나오면 검증 실패이므로
      // 아무런 작업도 하지 않고 바로 리턴.
      if (
        results.some(
          (result) =>
            result.status === 'rejected' ||
            !result.value ||
            result.value.user !== email,
        )
      ) {
        return { success: false, code: 'cartitem_not_owned_by_user' };
      }

      // order 생성.
      const cartitems = results.map((result) => {
        if (result.status !== 'fulfilled') return null;
        const cartitem = result.value;
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

      // 무통장입금일 경우 특수 처리 (무통장입금은 이후 finishPayment 가 호출되지 않음. 바로 끝남.)
      if (input.method === 'nobank') {
        // cartitem 삭제
        const removePromises = cartitems.map((cartitem) =>
          db.removeCartitem(cartitem.id),
        );

        // 관리자에게 이메일을 보냄
        const adminHtml = `
      - 사용자: ${email}<br>
      - 주문번호: ${order.id}<br>
      - 상품명: ${order.items.map((item) => item.product.name).join(', ')}
    `;
        const adminEmails = await db.getEmailsFromSiteOption('shopping_email');
        const mailAdminPromises = adminEmails.map((adminEmail) =>
          mail.sendGmail(
            { recipientEmail: adminEmail },
            `[소파섬] 새 주문 (무통장입금): ${order.id}`,
            adminHtml,
          ),
        );

        await Promise.allSettled([...removePromises, ...mailAdminPromises]);
      }
      return { success: true, code: 'normal', order_id: order.id };
    }).only(ACCESS_AUTH),

    // 결제 모듈에서 무사히 결제된 후 호출되는 endpoint.
    finishPayment: makeResolver(async (obj, args, context, info) => {
      const { id, receiptId } = args;

      let order = await db.getOrder(id);
      const user = context.getUser();

      // 유저 소유의 order 이어야 함.
      if (order.user !== user.email) {
        return { success: false, code: 'no_ownership' };
      }

      // 우선 bootpay id를 order에 넣어야 함.
      await db.updateOrder(id, { bootpay_id: receiptId });

      // 검증 및 cartitem 삭제, order를 payment_success 로 갱신하는 작업으로 들어감.
      const result = await payment.finishPayment(id);
      if (!result.success) {
        return { success: false, code: result.code };
      }

      // 결제 완료 되었다고 메일을 보냄 (사용자)
      order = await db.getOrder(id);
      mail
        .sendTemplatedGmail(
          {
            recipientEmail: user.email,
            recipientName: order.payer ?? order?.dest?.name ?? '',
          },
          '[소파섬] 결제가 완료되었습니다.',
          'payment-success',
          templateArgsRefiner.createPaymentSuccessArgs(order),
        )
        .catch((err) => {
          console.error(err);
          // todo: 메일이 제대로 안갔을 경우 처리
        });

      // 관리자에게 이메일을 보냄
      const adminHtml = `
        - 사용자: ${user.email}<br>
        - 주문번호: ${id}<br>
        - 상품명: ${order.items.map((item) => item.product.name).join(', ')}
      `;
      const mailAdminPromise = (async () => {
        const adminEmails = await db.getEmailsFromSiteOption('shopping_email');
        await Promise.allSettled(
          adminEmails.map((adminEmail) =>
            mail.sendGmail(
              { recipientEmail: adminEmail },
              `[소파섬] 새 주문: ${id}`,
              adminHtml,
            ),
          ),
        );
      })();

      // createOrderFromCart만 되고 실제 결제가 되지 않았던 쓸모 없는 Order를 삭제함.
      // todo: 문제가 있음. 왜냐하면 결제실패 이후 결제를 안하고 있으면 계속 DB에 남아 있음.
      const rresult = await db.removeDangledOrder(user.email);
      console.log('#order-resolver finishPayment rresult');
      console.log(rresult);

      // unresolved Promises 처리
      await mailAdminPromise;

      // 검증 결과를 내보냄.
      return { ...result, order };
    }).only(ACCESS_AUTH),
    // todo: make test
    reqCancelOrder: makeResolver(async (obj, args, context, info) => {
      const { id, cancel_reason } = args;
      const { email } = context.getUser();
      const orderDoc = await db.getOrder(id);
      // 자기 것이 아닐 경우 에러
      if (orderDoc.user !== email) {
        return { success: false, code: 'not_own_order' };
      }

      // 업데이트
      await db.updateOrder(id, { status: 'order_cancelling', cancel_reason });

      // 메일 보내기
      const adminEmails = await db.getEmailsFromSiteOption('shopping_email');
      const body = `
        - 사용자: ${email}<br>
        - 주문번호: ${id}<br>
        - 취소사유: ${cancel_reason}<br>
        - 상품명: ${orderDoc.items.map((item) => item.product.name).join(', ')}
      `;
      const sendPromises = adminEmails.map((adminEmail) =>
        mail.sendGmail(
          { recipientEmail: adminEmail, recipientName: '상품관리자' },
          `[소파섬] 주문취소 요청: ${id}`,
          body,
        ),
      );
      await Promise.allSettled(sendPromises);

      return { success: true };
    }).only(ACCESS_AUTH),

    // todo: make test
    cancelPayment: makeResolver(async (obj, args, context, info) => {
      const { id, cancel_reason, price } = args;
      const order = await db.getOrder(id);
      if (!order.bootpay_id) {
        return { success: false, code: 'no_bootpay_id' };
      }
      /** @type {import('@/typedef').CancelPaymentArgs} */
      const arg = {
        name: '관리자',
        reason: cancel_reason,
        receipt_id: order.bootpay_id,
      };
      // price 가 있을 시 정보 넣어주기.
      if (price) {
        arg.price = price;
      }

      const result = await payment.bootpay.cancelPayment(arg);
      // 성공했을 시 db 업데이트 및 결과 리턴
      if (result.success) {
        await db.updateOrder(id, {
          cancelled_fee: result.data.cancelled_price,
        });
        return {
          success: true,
          cancelled_price: result.data.cancelled_price,
        };
      }
      // 실패했을 시에는 result 를 그대로 리턴
      return result;
    }).only(ACCESS_ADMIN),
    updateOrder: makeResolver(async (obj, args, context, info) => {
      const { id, input } = args;
      await db.updateOrder(id, input);
      return { success: true };
    }).only(ACCESS_ADMIN),

    /** 회원이 자신의 order 를 수정 */
    updateMyOrder: makeResolver(async (obj, args, context, info) => {
      const { id, input } = args;
      const { email } = context.getUser();
      const orderDoc = await db.getOrder(id);

      // 자기 것이 아닐 경우 에러
      if (orderDoc.user !== email) {
        return { success: false, code: 'not_own_order' };
      }
      const updatePromise = db.updateOrder(id, input);

      // 메일 보내기
      const adminEmails = await db.getEmailsFromSiteOption('shopping_email');
      const body = `
        - 사용자: ${email}<br>
        - 주문번호: ${id}<br>
        - 상품명: ${orderDoc.items.map((item) => item.product.name).join(', ')}<br>
        주문이 수정되었습니다. 자세한 내용은 관리자 창에서 확인해주세요. 
      `;
      const sendPromises = adminEmails.map((adminEmail) =>
        mail.sendGmail(
          { recipientEmail: adminEmail, recipientName: '상품관리자' },
          `[소파섬] 주문수정: ${id}`,
          body,
        ),
      );
      await Promise.allSettled([...sendPromises, updatePromise]);

      return { success: true };
    }).only(ACCESS_AUTH),
    removeOrder: makeResolver(async (obj, args, context, info) => {
      const { id } = args;
      await db.removeOrder(id);
      return { success: true };
    }).only(ACCESS_ADMIN),
  },
};
