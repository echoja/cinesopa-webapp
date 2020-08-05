const model = require("./db/model");
const { makeResolverWithUserRole } = require("./auth");
const crypto = require("crypto");
const mail = require("./mail");
const createEmailVerificationToken = async (email) => {
  const user = await model.User.findOne({ email }).exec();
  if (!user) throw "createEmailVerificationToken : no user";

  const token = crypto.randomBytes(20).toString("hex");
  const tokenDoc = new model.Token({
    token,
    email,
    ttl: 1800,
    purpose: "email_verification",
  });
  await tokenDoc.save();
  await mail.sendGoogleMail({
    to: email,
    html: `
  <div>
    <p>회원가입을 완료하려면 <a href="https://sopaseom.com/email_verify/${token}">링크를 클릭</a>하세요.
  </div>`,
  });
};

const getUser = makeResolverWithUserRole(
  "ADMIN",
  async ({ email }, context) => {
    return await model.User.findOne({ email }); // 없을땐 null
  }
);

const initAdmin = async (args, context) => {
  await joinUser({
    email: "admin@admin.com",
    name: "SUPERMAN",
    role: "ADMIN",
    pwd: "13241324",
    verified: true,
  });
};

const joinUser = async ({ email, name, pwd, role, verified }) => {
  if (await model.User.findOne({ email })) throw "joinUser: email is existed";

  const newUser = new model.User({ email, name, role, verified });
  const newLogin = new model.Login({ email, pwd });
  const result = await newUser.save();
  await newLogin.save();

  return result;
};

const removeUserByEmail = async ({ email }) => {
  const user = await model.User.findOne({ email }).exec();
  if (!user) throw "removeUserByEmail: email not found";
  await model.Login.deleteMany({ email });
  await model.User.deleteMany({ email });
  await model.Token.deleteMany({ email });
  return user;
};

module.exports = {
  getUser,
  joinUser,
  initAdmin,
  removeUserByEmail,
  createAdmin: makeResolverWithUserRole("ADMIN", async (args, context) => {
    const pushArgs = args;
    pushArgs.role = "ADMIN";
    pushArgs.verified = true;
    const result = await joinUser(pushArgs, context);
    return result;
  }),

  async createGuest(args, context) {
    const args_newuser = args;
    args_newuser.role = "GUEST";
    args_newuser.verified = false;
    const result = await joinUser(args_newuser, context);

    // const token = crypto.randomBytes(20).toString("hex");
    const { email } = args;
    await createEmailVerificationToken(email);
    // const tokenDoc = new model.Token({
    //   token,
    //   email,
    //   ttl: 1800,
    //   purpose: "email_verification",
    // });
    // await tokenDoc.save();

    // await mail.sendGoogleMail({
    //   to: email,
    //   html: `
    // <div>
    //   <p>회원가입을 완료하려면 <a href="https://sopaseom.com/email_verify/${token}">링크를 클릭</a>하세요.
    // </div>`,
    // });

    return result;
  },

  

  /**
   * 토큰을 입력받아서 ok 시키는 것.
   * @param {*} param0
   * @param {*} context
   */
  async verifyEmail({ token }, context) {
    const tokenDoc = await model.Token.findOne({
      token,
      purpose: "email_verification",
    }).exec();
    if (!tokenDoc) throw "no token";
    const email = tokenDoc.email;
    const user = await model.User.findOne({ email });
    // 유효시간 초과
    if (Date.now() - tokenDoc.c_date > tokenDoc.ttl * 1000) {
      throw "verifyEmail: token expired";
    }
    // 유효시간 올바름.
    user.verified = true;
    await user.save();
    await model.Token.deleteOne({ _id: tokenDoc._id });
    return user;
  },

  async login({ provider: { email, pwd } }, context) {
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

  logout: makeResolverWithUserRole("ADMIN", async ({ email }, context) => {
    const userFound = await user.getUser(email);
    if (userFound) {
      await context.logout(userFound);
    }
    return { user: userFound };
  }),

  logoutMe: makeResolverWithUserRole("GUEST", async (args, context) => {
    const user = context.getUser();
    context.logout();
    return { user, redirectLink: "" };
  }),

  getUserByEmail: async (email) => {
    return await model.User.findOne({ email }); // 없을땐 null
  },
  // https://mongoosejs.com/docs/guide.html#id

  getMe: async (args, context) => {},

  getUserByAuth: async (email, pwd) => {
    const login = await model.Login.findOne({ email });
    if (login && login.pwd === pwd) {
      return await model.User.findOne({ email });
    } else {
      return null;
    }
  },

  getAllUsers: makeResolverWithUserRole("ADMIN", async (args, context) => {
    return await model.User.find();
  }),

  updateUser: makeResolverWithUserRole(
    "ADMIN",
    async ({ email, userinfo }, context) => {
      // console.log(email);
      // console.log(userinfo);
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
    }
  ),
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
