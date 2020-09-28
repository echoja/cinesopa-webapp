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
const a = 10;
const request = require('supertest');

const makeAgent = request.agent;
const session = require('express-session');
const MemoryStore = require('memorystore')(session);
const axios = require('axios');
const express = require('express');
const { expect } = require('chai');
const uuidv4 = require('uuid').v4;
const passport = require('passport');

const { graphqlSuper } = require('./tool');
const { graphQLServerMiddleware } = require('../graphql');
const local = require('../auth/local');

const headers = {
  'Content-Type': 'application/json',
  Accept: 'application/json',
};

const loginQuery = `
mutation Login ($email: String!, $pwd: String!) {
  login(provider: {email:$email, pwd: $pwd}) {
    user {
      name
      email
      role
    }
    redirectLink
  }
}
`;

const checkAuthQuery = `
query checkAuth($redirectLink: String!, $role: Permission!) {
  checkAuth(redirectLink:$redirectLink, role: $role) {
    permissionStatus
    user {
      name
      email
      c_date
      role
    }
  }
}
`;
const graphqlRequest = async (url, query, variables) =>
  new Promise((resolve, reject) => {
    axios
      .post(
        url,
        JSON.stringify({
          query,
          variables,
        }),
        {
          headers,
          withCredentials: true,
        },
      )
      .then((value) => {
        const { data } = value;
        if (data) return resolve(data);
        return resolve(data);
      })
      .catch((error) => reject(error));
  });

describe('로그인 및 로그아웃 (권한)', function () {
  this.timeout(10000);

  /** @type {import("supertest").SuperAgentTest} */
  let agent;

  const webapp = express();

  before('웹앱 세팅', async function () {
    delete require.cache[require.resolve('passport')];
    // session settings
    webapp.use(
      session({
        genid: (req) => uuidv4(),
        secret: 'test',
        resave: false,
        saveUninitialized: false,
        store: new MemoryStore(),
        expires: new Date(Date.now() + 30 * 86400 * 1000),
      }),
    );

    const localAuthConfig = local.make(
      async (email) => {
        console.log('first version of localAuthConfig - userFinder called');
        switch (email) {
          case 'eszqsc112@naver.com':
            // console.log("userFinder YES");
            return {
              email,
              msg: 'ok',
            };

          default:
            // console.log("userFinder NO");
            // return {
            //   email: "no...",
            //   msg: "nomsg",
            // };
            return null;
        }
      },
      async function (email, pwd) {
        if (email === 'eszqsc112@naver.com' && pwd === '13241324') {
          // console.log("getUserByAuth YES");
          return { email, name: 'ok' };
        }
        // console.log("getUserBYAuth no..");
        return null;
        // {
        //   return { email: "noemail", name: "no" };
        // }
      },
    );
    webapp.use(passport.initialize()); // passport 구동
    webapp.use(passport.session());
    localAuthConfig();
    webapp.use('/graphql', graphQLServerMiddleware, (err, req, res, next) => {
      if (err) res.status(500).send(err);
      else {
        next();
      }
    });
    webapp.get('/logintest', (req, res, next) => {
      if (req.isAuthenticated()) {
        res.send({ result: 'authenticated!' });
      } else {
        res.send({ result: 'unauthenticated!' });
      }
      // res.send(req.user);
    });
    webapp.get('/session', (req, res) => {
      // console.log(`/session - sessionID: ${req.sessionID}`);
      // console.log(`cookies: ${req.cookies}`);
      res.send(req.session);
    });
    webapp.get('/logout', (req, res, next) => {
      req.logout();
      res.send('yes');
    });
    agent = makeAgent(webapp);
    // server = webapp.listen(parseInt(port));
  });
  after('웹앱 종료', function () {
    // server.close();
  });

  afterEach('세션 초기화', async function () {
    await agent.get('/logout');
  });

  it('로그인 성공 테스트', async function () {
    const result = await graphqlSuper(agent, loginQuery, {
      email: 'eszqsc112@naver.com',
      pwd: '13241324',
    });
    expect(result?.body?.data?.login?.user?.email).to.equal(
      'eszqsc112@naver.com',
    );
    expect(result?.body?.data?.login?.user?.name).to.equal('ok');
  });
  it('로그인 실패 테스트', function (done) {
    graphqlSuper(agent, loginQuery, {
      email: 'eszqsc112@naver.como',
      pwd: '13241324',
    })
      .then((result) => {
        done(`에러가 발생해야 합니다. ==> ${result}`);
      })
      .catch(() => {
        done();
      });
    // console.dir(result);
    // expect(result?.body?.data.login).to.equal(null);
  });

  it('로그인이 되어있는지 체크할 수 있어야함 (성공 케이스)', async function () {
    const result = await graphqlSuper(agent, loginQuery, {
      email: 'eszqsc112@naver.com',
      pwd: '13241324',
    });
    const loginResult = await agent.get('/logintest');
    expect(loginResult.body.result).to.equal('authenticated!');
  });
  it('로그인이 되어있는지 체크할 수 있어야함 (실패 케이스)', async function () {
    const loginResult = await agent.get('/logintest');
    expect(loginResult.body.result).to.equal('unauthenticated!');
  });

  it('supertest 로그인 후 세션 유지 테스트', async function () {
    await graphqlSuper(agent, loginQuery, {
      email: 'eszqsc112@naver.com',
      pwd: '13241324',
    });
    const result = await agent.get('/session');
    expect(result.body?.passport?.user).to.equal('eszqsc112@naver.com');
  });
});
