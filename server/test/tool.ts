import fs from 'fs';
import path from 'path';
import sanitizeFilename from 'sanitize-filename';
// eslint-disable-next-line import/no-extraneous-dependencies
import { MongoMemoryServer } from 'mongodb-memory-server';
import express, { Router } from 'express';
import session from 'express-session';
import mongoose from 'mongoose';
import passport from 'passport';
import { v4 as uuidv4 } from 'uuid';
import request, { SuperAgentTest } from 'supertest';
import random from 'random';

// const auth = require('../service/auth');
import { make as authValidatorMake } from '@/auth/validator';
import fileManager from '@/manager/file';
import fileServiceMaker from '@/service/file';

// eslint-disable-next-line import/named
import { graphQLServerMiddleware } from '@/graphql';
import local, { configureLocalAuth } from '@/auth/passport-config';
import { makeAuthMiddleware } from '@/auth/middlewares';
import {
  db,
  auth,
  validator,
  // file: { uploadMiddleware },
} from '@/loader';
import { loginQuery } from './graphql-request';

export const uploadDest = 'test/uploads';
export const uploadField = 'bin';
export const fileService = fileServiceMaker.make(
  db,
  fileManager,
  uploadDest,
  uploadField,
);
export const { uploadMiddleware, getFileMiddleware } = fileService;
export const foldername = 'generated-html';
export const makeAgent = request.agent;

/**
 * supertest 의 agent 기반으로 graphql 요청을 보냅니다.
 * 요청주소는 /graphql 로 고정입니다.
 * @param {import("supertest").SuperAgentTest} agent
 * @param {string} query
 * @param {object} variables
 */
export const graphqlSuper = async (
  agent: SuperAgentTest,
  query: string,
  // eslint-disable-next-line @typescript-eslint/ban-types
  variables: object = {},
): Promise<request.Response> =>
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

export const guestEmail = 'testGuest';
export const adminEmail = 'testAdmin';

export const doLogin = async (agent, email, pwd) =>
  graphqlSuper(agent, loginQuery, {
    email,
    pwd,
  });

export const doLogout = async (agent) => {
  await agent.get('/logout');
};

export const doAdminLogin = async (agent) => {
  if (!agent) throw Error('agent 가 설정되지 않았습니다.');
  return graphqlSuper(agent, loginQuery, {
    email: adminEmail,
    pwd: 'abc',
  });
};
export const doGuestLogin = async (agent) => {
  if (!agent) throw Error('agent 가 설정되지 않았습니다.');
  return graphqlSuper(agent, loginQuery, {
    email: guestEmail,
    pwd: 'abc',
  });
};

/**
 *
 * @param {Mocha.Suite} hookFunctions
 */
export const testDatabaseServer = (hookFunctions) => {
  const mongod = new MongoMemoryServer({ binary: { version: 'latest' } });

  hookFunctions.timeout(1000000);
  hookFunctions.beforeAll('db 초기화', async function () {
    // console.log('testDatabaseServer - before!!');
    const uri = await mongod.getUri();
    // console.log(uri);
    /** @type {mongoose.ConnectOptions} */
    const mongooseOpts = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    };
    // console.log('과연 연결이 될까?');
    await mongoose.connect(uri, mongooseOpts);
    // console.log('과연 연결이 되었다!');
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
      promises.push(collection.deleteMany({}));
    });
    await Promise.allSettled(promises);
  });

  hookFunctions.afterAll('서버 및 db 종료', async function () {
    // console.log('testDatabaseServer - after!!');
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await mongod.stop();
  });

  return mongod;
};

/**
 * this 를 넘겨wnaustj createTestServer 수행
 * @param {Mocha.Suite} hookFunctions
 */
export const createTestServer = (hookFunctions: Mocha.Suite, options: {additional_router?: Router} = {}) => {
  // const model = require("../db/model").make(mongoose);

  /** @type {import("express").Express} */
  const webapp = express();
  /** @type {import("supertest").SuperAgentTest} */
  const agent = makeAgent(webapp);
  /** DB 세팅 */
  // delete require.cache[require.resolve('passport')];

  hookFunctions.beforeAll('웹서버 초기화', async function () {
    // const autoIncrement = AutoIncrementFactory(mongoose);
    // autoIncrement.initialize(mongoose.connection);
    // setAutoIncrement(autoIncrement, 'Page', 'id');

    /** 웹앱 세팅 */
    webapp.use(
      session({
        genid: () => uuidv4(),
        secret: 'test',
        resave: false,
        saveUninitialized: false,
        // store: new MemoryStore(),
        cookie: {
          maxAge: 1000 * 60 * 60 * 24,
        },
      }),
    );
    configureLocalAuth(passport, db);
    webapp.use(passport.initialize()); // passport 구동
    webapp.use(passport.session());
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
    const authValidator = authValidatorMake(auth.authmapLevel);
    // console.log("--auth.authmapLevel--");
    // console.dir(auth.authmapLevel);

    // 권한 테스트용
    webapp.get(
      '/auth-test-admin',
      makeAuthMiddleware(authValidator, ['ADMIN']),
      (req, res, next) => {
        res.send({ message: 'success' });
      },
    );

    // 권한 테스트용 (실패)
    webapp.get(
      '/auth-test-error',
      makeAuthMiddleware(authValidator, ['ADMIN']),
      (req, res, next) => {
        res.send({ message: 'success' });
      },
    );

    // 업로드용
    webapp.post(
      '/upload',
      makeAuthMiddleware(validator, ['ADMIN']),
      uploadMiddleware,
    );
    // 파일 get용.
    webapp.get('/upload/:filename', getFileMiddleware);

    // 추가적인 router
    if (options.additional_router) {
      webapp.use(options.additional_router);
    }
  });
  hookFunctions.afterEach('세션 초기화', async function () {
    // console.log('webapp - afterEach!!!');
    await doLogout(agent);
  });

  const mongod: MongoMemoryServer = testDatabaseServer(hookFunctions);

  return { mongod, agent, webapp, uploadDest, fileService };
};

