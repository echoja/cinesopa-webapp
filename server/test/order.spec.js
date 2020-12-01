const { expect } = require('chai');
// const {} = require('./graphql-request');
const {
  initTestServer,
  graphqlSuper,
  doLogout,
  doAdminLogin,
  doGuestLogin,
  adminEmail,
  guestEmail,
  makeSimpleMutation,
  makeSimpleQuery,
} = require('./tool');
const { graphql } = require('graphql');
const { model, db } = require('../loader');
const destinfo = require('../db/schema/destinfo');

describe('order', function () {
  // eslint-disable-next-line mocha/no-setup-in-describe
  const { agent } = initTestServer({ before, beforeEach, after, afterEach });
  describe('db', function () {
    describe('getOrder', function () {
      it('제대로 동작해야 함', async function () {
        const o = await model.Order.create({ user: guestEmail });
        const found = await db.getOrder(o.id);
        // console.log(found);
        expect(found.user).to.equal(guestEmail);
      });
    });
    describe('getOrders', function () {
      beforeEach('Order 미리 만들어놓기', async function () {
        const promises = [
          model.Order.create({ user: guestEmail }),
          model.Order.create({
            user: guestEmail,
            c_date: new Date('2010-01-01'),
          }),
          model.Order.create({
            user: guestEmail,
            c_date: new Date('2012-01-01'),
          }),
          model.Order.create({
            user: guestEmail,
            c_date: new Date('2014-01-01'),
          }),
          model.Order.create({ user: guestEmail, status: 'order_received' }),
          model.Order.create({ user: guestEmail }),
          model.Order.create({ user: guestEmail }),
          model.Order.create({ user: guestEmail }),
          model.Order.create({ user: guestEmail }),
          model.Order.create({ user: guestEmail }),
        ];
        const results = await Promise.allSettled(promises);
        // console.log(results);
      });
      it('기본 동작이 제대로 되어야 함', async function () {
        const result = await db.getOrders();
        // console.log(result);
        expect(result.total).to.equal(10);
        expect(result.list.length).to.equal(10);
      });
      it('날짜가 제대로 동작되어야 함', async function () {
        const result = await db.getOrders({
          date_gte: new Date('2009-01-01'),
          date_lte: new Date('2015-01-01'),
        });
        // console.log(result);
        expect(result.total).to.equal(3);
        expect(result.list.length).to.equal(3);
      });
      it('페이지가 제대로 동작되어야 함', async function () {
        const result = await db.getOrders({
          page: 2,
          perpage: 2,
        });
        // console.log(result);
        expect(result.total).to.equal(10);
        expect(result.list.length).to.equal(2);
        const result2 = await db.getOrders({
          page: 3,
          perpage: 3,
        });
        // console.log(result);
        expect(result2.total).to.equal(10);
        expect(result2.list.length).to.equal(1);
      });
      it('status 제대로 동작되어야 함', async function () {
        const result = await db.getOrders({
          status: 'order_received',
        });
        // console.log(result);
        expect(result.total).to.equal(1);
        expect(result.list.length).to.equal(1);
      });
    });
    describe('createOrder', function () {
      it('제대로 동작해야 함', async function () {
        this.skip();
      });
    });
    describe('updateOrder', function () {
      it('제대로 동작해야 함', async function () {
        this.skip();
      });
    });
    describe('removeOrder', function () {
      it('제대로 동작해야 함', async function () {
        this.skip();
      });
    });
  });
  describe('api', function () {
    describe('myOrders', function () {
      it('제대로 동작해야 함', async function () {
        model.Order.create({
          user: guestEmail,
          items: [
            {
              user: guestEmail,
              product_id: 1,
            },
          ],
        });
        model.Order.create({
          user: adminEmail,
          items: [
            {
              user: adminEmail,
              product_id: 1,
            },
          ],
        });
        await doGuestLogin(agent);
        const req = makeSimpleQuery(agent, 'myOrders');
        const res = await req(
          { condition: {} },
          `
          { total 
            list {
              user status method 
              items {
                user product_id
              }
            }
          }
        `,
        );
        expect(res.total).to.equal(1);
        expect(res.list.length).to.equal(1);
        // console.dir(res, {depth: 4});
      });
    });

    describe('orderAdmin', function () {
      it('제대로 동작해야 함', async function () {
        this.skip();
      });
    });
    describe('ordersAdmin', function () {
      it('제대로 동작해야 함', async function () {
        this.skip();
      });
    });
    describe('createOrderFromCart', function () {
      beforeEach('', async function () {
        const prod = await model.Product.create({
          content_main: 'hello, world!',
          options: [
            {
              id: 'ho',
              content: '호',
              left: 123,
              price: 500000,
            },
          ],
          product_type: 'sopakit',
          name: '슈펴사품',
          featured_image_url: 'https://ho',
          featured_image_alt: '이미지설명',
        });

        const cartitem = await model.Cartitem.create({
          product_id: prod.id,
          modified: new Date(),
          options: [
            {
              id: 'ho',
              count: 3,
            },
          ],
          user: guestEmail,
        });
      });
      it.only('제대로 동작해야 함', async function () {
        await doGuestLogin(agent);
        const req = makeSimpleMutation(agent, 'createOrderFromCart');
        const res = await req(
          {
            input: {
              items_id: [1],
              method: 'card',
              dest: {
                name: '123',
                address: '호호',
                address_detail: '자세한주소',
              },
              bootpay_id: '1213',
            },
          },
          `{success code}`,
        );
        // console.log(res);
        expect(res.success).to.be.true;
        expect(res.code).to.equal('normal');
        const orderFound = await model.Order.findOne().lean().exec();
        expect(orderFound.user).to.equal(guestEmail);
        expect(orderFound.status).to.equal('payment_success');
        expect(orderFound.items[0].id).to.be.a('number');
      });
      it.only('이미 있던 cartitem 은 삭제되어야 함', async function () {
        await doGuestLogin(agent);
        const req = makeSimpleMutation(agent, 'createOrderFromCart');
        const res = await req(
          {
            input: {
              items_id: [1],
              method: 'card',
              dest: {
                name: '123',
                address: '호호',
                address_detail: '자세한주소',
              },
              bootpay_id: '1213',
            },
          },
          `{success code}`,
        );

        // console.log(orderFound);
        const cartitemFound = await model.Cartitem.find().lean().exec();
        // console.log(cartitemFound);
        expect(cartitemFound.length).to.equal(0);
      });
      it.only('무통장 입금의 경우 status 는 결제 대기중이어야 함.', async function () {
        await doGuestLogin(agent);
        const req = makeSimpleMutation(agent, 'createOrderFromCart');
        const res = await req(
          {
            input: {
              items_id: [1],
              method: 'nobank',
              dest: {
                name: '123',
                address: '호호',
                address_detail: '자세한주소',
              },
              bootpay_id: '1213',
            },
          },
          `{success code}`,
        );

        const orderFound = await model.Order.findOne().lean().exec();
        expect(orderFound.user).to.equal(guestEmail);
        expect(orderFound.status).to.equal('payment_confirming');
        expect(orderFound.items[0].id).to.be.a('number');
      });
      it.only('존재하지 않은 cartitem 이 있을 경우 실패해야 함.', async function () {
        await doGuestLogin(agent);
        const req = makeSimpleMutation(agent, 'createOrderFromCart');
        const res = await req(
          {
            input: {
              items_id: [5], // 존재하지 않는 id
              method: 'card',
              dest: {
                name: '123',
                address: '호호',
                address_detail: '자세한주소',
              },
              bootpay_id: '1213',
            },
          },
          `{success code}`,
        );
        // console.log(res);
        expect(res.success).to.be.false;
      });
      it.only('자신의 것이 아닌 cartitem 이 있을 경우 실패해야 함.', async function () {
        // 어드민으로 로그인함. guest 가 아니라.
        await doAdminLogin(agent);
        const req = makeSimpleMutation(agent, 'createOrderFromCart');
        const res = await req(
          {
            input: {
              items_id: [1],
              method: 'card',
              dest: {
                name: '123',
                address: '호호',
                address_detail: '자세한주소',
              },
              bootpay_id: '1213',
            },
          },
          `{success code}`,
        );
        // console.log(res);
        expect(res.success).to.be.false;
      });
    });
    describe('reqCancelOrder', function () {
      it.only('제대로 동작해야 함', async function () {
        // todo
      });
    });
  });
});
