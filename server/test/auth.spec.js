/* eslint-disable mocha/no-setup-in-describe */
const sinon = require('sinon');
const { expect } = require('chai');
const userCreator = require('../service/user');
const {
  initTestServer,
  graphqlSuper,
  doAdminLogin,
  doGuestLogin,
  doLogout,
} = require('./tool');

const { model, db } = require('../loader');

const high_symbol = Symbol('HIGH');
const low_symbol = Symbol('LOW');
const mid_symbol = Symbol('MID');

const validator = require('../auth/validator').make({
  [high_symbol]: 22,
  [low_symbol]: 4,
  [mid_symbol]: 18,
});
const { kakaoVerifyFunctionMaker } = require('../auth/strategy/kakao');

describe('auth', function () {
  initTestServer({ before, beforeEach, after, afterEach });
  describe('strategy', function () {
    describe('kakao', function () {
      describe('kakaoVerifyFunction', function () {
        const kakaoVerifyFunction = kakaoVerifyFunctionMaker(db);
        it('존재하는 유저에 대해 제대로 동작해야함.', async function () {
          const done = sinon.fake();
          const goodProfile = {
            _json: {
              id: '123',
              kakao_account: {
                is_email_valid: true,
                is_email_verified: true,
                email: 'testGuest',
              },
            },
          };
          await kakaoVerifyFunction('hi', 'ho', goodProfile, done);
          expect(done.firstCall.args[0]).to.be.null;
          expect(done.firstCall.args[1]).to.be.an('object');
          expect(done.firstCall.args[1].kakao_id).to.equal('123');
          expect(done.firstCall.args[1].kakao_access_token).to.equal('hi');
          expect(done.firstCall.args[1].kakao_refresh_token).to.equal('ho');
        });
        it('is_email_valid 가 false 일때 실패해야 함.', async function () {
          const done = sinon.fake();
          const badInvalidProfile = {
            _json: {
              id: '123',
              kakao_account: {
                is_email_valid: false,
                is_email_verified: true,
                email: 'testGuest',
              },
            },
          };
          await kakaoVerifyFunction(null, null, badInvalidProfile, done);
          expect(done.firstCall.args[0]).to.be.an('Error');
          expect(done.firstCall.args[1]).to.not.be.an('object');
        });
        it('is_email_verified 가 false 일때 실패해야 함.', async function () {
          const done = sinon.fake();
          const badInvalidVerified = {
            _json: {
              id: '123',
              kakao_account: {
                is_email_valid: true,
                is_email_verified: false,
                email: 'testGuest',
              },
            },
          };
          await kakaoVerifyFunction(null, null, badInvalidVerified, done);
          expect(done.firstCall.args[0]).to.be.an('Error');
          expect(done.firstCall.args[1]).to.not.be.an('object');
        });
        it('is_email_verified, is_email_valid 둘 다 false 일 때 실패해야 함.', async function () {
          const done = sinon.fake();
          const badAllProfile = {
            _json: {
              id: '123',
              kakao_account: {
                is_email_valid: false,
                is_email_verified: false,
                email: 'testGuest',
              },
            },
          };
          await kakaoVerifyFunction(null, null, badAllProfile, done);
          expect(done.firstCall.args[0]).to.be.an('Error');
          expect(done.firstCall.args[1]).to.not.be.an('object');
        });
      });
    });
    describe('graphql-local', function () {});
  });
  describe('validator', function () {
    describe('isOK', function () {
      it('권한 가능', async function () {
        // const result = await validator.isOk("HIGH", "MID");
        const result = await validator.isOk(high_symbol, mid_symbol);
        expect(result).equals(true);
      });
      it('권한 일치', async function () {
        // const result = await validator.isOk("HIGH", "HIGH");
        const result = await validator.isOk(high_symbol, high_symbol);
        expect(result).equals(true);
      });
      it('권한 안됨', async function () {
        // const result = await validator.isOk("MID", "HIGH");
        const result = await validator.isOk(mid_symbol, high_symbol);
        expect(result).equals(false);
      });
    });

    describe('accessCheck', function () {
      const onlyLow = [low_symbol, mid_symbol];
      const onlyHigh = [high_symbol];
      const someRedirectLink = 'https://naver.com';
      const testAdminContext = {
        isUnauthenticated: () => false,
        getUser() {
          return {
            role: high_symbol,
          };
        },
        req: {
          session: {
            redirectLink: '',
          },
        },
      };
      const testUserContext = {
        isUnauthenticated: () => false,
        getUser() {
          return {
            role: low_symbol,
          };
        },
        req: {
          session: {
            redirectLink: '',
          },
        },
      };
      const testGuestContext = {
        isUnauthenticated: () => true,
        getUser() {
          return {
            role: '',
          };
        },
        req: {
          session: {
            redirectLink: 'abcde',
          },
        },
      };
      it('어드민은 어드민 페이지에 잘 들어가야 함', async function () {
        const result = await validator.accessCheck(
          someRedirectLink,
          onlyHigh,
          testAdminContext,
        );
        expect(result.permissionStatus).equals('OK');
      });
      it('로그인 안하면 권한이 필요함', async function () {
        const result = await validator.accessCheck(
          someRedirectLink,
          onlyLow,
          testGuestContext,
        );
        expect(result.permissionStatus).equals('LOGIN_REQUIRED');
      });
      it('권한이 낮은 사람도 들어갈 수 있는 페이지가 있음', async function () {
        const result = await validator.accessCheck(
          someRedirectLink,
          onlyLow,
          testUserContext,
        );
        expect(result.permissionStatus).equals('OK');
      });
      it('로그인 해도 권한이 필요함', async function () {
        const result = await validator.accessCheck(
          someRedirectLink,
          onlyHigh,
          testUserContext,
        );
        expect(result.permissionStatus).equals('NO_PERMISSION');
      });
      it('리다이렉트 링크를 빈 칸으로 두면 변경되지 않음', async function () {
        testUserContext.req.session.redirectLink = 'https://naver.com';
        const result = await validator.accessCheck(
          '',
          onlyHigh,
          testUserContext,
        );
        expect(testUserContext.req.session.redirectLink).equals(
          'https://naver.com',
        );
      });
      it('존재하지 않는 available은 에러가 나야함.', function (done) {
        validator
          .accessCheck('', ['WTF'], testUserContext)
          .then((value) => {
            done('성공하면 안됨.');
          })
          .catch((err) => {
            done();
          });
      });
    });

    describe('contains', function () {
      it('포함되어 있을 때 true 되어야 함.', function (done) {
        validator
          .contains(high_symbol, [high_symbol, low_symbol])
          .then((result) => {
            expect(result).to.equal(true);
            done();
          })
          .catch((err) => {
            done(err);
          });
      });
      it('포함되어 있을 때 false 되어야 함.', function (done) {
        validator
          .contains(low_symbol, [high_symbol, mid_symbol])
          .then((result) => {
            expect(result).to.equal(false);
            done();
          })
          .catch((err) => {
            done(err);
          });
      });
      it('condition에 문제가 있을 때 에러가 나야 함.', function (done) {
        validator
          .contains(high_symbol, [high_symbol, 'OO'])
          .then((result) => {
            done(result);
          })
          .catch((err) => {
            done();
          });
      });
    });
  });
});
