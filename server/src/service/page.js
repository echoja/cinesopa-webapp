// require('../typedef');
const { model } = require('@/loader');
const { Pageinfo, DBManager } = require("@/typedef");

/** @type {DBManager} */
let db;


/**
 * 
 * @param {string} permalink 
 * @param {string} belongs_to 
 */
const getPage = async (permalink, belongs_to) => {
  return db.getPageView(permalink, belongs_to);
}

/**
 * 페이지를 생성합니다.
 * @param {Pageinfo} pageinfo 
 */
const createPage = async (pageinfo) => {
  return db.createPage(pageinfo);
}

/**
 * 페이지를 갱신합니다.
 * @param {string} permalink 
 * @param {string} belongs_to
 * @param {Pageinfo} pageinfo 
 */
const updatePage = async (permalink, belongs_to, pageinfo) => {
  const page = await db.getPageView(permalink, belongs_to);
  return db.updatePage(page.id, pageinfo);
}

/**
 * 페이지를 삭제합니다.
 * @param {string} permalink 
 * @param {string} belongs_to 
 */
const removePage = async (permalink, belongs_to) => {
  const page = await db.getPageView(permalink, belongs_to)
  await db.removePage(page.id);
}


module.exports = {
  /**
   * 
   * @param {DBManager} dbManager 
   */
  make(dbManager) {
    db = dbManager;
    return {
      // getPage,
      // createPage,
      // updatePage,
      // removePage,
    }
  },
  /**
   * createPage description
   * @public
   */
  createPage: async (args, context) => {
    const newPage = new model.Page(args);

    const result = await newPage.save();
    return result;
    // return await result.populate("author").execPopulate();
  },

  getAllPages: async () => {
    return model.Page.find();
    // return model.Page.find().populate("author");
  },

  getPageById: async ({ id }) => {
    return model.Page.findById(id);
  },

  getPageByPermalink: async ({ permalink }) => {
    return model.Page.findOne({ permalink });
  },
};
