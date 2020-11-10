const { expect } = require('chai');
// const {} = require('./graphql-request');
const {
  initTestServer,
  graphqlSuper,
  doLogout,
  doAdminLogin,
  doGuestLogin,
  adminEamil,
  guestEmail,
} = require('./tool');
const { graphql } = require('graphql');
const { model, db } = require('../loader');

const updateOptionCountMutation = `
mutation updateOptionCountMutation(
  $id: Int!,
  $optionId: String!,
  $count: Int!,
  $current: DateTime!,
) {
  updateOptionCount(
    id: $id,
    optionId: $optionId,
    count: $count,
    current: $current,
  ) {
    success
    code
  }
}
`;

describe('cartitem', function () {
  // eslint-disable-next-line mocha/no-setup-in-describe
  const { agent } = initTestServer({ before, beforeEach, after, afterEach });
  describe('db', function () {
    describe('getCartitems', function () {
      it('잘 동작해야 함', async function () {
        await model.Cartitem.create({
          user: guestEmail,
        });
        const cartitems = await db.getCartitems(guestEmail);
        // console.log(cartitems);
        expect(cartitems.length).to.equal(1);
      });
    });
    describe('addCartitem', function () {
      it.only('아무것도 없을 경우 추가되어야 함.', async function () {
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

        const r1 = await db.addCartitem({
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
        expect(r1.success).to.be.true;
        const created = await model.Cartitem.findOne().lean().exec();
        const afterProd = await model.Product.findOne({ id: prod.id })
          .lean()
          .exec();
        console.log(created);
        console.log(afterProd);
        expect(created.user).to.equal(guestEmail);
        expect(created.options[0].id).to.equal('ho');
        expect(created.options[0].content).to.equal('호');
        expect(created.options[0].price).to.equal(500000);
        expect(created.options[0].count).to.equal(3);
        expect(created.product_id).to.equal(prod.id);
        expect(afterProd.related_cartitems[0]).to.equal(created.id);
      });
      it('이미 존재하는 cartitem 일 경우 추가되어야 함.', async function () {
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
        });

        const r1 = await db.addCartitem({
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
        const r2 = await db.addCartitem({
          product_id: prod.id,
          modified: new Date(),
          options: [
            {
              id: 'ho',
              count: 2,
            },
          ],
          user: guestEmail,
        });

        expect(r1.success).to.be.true;
        const added = await model.Cartitem.findOne().lean().exec();
        const afterProd = await model.Product.findOne({ id: prod.id })
          .lean()
          .exec();
        console.log(added);
        console.log(afterProd);
        expect(added.options[0].count).to.equal(5);
      });
      it('인수가 잘못되었을 경우 실행되지 않아야 함', async function () {
        const r1 = await db.addCartitem({
          // product_id: 0,
          modified: new Date(),
          options: {
            id: 'ho',
            count: '3',
          },
          user: guestEmail,
        });
        expect(r1.success).to.be.false;
        expect((await model.Cartitem.find()).length).to.equal(0);
        const r2 = await db.addCartitem({
          product_id: 0,
          // modified: new Date(),
          options: {
            id: 'ho',
            count: '3',
          },
          user: guestEmail,
        });
        expect(r2.success).to.be.false;
        expect((await model.Cartitem.find()).length).to.equal(0);
        const r3 = await db.addCartitem({
          product_id: 0,
          modified: new Date(),
          // options: {
          //   id: 'ho',
          //   count: '3',
          // },
          user: guestEmail,
        });
        expect(r3.success).to.be.false;
        expect((await model.Cartitem.find()).length).to.equal(0);
        const r4 = await db.addCartitem({
          product_id: 0,
          modified: new Date(),
          options: {
            id: 'ho',
            count: '3',
          },
          // user: guestEmail,
        });
        expect(r4.success).to.be.false;
        expect((await model.Cartitem.find()).length).to.equal(0);
      });
    });
    describe('removeCartitem', function () {
      it.only('제대로 동작해야 함', async function () {
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
        });

        const ci = await model.Cartitem.create({
          product_id: prod.id,
          user: guestEmail,
        });
        const result = await db.removeCartitem(ci.id);
        expect(result.success).to.be.true;
        const found = await model.Cartitem.find().lean().exec();
        expect(found.length).to.equal(0);
      });
      it.only('관련된 product 에서 삭제될 필요는 없음', async function () {
        const ci = await model.Cartitem.create({
          user: guestEmail,
        });
        const prod = await model.Product.create({
          content_main: 'hello, world!',
          related_cartitems: [ci.id],
        });
        db.removeCartitem(ci.id);
        const ciFound = await model.Cartitem.find().lean().exec();
        const newProd = await model.Product.findOne({ id: prod.id })
          .lean()
          .exec();
        expect(ciFound.length).to.equal(0);
        expect(newProd.related_cartitems.length).to.equal(1);
      });
    });
    describe('updateCartitemOption', function () {
      it('제대로 동작해야 함', async function () {
        const oldDate = new Date('2010-12-31');
        const newDate = new Date('2015-02-12');
        const item = await model.Cartitem.create({
          modified: oldDate,
          product_id: 123,
          options: [{ id: 'abc', count: 5 }],
        });
        const result = await db.updateCartitemOption(
          item.id,
          'abc',
          3,
          newDate,
        );
        // console.log(result);
        const after = await model.Cartitem.findOne({ id: item.id })
          .lean()
          .exec();
        expect(result.success).to.be.true;
        expect(after.options[0].count).to.equal(3);
        expect(after.modified.getTime()).to.equal(newDate.getTime());
      });
      it('갱신하는 시간이 더 오래 되었다면 동작하지 않아야 함.', async function () {
        const oldDate = new Date('2010-12-31');
        const newDate = new Date('2015-02-12');
        const item = await model.Cartitem.create({
          product_id: 123,
          modified: newDate,
          options: [{ id: 'abc', count: 5 }],
        });
        const result = await db.updateCartitemOption(
          item.id,
          'abc',
          3,
          oldDate,
        );
        const after = await model.Cartitem.findOne({ id: item.id })
          .lean()
          .exec();
        expect(result.success).to.be.false;
        expect(after.options[0].count).to.equal(5);
      });
      it('옵션이 존재하지 않을 경우 아무것도 수행되지 않아야 함.', async function () {
        const oldDate = new Date('2010-12-31');
        const newDate = new Date('2015-02-12');
        const item = await model.Cartitem.create({
          modified: oldDate,
          product_id: 123,
          options: [{ id: 'abc', count: 5 }],
        });
        const result = await db.updateCartitemOption(
          item.id,
          'abcdefg',
          3,
          newDate,
        );
        // console.log(result);
        const after = await model.Cartitem.findOne({ id: item.id })
          .lean()
          .exec();
        expect(result.success).to.be.false;
        expect(after.options[0].count).to.equal(5);
      });

      it('카트 아이템이 존재하지 않는다면 아무 것도 수행되지 않아야 함.', async function () {
        const result = await db.updateCartitemOption(
          123,
          'abcdefg',
          3,
          new Date(),
        );
        expect(result.success).to.be.false;
      });
    });
  });
  describe('api', function () {
    describe('cartitems', function () {
      it('제대로 동작해야 함', async function () {
        // todo
      });
    });
    describe('addCartitem', function () {});
    describe('updateOptionCount', function () {
      it('제대로 동작해야 함', async function () {
        await doGuestLogin(agent);
        const oldDate = new Date('2010-12-31');
        const newDate = new Date('2015-02-12');
        const item = await model.Cartitem.create({
          product_id: 123,
          modified: oldDate,
          options: [{ id: 'abc', count: 5 }],
        });
        const res = await graphqlSuper(agent, updateOptionCountMutation, {
          id: item.id,
          optionId: 'abc',
          count: 3,
          current: newDate,
        });
        const result = res.body.data.updateOptionCount;
        const after = await model.Cartitem.findOne({ id: item.id })
          .lean()
          .exec();
        expect(result.success).to.be.true;
        expect(after.options[0].count).to.equal(3);
        expect(after.modified.getTime()).to.equal(newDate.getTime());
      });
    });
    describe('removeCartitem', function () {
      it('제대로 동작해야 함', async function () {
        // todo
      });
    });
    describe('', function () {});
  });
});
