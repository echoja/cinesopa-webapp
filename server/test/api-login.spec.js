/**
 * 본 테스트는 의존성이 많은 테스트입니다.
 * 1. graphQLServerMiddleware 을 받을 수 있어야 합니다. 그래서 express 에서
 * graphql api를 받을 수 있는 endpoint가 존재해야 합니다.
 * 2. graphQLServerMiddleware 를 받으려면 미리 정의된 graphql typedef가 있어야 합니다.
 * - 에러가 나지 않으려면 해당 graphql typedef 에 알맞는 resolver 가 제공되어야 합니다. (기능은 상관없슴)
 * 3. 현재 테스트는 실무에 쓰이는 graphql 및 resolver까지 모두 쓰이므로 자연스럽게 db에 접근하게 됩니다.
 * 로그인 기능은 userFinder에 따라서 db에 접근할 수도 있고, 아닐 수도 있습니다.
 */

/**
 * 로그인 정보가 넘어가는 실행 순서
 * 1. resolvers.js 에서의 resolver
 * 2. auth.js 의 login 함수. context.authenticate 함수로 인수를 넘김
 * 3. local.js 에서 정의한 GraphQLLocalStrategy 객체
 * 4. local.make(...)에서 에서 만든 getUserByAuth 함수
 */

const axios = require('axios').default;
const { expect } = require('chai');
const addContext = require('mochawesome/addContext');

const { db } = require('@/loader');
const {
  graphqlSuper,
  createTestServer,
  makeSimpleQuery,
  makeSimpleMutation,
} = require('./tool').default;

const headers = {
  'Content-Type': 'application/json',
  Accept: 'application/json',
};

const loginResultString = `{
  user {
    email
    role
  }
  redirectLink
  success
  wrong_reason
  wrong_pwd_count
  emailVerificationRequired
  }`

describe('login & logout', function () {
  this.timeout(10000);

  const { agent } = createTestServer(this);
  describe('login', function () {
    beforeEach('기본 유저 생성', async function () {
      await db.createUser('eszqsc112@naver.com', '13241324');
    });
    it('로그인이 성공해야함 (createUser 사용)', async function () {
      const loginReq = makeSimpleMutation(agent, 'login');
      const result = await loginReq(
        { provider: { email: 'eszqsc112@naver.com', pwd: '13241324' } },
        loginResultString,
      );
      // console.log(result.body.data);
      expect(result?.user?.email).to.equal(
        'eszqsc112@naver.com',
      );
    });
    it('이메일 비밀번호가 일치하지 않다면 실패해야 함.', async function () {
      const loginReq = makeSimpleMutation(agent, 'login');
      const result = await loginReq(
        { provider: { email: 'eszqsc112@naver.como', pwd: '13241324' } },
        loginResultString,
      );
      addContext(this, { title: 'log', value: result});
      expect(result.success).to.equal(false);
    });

    it('로그인이 되어있다면 쿠키-세션에서 확인할 수 있어야 함', async function () {

      const loginReq = makeSimpleMutation(agent, 'login');
      const result = await loginReq(
        { provider: { email: 'eszqsc112@naver.com', pwd: '13241324' } },
        loginResultString,
      );
      addContext(this, { title: 'log', value: result});
      const loginResult = await agent.get('/logintest');
      addContext(this, { title: 'log', value: loginResult.body});
      expect(loginResult.body.result).to.equal('authenticated!');
    });
    it('로그인이 안되어 있는 상태를 쿠키-세션에서 체크되어야 함.', async function () {
      const loginResult = await agent.get('/logintest');
      addContext(this, { title: 'log', value: loginResult.body});
      expect(loginResult.body.result).to.equal('unauthenticated!');
    });
    it('supertest 로그인 후 세션 유지가 되어야 함', async function () {
      const loginReq = makeSimpleMutation(agent, 'login');
      const loginResult = await loginReq(
        { provider: { email: 'eszqsc112@naver.com', pwd: '13241324' } },
        loginResultString,
      );
      const result = await agent.get('/session');
      addContext(this, { title: 'log', value: result.body});
      expect(result.body.session.passport.user).to.equal('eszqsc112@naver.com');
    });
  });
});
