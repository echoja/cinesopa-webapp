import model from "../mongoose/model.js";
import { withAuth } from "./util.js";

export const user = {
  login: async ({ provider: { email, pwd } }, context) => {
    // 사용자 인증
    const { user } = await context.authenticate("graphql-local", {
      email,
      password: pwd,
    });
    // 로그인
    await context.login(user);
    const redirectLink = context.req.session.redirectLink;

    // 본래 있던 redirectLink 삭제
    if (redirectLink) {
      delete context.req.session.redirectLink;
    }
    return { user, redirectLink };
  },

  logout: withAuth(["ADMIN"], async ({ email }, context) => {
    const userFound = await user.getUser(email);
    if (userFound) {
      await context.logout(userFound);
    }
    return { user: userFound };
  }),

  logoutMe: withAuth(["ADMIN", "GUEST"], async (args, context) => {
    const user = context.getUser();
    context.logout()
    return {user, redirectLink:""};

  }),

  
  getUserByEmail: async(email) => {
    return await model.User.findOne({ email }); // 없을땐 null
  },
  // https://mongoosejs.com/docs/guide.html#id
  getUser: withAuth(["ADMIN"], async ({ email }, context) => {
    return await model.User.findOne({ email }); // 없을땐 null
  }),

  getMe: async (args, context) => {},

  getUserByAuth: async (email, pwd) => {
    const login = await model.Login.findOne({ email });
    if (login && login.pwd === pwd) {
      return await model.User.findOne({ email });
    } else {
      return null;
    }
  },

  getAllUsers: withAuth(["ADMIN"], async (args, context) => {
    return await model.User.find();
  }),

  joinUser: async ({ email, name, pwd, role }) => {
    if (await getUser(email)) throw "email is existed";

    const newUser = new model.User({ email, name });
    const newLogin = new model.Login({ email, pwd });
    const result = await newUser.save();
    await newLogin.save();

    return result;
  },

  updateUser: withAuth(["ADMIN"], async ({ email, userinfo }, context) => {
    console.log(email);
    console.log(userinfo);
    const user = await model.User.findOne({ email });
    if (!user) throw new Error("user not found");
    // console.log(user);
    for (let k in userinfo) {
      if (userinfo[k] !== null) {
        user[k] = userinfo[k];
      }
    }
    await user.save();
    return user;
  }),
};

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
