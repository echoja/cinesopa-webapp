const model = require("../mongoose/model.js");

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

  getPageById: async ({ id }, context) => {},

  getPageByPermalink: async ({ permalink }, context) => {
    return await model.Page.findOne({ permalink });
  },
};
