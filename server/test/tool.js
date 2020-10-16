const fs = require('fs');
const axios = require('axios');
const FormData = require('form-data');
const path = require('path');
const sanitizeFilename = require('sanitize-filename');
// eslint-disable-next-line import/no-extraneous-dependencies
const { MongoMemoryServer } = require('mongodb-memory-server');
const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');
const passport = require('passport');
const uuidv4 = require('uuid').v4;
const request = require('supertest');

const auth = require('../service/auth');
const authValidatorMaker = require('../auth/validator');
const {
  db,
  model,
  validator,
  // file: { uploadMiddleware },
} = require('../loader');
const fileManager = require('../manager/file');
const fileServiceMaker = require('../service/file');
const { graphQLServerMiddleware } = require('../graphql');
const local = require('../auth/passport');
const { enumAuthmap } = require('../db/schema/enum');
const { make: makeAuthMiddleware } = require('../auth/auth-middleware');
const {
  // checkAuthQuery,
  // createPageMutation,
  // getPageQuery,
  // getPagesQuery,
  loginQuery,
  // removePageMutation,
  // updatePageMutation,
  // logoutMeMutation,
  // createFilmMutation,
  // filmQuery,
  // filmsQuery,
  // removeFilmMutation,
  // updateFilmMutation,
  // createPostMutation,
  // postAdminQuery,
  // postQuery,
  // postsAdminQuery,
  // postsQuery,
  // removePostMutation,
  // updatePostMutation,
  // boardQuery,
  // boardsQuery,
  // createBoardMutation,
  // removeBoardMutation,
  // updateBoardMutation,
} = require('./graphql-request');

const uploadDest = 'test/uploads';
const uploadField = 'bin';
const fileService = fileServiceMaker.make(
  db,
  fileManager,
  uploadDest,
  uploadField,
);
const { uploadMiddleware, getFileMiddleware } = fileService;
const foldername = 'generated-html';
const makeAgent = request.agent;

/**
 * supertest 의 agent 기반으로 graphql 요청을 보냅니다.
 * 요청주소는 /graphql 로 고정입니다.
 * @param {import("supertest").SuperAgentTest} agent
 * @param {string} query
 * @param {string} variables
 */
const graphqlSuper = async (agent, query, variables) =>
  new Promise((resolve, reject) => {
    agent
      .post('/graphql')
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .withCredentials()
      .send(
        JSON.stringify({
          query,
          variables,
        }),
      )
      .expect(200)
      .end((err, res) => {
        // console.log(`status: ${res.status}`);
        const errors = res?.body?.errors;
        if (errors === null || errors === undefined) return resolve(res);
        return reject(errors);
      });
  });

const doLogin = async (agent, email, pwd) =>
  graphqlSuper(agent, loginQuery, {
    email,
    pwd,
  });

const testDatabaseServer = (hookFunctions) => {
  const mongod = new MongoMemoryServer({ binary: { version: '4.2.9' } });

  hookFunctions.before('db 초기화', async function () {
    // console.log('testDatabaseServer - before!!');
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
  });

  hookFunctions.beforeEach('유저 세팅', async function () {
    // console.log('testDatabaseServer - beforeEach!!');
    await db.createUser({
      email: 'testAdmin',
      pwd: 'abc',
      role: 'ADMIN',
    });
    await db.createUser({
      email: 'testGuest',
      pwd: 'abc',
      role: 'GUEST',
    });
  });

  hookFunctions.afterEach('db 내용 초기화', async function () {
    // console.log('testDatabaseServer - afterEach!!');
    const { collections } = mongoose.connection;

    const promises = [];
    Object.keys(collections).forEach((key) => {
      const collection = collections[key];
      promises.push(collection.deleteMany());
    });
    await Promise.allSettled(promises);
  });

  hookFunctions.after('서버 및 db 종료', async function () {
    // console.log('testDatabaseServer - after!!');
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await mongod.stop();
  });

  return mongod;
};

