const addContext = require("mochawesome/addContext");
const a = 10;
const auth = require("../service/auth");
const request = require("supertest");
const makeAgent = request.agent;
const session = require("express-session");
const MemoryStore = require("memorystore")(session);
const express = require("express");
const { expect } = require("chai");
const { graphQLServerMiddleware } = require("../graphql");
const uuidv4 = require("uuid").v4;
const local = require("../auth/local");
const passport = require("passport");
// const { noConflict } = require("lodash");
const { make: makeDB } = require("../manager/db");
const { make: makeAuthMiddleware } = require("../auth/auth-middleware");
const { enumAuthmap } = require("../db/schema/enum");
const { graphqlSuper } = require("./tool");
const db = require("../manager/db");

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

// createPage(pageinfo: Pageinfo!): Page
// modifyPage(permalink: String!, belongs_to: String!,  pageinfo: Pageinfo!): Page
// removePage(permalink: String!, belongs_to: String!): Page
const createPageMutation = `
mutation createPage($permalink: String!, $belongs_to: String!, $pageinfo: PageInput!) {
  createPage(permalink: $permalink, belongs_to: $belongs_to, pageinfo: $pageinfo) {
    title
    content
    permalink
    c_date {
      year
      month
      day
      hour
      minute
      second
    }
    m_date {
      year
      month
      day
      hour
      minute
      second
    }
    role
    belongs_to
    meta_json
  }
}
`;

const updatePageMutation = `
mutation updatePage($permalink: String!, $belongs_to: String!, $pageinfo: PageInput!) {
  updatePage(permalink: $permalink, belongs_to: $belongs_to, pageinfo: $pageinfo) {
    title
    content
    permalink
    c_date {
      year
      month
      day
      hour
      minute
      second
    }
    m_date {
      year
      month
      day
      hour
      minute
      second
    }
    role
    belongs_to
    meta_json
  }
}
`;

const removePageMutation = `
mutation removePage($permalink: String!, $belongs_to: String!) {
  removePage(permalink: $permalink, belongs_to: $belongs_to) {
    title
    content
    permalink
    c_date {
      year
      month
      day
      hour
      minute
      second
    }
    m_date {
      year
      month
      day
      hour
      minute
      second
    }
    role
    belongs_to
    meta_json
  }
}
`;

const doLogin = async (agent, email, pwd) => {
  return graphqlSuper(agent, loginQuery, {
    email,
    pwd,
  });
};

/**
 * - graphql typedef 및 resolver 필요.
 * - db 세팅. db는 본래 환경과 동일한 db 생성. 즉 모델 및 스키마가 완료되어야 함.
 * - db 세팅법은 `./db.spec.js` 에서 가져옴.
 */
