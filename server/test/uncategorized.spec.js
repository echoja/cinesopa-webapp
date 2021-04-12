/**
 * @file
 * 여기서는 실제 api에 대한 테스트를 진행합니다.
 * db-test와 달리 실제 model을 이용하기 때문에 실제 데이터가 잘 저장되었는지도 테스트 가능합니다.
 * 단, 본래 데이터를 잘 남겨두게 하기 위해서 mongodb의 서버는 테스트용 메모리 서버로 갑니다.
 * 실제 요청 graphql query 도 테스트 가능합니다.
 *
 */

const addContext = require('mochawesome/addContext');
// const request = require('supertest');
// const uuidv4 = require('uuid').v4;
// const passport = require('passport');
const { expect } = require('chai');
// const express = require('express');
// const session = require('express-session');
// const MemoryStore = require('memorystore')(session);
// const mongoose = require('mongoose');
// const { MongoMemoryServer } = require('mongodb-memory-server');

const { db: manager, model } = require('@/loader');
const {
  createPageMutation,
  getPageQuery,
  getPagesQuery,
  removePageMutation,
  updatePageMutation,
  getPageByIdQuery,
} = require('./graphql-request');
// const auth = require('../service/auth');
// const authValidatorMaker = require('../auth/validator');
// const { graphQLServerMiddleware } = require('../graphql');
// const local = require('../auth/local');
// const { noConflict } = require("lodash");
// const { make: makeAuthMiddleware } = require('../auth/auth-middleware');
// const { enumAuthmap } = require('../db/schema/enum');
const { graphqlSuper, createTestServer, doLogin } = require('./tool').default;

// const makeAgent = request.agent;

/**
 * - graphql typedef 및 resolver 필요.
 * - db 세팅. db는 본래 환경과 동일한 db 생성. 즉 모델 및 스키마가 완료되어야 함.
 * - db 세팅법은 `./db.spec.js` 에서 가져옴.
 */
describe('api etc', function () {
  // eslint-disable-next-line mocha/no-setup-in-describe
  const { agent } = createTestServer(this);
});
