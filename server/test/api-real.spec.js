/**
 * @file
 * 여기서는 실제 api에 대한 테스트를 진행합니다.
 * db-test와 달리 실제 model을 이용하기 때문에 실제 데이터가 잘 저장되었는지도 테스트 가능합니다.
 * 단, 본래 데이터를 잘 남겨두게 하기 위해서 mongodb의 서버는 테스트용 메모리 서버로 갑니다.
 * 실제 요청 graphql query 도 테스트 가능합니다.
 *
 */

const addContext = require('mochawesome/addContext');
const request = require('supertest');
const uuidv4 = require('uuid').v4;
const passport = require('passport');
const { expect } = require('chai');
const express = require('express');
const session = require('express-session');
const MemoryStore = require('memorystore')(session);
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

const {
  checkAuthQuery,
  createPageMutation,
  getPageByIdQuery,
  getPageQuery,
  getPagesQuery,
  loginQuery,
  removePageMutation,
  updatePageMutation,
  logoutMeMutation,
  createFilmMutation,
  filmQuery,
  filmsQuery,
  removeFilmMutation,
  updateFilmMutation,
  createPostMutation,
  postAdminQuery,
  postQuery,
  postsAdminQuery,
  postsQuery,
  removePostMutation,
  updatePostMutation,
  boardQuery,
  boardsQuery,
  createBoardMutation,
  removeBoardMutation,
  updateBoardMutation,
} = require('./graphql-request');
const auth = require('../service/auth');
const authValidatorMaker = require('../auth/validator');
const { db: manager, model } = require('../loader');
const { graphQLServerMiddleware } = require('../graphql');
const local = require('../auth/local');
// const { noConflict } = require("lodash");
const { make: makeAuthMiddleware } = require('../auth/auth-middleware');
const { enumAuthmap } = require('../db/schema/enum');
const { graphqlSuper } = require('./tool');

const makeAgent = request.agent;

const doLogin = async (agent, email, pwd) =>
  graphqlSuper(agent, loginQuery, {
    email,
    pwd,
  });

/**
 * - graphql typedef 및 resolver 필요.
 * - db 세팅. db는 본래 환경과 동일한 db 생성. 즉 모델 및 스키마가 완료되어야 함.
 * - db 세팅법은 `./db.spec.js` 에서 가져옴.
 */
