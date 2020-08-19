require('../../typedef');

const _ = require('lodash');
const { getDateFromObj } = require('../../util');
const {
  db, user, page, validator,
} = require('../../loader');
const { enumAuthmap } = require('../../db/schema/enum');
const { auth } = require('../../service');

const alist = enumAuthmap.raw_str_list;
const ACCESS_ALL = alist;
const ACCESS_AUTH = alist.slice(0, -1);
const ACCESS_UNAUTH = alist.slice(-1);
const ACCESS_ADMIN = alist.slice(0, 1);
const makeResolver = require('../make-resolver').init(ACCESS_UNAUTH[0]);

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
  return await auth.login(email, pwd, context);
}).only(ACCESS_UNAUTH);

// 수정 필요
const logoutMe = makeResolver(async (obj, args, context, info) => {
  const Logedout = await auth.logoutMe(args, context);
  return { user: Logedout };
}).only(ACCESS_AUTH);

const checkAuth = makeResolver(async (obj, args, context, info) => {
  const { redirectLink, role } = args;
  return await validator.accessCheck(
    redirectLink,
    [enumAuthmap[role]],
    context,
  );
}).only(ACCESS_ALL);

const createGuest = makeResolver(async (obj, args, context, info) => {
  const { email, pwd } = args;
  return await user.createGuest(email, pwd);
}).only(ACCESS_ALL);

const verifyUserEmail = makeResolver(async (obj, args, context, info) => {
  const { token } = args;
  console.log(`resolver-verifyUserEmail-token: ${token}`);
  return await user.verifyEmail(token);
}).only(ACCESS_ALL);

const updateUser = makeResolver(async (obj, args, context, info) => {
  const { email, userinfo } = args;
  return await db.updateUser(email, userinfo);
}).only(ACCESS_ADMIN);

const createPage = makeResolver(async (obj, args, context, info) => {
  const { permalink, belongs_to, pageinfo } = args;
  const { c_date, m_date } = pageinfo;

  if (c_date) pageinfo.c_date = getDateFromObj(c_date);
  if (m_date) pageinfo.m_date = getDateFromObj(m_date);
  pageinfo.permalink = permalink;
  pageinfo.belongs_to = belongs_to;

  await db.createPage(pageinfo);
  return await db.getPageView(permalink, belongs_to);
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
  await db.removePage(page.id);
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

const users = makeResolver(
  async (obj, args, context, info) => await user.getAllUsers(args, context),
).only(ACCESS_ADMIN);

// *** this is secure version!!***
const userResolver = makeResolver(async (obj, args, context, info) => {
  const { email } = args;
  return await user.getUser(email, context);
}).only(ACCESS_ADMIN);

const getUserByEmailNoAuth = makeResolver(async (obj, args, context, info) => {
  const { email } = args;
  return await user.getUserByEmail(email, context);
}).only(ACCESS_ALL);

const pageResolver = makeResolver(async (obj, args, context, info) => {
  const { permalink, belongs_to } = args;
  console.log(
    `pageResolver: permalink: ${permalink}, belongs_to: ${belongs_to}`,
  );
  return await db.getPageView(permalink, belongs_to);
  // return await page.getPageByPermalink(args, context);
}).only(ACCESS_ALL);

// pages(belongs_to: String!, page: Int, perPage: Int): [Page]
const pages = makeResolver(async (obj, args, context, info) => {
  const { belongs_to, page: pageNum = 0, perpage = 10 } = args;
  console.log('--pages-resolver--');
  console.log(args);
  const result = await db.getPages(belongs_to, pageNum, perpage);
  console.log(result);

  return result;
  // return await page.getAllPages(args, context);
}).only(ACCESS_ADMIN);

const pageById = makeResolver(
  async (obj, args, context, info) => await page.getPageById(args, context),
).only(ACCESS_ALL);
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
    // signinUserByEmail,
    // singleUpload,

    // async login(obj, args, context, info) {
    //   return await user.login(args, context);
    // },

    // async logout(obj, args, context, info) {
    //   const user = await user.logoutMe(args, context);
    //   return { user };
    // },
    // async logoutMe(obj, args, context, info) {
    //   return await user.logoutMe(args, context);
    // },
    // async createUser (obj, args, context, info){
    //   const { email, name, pwd, role } = args;
    //   return await user.joinUser(args);
    // },
    // async createAdmin(obj, args, context, info) {
    //   return await user.createAdmin(args, context);
    // },
    // async createGuest(obj, args, context, info) {

    // },
    // async verifyUserEmail(obj, args, context, info) {
    //   return await user.verifyEmail(args, context);
    // },
    // async updateUser(obj, args, context, info) {
    //   return await user.updateUser(args, context);
    // },
    // async createPage(obj, args, context, info) {
    //   return await page.createPage(args);
    // },
    // async signinUserByEmail(obj, args, context, info) {
    //   return await user.getUserByAuth(args.provider.email, args.provider.pwd);
    // },
    // async singleUpload(obj, args, context, info) {
    //   const file = { args };
    //   const { filename, mimetype, encoding } = await file;
    //   const returnFile = { filename, mimetype, encoding };
    //   return returnFile;
    // },
  },
  Query: {
    users,
    user: userResolver,
    getUserByEmailNoAuth,
    page: pageResolver,
    pages,
    pageById,
    checkAuth,

    // async users(obj, args, context, info) {
    //   return await user.getAllUsers(args, context);
    // },
    // // *** this is secure version!!***
    // async user(obj, args, context, info) {
    //   const { email } = args;
    //   return await user.getUser(email, context);
    // },
    // async getUserByEmailNoAuth(obj, args, context, info) {
    //   const { email } = args;
    //   return await user.getUserByEmail(email, context);
    // },
    // async page(obj, args, context, info) {
    //   return await page.getPageByPermalink(args, context);
    // },
    // async pages(obj, args, context, info) {
    //   return await page.getAllPages(args, context);
    // },
    // async pageById(obj, args, context, info) {
    //   return await page.getPageById(args, context);
    // },
    // async checkAuth(obj, args, context, info) {
    //   const { redirectLink, role } = args;
    //   return await auth.check(redirectLink, role, context);
    // },
  },
};

// var resolver = {

// };
// var resolver = {
//   users: async (args, context, info) => {
//     return await user.getAllUsers();
//   },

//   user: async (args, context, info) => {
//     const { email } = args;

//     return await user.getUser(email);
//   },

//   pages: async (args, context, info) => {
//     return await page.getAllPages();
//   },

//   checkAuth: async (args, context, info) => {
//     return await auth.check(args, context);
//   },

//   login: async (args, context, info) => {
//     return await user.login(args, context);
//   },

//   logout: async (args, context, info) => {
//     return await user.logoutMe(args, context);
//   },

//   logoutMe: async (args, context, info) => {
//     return await user.logoutMe(args, context);
//   },

//   createUser: async (args, context, info) => {
//     const { email, name, pwd, role } = args;
//     return await user.joinUser(args);
//   },

//   updateUser: async (args, context, info) => {
//     return await user.updateUser(args, context);
//   },

//   createPage: async (args, context, info) => {
//     return await page.createPage(args);
//   },
//   signinUserByEmail: async (args, context, info) => {
//     return await user.getUserByAuth(args.provider.email, args.provider.pwd);
//   },
// };
