import model from '../mongoose/model.js';

export default (function(){

  // https://mongoosejs.com/docs/guide.html#id
  async function getUser(email){
    return await model.User.findOne({email: email}); // 없을땐 null
  }

  async function getAllUsers(){
    return await model.User.find();
  }

  async function joinUser(email, name, pwd){
    if(await getUser(email)) throw "email is existed";

    const newUser = new model.User({email, name});
    const newLogin = new model.Login({email, pwd});
    const result = await newUser.save();
    await newLogin.save();
    
    return result;
  }

  return {
    getUser: getUser,
    getAllUsers: getAllUsers,
    joinUser: joinUser,
  };

})();