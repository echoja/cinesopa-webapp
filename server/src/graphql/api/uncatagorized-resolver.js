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
} = require('@/loader');
const { enumAuthmap } = require('../../db/schema/enum');
const { auth } = require('../../service');

// const alist = enumAuthmap;
// const ACCESS_ALL = alist;
// const ACCESS_AUTH = alist.slice(0, -1);
// const ACCESS_UNAUTH = alist.slice(-1);
// const ACCESS_ADMIN = alist.slice(0, 1);
// const makeResolver = require('../make-resolver').init(ACCESS_UNAUTH[0]);

// const checkAuth = async (obj, args, context, info) => {
//   const { redirectLink, role } = args;
//   return await validator.accessCheck(redirectLink, role, context);
// };


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
    createPage,
    updatePage,
    removePage,
  },
  Query: {
    page: pageResolver,
    pages,
    pageById,
  },
};
