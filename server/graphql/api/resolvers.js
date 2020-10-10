require('../../typedef');

const _ = require('lodash');
const { getDateFromObj } = require('../../util');
const {
  db,
  user,
  validator,
  ACCESS_ALL,
  ACCESS_ADMIN,
  ACCESS_AUTH,
  ACCESS_UNAUTH,
  makeResolver,
} = require('../../loader');
const { enumAuthmap } = require('../../db/schema/enum');
const { auth } = require('../../service');

// const alist = enumAuthmap.raw_str_list;
// const ACCESS_ALL = alist;
// const ACCESS_AUTH = alist.slice(0, -1);
// const ACCESS_UNAUTH = alist.slice(-1);
// const ACCESS_ADMIN = alist.slice(0, 1);
// const makeResolver = require('../make-resolver').init(ACCESS_UNAUTH[0]);

// const checkAuth = async (obj, args, context, info) => {
//   const { redirectLink, role } = args;
//   return await validator.accessCheck(redirectLink, role, context);
// };

/**
 *
 * @type {LoginResolver}
 * @callback LoginResolver
 * @param {{provider: {email: string, pwd: string}}} args
 * @returns {Promise<{userinfo: Userinfo, rediretLink: string}>}
 */
const login = makeResolver(async (obj, args, context, info) => {
  const {
    provider: { email, pwd },
  } = args;
  return auth.login(email, pwd, context);
}).only(ACCESS_UNAUTH);

// const logout = makeResolver(async (obj, args, context, info) => {
// 수정 필요
// }).only(ACCESS_ADMIN);

const logoutMe = makeResolver(async (obj, args, context, info) => {
  const Logedout = await auth.logoutMe(context);
  const { userinfo, redirectLink } = Logedout;
  return { user: userinfo };
}).only(ACCESS_AUTH);

/**
 *
 * @param {PassportContext} context
 * @param {string} redirectLink
 */
const setRedirectLink = (context, redirectLink) => {
  // if (redirectLink !== undefined && redirectLink !== '') {
    // 클라이언트에서 곧바로 login 링크로 갔을 때, 이 코드가 실행되어야 클라이언트에도
    // 세션이 살아있을 수 있다.
    // 원인은 불명. 세션을 건드리면 그때서야 쿠키가 생성되어 클라이언트로
    // 전달되는 모양. 그래서 조건문이 처음에는 있었는데, 없앴다.
    // redirectLink가 설정되지 않은 상태라도 일단 session에 접근은 하도록.
    context.req.session.redirectLink = redirectLink;
  // }
};

const checkAuth = makeResolver(async (obj, args, context, info) => {
  const { redirectLink, role } = args;
  const contextUser = context.getUser();
  // const roleSymbol = enumAuthmap[role];
  const isOk = await validator.isOkContext(context, role, enumAuthmap);

  if (isOk) return { permissionStatus: 'OK', user: contextUser };

  setRedirectLink(context, redirectLink);
  if (contextUser) {
    return { permissionStatus: 'NO_PERMISSION', user: contextUser };
  }
  return { permissionStatus: 'LOGIN_REQUIRED' };

  // return await validator.isOk(context, role);
  // return await validator.accessCheck(
  //   redirectLink,
  //   [enumAuthmap[role]],
  //   context,
  // );
}).only(ACCESS_ALL);

const createGuest = makeResolver(async (obj, args, context, info) => {
  const { email, pwd } = args;
  return user.createGuest(email, pwd);
}).only(ACCESS_ALL);

const verifyUserEmail = makeResolver(async (obj, args, context, info) => {
  const { token } = args;
  console.log(`resolver-verifyUserEmail-token: ${token}`);
  return user.verifyEmail(token);
}).only(ACCESS_ALL);

const updateUser = makeResolver(async (obj, args, context, info) => {
  const { email, userinfo } = args;
  return db.updateUser(email, userinfo);
}).only(ACCESS_ADMIN);

