const { expect } = require('chai');
const sinon = require('sinon');
const { db, model, payment } = require('@/loader');
const paymentServiceMaker = require('@/service/payment').make;
const { createTestServer, graphqlSuper, doLogin, guestEmail } = require('./tool').default;

describe('payment service', function () {
  // eslint-disable-next-line mocha/no-setup-in-describe
  const { agent } = createTestServer(this);
  describe('finishPayment', function () {

    // 테스트를 위해 이 녀석을 수정해주세요!!
    // 절대 실제 receipt_id 를 넣지 말아주세요!
    const bootpay_id = '5fd9d6a802f57e003de08f56';
    
    it('제대로 동작해야 함', async function () {
      // this.skip();
      // const results = await Promise.allSettled([
      //   model.Order.create({
      //     user: guestEmail,
      //     status: 'payment_confirming',
      //     bootpay_id,
      //     items: [
      //       {
      //         id: 1,
      //         options: [
      //           {
      //             id: 'hi',
      //             count: 5,
      //             price: 200,
      //           },
      //         ],
      //       },
      //       {
      //         id: 2,
      //         options: [
      //           {
      //             id: 'ho',
      //             count: 8,
      //             price: 250,
      //           },
      //         ],
      //       },
      //     ],
      //   }),
      //   model.Cartitem.create({}),
      //   model.Cartitem.create({}),
      // ]);
      // // console.dir(results[0], { depth: 4 });
      // // console.log(results[0].value.toObject());
      // // const {
      // //   value: { id },
      // // } = results[0];
      // const r  = results[0];
      // let id = -1;
      // if (r.status === 'fulfilled')
      // {
      //   id = r.value.id;
      // }
      
      // // console.log(id);
      // const result = await payment.finishPayment(id);
      // // success 가 참이어야 함.
      // // const orders = await model.Order.find().lean().exec();
      // // console.log(orders);

      // // const cartitemss = await model.Cartitem.find().lean().exec();
      // // console.log(cartitemss);

      // // console.log(result);
      // expect(result.success).to.be.true;

      // const cartitems = await model.Cartitem.find();
      // expect(cartitems.length).to.equal(
      //   0,
      //   '관련된 카트아이템은 다 삭제되어야 함.',
      // );

      // const order = await model.Order.findOne({ id });
      // expect(order.status).to.equal(
      //   'payment_success',
      //   'order의 상태가 변경되어 있어야 함',
      // );
    });
    it('부트페이에서 verifyPayment에 실패할 경우, 실패해야 함.', async function () {
      const results = await Promise.allSettled([
        model.Order.create({
          user: guestEmail,
          status: 'payment_confirming',
          bootpay_id,
          items: [
            {
              id: 1,
              options: [
                {
                  id: 'hi',
                  count: 5,
                  price: 200,
                },
              ],
            },
            {
              id: 2,
              options: [
                {
                  id: 'ho',
                  count: 8,
                  price: 250,
                },
              ],
            },
          ],
        }),
        model.Cartitem.create({}),
        model.Cartitem.create({}),
      ]);
      // console.dir(results[0], { depth: 4 });
      const id = results[0].status === 'fulfilled' ? results[0].value.id : -1;
      const paymentService = paymentServiceMaker(db, {
        verifyPayment: sinon.fake(() => ({ success: false, code: 'test' })),
      });
      const result = await paymentService.finishPayment(id);
      // success 가 거짓이어야 함
      // console.log(result);
      expect(result.success).to.be.false;
      expect(result.code).to.equal('verification_failed_test');

      const cartitems = await model.Cartitem.find();
      expect(cartitems.length).to.equal(
        2,
        '관련된 카트아이템은 삭제되지 않아야 함',
      );

      const order = await model.Order.findOne({ id });
      expect(order.status).to.equal(
        'payment_confirming',
        'order의 상태가 변경되면 안 됨.',
      );
    });
    it('order id 가 잘못되었을 경우 실패해야 함.', async function () {
      const results = await Promise.allSettled([
        model.Order.create({
          user: guestEmail,
          status: 'payment_confirming',
          bootpay_id,
          items: [
            {
              id: 1,
              options: [
                {
                  id: 'hi',
                  count: 5,
                  price: 200,
                },
              ],
            },
            {
              id: 2,
              options: [
                {
                  id: 'ho',
                  count: 8,
                  price: 250,
                },
              ],
            },
          ],
        }),
        model.Cartitem.create({}),
        model.Cartitem.create({}),
      ]);
      // console.dir(results[0], { depth: 4 });
      const id = results[0].status === 'fulfilled' ? results[0].value.id : -1;
      const result = await payment.finishPayment(1234);
      // success 가 참이어야 함.
      // console.log(result);
      expect(result.success).to.be.false;
      expect(result.code).to.equal('no_such_order');
      const cartitems = await model.Cartitem.find();
      expect(cartitems.length).to.equal(
        2,
        '관련된 카트아이템은 삭제되지 않아야 함',
      );

      const order = await model.Order.findOne({ id });
      expect(order.status).to.equal(
        'payment_confirming',
        'order의 상태가 변경되면 안 됨.',
      );
    });
  });
});