const initTestServer = (hookFunctions) => {
  // const model = require("../db/model").make(mongoose);

  /** @type {import("express").Express} */
  const webapp = express();
  /** @type {import("supertest").SuperAgentTest} */
  const agent = makeAgent(webapp);
  /** DB 세팅 */
  // delete require.cache[require.resolve('passport')];
  // this.timeout(10000);
  hookFunctions.before('웹서버 초기화', async function () {
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
        // store: new MemoryStore(),
        cookie: {
          maxAge: 1000 * 60 * 60 * 24,
        },
      }),
    );
    webapp.use(passport.initialize()); // passport 구동
    webapp.use(passport.session());
    local.init(db);
    webapp.use('/graphql', graphQLServerMiddleware);

    webapp.get('/session', (req, res) => {
      res.send({ session: req.session, id: req.sessionID });
    });

    webapp.get('/logout', (req, res, next) => {
      req.logout();
      res.send();
    });

    webapp.get('/logintest', (req, res, next) => {
      if (req.isAuthenticated()) {
        res.send({ result: 'authenticated!' });
      } else {
        res.send({ result: 'unauthenticated!' });
      }
    });

    webapp.get('/user', (req, res, next) => {
      res.send({ user: req.user, isAuthenticated: req.isAuthenticated() });
    });
    const authValidator = authValidatorMaker.make(auth.authmapLevel);
    // console.log("--auth.authmapLevel--");
    // console.dir(auth.authmapLevel);

    // 권한 테스트용
    webapp.get(
      '/auth-test-admin',
      makeAuthMiddleware(authValidator, [enumAuthmap.ADMIN]),
      (req, res, next) => {
        res.send({ message: 'success' });
      },
    );

    // 권한 테스트용 (실패)
    webapp.get(
      '/auth-test-error',
      makeAuthMiddleware(authValidator, 'ADMIN'),
      (req, res, next) => {
        res.send({ message: 'success' });
      },
    );

    // 업로드용
    webapp.post(
      '/upload',
      makeAuthMiddleware(validator, [enumAuthmap.ADMIN]),
      uploadMiddleware,
    );
    // 파일 get용.
    webapp.get('/upload/:filename', getFileMiddleware);
  });
  hookFunctions.afterEach('세션 초기화', async function () {
    // console.log('webapp - afterEach!!!');
    await doLogout(agent);
  });

  /** @type {MongoMemoryServer} */
  const mongod = testDatabaseServer(hookFunctions);

  return { mongod, agent, webapp, uploadDest, fileService };
};

const doLogout = async (agent) => {
  await agent.get('/logout');
}

/**
 * @typedef {object} MockFile
 * @property {string} name
 * @property {string} body
 * @property {string} mimeType
 */

module.exports = {
  graphqlSuper,
  doLogin,
  doLogout,
  testDatabaseServer,
  initTestServer,
  /**
   * HTML File 객체를 만듭니다.
   * @param {MockFile} file
   * @returns {File}
   * @deprecated
   */
  createFileFromMockFile(file) {
    const blob = new Blob([file.body], { type: file.mimeType });
    blob.lastModifiedDate = new Date();
    blob.name = file.name;
    return blob;
  },

  /**
   * HTML FileList 객체를 만듭니다.
   * @param {MockFile[]} files
   * @returns {FileList}
   * @deprecated
   */
  createMockFileList(files) {
    const fileList = {
      length: files.length,
      item(index) {
        return fileList[index];
      },
    };
    files.forEach(
      (file, index) => (fileList[index] = createFileFromMockFile(file)),
    );

    return fileList;
  },

  /**
   * 테스트용 html를 만듭니다. 경로는 test 이름 기반입니다. Mocha 전용입니다.
   * 만들어진 html 파일은 직접 삭제하세요. 삭제 코드는 위험하여 넣지 않았습니다.
   * 하위 폴더도 직접 만들어야 합니다. 아니면 에러가 발생합니다. (기본 폴더명: generated-html)
   * @param {Mocha.Context} self 해당하는 테스트에서 this를 넘깁니다.
   * @param {string} html
   * @returns {Promise<void>}
   */
  async makeHtmlReport(self, html) {
    return new Promise((resolve, reject) => {
      const filename = `${sanitizeFilename(self.test.fullTitle())}.html`;
      const fullpath = path.join(__dirname, foldername, filename);
      fs.writeFile(fullpath, html, function (err) {
        if (err) {
          return reject(err);
        }
        return resolve();
      });
    });
  },
  /**
   *
   * @param {string} url
   * @param {FormData} fd
   */
  async upload(url, fd) {
    fd.append('bin', fd);
    return axios.post(url, fd, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
};
