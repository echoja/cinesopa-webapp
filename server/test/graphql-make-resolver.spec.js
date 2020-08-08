const { expect } = require("chai");

const makeResolver = require("../graphql/make-resolver").init("ANY");

const onlyLow = ["LOW", "MID"];
const onlyHigh = ["HIGH"];
const someRedirectLink = "https://naver.com";
const testAdminContext = {
  isUnauthenticated: () => false,
  getUser() {
    return {
      role: "HIGH",
    };
  },
  req: {
    session: {
      redirectLink: "",
    },
  },
};
const testUserContext = {
  isUnauthenticated: () => false,
  getUser() {
    return {
      role: "LOW",
    };
  },
  req: {
    session: {
      redirectLink: "",
    },
  },
};
const testGuestContext = {
  isUnauthenticated: () => true,
  getUser() {
    return {
      role: "",
    };
  },
  req: {
    session: {
      redirectLink: "abcde",
    },
  },
};

describe("makeResolver 테스트", () => {
  it("함수를 생성하는 데 아무런 오류가 없어야 함", async (done) => {
    const a = makeResolver(async (obj, args, context, info) => {}).only([
      "a",
      "b",
      "c",
    ]);
    done();
  });
  it("권한이 포함되지 않음", (done) => {
    const resolver = makeResolver(async (obj, args, context, info) => {
      return "hello";
    }).only(["HIGH"]);
    resolver({}, {}, testUserContext, {})
      .then((value) => {
        done("여기는 에러가 발생해야 합니다.");
      })
      .catch((error) => {
        done();
      });
  });
  it("권한이 포함됨", (done) => {
    const resolver = makeResolver(async (obj, args, context, info) => {
      return "hello";
    }).only(["HIGH"]);
    resolver({}, {}, testAdminContext, {})
      .then((value) => {
        done();
      })
      .catch((error) => {
        done("에러가 발생하면 안 됩니다.");
      });
  });
  it("로그인이 되어있지 않은 사람만 올 수 있음", (done) => {
    const resolver = makeResolver(async (obj, args, context, info) => {
      return "hello";
    }).only(["ANY"]);
    resolver({}, {}, testGuestContext, {})
      .then((value) => {
        expect(value).equals("hello");
        done();
      })
      .catch((error) => {
        done("에러가 발생하면 안 됩니다.");
      });
  });
  it("로그인한 사람만 올 수 있음", (done) => {
    const resolver = makeResolver(async (obj, args, context, info) => {
      return "hello";
    }).only(["LOW", "MID", "HIGH"]);
    resolver({}, {}, testGuestContext, {})
      .then((value) => {
        done("에러가 발생해야 합니다.");
      })
      .catch((error) => {
        done();
      });
  });
});
