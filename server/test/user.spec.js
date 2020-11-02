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
const passport = require('../auth/passport');
const { resetBehavior } = require('sinon');

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
    wrong_reason
    wrong_pwd_count
    success
    emailVerificationRequired
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
mutation createGuestMutation($email: String!, $pwd: String!, $user_agreed: UserAgreedInput, $debug: Boolean) {
  createGuest(email: $email, pwd: $pwd, user_agreed: $user_agreed, debug: $debug) {
    email
    role
    verified
    has_pwd
    user_agreed {
      privacy
      policy
      advertisement
    }
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

const makePwdForKakaoUserMutation = `
mutation makePwdForKakaoUserMutation($pwd: String!) {
  makePwdForKakaoUser(pwd: $pwd) {
    email
    role
    verified
    has_pwd
  }
}
`;

const updateMeMutation = `
mutation updateMeMutation($userinfo: UpdateMeInput!) {
  updateMe(userinfo: $userinfo) {
    email
    role
    verified
  }
}
`;

const requestVerifyEmailMutation = `
mutation requestVerifyEmailMutation($debug: Boolean) {
  requestVerifyEmail(debug: $debug) {
    success
  }
}
`;

const requestChangePasswordMutation = `
mutation requestChangePasswordMutation($debug: Boolean) {
  requestChangePassword(debug: $debug) {
    success
  }
}
`;
const changePasswordMutation = `
mutation changePasswordMutation($token: String!, $pwd: String!) {
  changePassword(token: $token, pwd: $pwd) {
    success
  }
}
`;

const forceLoginMutation = `
mutation forceLoginMutation($email: String!) {
  forceLogin(email: $email) {
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
    describe('upsertOnlyLogin', function () {
      it('제대로 동작해야 함', async function () {
        await db.upsertOnlyLogin('abc', 'def');
        const login = await model.Login.findOne({ email: 'abc' });
        expect(login.email).to.equal('abc');
        expect(login.pwd).to.be.a('string');
        expect(login.pwd.length).to.be.greaterThan(40);
        expect(login.salt).to.be.a('string');
        expect(login.salt.length).to.be.greaterThan(40);
      });
    });
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
    describe('createToken', function () {
      it('제대로 동작해야 함', async function () {
        await db.createToken('testGuest', 'abcd', 'email_verification');
        const token = await model.Token.findOne().lean().exec();
        expect(token.c_date).to.be.a('Date');
        expect(token.ttl).to.be.a('number');
        expect(token.email).to.be.a('string');
        expect(token.token).to.be.a('string');
        expect(token.purpose).to.be.a('string');
      });
      it('두번 이상 실행된다 하더라도 무조건 하나가 남겨져야 함.', async function () {
        await db.createToken('testGuest', '1', 'email_verification');
        await db.createToken('testGuest', '2', 'change_password');
        await db.createToken('testGuest', '3', 'email_verification');
        await db.createToken('testGuest', '4', 'change_password');
        await db.createToken('testGuest', '5', 'email_verification');
        await db.createToken('testAdmin', '6', 'email_verification');
        const r1 = await model.Token.find({ purpose: 'change_password' })
          .lean()
          .exec();
        const r2 = await model.Token.find({
          email: 'testGuest',
          purpose: 'email_verification',
        })
          .lean()
          .exec();
        const r3 = await model.Token.find({
          email: 'testAdmin',
          purpose: 'email_verification',
        })
          .lean()
          .exec();
        const rall = await model.Token.find().lean().exec();
        // console.log(rall);
        expect(rall.length).to.equal(3);
        expect(r1.length).to.equal(1);
        expect(r2.length).to.equal(1);
        expect(r3.length).to.equal(1);
        expect(r1[0].email).to.equal('testGuest');
        expect(r2[0].email).to.equal('testGuest');
        expect(r3[0].email).to.equal('testAdmin');
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
        expect(user.role).to.equal('GUEST');
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
      it('이미 있는 계정이 인증했든 안했든, 이후 verified가 True 되어야 함.', async function () {
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
        getUserByEmail: sinon.fake(),
        userExists: sinon.fake(),
        createToken: sinon.fake(),
      };
      const mail = {
        sendMail: sinon.fake(),
      };
      beforeEach('매니저들 초기화', function () {
        db.userExists = sinon.fake.returns(true);
      });

      it('함수 호출이 잘 작동해야 함', async function () {
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
        it('계정이 없을 경우 제대로 동작해야 함', async function () {
          const result = await graphqlSuper(agent, userExistsQuery, {
            email: 'abcde',
          });
          const userExistsResult = result.body.data.userExists;
          // console.log(userExistsResult);
          expect(userExistsResult.email).to.be.false;
          expect(userExistsResult.kakao).to.be.false;
          expect(userExistsResult.pwd).to.be.false;
        });
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
        const wrongPasswd = async () => {
          return graphqlSuper(agent, loginMutation, {
            email: 'eszqsc112@naver.com',
            pwd: '13241325',
          });
        };
        beforeEach('기본 유저 생성', async function () {
          await db.createUser('eszqsc112@naver.com', '13241324');
        });
        it('계정 정보가 올바를 때에는 로그인이 성공해야함 (createUser 사용)', async function () {
          const res = await graphqlSuper(agent, loginMutation, {
            email: 'eszqsc112@naver.com',
            pwd: '13241324',
          });
          // console.log(res.body.data);
          const result = res.body.data.login;
          expect(result.user.email).to.equal('eszqsc112@naver.com');
          expect(result.success).to.be.true;
          expect(result.wrong_reason).to.be.null;
        });
        it('이메일이 없을 때 적절하게 처리되어야 함.', async function () {
          const res = await graphqlSuper(agent, loginMutation, {
            email: 'eszqsc112@naver.como',
            pwd: '13241324',
          });
          const result = res.body.data.login;
          // console.log(result);
          expect(result.success).to.be.false;
          expect(result.user).to.be.null;
          expect(result.wrong_reason).to.equal('no_email');
        });
        it('비밀번호가 일치하지 않을 때 적절하게 처리되어야 함.', async function () {
          const res = await graphqlSuper(agent, loginMutation, {
            email: 'eszqsc112@naver.com',
            pwd: '132413244',
          });
          const result = res.body.data.login;
          expect(result.success).to.be.false;
          expect(result.user).to.be.null;
          expect(result.wrong_reason).to.equal('wrong_pwd');
        });
        it('카카오 계정만 있을 때 적절하게 처리되어야 함. (db.upsertKakaoUser 수행)', async function () {
          await db.upsertKakaoUser('eszqsc123@naver.com', { kakao_id: 'ho' });
          const res = await graphqlSuper(agent, loginMutation, {
            email: 'eszqsc123@naver.com',
            pwd: '123',
          });
          const result = res.body.data.login;
          expect(result.success).to.be.false;
          expect(result.user).to.be.null;
          expect(result.wrong_reason).to.equal('only_kakao');
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
        it('supertest 로그인 후 세션 유지가 되어야 함', async function () {
          await graphqlSuper(agent, loginMutation, {
            email: 'eszqsc112@naver.com',
            pwd: '13241324',
          });
          const result = await agent.get('/session');
          expect(result.body.session.passport.user).to.equal(
            'eszqsc112@naver.com',
          );
        });
        it('wrong_pwd_count 제대로 나와야 함.', async function () {
          await wrongPasswd();
          await wrongPasswd();
          const res = await wrongPasswd();
          const result = res.body.data.login;
          // console.log(result);
          expect(result.wrong_pwd_count).to.equal(3);
          expect(result.wrong_reason).to.equal('wrong_pwd');
          expect(result.user).to.be.null;
        });
        it('비밀번호 딱 5번째 틀렸을 때 메세지가 제대로 나와야 함.', async function () {
          await wrongPasswd();
          await wrongPasswd();
          await wrongPasswd();
          await wrongPasswd();
          const res = await wrongPasswd();
          const result = res.body.data.login;
          console.log(result);
          expect(result.wrong_pwd_count).to.equal(5);
          expect(result.wrong_reason).to.equal('too_much_attempt');
          expect(result.user).to.be.null;
        });
        it('비밀번호 5번 틀린 뒤 비번이 맞다 하더라도 성공할 수 없음.', async function () {
          await wrongPasswd();
          await wrongPasswd();
          await wrongPasswd();
          await wrongPasswd();
          await wrongPasswd();
          const res = await graphqlSuper(agent, loginMutation, {
            email: 'eszqsc112@naver.com',
            pwd: '13241324',
          });
          const res2 = await wrongPasswd();
          const result = res.body.data.login;
          const result2 = res.body.data.login;
          // console.log(result);
          expect(result.wrong_pwd_count).to.equal(5);
          expect(result.wrong_reason).to.equal('too_much_attempt');
          expect(result.user).to.be.null;
          expect(result2.wrong_pwd_count).to.equal(5);
          expect(result2.wrong_reason).to.equal('too_much_attempt');
          expect(result2.user).to.be.null;
        });
        it('로그인 성공 시 비밀번호 틀린 횟수가 초기화되어야 함', async function() {
          await wrongPasswd();
          await wrongPasswd();
          await wrongPasswd();
          await graphqlSuper(agent, loginMutation, {
            email: 'eszqsc112@naver.com',
            pwd: '13241324',
          });
          await agent.get('/logout');
          const res = await wrongPasswd();
          const result = res.body.data.login;
          expect(result.wrong_pwd_count).to.equal(1);
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
        it('제대로 동작해야 함', async function () {
          await graphqlSuper(agent, createGuestMutation, {
            email: 'eszqsc112@naver.com',
            pwd: '13241324',
            user_agreed: {
              privacy: true,
              policy: true,
              advertisement: false,
            },
            debug: true,
          });
          const user = await model.User.findOne({
            email: 'eszqsc112@naver.com',
          })
            .lean()
            .exec();
          // expect(user.email).to.equal('eszqsc112@naver.com');
          console.log(user);
          expect(user.role).to.equal('GUEST');
          expect(user.verified).to.equal(false);
          expect(user.has_pwd).to.equal(true);
          expect(user.user_agreed.privacy).to.equal(true);
          expect(user.user_agreed.policy).to.equal(true);
          expect(user.user_agreed.advertisement).to.equal(false);
        });
        it('완료하고 나면 로그인 된 상태여야 함.', async function () {
          await graphqlSuper(agent, createGuestMutation, {
            email: 'eszqsc112@naver.com',
            pwd: '13241324',
            debug: true,
          });
          const result = await agent.get('/session');
          expect(result.body.session.passport.user).to.equal(
            'eszqsc112@naver.com',
          );
        });
      });
      describe('db.upsertKakaoUser > createGuest', function () {
        it('카카오 계정이 있는 상태에서는 계정이 합병되어야 함. (실제 기능으로는 악용의 소지가 있으므로 넣지 않아야 함)', async function () {
          await db.upsertKakaoUser('eszqsc112@naver.com', {
            kakao_access_token: '123',
            kakao_refresh_token: '456',
            kakao_id: '789',
          });
          const res = await graphqlSuper(agent, createGuestMutation, {
            email: 'eszqsc112@naver.com',
            pwd: '13241324',
            debug: true,
          });
          const result = res.body.data.createGuest;
          console.log(result);
          const found = await model.User.findOne({email: 'eszqsc112@naver.com'}).lean().exec();
          const login = await model.Login.findOne({email: 'eszqsc112@naver.com'}).lean().exec();
          expect(login).to.not.be.null;
          expect(login.pwd).to.be.a('string');
          expect(login.salt).to.be.a('string');
          expect(found.verified).to.be.true;
          expect(found.has_pwd).to.be.true;
        });
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
        it('성공했을 시 로그인 상태여야 함 - 불가!!', async function () {
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
      describe('db.upsertKakaoUser > makePwdForKakaoUser', function () {
        it('잘 동작해야 함', async function () {
          await db.upsertKakaoUser('eszqsc112@naver.com', {
            kakao_id: 'hello',
          });
          // todo 어떻게 로그인시키지??
          await graphqlSuper(agent, forceLoginMutation, {
            email: 'eszqsc112@naver.com',
          });
          await graphqlSuper(agent, makePwdForKakaoUserMutation, {
            pwd: '13241324',
          });
          const user = await model.User.findOne({
            email: 'eszqsc112@naver.com',
          })
            .lean()
            .exec();
          const login = await model.Login.findOne({
            email: 'eszqsc112@naver.com',
          })
            .lean()
            .exec();
          expect(user.has_pwd).to.be.true;
          expect(user.verified).to.equal(
            true,
            '여전히 verified 는 true 여야 합니다.',
          );
          expect(login.pwd).to.be.a('string');
          expect(login.salt).to.be.a('string');
        });
      });
      describe('updateMe', function () {
        it('제대로 동작해야 함', async function () {
          await doGuestLogin(agent);
          const result = await graphqlSuper(agent, updateMeMutation, {
            userinfo: {
              default_dest: {
                name: '홍길동',
              },
            },
          });
          const user = await model.User.findOne({ email: 'testGuest' });
          expect(user.default_dest.name).to.equal('홍길동');
        });
      });
      describe('requestVerifyEmail', function () {
        it('제대로 동작해야 함', async function () {
          await doGuestLogin(agent);
          const result = await graphqlSuper(agent, requestVerifyEmailMutation, {
            debug: true,
          });
          const token = await model.Token.find({
            email: 'testGuest',
            purpose: 'email_verification',
          })
            .lean()
            .exec();
          expect(token.length).to.not.equal(0);
        });
      });
      describe('requestChangePassword', function () {
        it('제대로 동작해야 함', async function () {
          await doGuestLogin(agent);
          await model.User.updateOne(
            { email: 'testGuest' },
            { verified: true },
          );
          const result = await graphqlSuper(
            agent,
            requestChangePasswordMutation,
            {
              debug: true,
            },
          );
          const token = await model.Token.find({
            email: 'testGuest',
            purpose: 'change_password',
          });
          expect(token.length).to.not.equal(0);
        });
      });
      describe('changePassword', function () {
        it('제대로 동작해야 함', async function () {
          await model.Token.create({
            token: '123',
            email: 'testGuest',
            purpose: 'change_password',
          });
          const prevLogin = await model.Login.find({ email: 'testGuest' })
            .lean()
            .exec();
          const res = await graphqlSuper(agent, changePasswordMutation, {
            token: '123',
            pwd: 'helloMan',
          });
          const result = res.body.data.changePassword;
          console.log(result);
          expect(result.success).to.be.true;
          const newLogin = await model.Login.find({ email: 'testGuest' })
            .lean()
            .exec();
          console.log(prevLogin);
          console.log(newLogin);
          expect(newLogin.length).to.equal(1);
          expect(newLogin[0].pwd).to.be.a('string');
          expect(newLogin[0].salt).to.be.a('string');
          expect(prevLogin[0].pwd).to.not.equal(newLogin[0].pwd);
          expect(prevLogin[0].salt).to.not.equal(newLogin[0].salt);
        });
        it('토큰이 없을 때 실패해야 함', async function () {
          const res = await graphqlSuper(agent, changePasswordMutation, {
            token: '123',
            pwd: 'helloMan',
          });
          const result = res.body.data.changePassword;
          expect(result.success).to.equal(false);
        });
      });
    });
  });
});
