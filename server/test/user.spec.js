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

const usersQuery = `
query usersQuery {
  users {
    count
    list {
      email
      role
      verified
    }
    
  }
}
`;
const userQuery = `
query userQuery($email: String!) {
  user(email: $email) {
    email
    role
    verified
  }
}
`;

const currentUserQuery = `
query currentUserQuery {
  currentUser {
    email
    role
    verified
  }
}
`;

const userExistsQuery = `
query userExistsQuery($email: String!) {
  userExists(email: $email) {
    email
    kakao
    pwd
  }
}
`;

const checkAuthQuery = `
query checkAuthQuery($redirectLink: String!, $role: Permission!, $should_verified: Boolean) {
  checkAuth(redirectLink: $redirectLink, role: $role, should_verified: $should_verified) {
    permissionStatus
    emailVerificationRequired
    user {
      email
      role
      verified
    }
  }
}
`;
const loginMutation = `
mutation Login ($email: String!, $pwd: String!) {
  login(provider: {email:$email, pwd: $pwd}) {
    user {
      email
      role
      verified
    }
    redirectLink
  }
}
`;

const logoutMeMutation = `
mutation logoutMeMutation {
  logoutMe {
    email
    role
    verified
  }
}
`;

const createGuestMutation = `
mutation createGuestMutation($email: String!, $pwd: String!, $debug: Boolean) {
  createGuest(email: $email, pwd: $pwd, debug: $debug) {
    email
    role
    verified
    has_pwd
  }
}
`;

const verifyUserEmailMutation = `
mutation verifyUserEmailMutation($token: String!) {
  verifyUserEmail(token: $token) {

      email
      role
      verified
    
  }
}
`;

const updateUserAdminMutation = `
mutation updateUserAdminMutation($email: String!, $userinfo: UpdateUserAdminInput) {
  updateUserAdmin(email: $email, userinfo: $userinfo) {
    email
    role
    verified
  }
}

`;
// createGuest(email: String!, pwd: String!): User
// verifyUserEmail(token: String!): User
// updateUser(email: String!, userinfo: UserUpdateInfo): User