const createPage = makeResolver(async (obj, args, context, info) => {
  const { permalink, belongs_to, pageinfo } = args;
  const { c_date, m_date } = pageinfo;

  if (c_date) pageinfo.c_date = getDateFromObj(c_date);
  if (m_date) pageinfo.m_date = getDateFromObj(m_date);
  pageinfo.permalink = permalink;
  pageinfo.belongs_to = belongs_to;

  await db.createPage(pageinfo);
  return db.getPageView(permalink, belongs_to);
}).only(ACCESS_ADMIN);

const updatePage = makeResolver(async (obj, args, context, info) => {
  const { permalink, belongs_to, pageinfo } = args;
  const { c_date, m_date } = pageinfo;
  // console.log("--args--");
  // console.log(args);
  if (c_date) pageinfo.c_date = getDateFromObj(c_date);
  if (m_date) pageinfo.m_date = getDateFromObj(m_date);
  const p = await db.getPageView(permalink, belongs_to);
  // console.log("--page--");
  // console.log(page);
  await db.updatePage(p.id, pageinfo);
  return db.getPage(p.id);
}).only(ACCESS_ADMIN);

const removePage = makeResolver(async (obj, args, context, info) => {
  const { permalink, belongs_to } = args;
  const p = await db.getPageView(permalink, belongs_to);
  await db.removePage(p.id);
  return p;
}).only(ACCESS_ADMIN);

// const signinUserByEmail = makeResolver(async (obj, args, context, info) => {
//   return await user.getUserByAuth(args.provider.email, args.provider.pwd);
// }).only(ACCESS_ALL);

// const singleUpload = makeResolver(async (obj, args, context, info) => {
//   const file = { args };
//   const { filename, mimetype, encoding } = await file;
//   const returnFile = { filename, mimetype, encoding };
//   return returnFile;
// }).only(ACCESS_AUTH);

/** QUERY */

const users = makeResolver(async (obj, args, context, info) => user.getAllUsers(args, context)).only(ACCESS_ADMIN);

// *** this is secure version!!***
const userResolver = makeResolver(async (obj, args, context, info) => {
  const { email } = args;
  return user.getUser(email, context);
}).only(ACCESS_ADMIN);

const currentUser = makeResolver(async (obj, args, context, info) => {
  if (context.isUnauthenticated()) return null;
  return context.getUser();
}).only(ACCESS_ALL);

const getUserByEmailNoAuth = makeResolver(async (obj, args, context, info) => {
  const { email } = args;
  return user.getUserByEmail(email, context);
}).only(ACCESS_ALL);

const pageResolver = makeResolver(async (obj, args, context, info) => {
  const { permalink, belongs_to } = args;
  console.log(
    `pageResolver: permalink: ${permalink}, belongs_to: ${belongs_to}`,
  );
  return db.getPageView(permalink, belongs_to);
  // return await page.getPageByPermalink(args, context);
}).only(ACCESS_ALL);

// pages(belongs_to: String!, page: Int, perPage: Int): [Page]
const pages = makeResolver(async (obj, args, context, info) => {
  const { belongs_to, page: pageNum = 0, perpage = 10 } = args;
  // console.log('--pages-resolver--');
  // console.log(args);
  const result = await db.getPages(belongs_to, pageNum, perpage);
  // console.log(result);

  return result;
  // return await page.getAllPages(args, context);
}).only(ACCESS_ADMIN);

const pageById = makeResolver(async (obj, args, context, info) => {
  const { id } = args;
  return db.getPage(id);
}).only(ACCESS_ALL);
// const checkAuth = makeResolver(async (obj, args, context, info) => {
//   const { redirectLink, role } = args;
//   return await auth.check(redirectLink, role, context);
// }).only(ACCESS_ALL);

module.exports = {
  Mutation: {
    login,
    logoutMe,
    createGuest,
    verifyUserEmail,
    updateUser,
    createPage,
    updatePage,
    removePage,
  },
  Query: {
    users,
    user: userResolver,
    currentUser,
    getUserByEmailNoAuth,
    page: pageResolver,
    pages,
    pageById,
    checkAuth,
  },
};
