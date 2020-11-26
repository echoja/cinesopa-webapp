const { expect } = require('chai');
// const {} = require('./graphql-request');
const {
  initTestServer,
  graphqlSuper,
  doLogout,
  doAdminLogin,
  doGuestLogin,
  randomDate,
  adminEmail,
  guestEmail,
} = require('./tool');
const { graphql } = require('graphql');
const { model, db } = require('../loader');

describe('cartitem', function () {
  // eslint-disable-next-line mocha/no-setup-in-describe
  const { agent } = initTestServer({ before, beforeEach, after, afterEach });
  describe('db', function () {
    describe('getSopakits', function () {
      it('제대로 동작해야 함', async function () {
        const r = [];
        for (let i = 0; i < 10; i++) {
          r.push(
            model.Sopakit.create({
              title: `ho${i}`,
              managing_date: randomDate(),
            }),
          );
        }
        await Promise.allSettled(r);
        const result = await db.getSopakits({ page: 2, perpage: 4 });
        // console.log(result);
        expect(result.list.length).to.equal(2);
        expect(result.total).to.equal(10);
        expect(result.list[0].managing_date).to.be.greaterThan(
          result.list[1].managing_date,
        );
      });
    });
    describe('createSopakit', function () {
      it('제대로 동작해야 함', async function () {
        const r = [];
        for (let i = 0; i < 10; i++) {
          r.push(
            db.createSopakit({
              title: `ho${i}`,
              managing_date: randomDate(),
            }),
          );
        }
        await Promise.allSettled(r);
        const result = await model.Sopakit.find().lean().exec();
        // console.log(result);
        expect(result.length).to.equal(10);
      });
    });
    describe('updateSopakit', function () {
      it('제대로 동작해야 함', async function () {
        const doc = await model.Sopakit.create({ tilte: 'hi' });
        await db.updateSopakit(doc.id, { title: 'no~~' });
        const found = await model.Sopakit.findOne({ id: doc.id });
        // console.log(found);
        expect(found.title).to.equal('no~~');
      });
    });
    describe('removeSopakit', function () {
      it('제대로 동작해야 함', async function () {
        const doc = await model.Sopakit.create({ tilte: 'hi' });
        const id = doc.id;
        await db.removeSopakit(id);
        const found = await model.Sopakit.findOne({ id });
        expect(found).to.be.null;
      });
    });
  });
  describe('api', function () {});
});