describe("REAL API", function () {
  const mongoose = require("mongoose");
  const model = require("../db/model").make(mongoose);
  /** @type {MongoMemoryServer} */
  let mongod;
  /** @type {DBManager} */
  let manager;
  /** @type {import("supertest").SuperAgentTest} */
  let agent;
  const webapp = express();

  before("서버 및 db 세팅", async function () {
    delete require.cache[require.resolve("passport")];
    this.timeout(10000);

    /** DB 세팅 */

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

    /** 웹앱 세팅 */
    webapp.use(
      session({
        genid: (req) => uuidv4(),
        secret: "test",
        resave: false,
        saveUninitialized: false,
        store: new MemoryStore(),
        expires: new Date(Date.now() + 30 * 86400 * 1000),
      })
    );
    webapp.use(passport.initialize()); // passport 구동
    webapp.use(passport.session());
    local.init(
      async (email) => {
        // console.log("--userFinder called--");
        const result = await manager.getUserByEmail(email);
        // console.dir(result);
        return result;
      },
      async (email, pwd) => {
        if (await manager.isCorrectPassword(email, pwd)) {
          // console.log(`getUserByAuth successed: email: ${email}, pwd: ${pwd}`);
          const result = await manager.getUserByEmail(email);
          // console.dir(result);
          return result;
        } else {
          // console.log("getUserByAuth failed");
          return null;
        }
      }
    );
    webapp.use("/graphql", graphQLServerMiddleware);
    webapp.get("/session", (req, res) => {
      res.send({ session: req.session, id: req.sessionID });
    });
    webapp.get("/logout", (req, res, next) => {
      req.logout();
      res.send();
    });
    webapp.get("/user", (req, res, next) => {
      res.send({ user: req.user, isAuthenticated: req.isAuthenticated() });
    });
    const authValidator = require("../auth/validator").make(auth.authmapLevel);
    // console.log("--auth.authmapLevel--");
    // console.dir(auth.authmapLevel);
    webapp.get(
      "/auth-test-admin",
      makeAuthMiddleware(authValidator, [enumAuthmap.ADMIN]),
      (req, res, next) => {
        res.send({ message: "success" });
      }
    );

    webapp.get(
      "/auth-test-error",
      makeAuthMiddleware(authValidator, "ADMIN"),
      (req, res, next) => {
        res.send({ message: "success" });
      }
    );
    agent = makeAgent(webapp);
  });

  afterEach("세션 초기화 및 DB 내용 초기화", async function () {
    await agent.get(`/logout`);
    const collections = mongoose.connection.collections;

    for (const key in collections) {
      const collection = collections[key];
      await collection.deleteMany();
    }
    // console.log("세션 초기화 및 DB 내용 초기ㅗ하!!!!!");
  });

  after("DB 종료", async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await mongod.stop();
  });

  describe("auth-middleware", async function () {
    before("유저 세팅", async function () {
      await manager.createUser({
        email: "testAdmin",
        pwd: "abc",
        role: "ADMIN",
      });
      await manager.createUser({
        email: "testGuest",
        pwd: "abc",
        role: "GUEST",
      });
    });
    it("권한이 성공해야 함", async function () {
      const loginResult = await graphqlSuper(agent, loginQuery, {
        email: "testAdmin",
        pwd: "abc",
      });

      const result = await agent.get("/auth-test-admin");
      if (result.status === 500) throw result.error;
      expect(result.status).to.equal(200);
      expect(result.body?.message).to.equal("success");
    });
    it("권한이 실패해야 함", async function () {
      const loginResult = await graphqlSuper(agent, loginQuery, {
        email: "testGuest",
        pwd: "abc",
      });
      const result = await agent.get("/auth-test-admin");
      if (result.status === 500) throw result.error;
      expect(result.status).to.equal(401);
      // expect(result.body?.message).to.equal("success");
    });
    it("권한이 에러나야 함", function (done) {
      graphqlSuper(agent, loginQuery, {
        email: "testGuest",
        pwd: "abc",
      })
        .then(() => {
          agent
            .get("/auth-test-error")
            .expect(200)
            .end((err, res) => {
              if (err) done();
              else done("에러가 나야 합니다.");
            });
        })
        .catch((err) => {
          done(err);
        });
    });
  });

  describe("page", function () {
    beforeEach("유저 세팅", async function () {
      await manager.createUser({
        email: "testAdmin",
        pwd: "abc",
        role: "ADMIN",
      });
      await manager.createUser({
        email: "testGuest",
        pwd: "abc",
        role: "GUEST",
      });
    });
    describe("createPage", function () {
      it("제대로 동작해야 함", function (done) {
        doLogin(agent, "testAdmin", "abc")
          .then((result) => {
            // console.log(result);
            graphqlSuper(agent, createPageMutation, {
              permalink: "hi",
              belongs_to: "sopaseom",
              pageinfo: {
                title: "hello",
                content: "<p>hello</p>",
                belongs_to: "sopaseom.kr",
              },
            })
              .then((result) => {
                addContext(this, {
                  title: "result",
                  value: result.body.data.createPage,
                });
                expect(result.body.data.createPage.title).to.equal("hello");
                expect(result.body.data.createPage.content).to.equal(
                  "<p>hello</p>"
                );
                return done();
              })
              .catch((err) => {
                console.error(err);
                return done(err);
              });
          })
          .catch((err) => {
            console.error(err);
            return done(err);
          });
      });
      it("권한이 없을 때 아무런 결과도 나오지 않아야 함", async function () {
        const result = await graphqlSuper(agent, createPageMutation, {
          permalink: "hi",
          belongs_to: "sopaseom",
          pageinfo: {
            title: "hello",
            content: "<p>hello</p>",
            belongs_to: "sopaseom.kr",
          },
        });
        addContext(this, { title: "결과", value: result });
        expect(result.body.data.createPage).to.equal(null);
      });
    });
    describe("updatePage", function () {
      it("제대로 동작해야 함", async function () {
        try {
          const loginres = await doLogin(agent, "testAdmin", "abc");
          addContext(this, { title: "loginres", value: loginres });
          const managerres = await manager.createPage({
            permalink: "hello",
            belongs_to: "sopaseom",
            title: "hoho",
            id: 100,
          });
          addContext(this, { title: "managerres", value: managerres });
          const result = await graphqlSuper(agent, updatePageMutation, {
            permalink: "hello",
            belongs_to: "sopaseom",
            pageinfo: {
              title: "mass",
            },
          });
          addContext(this, { title: "결과", value: result });
          expect(result.body.data.updatePage.title).to.equal("mass");
        } catch (error) {
          console.error(error);
          throw error;
        }
      });
      it("권한이 없을 때 아무런 결과도 나오지 않아야 함", async function () {
        const result = await graphqlSuper(agent, updatePageMutation, {
          permalink: "hi",
          belongs_to: "sopaseom",
          pageinfo: {
            title: "hello",
            content: "<p>hello</p>",
            belongs_to: "sopaseom.kr",
          },
        });
        addContext(this, { title: "결과", value: result });
        expect(result.body.data.updatePage).to.equal(null);
      });
    });
    describe("removePage", function () {
      it("제대로 동작해야 함", async function () {
        try {
          const loginres = await doLogin(agent, "testAdmin", "abc");
          addContext(this, { title: "loginres", value: loginres });
          const managerres = await manager.createPage({
            permalink: "hello",
            belongs_to: "sopaseom",
            title: "hoho",
            id: 100,
          });
          addContext(this, { title: "managerres", value: managerres });
          const result = await graphqlSuper(agent, removePageMutation, {
            permalink: "hello",
            belongs_to: "sopaseom"
          });
          addContext(this, { title: "결과", value: result });
          let found = false;
          manager.getPage(100).then((result) => {
            found = true;
          }).catch((err) => {
            found = false;
          });
          expect(found).to.be.false;
        } catch (error) {
          console.error(error);
          throw error;
        }
      });
      it("권한이 없을 때 아무런 결과도 나오지 않아야 함", async function () {
        const result = await graphqlSuper(agent, removePageMutation, {
          permalink: "hi",
          belongs_to: "sopaseom",
        });
        addContext(this, { title: "결과", value: result });
        expect(result.body.data.removePage).to.equal(null);
      });
    });
  });

  it("회원가입 및 로그인", async function () {
    // graphqlSuper(agent);
  });
});
