const high_symbol = Symbol("HIGH");
const low_symbol = Symbol("LOW");
const mid_symbol = Symbol("MID");

const validator = require("../auth/validator").make({
  [high_symbol]: 22,
  [low_symbol]: 4,
  [mid_symbol]: 18,
});
const { expect } = require("chai");

describe("isOK", () => {
  it("권한 가능", async () => {
    // const result = await validator.isOk("HIGH", "MID");
    const result = await validator.isOk(high_symbol, mid_symbol);
    expect(result).equals(true);
  });
  it("권한 일치", async () => {
    // const result = await validator.isOk("HIGH", "HIGH");
    const result = await validator.isOk(high_symbol, high_symbol);
    expect(result).equals(true);
  });
  it("권한 안됨", async () => {
    // const result = await validator.isOk("MID", "HIGH");
    const result = await validator.isOk(mid_symbol, high_symbol);
    expect(result).equals(false);
  });
});

describe("accessCheck", () => {
  const onlyLow = [low_symbol, mid_symbol];
  const onlyHigh = [high_symbol];
  const someRedirectLink = "https://naver.com";
  const testAdminContext = {
    isUnauthenticated: () => false,
    getUser() {
      return {
        role: high_symbol,
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
        role: low_symbol,
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
  it("어드민은 어드민 페이지에 잘 들어가야 함", async () => {
    const result = await validator.accessCheck(
      someRedirectLink,
      onlyHigh,
      testAdminContext
    );
    expect(result.permissionStatus).equals("OK");
  });
  it("로그인 안하면 권한이 필요함", async () => {
    const result = await validator.accessCheck(
      someRedirectLink,
      onlyLow,
      testGuestContext
    );
    expect(result.permissionStatus).equals("LOGIN_REQUIRED");
  });
  it("권한이 낮은 사람도 들어갈 수 있는 페이지가 있음", async () => {
    const result = await validator.accessCheck(
      someRedirectLink,
      onlyLow,
      testUserContext
    );
    expect(result.permissionStatus).equals("OK");
  });
  it("로그인 해도 권한이 필요함", async () => {
    const result = await validator.accessCheck(
      someRedirectLink,
      onlyHigh,
      testUserContext
    );
    expect(result.permissionStatus).equals("NO_PERMISSION");
  });
  it("리다이렉트 링크를 빈 칸으로 두면 변경되지 않음", async () => {
    testUserContext.req.session.redirectLink = "https://naver.com";
    const result = await validator.accessCheck("", onlyHigh, testUserContext);
    expect(testUserContext.req.session.redirectLink).equals(
      "https://naver.com"
    );
  });
  it("존재하지 않는 available은 에러가 나야함.", (done) => {
    validator
      .accessCheck("", ["WTF"], testUserContext)
      .then((value) => {
        done("성공하면 안됨.");
      })
      .catch((err) => {
        done();
      });
  });
});

describe("contains", function () {
  it("포함되어 있을 때 true 되어야 함.", function (done) {
    validator.contains(high_symbol, [high_symbol, low_symbol]).then((result) => {
      expect(result).to.equal(true);
      done();
    }).catch((err) => {
      done(err);
    })
  });
  it("포함되어 있을 때 false 되어야 함.", function (done) {
    validator.contains(low_symbol, [high_symbol, mid_symbol]).then((result) => {
      expect(result).to.equal(false);
      done();
    }).catch((err) => {
      done(err);
    })
  });
  it("condition에 문제가 있을 때 에러가 나야 함.", function (done) {
    validator.contains(high_symbol, [high_symbol, "OO"]).then((result) => {
      done(value);
    }).catch((err) => {
      done();
    })
  });
});
