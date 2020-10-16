require('../typedef');

// const { enumAuthmap, enumTokenPurpose } = require('../db/schema/enum');
const crypto = require('crypto');
// const { composeResolvers } = require('graphql-tools');

// const mail = require("./mail");
// const db = require("./db-manager").init(model);

class UserService {
  /** @type {DBManager} */
  #db;

  /** @type {MailManager} */
  #mail;

  constructor(dbManager, mailManager) {
    this.#db = dbManager;
    this.#mail = mailManager;
  }

  /**
   * 해당 이메일에 대해 새로운 토큰을 생성합니다.
   * @param {string} email 유저의 이메일
   */
  async startEmailVerifying(email) {
    if (!this.#db.isUserExist(email))
      throw `startEmailVerifying: ${email} 을 찾을 수 없습니다.`;
    const token = crypto.randomBytes(20).toString('hex');
    await this.#db.createEmailVerificationToken(email, token);
    const mailGate = {
      recipientEmail: email,
      recipientName: '',
      senderEmail: 'coop.cinesopa@gmail.com',
      senderName: '영화배급협동조합 씨네소파',
    };
    await this.#mail.sendMail(
      mailGate,
      '[소파섬] 회원가입 - 이메일 인증',
      `
    <div>
      <p>회원가입을 완료하려면 <a href="https://sopaseom.com/email_verify/${token}">링크를 클릭</a>하세요.
    </div>`,
    );
  }

  /**
   * 임시 ADMIN을 생성합니다.
   */
  async initAdmin() {
    await this.#db.createUser({
      email: 'admin@admin.com',
      name: 'SUPERMAN',
      role: 'ADMIN',
      pwd: '13241324',
      verified: true,
    });
  }

  /**
   *
   * @param {string} email 이메일
   * @param {string} pwd 비밀번호
   * @param {context} context
   */
  async createGuest(email, pwd) {
    const args = { email, pwd };
    args.role = 'GUEST';
    args.verified = false;
    const result = await this.#db.createUser(args);

    await this.startEmailVerifying(email);
    return result;
  }

  /**
   * 토큰을 입력받아서 ok 시키는 것. 토큰이 유효하지 않는 등 에러가 발생할 시 에러를 thorw 함.
   * @param {string} token
   * @returns {Promise<Userinfo>}
   */
  async verifyEmail(token) {
    const tokenDoc = await this.#db.getEmailVerificationToken(token); // 토큰을 찾지 못하면 에러.
    const email = tokenDoc.email;
    const user = await this.#db.getUserByEmail(email);
    // console.log('--verifyEmail - user--');
    // console.log(user);
    // 유효시간 초과
    // console.dir({
    //   now: Date.now(),
    //   c_date: tokenDoc.c_date,
    //   ttl: tokenDoc.ttl,
    // })
    if (Date.now() - tokenDoc.c_date > tokenDoc.ttl * 1000) {
      throw 'verifyEmail: token expired';
    }
    // 유효시간 올바름.
    await this.#db.updateUser(email, { verified: true });
    await this.#db.removeToken(token);
    await this.#db.updateUser(email, { verified: true });
    return user;
  }

  async getUserByAuth(email, pwd) {
    if (this.#db.isCorrectPassword(email, pwd)) {
      return this.#db.getUserByEmail(email);
    }
    return null;
  }
}

module.exports = {
  /**
   *
   * @param {DBManager} dbManager
   * @param {MailManager} mailManager
   */
  make(dbManager, mailManager) {
    return new UserService(dbManager, mailManager);
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
