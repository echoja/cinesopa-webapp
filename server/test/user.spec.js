const { expect } = require("chai");
const userCreator = require("../dao/user");

describe("user service 테스트", () => {
  it("초기화 테스트", () => {
    const userserv = userCreator.make({}, {});
    expect(userserv.initialized).to.be.equal(true);
  });
  describe("startEmailVerifying 테스트", () => {
    it("초기화 테스트", () => {
      const userserv = userCreator.make({}, {});
      expect(userserv.initialized).to.be.equal(true);
    });
  });
  describe("createGuest 테스트", () => {
    it("초기화 테스트", () => {
      const userserv = userCreator.make({}, {});
      expect(userserv.initialized).to.be.equal(true);
    });
  });
  describe("verifyEmail 테스트", () => {
    it("초기화 테스트", () => {
      const dbManager = {
        isUserExist(email) {return true},
        createEmailVerificationToken
      }
      const userserv = userCreator.make({}, {});
      expect(userserv.initialized).to.be.equal(true);
    });
  });
  describe("initAdmin 테스트", () => {
    it("초기화 테스트", () => {
      const userserv = userCreator.make({}, {});
      expect(userserv.initialized).to.be.equal(true);
    });
  });
});
