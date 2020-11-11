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
} = require('./tool');
const { graphql } = require('graphql');
const { model, db } = require('../loader');

const siteOptionQuery = `
query siteOptionQuery($name: String!) {
  siteOption(name: $name)
}
`;

const setSiteOptionMutation = `
mutation setSiteOptionMutation($name: String!, $value: String!) {
  setSiteOption(name: $name, value: $value) {
    success
    code
  }
}
`;

const removeSiteOptionMutation = `
mutation removeSiteOptionMutation($name: String!) {
  removeSiteOption (name: $name) {
    success
    code
  }
}

`;
describe('cartitem', function () {
  // eslint-disable-next-line mocha/no-setup-in-describe
  const { agent } = initTestServer({ before, beforeEach, after, afterEach });
  describe('db', function () {
    describe('setSiteOption', function () {
      it('제대로 동작해야 함 (type: string)', async function () {
        await db.setSiteOption('hello', 'abc', 'string');
        const all = await model.SiteOption.find().lean().exec();
        // console.log(all);
        expect(all.length).to.equal(1);
        expect(all[0].type).to.equal('string');
        expect(all[0].name).to.equal('hello');
        expect(all[0].value).to.equal('abc');
      });
      it('제대로 동작해야 함 (type: file)', async function () {
        await db.setSiteOption('logo', 'fakefilename', 'file');
        const all = await model.SiteOption.find().lean().exec();
        // console.log(all);
        expect(all.length).to.equal(1);
        expect(all[0].type).to.equal('file');
        expect(all[0].name).to.equal('logo');
        expect(all[0].value).to.equal('fakefilename');
      });
      it('이미 존재하는 SiteOption 에 대해 업데이트 되어야 함.', async function () {
        await model.SiteOption.create({
          name: 'hello',
          type: 'string',
          value: 'superpower',
        });
        await db.setSiteOption('hello', 'abc', 'string');
        const all = await model.SiteOption.find().lean().exec();
        // console.log(all);
        expect(all.length).to.equal(1);
        expect(all[0].type).to.equal('string');
        expect(all[0].name).to.equal('hello');
        expect(all[0].value).to.equal('abc');
      });
    });
    describe('getSiteOption', function () {
      it('제대로 동작해야 함', async function () {
        await model.SiteOption.create({
          name: 'hello',
          type: 'string',
          value: 'superpower',
        });
        const option = await db.getSiteOption('hello');
        // console.log(option);
        expect(option.type).to.equal('string');
        expect(option.name).to.equal('hello');
        expect(option.value).to.equal('superpower');
      });
    });
    describe('removeSiteOption', function () {
      it('제대로 동작해야 함', async function () {
        await model.SiteOption.create({
          name: 'hello',
          type: 'string',
          value: 'superpower',
        });
        const result = await db.removeSiteOption('hello');
        // console.log(result);
        const all = await model.SiteOption.find().lean().exec();
        expect(all.length).to.equal(0);
      });
    });
  });
  describe('api', function () {
    describe('siteOption', function () {
      it.only('잘 동작해야 함', async function () {
        await model.SiteOption.create({
          name: 'hello',
          type: 'string',
          value: 'superpower',
        });
        const res = await graphqlSuper(agent, siteOptionQuery, {
          name: 'hello',
        });
        const result = res.body.data.siteOption;
        // console.log(result);
        expect(result).to.equal('superpower');
      });
    });
    describe('setSiteOption', function () {
      it.only('처음부터 아무 것도 없을 때 잘 동작해야 함', async function () {
        await doAdminLogin(agent);
        const res = await graphqlSuper(agent, setSiteOptionMutation, {
          name: 'hello',
          value: 'alli',
        });
        const result = res.body.data.setSiteOption;
        // console.log(result);
        const option = await model.SiteOption.findOne({ name: 'hello' })
          .lean()
          .exec();
        // console.log(option);
        expect(option).to.not.be.null;
        expect(option.value).to.equal('alli');
        expect(option.type).to.equal('string');
      });
      it.only('이미 해당 옵션이 있어도 잘 동작해야 함.', async function () {
        await doAdminLogin(agent);
        await model.SiteOption.create({
          name: 'hello',
          value: 'before',
          type: 'string',
        });
        const res = await graphqlSuper(agent, setSiteOptionMutation, {
          name: 'hello',
          value: 'after',
        });
        const result = res.body.data.setSiteOption;
        // console.log(result);
        const options = await model.SiteOption.find().lean().exec();
        expect(options.length).to.equal(1);
        const option = await model.SiteOption.findOne({ name: 'hello' })
          .lean()
          .exec();
        // console.log(option);
        expect(option).to.not.be.null;
        expect(option.value).to.equal('after');
        expect(option.type).to.equal('string');
      });
    });
    describe('setSiteFileOption', function () {
      it.only('잘 동작해야 함', async function () {
        this.skip();
        // await doAdminLogin(agent);

      });
    });
    describe('removeSiteOption', function () {
      it.only('잘 동작해야 함', async function () {
        await doAdminLogin(agent);
        await model.SiteOption.create({
          name: 'hello',
          value: 'before',
          type: 'string',
        });
        const res = await graphqlSuper(agent, removeSiteOptionMutation, {
          name: 'hello',
        });
        const result = res.body.data.removeSiteOption;
        // console.log(result);
        expect(result.success).to.be.true;

        const found = await model.SiteOption.find().lean().exec();
        // console.log(found);
        expect(found.length).to.equal(0);
      });
    });
  });
});
