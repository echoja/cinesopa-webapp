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
const siteOptionsQuery = `
query siteOptionsQuery($names: [String!]!) {
  siteOptions(names: $names) {
    name
    value
    success
    code
  }
}
`;

const siteOptionDoubleQuery = `
query siteOptionDoubleQuery($names: [String!]) {
  siteOption(name: $name)
  siteOption(name:)
}
`;



const setSiteOptionMutation = `
mutation setSiteOptionMutation($name: String!, $value: JSON!) {
  setSiteOption(name: $name, value: $value) {
    success
    code
  }
}
`;

const setSiteOptionsMutation = `
mutation setSiteOptionsMutation($inputs: [SetSiteOptionInput!]!) {
  setSiteOptions(inputs: $inputs) {
    name
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
      it('잘 동작해야 함', async function () {
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
      it('한꺼번에 많이 받아올 수 있어야 함.', async function () {
        this.skip();
        // siteOptions 으로 기능 이전.


        // await model.SiteOption.create({
        //   name: 'hello',
        //   type: 'string',
        //   value: 'superpower',
        // });
        // await model.SiteOption.create({
        //   name: 'hi',
        //   type: 'string',
        //   value: 'superpower22',
        // });
        // const res = await
      });
    });
    describe('siteOptions', function () {
      it('제대로 잘 동작해야 함', async function () {
        await model.SiteOption.create({
          name: 'hello',
          type: 'string',
          value: 'superpower',
        });
        await model.SiteOption.create({
          name: 'hi',
          type: 'string',
          value: 'superpower22',
        });
        const res = await graphqlSuper(agent, siteOptionsQuery, {
          names: ['hello', 'hi'],
        });
        const result = res.body.data.siteOptions;
        // console.log(result);
        expect(result.length).to.equal(2);
        expect(result[0].name).to.equal('hello');
        expect(result[0].value).to.equal('superpower');
        expect(result[1].name).to.equal('hi');
        expect(result[1].value).to.equal('superpower22');
      });
    });
    describe('setSiteOption', function () {
      it('처음부터 아무 것도 없을 때 잘 동작해야 함', async function () {
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
      it('이미 해당 옵션이 있어도 잘 동작해야 함.', async function () {
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
    describe('setSiteOptions', function () {
      it('제대로 동작해야 함', async function () {
        await doAdminLogin(agent);
        await model.SiteOption.create({
          name: 'hello',
          type: 'string',
          value: 'superpower',
        });
        await model.SiteOption.create({
          name: 'hi',
          type: 'string',
          value: 'superpower22',
        });
        const inputs = [
          {
            name: 'newone',
            value: 'one',
          },
          {
            name: 'hello',
            value: '123',
          },
          {
            name: 'hi',
            value: 'superman',
          },
          {
            name: 'newtwo',
            value: 'two',
          },
        ];
        const res = await graphqlSuper(agent, setSiteOptionsMutation, {
          inputs,
        });
        const result = res.body.data.setSiteOptions;
        // console.log(result);
        const all = await model.SiteOption.find().lean().exec();
        // console.log(all);
        expect(all.length).to.equal(4);
        all.forEach((item) => {
          const found = inputs.find((input) => input.name === item.name);
          expect(found.value).to.equal(item.value);
          // console.log("oooo!!");
        });
      });
    });
    describe('setSiteFileOption', function () {
      it('잘 동작해야 함', async function () {
        this.skip();
        // await doAdminLogin(agent);
      });
    });
    describe('removeSiteOption', function () {
      it('잘 동작해야 함', async function () {
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
