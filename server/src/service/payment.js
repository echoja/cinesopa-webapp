// require('../typedef');

const {Orderinfo, BootpayManager, DBManager} = require('../typedef');

// /**
//  *
//  * @param {Orderinfo} order
//  */
// const getTotalPrice = (order) => {
//   if (!order) {
//     return 0;
//   }
//   /** @type {import('../typedef').CartItemOptioninfo[]} */
//   // need-check
//   const flatted = order.items.map((item) => item.options ?? []).flat(2);
//   // console.log(flatted);
//   const totalPrice =
//     flatted.reduce(
//       (acc, option) => acc + (option.count ?? 0) * (option.price ?? 0),
//       0,
//     ) + (order.transport_fee ?? 0);
//   return totalPrice;
// };

class PaymentService {
  /**
   *
   * @param {DBManager} db
   * @param {BootpayManager} bootpay
   */
  constructor(db, bootpay) {
    this.db = db;
    this.bootpay = bootpay;
  }

  // /**
  //  * 결제를 취소합니다. 필요한 정보는 order에서 알아서 뽑아와서 조합됩니다.
  //  * @param {number} id Order의 ID
  //  */
  // async cancelPayment(id, price = null) {
  //   const order = await this.db.getOrder(id);
  //   if(!order) {
  //     return { success: false, code: 'no_such_order' };
  //   }

  //   this.bootpay.cancelPayment(order.bootpay_id, {name, price, reason: ''})
  // }
  /**
   * 먼저 Order Id 에 해당하는 주문이 제대로 결제가 되었는지를 확인하고
   * 결제 완료 상태로 만듭니다.
   * @param {number} id Order의 ID
   */
  async finishPayment(id) {
    // order 가 없을 경우 에러
    const order = await this.db.getOrder(id);

    // console.log('# payment finishPayment order');
    // console.log(order);

    if (!order) {
      return { success: false, code: 'no_such_order' };
    }

    // bootpay_id 가 없을 경우 에러
    if (typeof order.bootpay_id !== 'string') {
      return { success: false, code: 'no_bootpay_id' };
    }

    // 결제진행중 상태여야 함.
    if (order.status !== 'payment_confirming') {
      return { success: false, code: 'payment_not_confirming' };
    }

    // order 에서 총 가격을 구함
    // console.log('# payment finishPayment order2');
    // console.log(order);

    const flatted = order.items.map((item) => item.options).flat(20);
    // console.log('# payment finishPayment flatted');
    // console.log(flatted);

    const totalPrice =
      flatted.reduce(
        (acc, option) => acc + (option.count ?? 0) * (option.price ?? 0),
        0,
      ) + (order.transport_fee ?? 0);

    // console.log('# payment finishPayment totalPrice');
    // console.log(totalPrice);

    // 삭제할 cartitemId 를 구함.
    const cartitemIds = order.items.map((cartitem) => cartitem.id);
    // console.log('# payment finishPayment cartitemIds');
    // console.log(cartitemIds);

    // 검증 실시. 만약 검증에 실패했다면 결제를 취소함.
    const verifyResult = await this.bootpay.verifyPayment(
      order.bootpay_id,
      totalPrice,
    );
    // console.log('# payment finishPayment verifyResult');
    // console.log(verifyResult);
    if (!verifyResult.success) {
      // await this.bootpay.cancelPayment(order.bootpay_id);
      return {
        success: false,
        code: `verification_failed_${verifyResult.code}`,
      };
    }
    // verifyResult.info.receipt_url

    // 결제 완료 업데이트 및 cartitem 삭제
    const promises = [
      this.db.updateOrder(id, { status: 'payment_success', bootpay_payment_info: verifyResult.info }),
      ...cartitemIds.map((cartitemId) => this.db.removeCartitem(cartitemId)),
    ];
    const results = await Promise.allSettled(promises);

    // 만약 하나라도 fulfilled 되지 않았다면 에러
    if (results.some((result) => result.status !== 'fulfilled')) {
      return {
        success: false,
        code: 'went_wrong_while_removing_cartitem_or_updating_order',
      };
    }

    // 모든 과정을 지나왔다면 성공!
    return { success: true, code: 'normal' };
  }
}

module.exports = {
  make: (db, bootpay) => {
    return new PaymentService(db, bootpay);
  },
};
