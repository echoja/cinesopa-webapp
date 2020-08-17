require("../typedef");

const { enumAuthmap, enumTokenPurpose } = require("../db/schema/enum");
const crypto = require("crypto");
const { composeResolvers } = require("graphql-tools");

// const mail = require("./mail");
// const db = require("./db-manager").init(model);

let _initialized = false;

/** @type {DBManager} */
let db;

/** @type {MailManager} */
let mail;

// const ifNoUserWithEmail = async (email) => {
//   const user = db.getUserByEmail(email);
//   if (!user) throw `${email} is not exist`;
// };

/**
 * 해당 이메일에 대해 새로운 토큰을 생성합니다.
 * @param {string} email 유저의 이메일
 */
const startEmailVerifying = async (email) => {
  if (!db.isUserExist(email))
    throw `startEmailVerifying: ${email} 을 찾을 수 없습니다.`;
  const token = crypto.randomBytes(20).toString("hex");
  await db.createEmailVerificationToken(email, token);
  const mailGate = {
    recipientEmail: email,
    recipientName: "",
    senderEmail: "coop.cinesopa@gmail.com",
    senderName: "영화배급협동조합 씨네소파",
  }
  await mail.sendMail(mailGate, "[소파섬] 회원가입 - 이메일 인증", `
  <div>
    <p>회원가입을 완료하려면 <a href="https://sopaseom.com/email_verify/${token}">링크를 클릭</a>하세요.
  </div>`);

  //---------------

  //---------------------
  // const user = await model.User.findOne({ email }).exec();
  // if (!user) throw "createEmailVerificationToken : no user";

  // const token = crypto.randomBytes(20).toString("hex");
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
};

// const getUser = makeResolverWithUserRole(
//   enumAuthmap.ADMIN,
//   async ({ email }, context) => {
//     console.log("hiho");
//     return await model.User.findOne({ email }); // 없을땐 null
//   }
// );

/**
 * 임시 ADMIN을 생성합니다.
 */
const initAdmin = async () => {
  await db.createUser({
    email: "admin@admin.com",
    name: "SUPERMAN",
    role: "ADMIN",
    pwd: "13241324",
    verified: true,
  });
};

/**
 *
 * @param {string} email 이메일
 * @param {string} pwd 비밀번호
 * @param {context} context
 */
const createGuest = async (email, pwd) => {
  const args = { email, pwd };
  args.role = "GUEST";
  args.verified = false;
  const result = await db.createUser(args);

  await startEmailVerifying(email);
  return result;
};

/**
 * 토큰을 입력받아서 ok 시키는 것. 토큰이 유효하지 않는 등 에러가 발생할 시 에러를 thorw 함.
 * @param {string} token
 * @returns {Promise<Userinfo>}
 */
const verifyEmail = async (token) => {
  const tokenDoc = await db.getEmailVerificationToken(token); // 토큰을 찾지 못하면 에러.
  const email = tokenDoc.email;
  const user = await db.getUserByEmail(email);
  console.log("--verifyEmail - user--");
  console.log(user);
  // 유효시간 초과
  // console.dir({
  //   now: Date.now(),
  //   c_date: tokenDoc.c_date,
  //   ttl: tokenDoc.ttl,
  // })
  if (Date.now() - tokenDoc.c_date > tokenDoc.ttl * 1000) {
    throw "verifyEmail: token expired";
  }
  // 유효시간 올바름.
  await db.updateUser(email, { verified: true });
  await db.removeToken(token);
  await db.updateUser(email, {verified: true});
  return user;
};

const getUserByAuth = async (email, pwd) => {
  if (db.isCorrectPassword(email, pwd)) {
    return db.getUserByEmail(email);
  }
  return null;
};

// const joinUser = async (userinfo) => {
//   if (await model.User.findOne({ email })) throw "joinUser: email is existed";
//   const { email, name, pwd, role, verified } = userinfo;
//   const newUser = new model.User({ email, name, role, verified });
//   const newLogin = new model.Login({ email, pwd });
//   const result = await newUser.save();
//   await newLogin.save();

//   return result;
// };

// const removeUserByEmail = async ({ email }) => {
//   const user = await model.User.findOne({ email }).exec();
//   if (!user) throw "removeUserByEmail: email not found";
//   await model.Login.deleteMany({ email });
//   await model.User.deleteMany({ email });
//   await model.Token.deleteMany({ email });
//   return user;
// };

module.exports = {
  // getUser,
  // joinUser,
  /**
   * 
   * @param {DBManager} dbManager 
   * @param {MailManager} mailManager 
   */
  make(dbManager, mailManager) {
    db = dbManager;
    mail = mailManager;
    _initialized = true;
    return {
      get initialized() {
        return _initialized;
      },
      initAdmin,
      getUserByAuth,
      // removeUserByEmail,
      createGuest,
      verifyEmail,
      startEmailVerifying,
    };
  },

  // getUserByEmail: async (email) => {
  //   return await model.User.findOne({ email }); // 없을땐 null
  // },
  // https://mongoosejs.com/docs/guide.html#id

  // getMe: async (args, context) => {},

  // getAllUsers: makeResolverWithUserRole(enumAuthmap.ADMIN, async (args, context) => {
  //   return await model.User.find();
  // }),

  // updateUser: makeResolverWithUserRole(
  //   enumAuthmap.ADMIN,
  //   async ({ email, userinfo }, context) => {
  //     const user = await model.User.findOne({ email });
  //     if (!user) throw new Error("user not found");
  //     for (let k in userinfo) {
  //       if (userinfo[k] !== null) {
  //         user[k] = userinfo[k];
  //       }
  //     }
  //     await user.save();
  //     return user;
  //   }
  // ),
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
