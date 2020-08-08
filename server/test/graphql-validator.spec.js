const validator = require("../graphql/validator").init({
  HIGH: 22,
  LOW: 4,
  MID: 18,
});
const { expect } = require("chai");

describe("isOK 테스트", () => {
  it("권한 가능", () => {
    const result = validator.isOk("HIGH", "MID");
    expect(result).equals(true);
  });
  it("권한 일치", () => {
    const result = validator.isOk("HIGH", "HIGH");
    expect(result).equals(true);
  });
  it("권한 안됨", () => {
    const result = validator.isOk("MID", "HIGH");
    expect(result).equals(false);
  });
});

describe("accessCheck 테스트", () => {
  const onlyLow = ["LOW", "MID"];
  const onlyHigh = ["HIGH"];
  const emptyRedirectLink = "";
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
  it("어드민은 어드민 페이지에 잘 들어가야 함", () => {
    const result = validator.accessCheck(
      someRedirectLink,
      onlyHigh,
      testAdminContext
    );
    expect(result.permissionStatus).equals("OK");
  });
  it("로그인 안하면 권한이 필요함", () => {
    const result = validator.accessCheck(
      someRedirectLink,
      onlyLow,
      testGuestContext
    );
    expect(result.permissionStatus).equals("LOGIN_REQUIRED");
  });
  it("권한이 낮은 사람도 들어갈 수 있는 페이지가 있음", () => {
    const result = validator.accessCheck(
      someRedirectLink,
      onlyLow,
      testUserContext,
    );
    expect(result.permissionStatus).equals("OK");
  });
  it("로그인 해도 권한이 필요함", () => {
    const result = validator.accessCheck(
      someRedirectLink,
      onlyHigh,
      testUserContext
    );
    expect(result.permissionStatus).equals("NO_PERMISSION");
  });
  it("리다이렉트 링크를 빈 칸으로 두면 변경되지 않음", () => {
    testUserContext.req.session.redirectLink = "https://naver.com";
    const result = validator.accessCheck(
      "",
      onlyHigh,
      testUserContext
    );
    expect(testUserContext.req.session.redirectLink).equals("https://naver.com");
  });
});
