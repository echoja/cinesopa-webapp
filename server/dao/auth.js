const { enumAuthmap } = require("./db/schema/enum");
const user = require("./db/schema/user");
const authmap = enumAuthmap.raw_str_list;
const cmp = {};
for (let auth in authmap) {
  cmp[authmap[auth]] = auth;
}

/**
 * 권한이 올바른지 체크하는 함수. 주어진 권한이 조건 권한보다 더 상위의 권한인지 체크.
 * @param {string} given 주어진 권한
 * @param {string} condition 조건 권한
 * @returns {boolean} 올바르면 true, 틀리면 false.
 */
const level = {
  [enumAuthmap.ADMIN]: 2,
  [enumAuthmap.GUEST]: 1,
  [enumAuthmap.ANYONE]: 0,
}

const isOk = (given, condition) => {
  let result = false;
  try {
    result = level[given] >= level[condition];
    console.log(level[given]);
    console.log(level[condition]);
    return result;
  } catch {
    throw `given(${given}) or condition(${condition}) should be in [${authmap.join(
      ", "
    )}]`;
  }
};

/**
 * 클라이언트에서 해당 페이지에 권한이 있는지 없는지 체크하는 리졸버와 이어지는 함수.
 * 각 api에 대해 체크하는 게 아니라서 에러를 일으킬 필요가 없고,
 * 클라이언트에게 로그인이 필요하거나 권한이 없다고 알려주는 역할임.
 * @param {Object} args resolver 로부터 받는 arg 객체
 * @param {string} args.redirectLink 리다이렉트할 링크
 * @param {string} args.role authmap 에 명시된 역할
 * @param {*} context graphql context
 */
const check = async ({ redirectLink, role }, context) => {
  const { isUnauthenticated, req, getUser } = context;
  // console.log(process.env.EXAMPLE);

  if (isUnauthenticated()) {
    if (redirectLink !== "") {
      req.session.redirectLink = redirectLink;
    }

    return {
      permissionStatus: "LOGIN_REQUIRED",
    };
  } else {
    const user = getUser();
    if (isOk(enumAuthmap[user.role], enumAuthmap[role])) {
      return {
        permissionStatus: "OK",
        user: getUser(),
      };
    } else {
      return {
        permissionStatus: "NO_PERMISSION",
      };
    }
  }
};

// 서버로 graphql api가 들어왔을 때 해당 요청이 정말로 권한이 있는 요청인지 체크하는 리졸버 래퍼 함수.
// 함수 시그니처 : (args, context) => ...
const makeResolverWithUserRole = (role, func) => {
  return async (args, context) => {
    if (context.isUnauthenticated()) throw Error("Not Authenticated");
    const user = await context.getUser();
    if (isOk(user.role, role)) {
      return await func(args, context);
    }
    // else
    // if (!roleList.includes(user.role))
    //   throw Error(
    //     `UserRole not matched. required:${roleList}, given:${user.role}`
    //   );
    // return await func(args, context);
  };
};

module.exports = {
  isOk,
  check,
  makeResolverWithUserRole,
};
