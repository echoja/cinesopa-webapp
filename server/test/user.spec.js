/* eslint-disable mocha/no-setup-in-describe */
const sinon = require('sinon');
const { expect } = require('chai');
const userCreator = require('../service/user');
const { initTestServer, graphqlSuper, doLogin, doLogout } = require('./tool');
const { graphql } = require('graphql');
const { model, db } = require('../loader');

describe('user', function () {
  const { agent } = initTestServer({ before, beforeEach, after, afterEach });
  describe('db', function () {
    describe('createUser', function () {
      it('아이디 - 비번 생성이 잘 되어야 함.', async function () {
        const email = 'eszqsc112@naver.com';
        await db.createUser({ email, name: '김태훈', pwd: '13241324' });
        const user = await model.User.findOne({ email }).lean();
        const login = await model.Login.findOne().lean();
        expect(user).to.not.be.a('null');
        expect(user.email).to.equal('eszqsc112@naver.com');
        expect(user.verified).to.equal(false);
        expect(login.pwd).to.be.a('string');
        expect(login.salt).to.be.a('string');
        expect(login.email).to.be.a('string');
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
          name: '김태훈',
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
    describe('isUserExist', function () {
      it('찾을 수 없는 경우 False가 나와야 함', async function () {
        const result = await db.isUserExist('eszqsc112@naver.com');
        expect(result).equal(false);
      });
      it('찾을 수 있는 경우 True가 나와야 함.', async function () {
        await model.User.create({
          email: 'eszqsc112@naver.com',
          name: '김태훈',
          pwd: '13241324',
        });
        const result = await db.isUserExist('eszqsc112@naver.com');
        expect(result).equal(true);
      });
    });
    describe('removeUserByEmail', function () {
      it('제대로 동작해야 함', async function () {
        const email = 'eszqsc112@naver.com';
        await model.User.create({
          email,
          name: '김태훈',
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
          name: '김태훈',
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
        await db.createUser({
          email: 'eszqsc112@naver.com',
          name: '김태훈',
          pwd: '13241324',
        });
        const result = await db.isCorrectPassword(
          'eszqsc112@naver.com',
          '13241324',
        );
        expect(result).equal(true);
      });
      it('createUser - isCorrectPassword : 비밀번호가 틀려야 함', async function () {
        await db.createUser({
          email: 'eszqsc112@naver.com',
          name: '김태훈',
          pwd: '13241324',
        });
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
        isUserExist: sinon.fake(),
        createEmailVerificationToken: sinon.fake(),
      };
      const mail = {
        sendMail: sinon.fake(),
      };
      beforeEach('매니저들 초기화', function () {
        db.isUserExist = sinon.fake.returns(true);
      });

      it('기본실행', async function () {
        const userserv = userCreator.make(db, mail);
        await userserv.createGuest('test', 'abc');
        const firstArgs = db.createUser.args[0][0];
        expect(firstArgs.email).to.equal('test');
        expect(firstArgs.pwd).to.equal('abc');
        expect(firstArgs.role).to.equal('GUEST');
        expect(firstArgs.verified).to.equal(false);
        expect(mail.sendMail.calledOnce).to.be.true;
        expect(mail.sendMail.firstCall.args[0].recipientEmail).to.equal('test');
      });
    });

    describe('.verifyEmail', function () {
      const db = {
        getEmailVerificationToken: sinon.fake(),
        getUserByEmail: sinon.fake(),
        updateUser: sinon.fake(),
        removeToken: sinon.fake(),
      };
      const mail = {};
      beforeEach('매니저들 초기화', function () {
        db.getEmailVerificationToken = sinon.fake.returns({
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
        expect(db.getEmailVerificationToken.calledWith('1324')).to.be.true;
      });
      it('유효기간이 맞지 않으면 오류가 나야 함', function (done) {
        db.getEmailVerificationToken = sinon.fake.returns({
          c_date: 5,
          ttl: 10,
        });
        const userserv = userCreator.make(db, mail);
        userserv
          .verifyEmail('1324')
          .then((value) => {
            expect(db.removeToken.calledOnce).to.be.true;
            done('에러가 나야 함');
          })
          .catch((err) => {
            done();
          });
      });

      it('유효기간이 올바르면 제대로 실행되어야 함.', function (done) {
        const ddate = new Date();
        ddate.setMinutes(ddate.getMinutes() - 10);
        db.getEmailVerificationToken = sinon.fake.returns({
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
        const firstCallArg = db.createUser.firstCall.args[0];
        expect(firstCallArg.role).to.equal('ADMIN');
        expect(firstCallArg.verified).to.equal(true);
      });
    });
  });
});
