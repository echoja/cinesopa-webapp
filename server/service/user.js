require('../typedef');
const { enumTokenPurpose } = require('../db/schema/enum');

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
   * 임시 ADMIN을 생성합니다.
   */
  async initAdmin() {
    await this.#db.createUser('admin@admin.com', '13241324', {
      role: 'ADMIN',
      verified: true,
    });
  }

  /**
   * 해당 이메일에 대해 새로운 토큰을 생성합니다.
   * @param {string} email 유저의 이메일
   * @param {boolean} debug 디버그 모드. 켜면 메일을 안보냄.
   * @throws 이메일을 찾을 수 없을 때
   */
  async startEmailVerifying(email, debug = false) {

    
    // 이메일을 찾을 수 없을 경우 에러
    if (!this.#db.userExists(email))
      throw `startEmailVerifying: ${email} 을 찾을 수 없습니다.`;

    // 토큰 생성
    const token = crypto.randomBytes(20).toString('hex');
    await this.#db.createToken(email, token, 'email_verification');
    const mailGate = {
      recipientEmail: email,
      recipientName: '',
      senderEmail: 'coop.cinesopa@gmail.com',
      senderName: '영화배급협동조합 씨네소파',
    };
    if (!debug) {
      await this.#mail.sendMail(
        mailGate,
        '[소파섬] 회원가입 - 이메일 인증',
        `
      <div>
        <p>회원가입을 완료하려면 <a href="https://sopaseom.com/verify-email?token=${token}">링크를 클릭</a>하세요.
      </div>`,
      );
    }
  }

  /**
   * 일반 계정을 만들면서 동시에 email Verifying 과정을 시작함.
   * @param {string} email 이메일
   * @param {string} pwd 비밀번호
   * @param {boolean} debug 디버그 모드. 켜면 메일을 안보냄.
   * @param {context} context
   */
  async createGuest(email, pwd, debug) {
    await this.#db.createUser(email, pwd, { role: 'GUEST' });
    await this.startEmailVerifying(email, debug);
  }
  /**
   * 계정에 대해 비밀번호 변경 링크를 만들어 계정에게 이메일을 보냄.
   * 이때, 계정은 본인 소유인 게 확인이 완료된 상태임.
   */
  async requestChangePassword(email, debug = false) {
    // 이메일을 찾을 수 없는 경우 에러
    const user = await this.#db.getUserByEmail(email);
    if (!user) {
      throw Error(`requestChangePassword: ${email} 유저를 찾을 수 없습니다.`);
    }
    // 이메일이 인증되지 않은 상태일 경우 에러
    if (user.verified !== true) {
      throw Error(
        `requestChangePassword: ${email} 유저가 이메일 인증된 상태가 아닙니다.`,
      );
    }

    const token = crypto.randomBytes(20).toString('hex');
    await this.#db.createToken(email, token, 'change_password');

    const mailGate = {
      recipientEmail: email,
      recipientName: '',
      senderEmail: 'coop.cinesopa@gmail.com',
      senderName: '영화배급협동조합 씨네소파',
    };
    if(!debug) {
      await this.#mail.sendMail(
        mailGate,
        '[소파섬] 비밀번호 변경 링크',
        `
      <div>
        <p>비밀번호를 변경하려면, 아래 링크를 클릭하여 계속 진행해주세요.</p>
        <p><a href="https://sopaseom.com/change-password?token=${token}">비밀번호 변경</a></p>
      </div>`,
      );
    }
  }

  /**
   * 토큰을 입력받아서 ok 시키는 것. 토큰이 유효하지 않는 등 에러가 발생할 시 에러를 thorw 함.
   * @param {string} token
   * @returns {Promise<Userinfo>}
   */
  async verifyEmail(token) {
    const tokenDoc = await this.#db.getToken(token, 'email_verification'); // 토큰을 찾지 못하면 에러.
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
      throw Error('verifyEmail: token expired');
    }
    // 유효시간 올바름.
    await this.#db.updateUser(email, { verified: true });
    await this.#db.removeToken(token);
    return this.#db.getUserByEmail(email);
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
};
