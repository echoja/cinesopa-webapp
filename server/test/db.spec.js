const { expect } = require('chai');
const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');
const modelMaker = require('../db/model');

const { make: makeDB } = require('../manager/db');
const tool = require('./tool');

describe('실제 모델기반 DB 테스트', function () {
  /** @type {MongoMemoryServer} */
  let mongod;
  /** @type {DBManager} */
  let manager;
  /** @type {Object.<string, Model<MongooseDocument, {}>>} */
  let model;

  before('DB 초기화', async function () {
    // mongoose.deleteModel(/.+/);
    this.timeout(10000);
    model = modelMaker.make(mongoose);
    console.log(model);
    manager = makeDB(model);

    mongod = new MongoMemoryServer();
    const uri = await mongod.getConnectionString();
    const mongooseOpts = {
      useNewUrlParser: true,
      // autoReconnect: true,
      // reconnectTries: Number.MAX_VALUE,
      // reconnectInterval: 1000,
      useUnifiedTopology: true,
    };
    await mongoose.connect(uri, mongooseOpts);
  });

  afterEach('DB 내용 제거', async function () {
    const { collections } = mongoose.connection;

    for (const key in collections) {
      const collection = collections[key];
      await collection.deleteMany();
    }
  });

  after('DB 종료', async function () {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await mongod.stop();
  });

  describe('findMany 테스트', function () {
    it('제대로 작동해야 함', function (done) {
      const newPost = async (title) => {
        const p = model.Post({ title });
        return p.save();
      };
      Promise.allSettled([newPost('1'), newPost('1'), newPost('2')])
        .then((resultho) => {
          manager
            .findMany('Post', { title: '1' })
            .then((result) => {
              expect(result.length).to.equal(2);
              done();
            })
            .catch((err) => {
              done(err);
            });
        })
        .catch((err) => {
          done(err);
        });
    });
  });

  describe('User', function () {
    it('createUser 테스트', async function () {
      await manager.createUser({
        email: 'eszqsc112@naver.com',
        name: '김태훈',
        pwd: '13241324',
      });
      const found = await model.User.find().lean();
      const login = await model.Login.findOne().lean();
      const user = found[0];
      expect(found).to.not.be.a('null');
      expect(user.email).to.equal('eszqsc112@naver.com');
      expect(user.verified).to.equal(false);
      expect(login.pwd).to.be.a('string');
      expect(login.salt).to.be.a('string');
      expect(login.email).to.be.a('string');
    });

    it('createUser - getUserByEmail 테스트', async function () {
      await manager.createUser({
        email: 'eszqsc112@naver.com',
        name: '김태훈',
        pwd: '13241324',
      });
      expect(
        await manager.getUserByEmail('eszqsc112@naver.com'),
        'email 키가 존재해야 함',
      ).to.have.any.keys(['email']);
      expect(
        await manager.getUserByEmail('wierd@naver.com'),
        'email 키가 없어야 함',
      ).to.be.a('null');
    });

    it('isUserExist : False', async function () {
      const result = await manager.isUserExist('eszqsc112@naver.com');
      expect(result).equal(false);
    });

    it('isUserExist : True', async function () {
      await manager.createUser({
        email: 'eszqsc112@naver.com',
        name: '김태훈',
        pwd: '13241324',
      });
      const result = await manager.isUserExist('eszqsc112@naver.com');
      expect(result).equal(true);
    });

    it('createUser후 removeUserByEmail', async function () {
      await manager.createUser({
        email: 'eszqsc112@naver.com',
        name: '김태훈',
        pwd: '13241324',
      });
      await manager.removeUserByEmail('eszqsc112@naver.com');
      const found = await model.User.find().lean();
      expect(found.length).to.equal(0);
    });

    it('updateUser', async function () {
      await manager.createUser({
        email: 'eszqsc112@naver.com',
        name: '김태훈',
        pwd: '13241324',
      });
      await manager.updateUser('eszqsc112@naver.com', { name: '안녕' });
      const user = await manager.getUserByEmail('eszqsc112@naver.com');
      expect(user.name).equal('안녕');
    });
  });

  describe('Password', function () {
    it('유저 생성 후 비번이 같아야 함 - isCorrectPassword', async function () {
      await manager.createUser({
        email: 'eszqsc112@naver.com',
        name: '김태훈',
        pwd: '13241324',
      });
      const result = await manager.isCorrectPassword(
        'eszqsc112@naver.com',
        '13241324',
      );
      expect(result).equal(true);
      await tool.makeHtmlReport(
        this,
        `<!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Document</title>
      </head>
      <body>
        <p>hahaha</p>
      </body>
      </html>`,
      );
    });
    it('유저 생성 후 비번이 틀려야 함 - isCorrectPassword', async function () {
      await manager.createUser({
        email: 'eszqsc112@naver.com',
        name: '김태훈',
        pwd: '13241324',
      });
      const result = await manager.isCorrectPassword(
        'eszqsc112@naver.com',
        '12345678',
      );
      expect(result).equal(false);
    });
  });

  describe('Page', function () {
    it('.createPage', function (done) {
      manager
        .createPage({
          belongs_to: 'cinesopa',
          content: 'ho',
          permalink: 'ha',
        })
        .then(() => {
          model.Page.findOne({ content: 'ho' })
            .then((result) => {
              expect(result.belongs_to).to.equal('cinesopa');
              expect(result.permalink).to.equal('ha');
              done();
            })
            .catch((err) => {
              done(err);
            });
        })
        .catch((err) => {
          done(err);
        });
    });
    it('.getPage', function (done) {
      const p = new model.Page({ title: 'ho', id: 100 });
      p.save()
        .then((result) => {
          manager
            .getPage(100)
            .then((result) => {
              expect(result.title).to.equal('ho');
              done();
            })
            .catch((err) => {
              done(err);
            });
        })
        .catch((err) => {
          done(err);
        });
      // manager.page
    });
    it('.getPages', function (done) {
      const promises = [];
      for (let index = 0; index < 30; index++) {
        const p = new model.Page({
          id: index,
          title: `제목${index}`,
          belongs_to: 'sopaseom',
        });
        promises.push(p.save());
      }
      Promise.allSettled(promises)
        .then((result) => {
          manager
            .getPages('sopaseom', 3, 6)
            .then((result) => {
              // console.log(result);
              expect(result.length).to.equal(6);
              expect(result[0].id).to.equal(18);
              expect(result[3].id).to.equal(21);
              expect(result[5].id).to.equal(23);
              done();
            })
            .catch((err) => {
              done(err);
            });
        })
        .catch((err) => {
          done(err);
        });
    });
    it('.getPageView', async function () {
      const p = new model.Page({
        permalink: 'ho',
        belongs_to: 'sopaseom',
      });
      await p.save();
      const found = await manager.getPageView('ho', 'sopaseom');
      expect(found).to.be.not.null;
    });
    it('.removePage', async function () {
      const p = new model.Page({
        permalink: 'ho',
        belongs_to: 'sopaseom',
        id: 100,
      });
      await p.save();
      await manager.removePage(100);
      const result = await model.Page.find();
      expect(result.length).to.equal(0);
    });
    it('.removePage - 존재하지 않을 때 에러', async function () {
      let err = null;
      try {
        const p = new model.Page({
          permalink: 'ho',
          belongs_to: 'sopaseom',
          id: 100,
        });
        await p.save();
        await manager.removePage(101);
      } catch (error) {
        // console.error(error);
        err = error;
      }
      if (err) console.log(err);
      expect(err).to.be.not.null;
    });
    it('.updatePage', async function () {
      const p = new model.Page({
        permalink: 'ho',
        belongs_to: 'sopaseom',
        id: 100,
      });
      await p.save();
      await manager.updatePage(100, {
        permalink: 'hi',
      });
      const found = await model.Page.findOne({ id: 100 });
      expect(found.permalink).to.equal('hi');
    });
    it('.updatePage 존재하지 않을 때 에러', function (done) {
      const p = new model.Page({
        permalink: 'ho',
        belongs_to: 'sopaseom',
        id: 100,
      });
      p.save()
        .then(() => {
          manager
            .updatePage(101, {
              permalink: 'hi',
            })
            .then(() => {
              done(new Error('에러가 나야 합니다.'));
            })
            .catch(() => {
              done();
            });
        })
        .catch((err) => {
          done(err);
        });
    });
  });
});
