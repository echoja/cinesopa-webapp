const sinon = require("sinon");
const { expect } = require("chai");
const userCreator = require("../service/user");

describe("user Service", () => {
  it("초기화 테스트", () => {
    const userserv = userCreator.make({}, {});
    expect(userserv.initialized).to.be.equal(true);
  });
  // describe("startEmailVerifying 테스트", () => {
  //   it("초기화 테스트", () => {
  //     const userserv = userCreator.make({}, {});
  //     expect(userserv.initialized).to.be.equal(true);
  //   });
  // });

  describe(".createGuest", () => {
    const db = {
      createUser: sinon.fake(),
      isUserExist: sinon.fake(),
      createEmailVerificationToken: sinon.fake(),
    };
    const mail = {
      sendGoogleMail: sinon.fake(),
    };
    beforeEach("매니저들 초기화", function () {
      db.isUserExist = sinon.fake.returns(true);
    });

    it("기본실행", async function () {
      const userserv = userCreator.make(db, mail);
      await userserv.createGuest("test", "abc");
      const firstArgs = db.createUser.args[0][0];
      expect(firstArgs.email).to.equal("test");
      expect(firstArgs.pwd).to.equal("abc");
      expect(firstArgs.role).to.equal("GUEST");
      expect(firstArgs.verified).to.equal(false);
      expect(mail.sendGoogleMail.calledOnce).to.be.true;
      expect(mail.sendGoogleMail.firstCall.args[0].to).to.equal("test");
    });
  });

  describe(".verifyEmail", () => {
    const db = {
      getEmailVerificationToken: sinon.fake(),
      getUserByEmail: sinon.fake(),
      updateUser: sinon.fake(),
      removeToken: sinon.fake(),
    };
    const mail = {};
    beforeEach("매니저들 초기화", function () {
      db.getEmailVerificationToken = sinon.fake.returns({
        token: "1324",
        email: "test",
      });
      db.getUserByEmail = sinon.fake.returns({ email: "test" });
      db.updateUser = sinon.fake.returns({ email: "test" });
      db.removeToken = sinon.fake();
    });

    it("기본 실행 테스트", async function () {
      const userserv = userCreator.make(db, mail);
      await userserv.verifyEmail("1324");
      expect(userserv.initialized).to.be.equal(true);
      expect(db.getEmailVerificationToken.calledWith("1324")).to.be.true;
    });
    it("유효기간이 맞지 않으면 오류가 나야 함", function (done) {
      db.getEmailVerificationToken = sinon.fake.returns({ c_date: 5, ttl: 10 });
      const userserv = userCreator.make(db, mail);
      userserv
        .verifyEmail("1324")
        .then((value) => {
          expect(db.removeToken.calledOnce).to.be.true;
          done("에러가 나야 함");
        })
        .catch((err) => {
          done();
        });
    });

    it("유효기간이 올바르면 제대로 실행되어야 함.", function (done) {
      const ddate = new Date();
      ddate.setMinutes(ddate.getMinutes() - 10);
      db.getEmailVerificationToken = sinon.fake.returns({
        c_date: ddate,
        ttl: 1000,
      });
      const userserv = userCreator.make(db, mail);
      userserv
        .verifyEmail("1324")
        .then((value) => {
          expect(db.removeToken.calledOnce).to.be.true;
          done();
        })
        .catch((err) => {
          done(err);
        });
    });
  });
  describe(".initAdmin", () => {
    const db = {
      createUser: sinon.fake(),
    };
    it("기본 실행", async function () {
      const userserv = userCreator.make(db, {});
      await userserv.initAdmin();
      const firstCallArg = db.createUser.firstCall.args[0];
      expect(firstCallArg.role).to.equal("ADMIN");
      expect(firstCallArg.verified).to.equal(true);
    });
  });
});