describe('user', function () {
  this.timeout(5000);
  const { agent } = initTestServer({ before, beforeEach, after, afterEach });

  describe('db', function () {
    describe('createUser', function () {
      it('아이디 - 비번 생성이 잘 되어야 함.', async function () {
        const email = 'eszqsc112@naver.com';
        await db.createUser(email, '13241324');
        const user = await model.User.findOne({ email }).lean();
        const login = await model.Login.findOne({ email }).lean();
        expect(user).to.not.be.a('null');
        expect(user.email).to.equal('eszqsc112@naver.com');
        expect(user.verified).to.equal(false);
        expect(login.pwd).to.be.a('string');
        expect(login.salt).to.be.a('string');
        expect(login.email).to.be.a('string');
      });
      it('이미 계정이 있는 상태에서 에러를 일으켜야 함', async function () {
        let errored = false;
        try {
          await db.createUser('testGuest', '13241324');
        } catch (e) {
          errored = true;
        }
        expect(errored).to.be.true;
      });
    });

    describe('upsertKakaoUser', function () {
      it('카카오 계정 생성이 잘 되어야 함.', async function () {
        const email = 'eszqsc112@naver.com';
        await db.upsertKakaoUser(email, {
          kakao_id: 'abc',
          kakao_access_token: 'def',
          kakao_refresh_token: 'ghi',
        });
        const user = await model.User.findOne({ email }).exec();
        expect(user).to.not.be.null;
        expect(user.kakao_id).to.equal('abc');
        expect(user.kakao_access_token).to.equal('def');
        expect(user.kakao_refresh_token).to.equal('ghi');
      });
      it('계정이 이미 있는 상태에서 잘 갱신시켜야 함.', async function () {
        const email = 'testEmail';
        await model.User.create({
          email,
        });
        await db.upsertKakaoUser(email, {
          kakao_id: '123',
          kakao_access_token: '456',
          kakao_refresh_token: '789',
        });

        const users = await model.User.find({ email });
        expect(users.length).to.equal(1);
        expect(users[0].kakao_id).to.equal('123');
        expect(users[0].kakao_access_token).to.equal('456');
        expect(users[0].kakao_refresh_token).to.equal('789');
      });
      it('호출 이후 verified가 True 되어야 함.', async function () {
        const email1 = 'testEmail1';
        const email2 = 'testEmail2';
        await model.User.create({
          email: email1,
        });
        await db.upsertKakaoUser(email1, {
          kakao_id: '123',
          kakao_access_token: '456',
          kakao_refresh_token: '789',
        });
        await db.upsertKakaoUser(email2, {
          kakao_id: '1231',
          kakao_access_token: '4564',
          kakao_refresh_token: '7897',
        });

        const user1 = await model.User.findOne({ email: email1 });
        const user2 = await model.User.findOne({ email: email2 });
        expect(user1.verified).to.be.true;
        expect(user2.verified).to.be.true;
      });
      it('인수를 잘못 넣었을 때 에러가 나야 함.', function (done) {
        db.upsertKakaoUser('abcde')
          .then((result) => {
            done(Error('에러가 나야 합니다.'));
          })
          .catch((err) => {
            done();
          });
      });
    });
    describe('getUserByEmail', function () {
      it('제대로 동작해야 함', async function () {
        await model.User.create({
          email: 'eszqsc112@naver.com',
          pwd: '13241324',
        });
        expect(
          await db.getUserByEmail('eszqsc112@naver.com'),
          'email 키가 존재해야 함',
        ).to.have.any.keys(['email']);
        expect(
          await db.getUserByEmail('wierd@naver.com'),
          'email 키가 없어야 함',
        ).to.be.a('null');
      });
    });
    describe('userExists', function () {
      it('찾을 수 없는 경우 False가 나와야 함', async function () {
        const result = await db.userExists('eszqsc112@naver.com');
        expect(result).equal(false);
      });
      it('찾을 수 있는 경우 True가 나와야 함.', async function () {
        await model.User.create({
          email: 'eszqsc112@naver.com',
          pwd: '13241324',
        });
        const result = await db.userExists('eszqsc112@naver.com');
        expect(result).equal(true);
      });
    });
    describe('removeUserByEmail', function () {
      it('제대로 동작해야 함', async function () {
        const email = 'eszqsc112@naver.com';
        await model.User.create({
          email,
          pwd: '13241324',
        });
        await db.removeUserByEmail(email);
        const found = await model.User.find({ email }).lean();
        expect(found.length).to.equal(0);
      });
    });
    describe('updateUser', function () {
      it('제대로 동작해야 함', async function () {
        const email = 'eszqsc112@naver.com';
        await model.User.create({
          email,
          pwd: '13241324',
        });
        await db.updateUser(email, { wrong_pwd_count: 3 });
        const user = await db.getUserByEmail(email);
        // console.log(user);
        expect(user.wrong_pwd_count).equal(3);
      });
    });
    describe('isCorrectPassword', function () {
      it('createUser - isCorrectPassword : 비밀번호가 잘 맞아야 함', async function () {
        await db.createUser('eszqsc112@naver.com', '13241324');
        const result = await db.isCorrectPassword(
          'eszqsc112@naver.com',
          '13241324',
        );
        expect(result).equal(true);
      });
      it('createUser - isCorrectPassword : 비밀번호가 틀려야 함', async function () {
        await db.createUser('eszqsc112@naver.com', '13241324');
        const result = await db.isCorrectPassword(
          'eszqsc112@naver.com',
          '12345678',
        );
        expect(result).equal(false);
      });
    });
  });
  describe('service', function () {
    describe('.createGuest', function () {
      const db = {
        createUser: sinon.fake(),
        userExists: sinon.fake(),
        createToken: sinon.fake(),
      };
      const mail = {
        sendMail: sinon.fake(),
      };
      beforeEach('매니저들 초기화', function () {
        db.userExists = sinon.fake.returns(true);
      });

      it('잘 작동해야 함', async function () {
        const userserv = userCreator.make(db, mail);
        await userserv.createGuest('test', 'abc');
        const args = db.createUser.args[0];
        expect(args[0]).to.equal('test');
        expect(args[1]).to.equal('abc');
        expect(mail.sendMail.calledOnce).to.be.true;
        expect(mail.sendMail.firstCall.args[0].recipientEmail).to.equal('test');
      });
    });

    describe('.verifyEmail', function () {
      const db = {
        getToken: sinon.fake(),
        getUserByEmail: sinon.fake(),
        updateUser: sinon.fake(),
        removeToken: sinon.fake(),
      };
      const mail = {};
      beforeEach('매니저들 초기화', function () {
        db.getToken = sinon.fake.returns({
          token: '1324',
          email: 'test',
        });
        db.getUserByEmail = sinon.fake.returns({ email: 'test' });
        db.updateUser = sinon.fake.returns({ email: 'test' });
        db.removeToken = sinon.fake();
      });

      it('기본 실행 테스트', async function () {
        const userserv = userCreator.make(db, mail);
        await userserv.verifyEmail('1324');
        expect(db.getToken.calledWith('1324')).to.be.true;
      });
      it('유효기간이 맞지 않으면 오류가 나야 함', function (done) {
        db.getToken = sinon.fake.returns({
          c_date: 5,
          ttl: 10,
        });
        const userserv = userCreator.make(db, mail);
        userserv
          .verifyEmail('1324')
          .then(() => {
            expect(db.removeToken.calledOnce).to.be.true;
            done('에러가 나야 함');
          })
          .catch(() => {
            done();
          });
      });

      it('유효기간이 올바르면 제대로 실행되어야 함.', function (done) {
        const ddate = new Date();
        ddate.setMinutes(ddate.getMinutes() - 10);
        db.getToken = sinon.fake.returns({
          c_date: ddate,
          ttl: 1000,
        });
        const userserv = userCreator.make(db, mail);
        userserv
          .verifyEmail('1324')
          .then((value) => {
            expect(db.removeToken.calledOnce).to.be.true;
            done();
          })
          .catch((err) => {
            done(err);
          });
      });
    });
    describe('.initAdmin', function () {
      const db = {
        createUser: sinon.fake(),
      };
      it('기본 실행', async function () {
        const userserv = userCreator.make(db, {});
        await userserv.initAdmin();
        const { args } = db.createUser.firstCall;
        expect(args[2].role).to.equal('ADMIN');
      });
    });
  });
  describe('api', function () {
    // initTestServer 에서 유저 두 명이 자동으로 추가된다는 사실을 기억해!
    describe('Query', function () {
      describe('users', function () {
        it('제대로 동작해야 함', async function () {
          await model.User.deleteMany({ email: { $ne: 'testAdmin' } });
          await model.User.create({ email: 'abcde' });
          await doAdminLogin(agent);

          const users = await model.User.find();
          expect(users.length).to.equal(2);

          const result = await graphqlSuper(agent, usersQuery);
          const resultUsers = result.body.data.users;
          expect(resultUsers.count).to.equal(2);
          expect(resultUsers.list.length).to.equal(2);
          expect(resultUsers.list[0].email).to.be.string;
          expect(resultUsers.list[1].email).to.be.string;
        });
      });
      describe('user', function () {
        it('제대로 동작해야함.', async function () {
          await doAdminLogin(agent);
          const {
            body: {
              data: { user },
            },
          } = await graphqlSuper(agent, userQuery, {
            email: 'testGuest',
          });
          expect(user.email).to.equal('testGuest');
        });
      });
      describe('currentUser', function () {
        it('로그인 후 제대로 동작해야 함', async function () {
          await doAdminLogin(agent);
          const result1 = await graphqlSuper(agent, currentUserQuery);
          // console.log(result1.body.data.currentUser);
          expect(result1.body.data.currentUser.email).to.equal('testAdmin');
        });
        it('로그인 후 로그아웃 상태면 권한 에러가 떠야 함', function (done) {
          doAdminLogin(agent)
            .then(() => {
              doLogout(agent)
                .then(() => {
                  graphqlSuper(agent, currentUserQuery)
                    .then((result) => {
                      console.log(result);
                      done(Error('에러가 발생하여야 합니다!'));
                    })
                    .catch(() => {
                      done();
                    });
                })
                .catch(() => {});
            })
            .catch(() => {});
        });
        it('로그인, 로그아웃, 다시 로그인 후까지 제대로 동작해야함.', async function () {
          await doAdminLogin(agent);
          await doLogout(agent);
          await doGuestLogin(agent);
          const result3 = await graphqlSuper(agent, currentUserQuery);
          // console.log(result3.body.data.currentUser);
          expect(result3.body.data.currentUser.email).to.equal('testGuest');
        });
      });
      describe('userExists', function () {
        it('일반 계정일 경우 제대로 동작해야 함', async function () {
          const result = await graphqlSuper(agent, userExistsQuery, {
            email: 'testAdmin',
          });
          const userExistsResult = result.body.data.userExists;
          // console.log(userExistsResult);
          expect(userExistsResult.email).to.be.true;
          expect(userExistsResult.kakao).to.be.false;
          expect(userExistsResult.pwd).to.be.true;
        });
      });
      describe('db.upsertKakaoUser > db.userExists', function () {
        it('제대로 동작해야 함.', async function () {
          await db.upsertKakaoUser('eszqsc112@naver.com', { kakao_id: '123' });
          const {
            body: {
              data: { userExists },
            },
          } = await graphqlSuper(agent, userExistsQuery, {
            email: 'eszqsc112@naver.com',
          });
          // console.log(userExists);
          expect(userExists.email).to.be.true;
          expect(userExists.kakao).to.be.true;
          expect(userExists.pwd).to.be.false;
        });
      });
      describe('db.createUser > db.upsertKakaoUser > userExists', function () {
        it('일반 계정 생성 후 db.upsertKakaoUser 이후 제대로 동작해야 함.', async function () {
          await db.createUser('eszqsc112@naver.com', '13241324');
          await db.upsertKakaoUser('eszqsc112@naver.com', { kakao_id: '123' });
          const {
            body: {
              data: { userExists },
            },
          } = await graphqlSuper(agent, userExistsQuery, {
            email: 'eszqsc112@naver.com',
          });
          // console.log(userExists);
          expect(userExists.email).to.be.true;
          expect(userExists.kakao).to.be.true;
          expect(userExists.pwd).to.be.true;
        });
      });
      describe('checkAuth', function () {
        it('로그인 안했을 시, 이메일 인증 필요 없는 페이지에 대해, 제대로 동작해야 함', async function () {
          const {
            body: {
              data: { checkAuth },
            },
          } = await graphqlSuper(agent, checkAuthQuery, {
            redirectLink: '',
            role: 'GUEST',
          });
          expect(checkAuth.permissionStatus).to.equal('LOGIN_REQUIRED');
          expect(checkAuth.emailVerificationRequired).to.be.null;
          expect(checkAuth.user).to.be.null;
        });

        it('로그인 안했을 시, 이메일 인증이 필요할 때, 제대로 동작해야 함', async function () {
          const {
            body: {
              data: { checkAuth },
            },
          } = await graphqlSuper(agent, checkAuthQuery, {
            redirectLink: '',
            role: 'GUEST',
            should_verified: true,
          });
          expect(checkAuth.permissionStatus).to.equal('LOGIN_REQUIRED');
          expect(checkAuth.emailVerificationRequired).to.be.null;
          expect(checkAuth.user).to.be.null;
        });
        it('로그인 O, role O, 이메일 인증 필요O, 현재 이메일 인증 상태 X일 때 제대로 동작해야 함', async function () {
          await model.User.updateOne(
            { email: 'testGuest' },
            { verified: false },
          );
          await doGuestLogin(agent);
          const {
            body: {
              data: { checkAuth },
            },
          } = await graphqlSuper(agent, checkAuthQuery, {
            redirectLink: '',
            role: 'GUEST',
            should_verified: true,
          });
          expect(checkAuth.permissionStatus).to.equal('NO_PERMISSION');
          expect(checkAuth.emailVerificationRequired).to.be.true;
          expect(checkAuth.user).to.not.be.null;
        });

        it('로그인 O, role O, 이메일 인증 필요O, 현재 이메일 인증 상태 O일 때 제대로 동작해야 함', async function () {
          await model.User.updateOne(
            { email: 'testGuest' },
            { verified: true },
          );
          await doGuestLogin(agent);
          const {
            body: {
              data: { checkAuth },
            },
          } = await graphqlSuper(agent, checkAuthQuery, {
            redirectLink: '',
            role: 'GUEST',
            should_verified: true,
          });
          expect(checkAuth.permissionStatus).to.equal('OK');
          expect(checkAuth.emailVerificationRequired).to.be.null;
          expect(checkAuth.user).to.not.be.null;
        });
        it('로그인 O, role O, 이메일 인증 필요X, 현재 이메일 상태 상관없이 OK 되어야 함', async function () {
          await model.User.updateOne(
            { email: 'testGuest' },
            { verified: true },
          );
          await doGuestLogin(agent);
          const result = await graphqlSuper(agent, checkAuthQuery, {
            redirectLink: '',
            role: 'GUEST',
            should_verified: false,
          });
          const { checkAuth } = result.body.data;

          expect(checkAuth.permissionStatus).to.equal('OK');
          expect(checkAuth.emailVerificationRequired).to.be.null;
          expect(checkAuth.user).to.not.be.null;

          await model.User.updateOne(
            { email: 'testGuest' },
            { verified: false },
          );
          const result2 = await graphqlSuper(agent, checkAuthQuery, {
            redirectLink: '',
            role: 'GUEST',
            should_verified: false,
          });
          const { checkAuth: checkAuth2 } = result2.body.data;

          expect(checkAuth2.permissionStatus).to.equal('OK');
          expect(checkAuth2.emailVerificationRequired).to.be.null;
          expect(checkAuth2.user).to.not.be.null;
        });
        it('로그인 O, role X 이면 이메일 인증 상관없이 NO_PERMISSION', async function () {
          await model.User.updateOne(
            { email: 'testGuest' },
            { verified: true },
          );
          await doGuestLogin(agent);
          const {
            body: {
              data: { checkAuth: checkAuth1 },
            },
          } = await graphqlSuper(agent, checkAuthQuery, {
            redirectLink: '',
            role: 'ADMIN',
            should_verified: true,
          });
          const {
            body: {
              data: { checkAuth: checkAuth2 },
            },
          } = await graphqlSuper(agent, checkAuthQuery, {
            redirectLink: '',
            role: 'ADMIN',
            should_verified: false,
          });
          const {
            body: {
              data: { checkAuth: checkAuth3 },
            },
          } = await graphqlSuper(agent, checkAuthQuery, {
            redirectLink: '',
            role: 'ADMIN',
          });
          expect(checkAuth1.permissionStatus).to.equal('NO_PERMISSION');
          expect(checkAuth1.emailVerificationRequired).to.be.false;
          expect(checkAuth1.user).to.not.be.null;
          expect(checkAuth2.permissionStatus).to.equal('NO_PERMISSION');
          expect(checkAuth2.emailVerificationRequired).to.be.false;
          expect(checkAuth2.user).to.not.be.null;
          expect(checkAuth3.permissionStatus).to.equal('NO_PERMISSION');
          expect(checkAuth3.emailVerificationRequired).to.be.false;
          expect(checkAuth3.user).to.not.be.null;
        });
        it('로그인 안했을 시 LOGIN_REQUIRED', async function () {
          const {
            body: {
              data: { checkAuth },
            },
          } = await graphqlSuper(agent, checkAuthQuery, {
            redirectLink: '',
            role: 'ADMIN',
          });
          expect(checkAuth.permissionStatus).to.equal('LOGIN_REQUIRED');
        });
      });
    });
    describe('Mutation', function () {
      describe('login', function () {
        beforeEach('기본 유저 생성', async function () {
          await db.createUser('eszqsc112@naver.com', '13241324');
        });
        it('로그인이 성공해야함 (createUser 사용)', async function () {
          const result = await graphqlSuper(agent, loginMutation, {
            email: 'eszqsc112@naver.com',
            pwd: '13241324',
          });
          console.log(result.body.data);
          expect(result?.body?.data?.login?.user?.email).to.equal(
            'eszqsc112@naver.com',
          );
        });
        it('로그인 실패 테스트', function (done) {
          graphqlSuper(agent, loginMutation, {
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
          const result = await graphqlSuper(agent, loginMutation, {
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
          await graphqlSuper(agent, loginMutation, {
            email: 'eszqsc112@naver.com',
            pwd: '13241324',
          });
          const result = await agent.get('/session');
          expect(result.body.session.passport.user).to.equal(
            'eszqsc112@naver.com',
          );
        });
      });
      describe('logoutMe', function () {
        it('제대로 동작하는지 테스트', async function () {
          await doGuestLogin(agent);
          const result = await graphqlSuper(agent, logoutMeMutation);
          const user = result.body.data.logoutMe;
          expect(user.email).to.equal('testGuest');
        });
        it('로그인하지 않은 상태라면, 에러가 나와야 함.', function (done) {
          graphqlSuper(agent, logoutMeMutation)
            .then(() => {
              done(Error('에러가 나야 합니다!'));
            })
            .catch(() => {
              done();
            });
        });
      });

      describe('createGuest', function () {
        // 이 테스트는 실제 메일을 씁니다!!!
        it('제대로 동작해야 함', async function () {
          await graphqlSuper(agent, createGuestMutation, {
            email: 'eszqsc112@naver.com',
            pwd: '13241324',
            debug: true,
          });
          const user = await model.User.findOne({
            email: 'eszqsc112@naver.com',
          })
            .lean()
            .exec();
          // expect(user.email).to.equal('eszqsc112@naver.com');
          expect(user.role).to.equal('GUEST');
          expect(user.verified).to.equal(false);
          expect(user.has_pwd).to.equal(true);
        });
        it.only('완료하고 나면 로그인 된 상태여야 함.', async function() {
          await graphqlSuper(agent, createGuestMutation, {
            email: 'eszqsc112@naver.com',
            pwd: '13241324',
            debug: true,
          });
          const result = await agent.get('/session');
          expect(result.body.session.passport.user).to.equal(
            'eszqsc112@naver.com',
          );
        })
      });
      describe('verifyUserEmail', function () {
        it('유효기간이 될 경우 제대로 동작해야 함', async function () {
          await model.User.updateOne(
            { email: 'testGuest' },
            { verified: false },
          );
          await model.Token.create({
            token: 'abcde',
            purpose: 'email_verification',
            email: 'testGuest',
            ttl: 1800,
          });
          await graphqlSuper(agent, verifyUserEmailMutation, {
            token: 'abcde',
          });
          const guest = await model.User.findOne({ email: 'testGuest' });
          expect(guest.verified).to.equal(true);
        });
        it('유효기간이 넘을 경우 에러 발생해야 함', function (done) {
          model.User.updateOne({ email: 'testGuest' }, { verified: false })
            .then(() => {
              model.Token.create({
                token: 'abcde',
                purpose: 'email_verification',
                email: 'testGuest',
                ttl: 1800,
                c_date: new Date('2010-10-10'),
              })
                .then(() => {
                  graphqlSuper(agent, verifyUserEmailMutation, {
                    token: 'abcde',
                  })
                    .then((result) => {
                      console.log(result.body.data);
                      done(Error('에러가 발생해야 합니다!!!'));
                    })
                    .catch(() => {
                      model.User.findOne({ email: 'testGuest' })
                        .then((user) => {
                          expect(user.verified).to.be.false;
                          done();
                        })
                        .catch((err) => {
                          done(err);
                        });
                    });
                })
                .catch((err) => {
                  done(err);
                });
            })
            .catch((err) => {
              done(err);
            });
        });
        it('성공했을 시 로그인 상태여야 함 - 불가!!', async function() {
          this.skip();
        });
      });
      describe('updateUserAdmin', function () {
        it('제대로 작동해야 함.', async function () {
          await doAdminLogin(agent);
          const result = await graphqlSuper(agent, updateUserAdminMutation, {
            email: 'testGuest',
            userinfo: {
              default_dest: {
                name: 'hello',
              },
            },
          });
          const user = await model.User.findOne({ email: 'testGuest' });
          expect(user.default_dest.name).to.equal('hello');
        });
        it('권한 없을 시 에러가 나야함.', async function () {
          let errored = false;
          try {
            await graphqlSuper(agent, updateUserAdminMutation, {
              email: 'testGuest',
              userinfo: {
                default_dest: {
                  name: 'hello',
                },
              },
            });
          } catch (e) {
            errored = true;
          }
          expect(errored).to.be.true;
        });
      });
      describe('loginKakao', function () {});
    });

    describe('', function () {});
  });
});
