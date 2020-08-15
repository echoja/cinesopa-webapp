

const tool = require("./tool");
const fs = require("fs");
const path = require("path");
const { expect } = require("chai");

const { pwd_verify, pwd_encrypt, make: makeDB } = require("../manager/db");

describe("암호화 테스트", function () {
  const testpwd = "13241324";
  describe(`암호화가 제대로 동작하는지 체크 : ${testpwd}`, () => {
    let encrypted = "";
    it("pwd_encrypt 실행", async () => {
      const encryptObj = await pwd_encrypt(testpwd);
      encrypted = encryptObj.result;
    });

    it("pwd_encrypt 같은 값 두번 실행", async () => {
      const p1 = (await pwd_encrypt(testpwd)).pwd;
      const p2 = (await pwd_encrypt("13241324")).pwd;
      expect(p1).not.equals(p2, "같은 입력에 다른 암호화 값이 나와야 함");
    });

    it("pwd_verify OK", async () => {
      const { pwd, salt } = await pwd_encrypt(testpwd);
      const b = await pwd_verify(testpwd, { pwd, salt });
      expect(b).equals(true);
    });

    it("pwd_verify FAIL", async () => {
      const { pwd, salt } = await pwd_encrypt(testpwd);
      const b = await pwd_verify("13241323", { pwd, salt });
      expect(b).equals(false);
    });
    after(() => {
      console.log(`암호화 후 패스워드 : ${encrypted}`);
    });
  });
});

describe("findMany 테스트", function () {
  let db;
  before("db 초기화", () => {
    db = makeDB({
      User: {
        find(c) {
          return {
            lean() {
              return `condition is ${c}`;
            },
          };
        },
      },
    });
  });

  it("제대로 작동해야 함", function (done) {
    db.findMany("User", "hi")
      .then((value) => {
        expect(value).to.equal("condition is hi");
        done();
      })
      .catch((error) => {
        done("에러가 나지 않아야 함");
      });
  });
});

describe("실제 모델 테스트", (self) => {
  const mongoose = require("mongoose");
  mongoose.deleteModel(/.+/);
  const model = require("../db/model").make(mongoose);
  /** @type {MongoMemoryServer} */
  let mongod;
  /** @type {DBManager} */
  let manager;

  before("DB 초기화", async function () {
    this.timeout(10000);
    manager = makeDB(model);

    const { MongoMemoryServer } = require("mongodb-memory-server");
    mongod = new MongoMemoryServer();
    const uri = await mongod.getConnectionString();
    const mongooseOpts = {
      useNewUrlParser: true,
      // autoReconnect: true,
      // reconnectTries: Number.MAX_VALUE,
      // reconnectInterval: 1000,
      useUnifiedTopology: true,
    };
    await mongoose.connect(uri, mongooseOpts);
  });

  afterEach("DB 내용 제거", async () => {
    const collections = mongoose.connection.collections;

    for (const key in collections) {
      const collection = collections[key];
      await collection.deleteMany();
    }
  });

  after("DB 종료", async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await mongod.stop();
  });

  describe("User 테스트", function () {
    it("createUser 테스트", async function () {
      await manager.createUser({
        email: "eszqsc112@naver.com",
        name: "김태훈",
        pwd: "13241324",
      });
      const found = await model.User.find().lean();
      const login = await model.Login.findOne().lean();
      const user = found[0];
      expect(found).to.not.be.a("null");
      expect(user.email).to.equal("eszqsc112@naver.com");
      expect(user.verified).to.equal(false);
      expect(login.pwd).to.be.a("string");
      expect(login.salt).to.be.a("string");
      expect(login.email).to.be.a("string");
    });

    it("createUser - getUserByEmail 테스트", async function () {
      await manager.createUser({
        email: "eszqsc112@naver.com",
        name: "김태훈",
        pwd: "13241324",
      });
      expect(
        await manager.getUserByEmail("eszqsc112@naver.com"),
        "email 키가 존재해야 함"
      ).to.have.any.keys(["email"]);
      expect(
        await manager.getUserByEmail("wierd@naver.com"),
        "email 키가 없어야 함"
      ).to.be.a("null");
    });

    it("isUserExist : False", async function () {
      const result = await manager.isUserExist("eszqsc112@naver.com");
      expect(result).equal(false);
    });

    it("isUserExist : True", async function () {
      await manager.createUser({
        email: "eszqsc112@naver.com",
        name: "김태훈",
        pwd: "13241324",
      });
      const result = await manager.isUserExist("eszqsc112@naver.com");
      expect(result).equal(true);
    });

    it("createUser후 removeUserByEmail", async function () {
      await manager.createUser({
        email: "eszqsc112@naver.com",
        name: "김태훈",
        pwd: "13241324",
      });
      await manager.removeUserByEmail("eszqsc112@naver.com");
      const found = await model.User.find().lean();
      expect(found.length).to.equal(0);
    });

    it("updateUser", async function () {
      await manager.createUser({
        email: "eszqsc112@naver.com",
        name: "김태훈",
        pwd: "13241324",
      });
      await manager.updateUser("eszqsc112@naver.com", { name: "안녕" });
      const user = await manager.getUserByEmail("eszqsc112@naver.com");
      expect(user.name).equal("안녕");
    });
  });

  describe("패스워드 테스트", function () {
    it("유저 생성 후 비번이 같아야 함 - isCorrectPassword", async function () {
      await manager.createUser({
        email: "eszqsc112@naver.com",
        name: "김태훈",
        pwd: "13241324",
      });
      const result = await manager.isCorrectPassword(
        "eszqsc112@naver.com",
        "13241324"
      );
      expect(result).equal(true);
      await tool.makeHtmlReport(
        this,
        `<!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Document</title>
      </head>
      <body>
        <p>hahaha</p>
      </body>
      </html>`
      );
    });
    it("유저 생성 후 비번이 틀려야 함 - isCorrectPassword", async function () {
      await manager.createUser({
        email: "eszqsc112@naver.com",
        name: "김태훈",
        pwd: "13241324",
      });
      const result = await manager.isCorrectPassword(
        "eszqsc112@naver.com",
        "12345678"
      );
      expect(result).equal(false);
    });
  });
});
