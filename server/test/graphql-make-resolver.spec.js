const { expect } = require('chai');
const expressRequestMock = require('express-request-mock');

const makeResolver = require('@/graphql/make-resolver').default.init('ANYONE');


const reqOther = {
  isUnauthenticated: () => false,
  getUser() {
    /** @type {import('@/typedef').AuthType} */
    const role = 'ANYONE';
    return {
      role,
    };
  },
  async login(user) {
    //
  },
  logout() {
    //
  },
  logOut() {
    //
  },
  isAuthenticated() {
    return true;
  },
  async authenticate(type, credentials) {
    return { user: {} };
  },
};

describe('makeResolver 테스트', function () {
  it('함수를 생성하는 데 아무런 오류가 없어야 함', async function () {
    const a = makeResolver(async (obj, args, context, info) => {
      // blank
    }).only(['ADMIN', 'ANYONE', 'GUEST']);
  });
  it('권한이 포함되지 않음', async function () {
    // this.skip();
    let errored = false;
    let ready = false;
    try {
      const { req } = await expressRequestMock((req, res, next) => {
        res.status(200).send();
      });
      const resolver = makeResolver(
        async (obj, args, context, info) => 'hello',
      ).only(['ADMIN']);
      /** @type {import('@/typedef').CustomPassportContext} */
      const testUserContext = {
        ...reqOther,
        req,
        getUser: () => ({ role: 'ANYONE' }),
      };
      ready = true;
      await resolver({}, {}, testUserContext, {});
    } catch (e) {
      errored = true;
    }
    expect(ready).to.equal(true, '이전 단계까지 잘 수행되어야 함.');
    expect(errored).to.equal(true, '에러가 발생해야 합니다.');
  });
  it('권한이 포함됨', async function () {
    console.log('ho');
    const { req } = await expressRequestMock((req, res, next) => {
      res.status(200).send();
    });
    /** @type {import('@/typedef').CustomPassportContext} */
    const testAdminContext = {
      ...reqOther,
      req,
      getUser: () => ({ role: 'ADMIN' }),
    };
    const resolver = makeResolver(
      async (obj, args, context, info) => 'hello',
    ).only(['ADMIN']);

    await resolver({}, {}, testAdminContext, {});
  });
  it('로그인이 되어있지 않은 사람이 올 수 있음', async function () {
    const { req } = await expressRequestMock((req, res, next) => {
      res.status(200).send();
    });
    /** @type {import('@/typedef').CustomPassportContext} */
    const testAnyoneContext = {
      ...reqOther,
      req,
      getUser: () => ({ role: 'ANYONE' }),
      isUnauthenticated() {
        return false;
      },
    };
    const resolver = makeResolver(
      async (obj, args, context, info) => 'hello',
    ).only(['ANYONE']);
    await resolver({}, {}, testAnyoneContext, {});
  });
  it('로그인하지 않았다면 에러가 일어나야 함', async function () {
    let errored = false;
    let ready = false;
    try {
      const { req } = await expressRequestMock((req, res, next) => {
        res.status(200).send();
      });
      /** @type {import('@/typedef').CustomPassportContext} */
      const testAnyoneContext = {
        ...reqOther,
        req,
        getUser: () => ({ role: 'ADMIN' }),
        /** role 이 어떻게 설정되었든 간에 isUnauthenticated 가 True 이므로 Anyone 으로 간주해야 함. */
        isUnauthenticated() {
          return true; 
        },
      };
      const resolver = makeResolver(
        async (obj, args, context, info) => 'hello',
      ).only(['GUEST', 'ADMIN']);
      ready = true;
      await resolver({}, {}, testAnyoneContext, {});
    } catch (e) {
      errored = true;
    }
    expect(ready).to.equal(true, '이전 단계까지 잘 수행되어야 함.');
    expect(errored).to.equal(true, '에러가 발생해야 합니다.');
  });
});
