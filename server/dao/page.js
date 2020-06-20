const model = require("./db/model.js");

module.exports = {
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
    return await model.Page.find();
    // return await model.Page.find().populate("author");
  },

  getPageById: async ({ id }) => {
    return await model.Page.findById(id);
  },

  getPageByPermalink: async ({ permalink }) => {
    return await model.Page.findOne({ permalink });
  },
};
