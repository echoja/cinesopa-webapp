// require('@/typedef');

const {
  DBManager,
  MailManager,
  UserAgreedinfo,
  CustomPassportContext,
  Tokeninfo,
  Userinfo,
} = require('@/typedef');

// const { enumAuthmap, enumTokenPurpose } = require('../db/schema/enum');
const crypto = require('crypto');
const { enumTokenPurpose } = require('../db/schema/enum');
// const { composeResolvers } = require('graphql-tools');

// const mail = require("./mail");
// const db = require("./db-manager").init(model);

class UserService {
  #db;

  #mail;

  /**
   *
   * @param {DBManager} dbManager
   * @param {MailManager} mailManager
   */
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
    await this.#db.createToken({ email, token, purpose: 'email_verification' });
    const mailGate = {
      recipientEmail: email,
      recipientName: '',
      senderEmail: 'coop.cinesopa@gmail.com',
      senderName: '영화배급협동조합 씨네소파',
    };
    const subject = '[소파섬] 회원가입 - 이메일 인증';

    // 디버그 모드가 아닐 때에만 메일 발송!
    if (!debug) {
      await this.#mail.sendTemplatedGmail(mailGate, subject, 'verify-mail', {
        verifyUrl: `https://sopaseom.com/verify-email?token=${token}`,
      });
    }
  }

  /**
   * 아이디/비밀번호 계정을 만드는 과정임.
   * 일반 계정을 만들면서 동시에 email Verifying 과정을 시작함.
   * 이미 카카오 계정이 있다면 합병하는 것만으로도 충분
   * @param {string} email 이메일
   * @param {string} pwd 비밀번호t
   * @param {UserAgreedinfo} user_agreed 약관 동의 정보
   * @param {boolean} debug 디버그 모드. 켜면 메일을 안보냄.
   */
  // * @param {CustomPassportContext} context
  async createGuest(email, pwd, user_agreed, debug) {
    const user = await this.#db.getUserByEmail(email);
    // 만약 유저가 없으면 새롭게 만듭니다.
    if (!user) {
      await this.#db.createUser(email, pwd, { role: 'GUEST', user_agreed });
      await this.startEmailVerifying(email, debug);
    }
    // 만약 유저가 있다면 (카카오 계정이라면) 새롭게 추가합니다. (실제로는 쓰이지 않음.)
    else if (typeof user.kakao_id === 'string') {
      await this.#db.updateUser(email, {
        has_pwd: true,
      });
      await this.#db.upsertOnlyLogin(email, pwd);
    }
  }

  /**
   * 계정에 대해 비밀번호 변경 링크를 만들어 계정에게 이메일을 보냄.
   * @param {string} email 
   * @param {boolean=} debug 
   */
  async requestChangePassword(email, debug = false) {
    // 이메일을 찾을 수 없는 경우 에러
    // const user = await this.#db.getUserByEmail(email);
    // if (!user) {
    //   throw Error(`requestChangePassword: ${email} 유저를 찾을 수 없습니다.`);
    // }

    // 이메일이 인증되지 않은 상태일 경우 에러.
    // if (user.verified !== true) {
    //   throw Error(
    //     `requestChangePassword: ${email} 유저가 이메일 인증된 상태가 아닙니다.`,
    //   );
    // }

    const token = crypto.randomBytes(20).toString('hex');
    await this.#db.createToken({ email, token, purpose: 'change_password' });

    const mailGate = {
      recipientEmail: email,
      recipientName: '',
    };
    if (!debug) {
      this.#mail
        .sendTemplatedGmail(
          mailGate,
          '[소파섬] 비밀번호 변경 링크',
          'change-password',
          {
            tokenUrl: `https://sopaseom.com/change-password/auth?token=${token}`,
          },
        )
        .catch((err) => {
          console.log(
            '# user service requestChangePassword sendTemplatedMail 실패',
          );
          console.error(err);
        });

      // await this.#mail.sendMail(
      //   mailGate,
      //   '[소파섬] 비밀번호 변경 링크',
      //   `
      // <div>
      //   <p>비밀번호를 변경하려면, 아래 링크를 클릭하여 계속 진행해주세요.</p>
      //   <p><a href="https://sopaseom.com/change-password/auth?token=${token}">비밀번호 변경</a></p>
      // </div>`,
      // );
    }
    return { success: true };
  }

  /**
   * 비밀번호를 변경합니다. 토큰이 있어야 작동합니다.
   * @param {string} token 비밀번호 변경 토큰
   * @param {string} pwd 암호화 되기 전 패스워드
   */
  async changePassword(token, pwd) {
    /** @type {Tokeninfo} */
    let tokenDoc = null;

    /** @type {boolean} */
    let isValidTTL;
    try {
      const result = await this.#db.getToken(token, 'change_password');
      tokenDoc = result.token;
      isValidTTL = result.isValidTTL;
    } catch (error) {
      return { success: false, code: 'no_such_token' };
    }
    if (!tokenDoc) return { success: false, code: 'no_such_token' };
    // console.log('# user service changePassword tokenDoc');
    // console.log(tokenDoc);
    const results = await Promise.allSettled([
      this.#db.updateUser(tokenDoc.email, { wrong_pwd_count: 0 }),
      this.#db.upsertOnlyLogin(tokenDoc.email, pwd),
    ]);
    if (results.every(({ status }) => status === 'fulfilled')) {
      return { success: true };
    }
    return {
      success: false,
      code: ['updateUser_failed', 'upsertOnlyLogin_failed']
        .filter((msg, index) => results[index].status === 'rejected')
        .join(', '),
    };
  }

  /**
   * 토큰을 입력받아서 ok 시키는 것. 토큰이 유효하지 않는 등 에러가 발생할 시 에러를 thorw 함.
   * @param {string} token
   * @returns {Promise<Userinfo>}
   */
  async verifyEmail(token) {
    const { isValidTTL, token: tokenDoc } = await this.#db.getToken(
      token,
      'email_verification',
    );

    const { email } = tokenDoc;
    const user = await this.#db.getUserByEmail(email);
    // console.log('--verifyEmail - user--');
    // console.log(user);
    // 유효시간 초과
    // console.dir({
    //   now: Date.now(),
    //   c_date: tokenDoc.c_date,
    //   ttl: tokenDoc.ttl,
    // })

    // 토큰 검사
    if (!isValidTTL) {
      // need check
      throw Error('token-expired');
    }
    // 유효시간 올바름.
    await this.#db.updateUser(email, { verified: true });
    await this.#db.removeToken(token);
    const result = await this.#db.getUserByEmail(email);
    return result;
  }

  async getUserByAuth(email, pwd) {
    if (this.#db.isCorrectPassword(email, pwd)) {
      return this.#db.getUserByEmail(email);
    }
    return null;
  }

  // /**
  //  * 비밀번호 변경 토큰을 받아서 유효한 토큰인지 체크.
  //  * @param {string} token
  //  * @return {Promise<boolean>}
  //  */
  // async verifyPasswordChangeReq(token) {
  //   //
  // }
  /**
   * 카카오 유저에게 비밀번호를 만들어줍니다.
   * @param {string} pwd
   */
  async makePwdForKakaoUser(email, pwd) {
    await this.#db.updateUser(email, { has_pwd: true });
    await this.#db.upsertOnlyLogin(email, pwd);
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