/**
 * 테스트용 html를 만듭니다. 경로는 test 이름 기반입니다. Mocha 전용입니다.
 * 만들어진 html 파일은 직접 삭제하세요. 삭제 코드는 위험하여 넣지 않았습니다.
 * 하위 폴더도 직접 만들어야 합니다. 아니면 에러가 발생합니다. (기본 폴더명: generated-html)
 * @param {Mocha.Context} self 해당하는 테스트에서 this를 넘깁니다.
 * @param {string} html
 * @returns {Promise<void>}
 */
export const makeHtmlReport = async (self, html) =>
  new Promise<void>((resolve, reject) => {
    const filename = `${sanitizeFilename(self.test.fullTitle())}.html`;
    const fullpath = path.join(__dirname, foldername, filename);
    fs.writeFile(fullpath, html, function (err) {
      if (err) {
        return reject(err);
      }
      return resolve();
    });
  });

/**
 * 제일 첫 글자를 대문자로 만듭니다.
 * @param {string} s
 */
export const capitalize = (s) => {
  if (typeof s !== 'string') return '';
  return s.charAt(0).toUpperCase() + s.slice(1);
};

/**
 * graphql argument 로 들어갈 수 있는 문자열을 생성합니다.
 * @param {Object} obj
 */
export const stringify = (obj) => {
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
export const makeOuterParamList = (paramList) =>
  paramList.map((param) => `$${param.varName}: ${param.typeName}`).join(', ');
/**
 * @param {GraphQLParamListItem[]} paramList
 */
export const makeInnerParamlist = (paramList) =>
  paramList.map((param) => `${param.varName}: $${param.varName}`).join(', ');
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
export const makeReqString = (
  reqName,
  { type = 'query', paramList, resultString },
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
export const makeRequest = (agent, reqName, defs) => async (args) => {
  const res = await graphqlSuper(agent, makeReqString(reqName, defs), args);
  const result = res.body.data[reqName];
  return result;
};

// simpleRequest${capitalize(endpoint)} { }

/**
 * graphql 자체의 arg 시스템을 쓰지 않고 그냥 간단한 쿼리를 만듭니다.
 * @param {string} endpoint
 * @param {Object.<string, any>} args
 * @param {string} resultString
 */
export const makeSimpleRequestString = (endpoint, args, resultString) => {
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
export const makeSimpleMutation = (
  agent: SuperAgentTest,
  endpoint: string,
) => async (args: any, resultString: string): Promise<any> => {
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

/**
 * 간단한 Query 요청 함수를 만듭니다.
 * @param {string} endpoint
 */
export function makeSimpleQuery<Args = any, Result = any>(
  agent: SuperAgentTest,
  endpoint: string,
) {
  return async (args: Args, resultString: string): Promise<Result> => {
    const str = `query ${endpoint}Query ${makeSimpleRequestString(
      endpoint,
      args,
      resultString,
    )}`;
    // console.log(str);
    const res = await graphqlSuper(agent, str);
    return res.body.data[endpoint];
  };
}

// /**
//  *
//  * @param {string} url
//  * @param {FormData} fd
//  */
// const upload = (url, fd) => {
//   fd.append('bin', fd);
//   return axios.post(url, fd, {
//     headers: {
//       'Content-Type': 'multipart/form-data',
//     },
//   });
// };

export const randomDate = () =>
  new Date(random.int(1990, 2020), random.int(1, 12), random.int(1, 20));

/**
 * 폴더 안의 파일들을 삭제합니다.
 * @param {string} directory 폴더의 경로
 */
export const clearDirectory = async (directory) => {
  const files = await fs.promises.readdir(directory);
  const removePromises = files.map((file) =>
    fs.promises.unlink(path.join(directory, file)),
  );
  await Promise.allSettled(removePromises);
};

// /**
//  * @typedef {object} MockFile
//  * @property {string} name
//  * @property {string} body
//  * @property {string} mimeType
//  */

export default {
  adminEmail,
  guestEmail,
  graphqlSuper,
  doAdminLogin,
  doGuestLogin,
  doLogin,
  doLogout,
  testDatabaseServer,
  createTestServer,
  makeHtmlReport,
  capitalize,
  stringify,
  makeReqString,
  makeRequest,
  makeSimpleRequestString,
  makeSimpleMutation,
  makeSimpleQuery,
  randomDate,
  clearDirectory,
};
