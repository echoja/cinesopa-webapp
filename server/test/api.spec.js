/**
 * 본 테스트는 의존성이 많은 테스트입니다.
 * 1. graphQLServerMiddleware 을 받을 수 있어야 합니다. 그래서 express 에서 graphql api를 받을 수 있는 endpoint가 존재해야 합니다.
 * 2. graphQLServerMiddleware 를 받으려면 미리 정의된 graphql typedef가 있어야 합니다.
 * - 에러가 나지 않으려면 해당 graphql typedef 에 알맞는 resolver 가 제공되어야 합니다. (기능은 상관없슴)
 * 3. 현재 테스트는 실무에 쓰이는 graphql 및 resolver까지 모두 쓰이므로 자연스럽게 db에 접근하게 됩니다. 
 * 로그인 기능은 userFinder에 따라서 db에 접근할 수도 있고, 아닐 수도 있습니다.
 */

 /**
  * 로그인 정보가 넘어가는 실행 순서
  * 1. resolvers.js 에서의 resolver
  * 2. auth.js 의 login 함수. context.authenticate 함수로 인수를 넘김
  * 3. local.js 에서 정의한 GraphQLLocalStrategy 객체
  * 4. local.make(...)에서 에서 만든 getUserByAuth 함수
  */

const session = require("express-session");
const axios = require("axios");
const express = require("express");
const { expect } = require("chai");
const { graphQLServerMiddleware } = require("../graphql");
const uuidv4 = require("uuid").v4;
const local = require("../auth/local");
const passport = require("passport");
const headers = {
  "Content-Type": "application/json",
  Accept: "application/json",
};

const loginQuery = `
mutation Login ($email: String!, $pwd: String!) {
  login(provider: {email:$email, pwd: $pwd}) {
    user {
      name
      email
    }
    redirectLink
  }
}
`;

const graphqlRequest = async (url, query, variables) => {
  return new Promise((resolve, reject) => {
    axios
      .post(
        url,
        JSON.stringify({
          query,
          variables,
        }),
        {
          headers,
          credentials: true,
        }
      )
      .then((value) => {
        const { data } = value;
        if (data) return resolve(data);
        return resolve(received);
      })
      .catch((error) => {
        return reject(error);
      });
  });
};

const webapp = express();
let server;

describe("로그인 및 로그아웃 테스트", function () {
  this.timeout(10000);

  before("웹앱 세팅", async function () {
    // session settings
    webapp.use(
      session({
        genid: (req) => uuidv4(),
        secret: "test",
        resave: false,
        saveUninitialized: false,
      })
    );

    const localAuthConfig = local.make(
      async (email) => {
        switch (email) {
          case "eszqsc112@naver.com":
            return {
              email,
              msg: "ok",
            };
            break;

          default:
            return {
              email: "no...",
              msg: "nomsg",
            };
            break;
        }
      },
      async function (email, pwd) {
        if (email == "eszqsc112@naver.com" && pwd == "13241324") {
          return { email, name: "ok" };
        } else {
          return { email: "noemail", name: "no" };
        }
      }
    );
    localAuthConfig();
    webapp.use(passport.initialize()); // passport 구동
    webapp.use(passport.session());
    webapp.use("/graphql", graphQLServerMiddleware);
    server = webapp.listen(4000);
  });
  after("웹앱 종료", () => {
    server.close();
  });

  it("로그인 성공 테스트", async function () {
    const result = await graphqlRequest(
      "http://localhost:4000/graphql",
      loginQuery,
      {
        email: "eszqsc112@naver.com",
        pwd: "13241324",
      }
    );
    expect(result?.data?.login?.user?.email).to.equal("eszqsc112@naver.com");
    expect(result?.data?.login?.user?.name).to.equal("ok");
  });
  it("로그인 실패 테스트", async function () {
    const result = await graphqlRequest(
      "http://localhost:4000/graphql",
      loginQuery,
      {
        email: "eszqsc112@naver.como",
        pwd: "13241324",
      }
    );
    expect(result?.data?.login?.user?.email).to.equal("noemail");
    expect(result?.data?.login?.user?.name).to.equal("no");
  });
});
