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
  makeSimpleQuery,
  makeSimpleMutation,
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
  describe('api', function () {
    const mongooseCreateSopakits = async (count = 10) => {
      const r = [];
      for (let i = 0; i < count; i++) {
        r.push(
          model.Sopakit.create({
            title: `ho${i}`,
            managing_date: randomDate(),
          }),
        );
      }
      return Promise.allSettled(r);
    };
    describe('sopakitsAdmin', function () {
      it('잘 동작해야 함', async function () {
        await mongooseCreateSopakits(10);
        await doAdminLogin(agent);
        const request = makeSimpleQuery(agent, 'sopakitsAdmin');
        const result = await request(
          { condition: { page: 1, perpage: 3 } },
          `{total list {
            num
            title
            year
            managing_date
            description
            image_url
            image_alt
            status
          }}`,
        );
        // 기본적으로 정렬이 잘 나야 함.
        console.log(result);
        expect(result.total).to.equal(10);
        expect(result.list.length).to.equal(3);
        expect(new Date(result.list[0].managing_date)).to.be.greaterThan(
          new Date(result.list[1].managing_date),
        );
        expect(new Date(result.list[1].managing_date)).to.be.greaterThan(
          new Date(result.list[2].managing_date),
        );
      });
    });
    describe('sopakits', function () {
      it('잘 되어야 함 & hide 는 나오지 않아야 함.', async function () {
        const r = [];
        for (let i = 0; i < 10; i++) {
          r.push(
            db.createSopakit({
              title: `ho${i}`,
              managing_date: randomDate(),
              status: i % 2 === 0 ? 'show' : 'hide',
            }),
          );
        }
        await Promise.allSettled(r);
        const request = makeSimpleQuery(agent, 'sopakits');
        const result = await request(
          { condition: { page: 0, perpage: 10 } },
          `{total list {
            num
            title
            year
            managing_date
            description
            image_url
            image_alt
            status
          }}`,
        );
        expect(result.total).to.equal(5);
        expect(result.list.length).to.equal(5);
        console.log(result);
      });
    });
    describe('createSopakit', function () {
      it('잘 동작해야 함', async function () {
        await doAdminLogin(agent);

        const mut = makeSimpleMutation(agent, 'createSopakit');
        const res = await mut(
          {
            input: {
              title: 'hi',
              num: '02',
              year: 2020,
              managing_date: new Date('2019-01-01'),
              description: '설명',
              image_url: '이미지 url',
              image_alt: '이미지 alt',
              status: 'show',
            },
          },
          '{success code}',
        );
        console.log(res);
        expect(res.success).to.be.true;
        expect(res.code).to.be.null;

        const found = await model.Sopakit.findOne({ year: 2020 });
        console.log(found);
        expect(found).to.not.be.null;
      });
    });
    describe('updateSopakit', function () {
      it('잘 동작해야 함', async function () {
        await doAdminLogin(agent);
        const doc = await model.Sopakit.create({
          title: 'ho',
          year: 2020,
        });
        const { id } = doc;
        const mut = makeSimpleMutation(agent, 'updateSopakit');
        const res = await mut(
          {
            id,
            input: {
              year: 2021,
            },
          },
          '{success code}',
        );
        expect(res.success).to.be.true;
        expect(res.code).to.be.null;
        const found = await model.Sopakit.findOne({ id });
        expect(found.year).to.equal(2021);
      });
    });
    describe('removeSopakit', function () {
      it('잘 동작해야 함', async function () {
        await doAdminLogin(agent);
        const doc = await model.Sopakit.create({
          title: 'ho',
          year: 2020,
        });
        const { id } = doc;
        const mut = makeSimpleMutation(agent, 'removeSopakit');
        const res = await mut(
          {
            id,
          },
          '{success code}',
        );
        expect(res.success).to.be.true;
        expect(res.code).to.be.null;
        const found = await model.Sopakit.findOne({ id });
        expect(found).to.be.null;
      });
    });
  });
});