describe('REAL API', function () {
  // const model = require("../db/model").make(mongoose);
  /** @type {MongoMemoryServer} */
  let mongod;
  /** @type {import("supertest").SuperAgentTest} */
  let agent;

  /** @type {import("express").Express} */
  let webapp;

  before('서버 및 db 세팅', async function () {
    // delete require.cache[require.resolve('passport')];
    this.timeout(10000);

    webapp = express();

    /** DB 세팅 */

    // manager = makeDB(model);

    mongod = new MongoMemoryServer();
    const uri = await mongod.getUri();
    const mongooseOpts = {
      useNewUrlParser: true,
      // autoReconnect: true,
      // reconnectTries: Number.MAX_VALUE,
      // reconnectInterval: 1000,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    };
    await mongoose.connect(uri, mongooseOpts);
    // const autoIncrement = AutoIncrementFactory(mongoose);
    // autoIncrement.initialize(mongoose.connection);
    // setAutoIncrement(autoIncrement, 'Page', 'id');

    /** 웹앱 세팅 */
    webapp.use(
      session({
        genid: (req) => uuidv4(),
        secret: 'test',
        resave: false,
        saveUninitialized: false,
        store: new MemoryStore(),
        cookie: {
          maxAge: 1000 * 60 * 60 * 24,
        },
      }),
    );
    webapp.use(passport.initialize()); // passport 구동
    webapp.use(passport.session());
    local.init(
      async (email) => {
        // console.log("--userFinder called--");
        const result = await manager.getUserByEmail(email);
        // console.dir(result);
        return result;
      },
      async (email, pwd) => {
        if (await manager.isCorrectPassword(email, pwd)) {
          // console.log(`getUserByAuth successed: email: ${email}, pwd: ${pwd}`);
          const result = await manager.getUserByEmail(email);
          // console.dir(result);
          return result;
        }
        // console.log("getUserByAuth failed");
        return null;
      },
    );
    webapp.use('/graphql', graphQLServerMiddleware);
    webapp.get('/session', (req, res) => {
      res.send({ session: req.session, id: req.sessionID });
    });
    webapp.get('/logout', (req, res, next) => {
      req.logout();
      res.send();
    });
    webapp.get('/user', (req, res, next) => {
      res.send({ user: req.user, isAuthenticated: req.isAuthenticated() });
    });
    const authValidator = authValidatorMaker.make(auth.authmapLevel);
    // console.log("--auth.authmapLevel--");
    // console.dir(auth.authmapLevel);
    webapp.get(
      '/auth-test-admin',
      makeAuthMiddleware(authValidator, [enumAuthmap.ADMIN]),
      (req, res, next) => {
        res.send({ message: 'success' });
      },
    );

    webapp.get(
      '/auth-test-error',
      makeAuthMiddleware(authValidator, 'ADMIN'),
      (req, res, next) => {
        res.send({ message: 'success' });
      },
    );
    agent = makeAgent(webapp);
  });

  beforeEach('유저 세팅', async function () {
    await manager.createUser({
      email: 'testAdmin',
      pwd: 'abc',
      role: 'ADMIN',
    });
    await manager.createUser({
      email: 'testGuest',
      pwd: 'abc',
      role: 'GUEST',
    });
  });

  afterEach('세션 초기화 및 DB 내용 초기화', async function () {
    await agent.get('/logout');
    const { collections } = mongoose.connection;

    const promises = [];
    Object.keys(collections).forEach((key) => {
      const collection = collections[key];
      promises.push(collection.deleteMany());
    });
    await Promise.allSettled(promises);
    // console.log("세션 초기화 및 DB 내용 초기ㅗ하!!!!!");
  });

  after('DB 종료', async function () {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await mongod.stop();
  });

  describe('auth-middleware', function () {
    it('권한이 성공해야 함', async function () {
      const loginResult = await graphqlSuper(agent, loginQuery, {
        email: 'testAdmin',
        pwd: 'abc',
      });

      const result = await agent.get('/auth-test-admin');
      if (result.status === 500) throw result.error;
      expect(result.status).to.equal(200);
      expect(result.body?.message).to.equal('success');
    });
    it('권한이 실패해야 함', function (done) {
      graphqlSuper(agent, loginQuery, {
        email: 'testGuest',
        pwd: 'abc',
      })
        .then((result) => {
          addContext(this, { title: 'Login 결과', value: result.body });
          agent
            .get('/auth-test-admin')
            .expect(401)
            .end((err, res) => {
              if (!err) return done();
              return done(res);
            });
        })
        .catch((err) => {
          done(err);
        });
      // const result = await
      // if (result.status === 500) throw result.error;
      // expect(result.status).to.equal(401);
      // expect(result.body?.message).to.equal("success");
    });
    it('권한이 에러나야 함', function (done) {
      graphqlSuper(agent, loginQuery, {
        email: 'testGuest',
        pwd: 'abc',
      })
        .then(() => {
          agent
            .get('/auth-test-error')
            .expect(200)
            .end((err, res) => {
              if (err) done();
              else done('에러가 나야 합니다.');
            });
        })
        .catch((err) => {
          done(err);
        });
    });
  });

  describe('page', function () {
    // describe.skip("createPage");
    describe('createPage', function () {
      it('제대로 동작해야 함', function (done) {
        model.Page.create({ title: 'hi', content: 'ho' })
          .then((result) => {
            console.log(result);
          })
          .catch((err) => {});
        doLogin(agent, 'testAdmin', 'abc')
          .then(() => {
            // console.log(login);
            graphqlSuper(agent, createPageMutation, {
              permalink: 'hi',
              belongs_to: 'sopaseom',
              pageinfo: {
                title: 'hello',
                content: '<p>hello</p>',
                belongs_to: 'sopaseom.kr',
              },
            })
              .then((result) => {
                addContext(this, {
                  title: 'result',
                  value: result.body.data.createPage,
                });
                expect(result.body.data.createPage.id).to.not.be.null;
                expect(result.body.data.createPage.title).to.equal('hello');
                expect(result.body.data.createPage.content).to.equal(
                  '<p>hello</p>',
                );
                return done();
              })
              .catch((err) => {
                console.error(err);
                return done(err);
              });
          })
          .catch((err) => {
            console.error(err);
            return done(err);
          });
      });
      it('중복되었을 때 에러가 발생해야 함', async function () {
        let err = null;
        let rightCount = 0;
        try {
          const loginResult = await doLogin(agent, 'testAdmin', 'abc');
          addContext(this, { title: 'loginResult', value: loginResult.body });

          const result1 = await graphqlSuper(agent, createPageMutation, {
            permalink: 'hi',
            belongs_to: 'sopaseom',
            pageinfo: { title: 'hi1' },
          });
          rightCount++;
          // console.log(result1.body);
          const result2 = await graphqlSuper(agent, createPageMutation, {
            permalink: 'hi',
            belongs_to: 'sopaseom',
            pageinfo: { title: 'hi2' },
          });
          rightCount++;
          // console.log(result2.body);
          err = null;
        } catch (error) {
          err = error;
        }
        // console.log(err);
        expect(err).to.not.equal(null);
        expect(rightCount).to.equal(1);
      });
      it('권한이 없을 때 아무런 결과도 나오지 않아야 함', function (done) {
        graphqlSuper(agent, createPageMutation, {
          permalink: 'hi',
          belongs_to: 'sopaseom',
          pageinfo: {
            title: 'hello',
            content: '<p>hello</p>',
            belongs_to: 'sopaseom.kr',
          },
        })
          .then((result) => {
            addContext(this, { title: '결과', value: result });
            done(result);
          })
          .catch((err) => {
            done();
          });
      });
    });
    describe('updatePage', function () {
      it('제대로 동작해야 함', async function () {
        try {
          const loginres = await doLogin(agent, 'testAdmin', 'abc');
          addContext(this, { title: 'loginres', value: loginres });
          const managerres = await manager.createPage({
            permalink: 'hello',
            belongs_to: 'sopaseom',
            title: 'hoho',
            id: 100,
          });
          addContext(this, { title: 'managerres', value: managerres });
          const result = await graphqlSuper(agent, updatePageMutation, {
            permalink: 'hello',
            belongs_to: 'sopaseom',
            pageinfo: {
              title: 'mass',
            },
          });
          addContext(this, { title: '결과', value: result });
          const r = await model.Page.find({ id: 1 }).lean().exec();
          console.log(r);
        } catch (error) {
          console.error(error);
          throw error;
        }
      });
      it('권한이 없을 때 아무런 결과도 나오지 않아야 함', function (done) {
        graphqlSuper(agent, updatePageMutation, {
          permalink: 'hi',
          belongs_to: 'sopaseom',
          pageinfo: {
            title: 'hello',
            content: '<p>hello</p>',
            belongs_to: 'sopaseom.kr',
          },
        })
          .then((result) => {
            addContext(this, { title: '결과', value: result });
            // expect(result.body.data.updatePage).to.equal(null);
            done(result);
          })
          .catch((err) => {
            done();
          });
      });
    });
    describe('removePage', function () {
      it('제대로 동작해야 함', async function () {
        try {
          const loginres = await doLogin(agent, 'testAdmin', 'abc');
          addContext(this, { title: 'loginres', value: loginres });
          const managerres = await manager.createPage({
            permalink: 'hello',
            belongs_to: 'sopaseom',
            title: 'hoho',
            id: 100,
          });
          addContext(this, { title: 'managerres', value: managerres });
          const result = await graphqlSuper(agent, removePageMutation, {
            permalink: 'hello',
            belongs_to: 'sopaseom',
          });
          addContext(this, { title: '결과', value: result });
          let found = false;
          manager
            .getPage(100)
            .then((result) => {
              found = true;
            })
            .catch((err) => {
              found = false;
            });
          expect(found).to.be.false;
        } catch (error) {
          console.error(error);
          throw error;
        }
      });
      it('권한이 없을 때 아무런 결과도 나오지 않아야 함', function (done) {
        graphqlSuper(agent, removePageMutation, {
          permalink: 'hi',
          belongs_to: 'sopaseom',
        })
          .then((result) => {
            addContext(this, { title: '결과', value: result });
            done(result);
          })
          .catch((err) => {
            done();
          });
      });
    });
    describe('page (getPage)', function () {
      it('제대로 동작해야 함', async function () {
        try {
          // const loginres = await doLogin(agent, "testAdmin", "abc");
          // addContext(this, { title: "loginres", value: loginres });
          const managerres = await manager.createPage({
            permalink: 'hi',
            belongs_to: 'sopaseom',
            title: 'hoho',
            id: 100,
          });
          // addContext(this, { title: "managerres", value: managerres });
          const result = await graphqlSuper(agent, getPageQuery, {
            permalink: 'hi',
            belongs_to: 'sopaseom',
          });
          // console.dir(result.body);
          addContext(this, { title: '결과', value: result.body });
          // console.log("--result--");
          // console.dir(result.body, {'maxArrayLength': null});
          expect(result.body.data.page.title).to.equal('hoho');
          // console.log(result)
        } catch (error) {
          // console.log("--error show--");
          // console.dir(error, {'maxArrayLength': null});
          addContext(this, { title: '에러', value: error });
          throw error;
        }
      });
    });
    describe('pages', function () {
      it('제대로 동작해야 함', async function () {
        await doLogin(agent, 'testAdmin', 'abc');
        // const promises = [];
        for (let i = 0; i < 30; i++) {
          const p = new model.Page({
            // id: i, // Auto Increment 때문에 무조건 1부터 시작함.
            title: `제목-${i}`,
            belongs_to: 'sopaseom',
          });
          await p.save();
        }
        const result = await graphqlSuper(agent, getPagesQuery, {
          belongs_to: 'sopaseom',
          page: 2,
          perpage: 5,
        });
        const ls = result.body.data.pages;
        expect(ls.length).to.equal(5);
        // console.log(ls);
        expect(ls[0].id).to.equal(11);
        expect(ls[1].id).to.equal(12);
        expect(ls[2].id).to.equal(13);
        expect(ls[4].id).to.equal(15);
      });
    });
    describe('pageById', function () {
      it('제대로 동작해야 함', async function () {
        await doLogin(agent, 'testAdmin', 'abc');
        const page = await model.Page.create({
          id: 132413,
          title: '제목',
          belongs_to: 'sopaseom',
        });
        expect(page.id).to.equal(1); // AutoIncrement 때문에 본래 설정이 무시되고 1부터 설정됨.
        const result = await graphqlSuper(agent, getPageByIdQuery, {
          id: 1,
        });
        expect(result.body.data.pageById.title).to.equal('제목');
      });
      it('페이지가 없으면 결과가 null이어야 함.', async function () {
        await doLogin(agent, 'testAdmin', 'abc');
        const result = await graphqlSuper(agent, getPageByIdQuery, {
          id: 1,
        });
        expect(result.body.data.pageById).to.be.null;
      });
    });
  });

  describe('user', function () {
    describe('users', function () {
      it('제대로 동작해야 함', async function () {
        this.skip();
        await doLogin(agent, 'testAdmin', 'abc');
      });
    });
    describe('user', function () {});
    describe('currentUser', function () {});
  });

  describe('login and logout', function () {
    describe('login', function () {
      it('제대로 동작해야 함', async function () {
        await doLogin(agent, 'testAdmin', 'abc');
        const result = await agent.get('/session');
        expect(result.body.session.cookie).to.be.not.null;
        expect(result.body.session.passport).to.be.not.null;
        expect(result.body.session.passport).to.haveOwnProperty('user');
      });
    });
    describe('logoutMe', function () {
      it('제대로 동작해야 함', async function () {
        await doLogin(agent, 'testAdmin', 'abc');
        await graphqlSuper(agent, logoutMeMutation);

        const result = await agent.get('/session');
        expect(result.body.session.cookie).to.be.not.null;
        expect(result.body.session.passport).to.be.not.null;
        expect(result.body.session.passport).to.not.haveOwnProperty('user');
      });
    });
  });

  describe('checkAuth', function () {
    it('로그인이 되어있지 않으면 LOGIN_REQUIRED 가 나와야 함.', async function () {
      const check = await graphqlSuper(agent, checkAuthQuery, {
        redirectLink: '/',
        role: 'ADMIN',
      });
      expect(check.body.data.checkAuth.permissionStatus).to.equal(
        'LOGIN_REQUIRED',
      );
    });
    it('로그인이 되어 있으나 권한이 없어 NO_PERMISSION이 나와야 함.', async function () {
      await doLogin(agent, 'testGuest', 'abc');
      const check = await graphqlSuper(agent, checkAuthQuery, {
        redirectLink: '/',
        role: 'ADMIN',
      });
      expect(check.body.data.checkAuth.permissionStatus).to.equal(
        'NO_PERMISSION',
      );
    });

    it('상위의 권한이라도 제대로 되어야 함.', async function () {
      await doLogin(agent, 'testAdmin', 'abc');
      const check = await graphqlSuper(agent, checkAuthQuery, {
        redirectLink: '/',
        role: 'GUEST',
      });
      expect(check.body.data.checkAuth.permissionStatus).to.equal('OK');
    });
    it('제대로 되었다면 OK가 나와야 함', async function () {
      await doLogin(agent, 'testGuest', 'abc');
      const check = await graphqlSuper(agent, checkAuthQuery, {
        redirectLink: '/',
        role: 'GUEST',
      });
      expect(check.body.data.checkAuth.permissionStatus).to.equal('OK');
    });
  });

  describe('film영화', function () {
    describe('film', function () {
      it('제대로 동작해야 함', async function () {
        await model.Film.create({ title: '안녕' });
        const result = await graphqlSuper(agent, filmQuery, {
          id: 1,
        });
        expect(result.body.data.film).not.be.null;
      });
      it('존재하지 않을 때 결과가 없어야 함', async function () {
        const result = await graphqlSuper(agent, filmQuery, {
          id: 1,
        });
        expect(result.body.data.film).to.be.null;
      });
    });
    describe('films', function () {
      beforeEach('초기정보 만들기', async function () {
        await model.Film.create({
          title: '안녕',
          prod_date: new Date('2019-12-25'),
          open_date: new Date('2019-12-28'),
          title_en: 'hello',
        });
        await model.Film.create({
          title: '안녕2',
          prod_date: new Date('2020-04-25'),
          open_date: new Date('2020-05-28'),
          title_en: 'hello2',
        });
      });
      it('날짜 조건이 제대로 동작해야 함', async function () {
        const result = await graphqlSuper(agent, filmsQuery, {
          condition: {
            prod_lte: new Date('2019-12-31'),
          },
        });
        // console.log(result.body.data.films);
        expect(result.body.data.films).to.not.be.null;
        expect(result.body.data.films.length).to.equal(1);
      });
      it('검색 조건이 제대로 동작해야 함.1', async function () {
        const result2 = await graphqlSuper(agent, filmsQuery, {
          condition: {
            search: '녕',
          },
        });
        // console.log(result2.body.data.films);
        expect(result2.body.data.films.length).to.equal(2);
      });
      it('검색 조건이 제대로 동작해야 함.2', async function () {
        const result3 = await graphqlSuper(agent, filmsQuery, {
          condition: {
            search: '녕2',
          },
        });
        // console.log(result3.body.data.films);
        expect(result3.body.data.films.length).to.equal(1);
      });
    });
    describe('createfilm', function () {
      it('제대로 동작해야 함', async function () {
        await doLogin(agent, 'testAdmin', 'abc');
        await graphqlSuper(agent, createFilmMutation, {
          input: {
            title: '하이',
            companies: [
              {
                name: '영화배급협동조합 씨네소파',
              },
            ],
            prod_date: new Date('2020-8-1'),
          },
        });
        const found = await model.Film.findOne({ title: '하이' }).lean().exec();
        // console.log(found);

        expect(found.title).to.equal('하이');
        expect(found.companies[0].name).to.equal('영화배급협동조합 씨네소파');
      });
    });
    describe('updatefilm', function () {
      it('제대로 동작해야 함', async function () {
        await doLogin(agent, 'testAdmin', 'abc');
        await model.Film.create({ title: '바뀌기 전' });
        await graphqlSuper(agent, updateFilmMutation, {
          id: 1,
          input: {
            title: '바뀐 후',
          },
        });
        const doc = await model.Film.findOne({ id: 1 });
        expect(doc.title).to.equal('바뀐 후');
      });
    });
    describe('removefilm', function () {
      it('제대로 동작해야 함', async function () {
        await doLogin(agent, 'testAdmin', 'abc');
        await model.Film.create({ title: '바뀌기 전' });
        const removed = await graphqlSuper(agent, removeFilmMutation, {
          id: 1,
        });
        expect(removed.body.data.removeFilm.id).to.equal(1);
        const docs = await model.Film.find();
        expect(docs.length).to.equal(0);
      });
    });
  });

  describe('Post', function () {
    beforeEach('포스트 여러개 세팅', async function () {
      await model.Post.create({
        title: '헬로',
        status: 'public',
      });
      await model.Post.create({
        title: '하읭',
        status: 'private',
      });
    });
    describe('post', function () {
      it('제대로 동작해야 함', async function () {
        const res = await graphqlSuper(agent, postQuery, {
          id: 1,
        });
        expect(res.body.data.post.id).to.equal(1);
        expect(res.body.data.post.title).to.equal('헬로');
      });
      it('private 은 보이지 않아야 함', async function () {
        const res = await graphqlSuper(agent, postQuery, {
          id: 2,
        });
        // console.log(res.body);
        expect(res.body.data.post).to.be.null;
      });
    });
    describe('posts', function () {
      it('private 은 보이지 않아야 함', async function () {
        const onlyPublic = await graphqlSuper(agent, postsQuery, {
          condition: {},
        });
        // console.log(onlyPublic.body);
        expect(onlyPublic.body.data.posts.length).to.equal(1);
      });
    });
    describe('postAdmin', function () {
      it('private 도 제대로 검색되어야 함', async function () {
        await doLogin(agent, 'testAdmin', 'abc');
        const res = await graphqlSuper(agent, postAdminQuery, {
          id: 2,
        });
        expect(res.body.data.postAdmin).to.not.be.null;
      });
    });
    describe('postsAdmin', function () {
      it('모든 게시물이 나와야 함', async function () {
        await doLogin(agent, 'testAdmin', 'abc');
        const all = await graphqlSuper(agent, postsAdminQuery, {
          condition: {},
        });
        // console.log(all.body);
        expect(all.body.data.postsAdmin.length).to.equal(2);
      });
    });
    describe('createPost', function () {
      it('제대로 동작해야 함', async function () {
        await doLogin(agent, 'testAdmin', 'abc');
        const res = await graphqlSuper(agent, createPostMutation, {
          input: { title: '제목이에요', excerpt: '요약입니다' },
        });
        expect(res.body.data.createPost).to.not.be.null;
        const all = await model.Post.find();
        expect(all.length).to.equal(3);
      });
    });
    describe('updatePost', function () {
      it('제대로 동작해야 함', async function () {
        await doLogin(agent, 'testAdmin', 'abc');
        const res = await graphqlSuper(agent, updatePostMutation, {
          id: 1,
          input: {
            title: '이것은 바뀐 제목입니다.',
            excerpt: '새로 생긴 필드',
          },
        });
        // console.log(res.body);
        expect(res.body.data.updatePost).to.not.be.null;
        const found = await model.Post.findOne({ id: 1 }).exec();
        // console.log(found);
        expect(found.title).to.equal('이것은 바뀐 제목입니다.');
        expect(found.excerpt).to.equal('새로 생긴 필드');
      });
    });
    describe('removePost', function () {
      it('제대로 동작해야 함', async function () {
        await doLogin(agent, 'testAdmin', 'abc');
        await graphqlSuper(agent, removePostMutation, {
          id: 1,
        });
        const found = await model.Post.find().exec();
        expect(found.length).to.equal(1);

        const exact = await model.Post.findOne({ id: 1 }).lean().exec();
        expect(exact).to.be.null;
      });
    });
  });

  describe('Board', function () {
    beforeEach('보드 세팅', async function () {
      await model.Board.create({
        title: '제목',
        description: '설명',
        belongs_to: 'cinesopa',
        permalink: 'notice',
      });
    });
    describe('board', function () {
      it('id로 잘 얻어야 함', async function () {
        const res = await graphqlSuper(agent, boardQuery, {
          condition: {
            id: 1,
          },
        });
        // console.log(res.body);
        expect(res.body.data.board).to.not.be.null;
      });
      it('permalink, belongs_to로 잘 얻어야 함.', async function () {
        const res = await graphqlSuper(agent, boardQuery, {
          condition: {
            permalink: 'notice',
            belongs_to: 'cinesopa',
          },
        });
        // console.log(res.body);
        expect(res.body.data.board).to.not.be.null;
      });
    });
    describe('boards', function () {
      it('제대로 작동되어야 함', async function () {
        await doLogin(agent, 'testAdmin', 'abc');
        const res = await graphqlSuper(agent, boardsQuery, {
          belongs_to: 'cinesopa',
        });
        expect(res.body.data.boards.length).to.equal(1);
      });
      it('해당하는 belongs_to가 아닐 경우 결과가 없어야 함', async function () {
        await doLogin(agent, 'testAdmin', 'abc');
        const res = await graphqlSuper(agent, boardsQuery, {
          belongs_to: '없는것',
        });
        expect(res.body.data.boards.length).to.equal(0);
      });
    });
    describe('createBoard', function () {
      it('제대로 작동되어야 함', async function () {
        await doLogin(agent, 'testAdmin', 'abc');
        await graphqlSuper(agent, createBoardMutation, {
          input: {
            title: 'hihello',
          },
        });
        const found = await model.Board.findOne({ title: 'hihello' }).lean().exec();
        console.log(found);
        expect(found).to.not.be.null;
      });
    });
    describe('updateBoard', function () {
      it('제대로 작동되어야 함', async function () {
        await doLogin(agent, 'testAdmin', 'abc');
        await graphqlSuper(agent, updateBoardMutation, {
          id: 1,
          input: {
            title: '변경된 타이틀',
          },
        });

        const found = await model.Board.findOne({ id: 1 }).lean().exec();
        console.log(found);
        expect(found.title).to.equal('변경된 타이틀');
      });
    });
    describe('removeBoard', function () {
      it('제대로 작동되어야 함', async function () {
        await doLogin(agent, 'testAdmin', 'abc');
        await graphqlSuper(agent, removeBoardMutation, {
          id: 1,
        });

        const found = await model.Board.find().lean().exec();
        console.log(found);
        expect(found.length).to.equal(0);
      });
    });
  });
});
