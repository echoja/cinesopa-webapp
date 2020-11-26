const fs = require('fs');
const axios = require('axios');
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
const random = require('random');

// const auth = require('../service/auth');
const authValidatorMaker = require('../auth/validator');
const {
  db,
  auth,
  validator,
  // file: { uploadMiddleware },
} = require('../loader');
const fileManager = require('../manager/file');
const fileServiceMaker = require('../service/file');
const { graphQLServerMiddleware } = require('../graphql');
const local = require('../auth/passport');
const { enumAuthmap } = require('../db/schema/enum');
const { make: makeAuthMiddleware } = require('../auth/auth-middleware');
const { loginQuery } = require('./graphql-request');

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
 * @param {object} variables
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

const guestEmail = 'testGuest';
const adminEmail = 'testAdmin';

const doLogin = async (agent, email, pwd) =>
  graphqlSuper(agent, loginQuery, {
    email,
    pwd,
  });
const doAdminLogin = async (agent) =>
  graphqlSuper(agent, loginQuery, {
    email: adminEmail,
    pwd: 'abc',
  });
const doGuestLogin = async (agent) =>
  graphqlSuper(agent, loginQuery, {
    email: guestEmail,
    pwd: 'abc',
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
    await db.createUser(adminEmail, 'abc', {
      role: 'ADMIN',
    });
    await db.createUser(guestEmail, 'abc', {
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
  // timeout(10000);
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
};

/**
 * HTML File 객체를 만듭니다.
 * @param {MockFile} file
 * @returns {File}
 * @deprecated
 */
const createFileFromMockFile = (file) => {
  const blob = new Blob([file.body], { type: file.mimeType });
  blob.lastModifiedDate = new Date();
  blob.name = file.name;
  return blob;
};

/**
 * HTML FileList 객체를 만듭니다.
 * @param {MockFile[]} files
 * @returns {FileList}
 * @deprecated
 */
const createMockFileList = (files) => {
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
};

/**
 * 테스트용 html를 만듭니다. 경로는 test 이름 기반입니다. Mocha 전용입니다.
 * 만들어진 html 파일은 직접 삭제하세요. 삭제 코드는 위험하여 넣지 않았습니다.
 * 하위 폴더도 직접 만들어야 합니다. 아니면 에러가 발생합니다. (기본 폴더명: generated-html)
 * @param {Mocha.Context} self 해당하는 테스트에서 this를 넘깁니다.
 * @param {string} html
 * @returns {Promise<void>}
 */
const makeHtmlReport = async (self, html) => {
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
};

/**
 * 제일 첫 글자를 대문자로 만듭니다.
 * @param {string} s
 */
const capitalize = (s) => {
  if (typeof s !== 'string') return '';
  return s.charAt(0).toUpperCase() + s.slice(1);
};

/**
 * graphql argument 로 들어갈 수 있는 문자열을 생성합니다.
 * @param {Object} obj
 */
const stringify = (obj) => {
  if (obj === null || obj instanceof Date || typeof obj !== 'object') {
    // not an object, stringify using native function
    return JSON.stringify(obj);
  }
  if (Array.isArray(obj)) {
    return `[${obj.map((c) => stringify(c)).join(', ')}]`;
  }
  // Implements recursive object serialization according to JSON spec
  // but without quotes around the keys.
  const props = Object.keys(obj)
    .map((key) => `${key}:${stringify(obj[key])}`)
    .join(', ');
  return `{${props}}`;
};

/**
 * 호호
 * @typedef {Object} GraphQLParamListItem
 * @property {string} varName
 * @property {string} typeName
 */

/**
 * @param {GraphQLParamListItem[]} paramList
 */
const makeOuterParamList = (paramList) => {
  return paramList
    .map((param) => `$${param.varName}: ${param.typeName}`)
    .join(', ');
};
/**
 * @param {GraphQLParamListItem[]} paramList
 */
const makeInnerParamlist = (paramList) => {
  return paramList
    .map((param) => `${param.varName}: $${param.varName}`)
    .join(', ');
};
/**
 * @typedef {Object} CreateQueryStringOption
 * @property {string} type 'query' | 'mutation'
 * @property {GraphQLParamListItem[]} paramList 사용할 파라미터
 * @property {string} resultString 결과 값들 {}로 둘러싸여져 있도록 함.
 */

/**
 * grapql 로 요청하는 쿼리 혹은 뮤테이션 string 을 제작해줍니다.
 * @param {string} reqName
 * @param {CreateQueryStringOption} param1
 */
const makeReqString = (
  reqName,
  { type = 'query', paramList, resultString } = {},
) => {
  if (typeof reqName !== 'string') return '# makeReqString: No reqName Error';
  return `${type} ${reqName}${capitalize(type)}(${makeOuterParamList(
    paramList,
  )}) {
    ${reqName}(${makeInnerParamlist(paramList)}) ${resultString}
  }`;
};

/**
 * 쿼리에 따라 요청하는 graphql 함수를 만들어줍니다.
 * @param {string} reqName
 * @param {CreateQueryStringOption} defs
 */
const makeRequest = (agent, reqName, defs) => {
  return async (args) => {
    const res = await graphqlSuper(agent, makeReqString(reqName, defs), args);
    const result = res.body.data[reqName];
    return result;
  };
};

// simpleRequest${capitalize(endpoint)} { }

/**
 * graphql 자체의 arg 시스템을 쓰지 않고 그냥 간단한 쿼리를 만듭니다.
 * @param {string} endpoint
 * @param {Object.<string, any>} args
 * @param {string} resultString
 */
const makeSimpleRequestString = (endpoint, args, resultString) => {
  const entries = Object.entries(args);
  let argsString = '';
  if (entries.length > 0) {
    argsString = `(${entries
      .map(([key, value]) => `${key}: ${stringify(value)}`)
      .join(', ')})`;
  }

  return `{
   ${endpoint}${argsString} ${resultString}
  }`;
};

/**
 * 간단한 Mutation 요청 함수를 만듭니다.
 * @param {string} endpoint
 */
const makeSimpleMutation = (agent, endpoint) => {
  return async (args, resultString) => {
    const reqStr = `mutation ${endpoint}Mutation ${makeSimpleRequestString(
      endpoint,
      args,
      resultString,
    )}`;
    // console.log("# graphql-client makeSimpleMutation");
    // console.log(reqStr);
    const res = await graphqlSuper(agent, reqStr);
    return res.body.data[endpoint];
  };
};

/**
 * 간단한 Query 요청 함수를 만듭니다.
 * @param {string} endpoint
 */
const makeSimpleQuery = (agent, endpoint) => {
  return async (args, resultString) => {
    const str = `query ${endpoint}Query ${makeSimpleRequestString(
      endpoint,
      args,
      resultString,
    )}`;
    console.log(str);
    const res = await graphqlSuper(agent, str);
    return res.body.data[endpoint];
  };
};

/**
 *
 * @param {string} url
 * @param {FormData} fd
 */
const upload = (url, fd) => {
  fd.append('bin', fd);
  return axios.post(url, fd, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

const randomDate = () => {
  return new Date(
    random.int(1990, 2020),
    random.int(1, 12),
    random.int(1, 20),
  );
};

// /**
//  * @typedef {object} MockFile
//  * @property {string} name
//  * @property {string} body
//  * @property {string} mimeType
//  */

module.exports = {
  adminEmail,
  guestEmail,
  graphqlSuper,
  doAdminLogin,
  doGuestLogin,
  doLogin,
  doLogout,
  testDatabaseServer,
  initTestServer,
  createMockFileList,
  makeHtmlReport,
  capitalize,
  stringify,
  makeReqString,
  makeRequest,
  makeSimpleRequestString,
  makeSimpleMutation,
  makeSimpleQuery,
  upload,
  randomDate,
};
