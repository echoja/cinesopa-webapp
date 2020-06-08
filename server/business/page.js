import model from '../mongoose/model.js'

export default (function(){

  async function createPage({title, content, author}){
    const newPage = new model.Page({title: title, content: content, author: author});

    const result = await newPage.save();
    return await result.populate('author').execPopulate();
  }

  async function getAllPages(){
    return await model.Page.find().populate('author');
  }

  return {
    createPage: createPage,
    getAllPages: getAllPages,
  };

})();