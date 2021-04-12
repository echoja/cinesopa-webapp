/* eslint-disable mocha/no-setup-in-describe */
const sinon = require('sinon');
const { expect } = require('chai');
const { model, db } = require('@/loader');
const addContext = require('mochawesome/addContext');
const userCreator = require('@/service/user');
const validator = require('@/auth/validator').make({
  ADMIN: 3,
  ANYONE: 1,
  GUEST: 2,
});
const { kakaoVerifyFunctionMaker } = require('@/auth/strategy/kakao');
const {
  createTestServer,
  graphqlSuper,
  doAdminLogin,
  doGuestLogin,
  doLogout,
} = require('./tool').default;
const { logoutMeMutation, checkAuthQuery, loginQuery } = require('./graphql-request');


describe('auth', function () {
  const {agent} = createTestServer(this);
  describe('login and logout', function () {
    describe('login', function () {
      it('제대로 동작해야 함', async function () {
        await doAdminLogin(agent);
        const result = await agent.get('/session');
        expect(result.body.session.cookie).to.be.not.null;
        expect(result.body.session.passport).to.be.not.null;
        expect(result.body.session.passport).to.haveOwnProperty('user');
      });
    });
    describe('logoutMe', function () {
      it('제대로 동작해야 함', async function () {
        await doAdminLogin(agent);
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
      await doGuestLogin(agent);
      const check = await graphqlSuper(agent, checkAuthQuery, {
        redirectLink: '/',
        role: 'ADMIN',
      });
      expect(check.body.data.checkAuth.permissionStatus).to.equal(
        'NO_PERMISSION',
      );
    });

    it('상위의 권한이라도 제대로 되어야 함.', async function () {
      await doAdminLogin(agent);
      const check = await graphqlSuper(agent, checkAuthQuery, {
        redirectLink: '/',
        role: 'GUEST',
      });
      expect(check.body.data.checkAuth.permissionStatus).to.equal('OK');
    });
    it('제대로 되었다면 OK가 나와야 함', async function () {
      await doGuestLogin(agent);
      const check = await graphqlSuper(agent, checkAuthQuery, {
        redirectLink: '/',
        role: 'GUEST',
      });
      expect(check.body.data.checkAuth.permissionStatus).to.equal('OK');
    });
  });

  describe('auth-middleware', function () {
    it('권한이 성공해야 함', async function () {
    await doAdminLogin(agent);
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
              else done(new Error('에러가 나야 합니다.'));
            });
        })
        .catch((err) => {
          done(err);
        });
    });
  });

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
    describe('graphql-local', function () {
      it('제대로 동작해야 함', function () { 
        this.skip();
      });
    });
  });
  describe('validator', function () {
    describe('isOK', function () {
      it('권한 가능', async function () {
        // const result = await validator.isOk("HIGH", "MID");
        const result = await validator.isOk('ADMIN', 'GUEST');
        expect(result).equals(true);
      });
      it('권한 일치', async function () {
        // const result = await validator.isOk("HIGH", "HIGH");
        const result = await validator.isOk('ADMIN', 'ADMIN');
        expect(result).equals(true);
      });
      it('권한 안됨', async function () {
        // const result = await validator.isOk("MID", "HIGH");
        const result = await validator.isOk('GUEST', 'ADMIN');
        expect(result).equals(false);
      });
    });

    describe('contains', function () {
      it('포함되어 있을 때 true 되어야 함.', function (done) {
        validator
          .contains('ADMIN', ['ADMIN', 'ANYONE'])
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
          .contains('ANYONE', ['ADMIN', 'GUEST'])
          .then((result) => {
            expect(result).to.equal(false);
            done();
          })
          .catch((err) => {
            done(err);
          });
      });
    });
  });
});
