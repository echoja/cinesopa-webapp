import model from '../mongoose/model.js';

export const user = {
  // https://mongoosejs.com/docs/guide.html#id
  getUser: async (email) => {
    return await model.User.findOne({email}); // 없을땐 null
  },

  getUserByAuth: async(email, pwd) => {
    const login = await model.Login.findOne({email})
    if ( login && login.pwd === pwd ) {
      return await model.User.findOne({email});
    } else {
      return null;
    }
  },

  getAllUsers: async () => {
    return await model.User.find();
  },

  joinUser: async () => {
    if(await getUser(email)) throw "email is existed";

    const newUser = new model.User({email, name});
    const newLogin = new model.Login({email, pwd});
    const result = await newUser.save();
    await newLogin.save();
    
    return result;
  }

}


// (function(){

//   // https://mongoosejs.com/docs/guide.html#id
//   async function getUser(email){
//     return await model.User.findOne({email: email}); // 없을땐 null
//   }

//   async function getAllUsers(){
//     return await model.User.find();
//   }

//   async function joinUser(email, name, pwd){
//     if(await getUser(email)) throw "email is existed";

//     const newUser = new model.User({email, name});
//     const newLogin = new model.Login({email, pwd});
//     const result = await newUser.save();
//     await newLogin.save();
    
//     return result;
//   }

//   return {
//     getUser: getUser,
//     getAllUsers: getAllUsers,
//     joinUser: joinUser,
//   };

// })();