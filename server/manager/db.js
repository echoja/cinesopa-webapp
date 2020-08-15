const path = require("path");
const fs = require("fs");
require("../typedef");
const {
  MongooseDocument,
  DocumentQuery,
  Model,
  SchemaTypes: { ObjectId },
} = require("mongoose");
// const { ManagerCreater } = require("./manager-loader");
const crypto = require("crypto");
const { fstat } = require("fs");

/** @typedef {Object.<string, Model<MongooseDocument, {}>>} ModelWrapper */
/** @typedef {DBManager} DBManager */

/** @type {ModelWrapper} */
let model;

/** @type {boolean} */
let initialized;

/*=====================================
내부 편의 함수
=====================================*/

/**
 * 비밀번호 암호화 함수. 평문을 암호화하여 저장함.
 *
 * @param {string} plain 평문
 * @returns {Promise<Encrypted>} 암호화된 base64 기반 암호.
 */
const pwd_encrypt = async (plain) => {
  return new Promise((resolve, reject) => {
    const salt = crypto.randomBytes(64).toString("base64");
    let result = "";
    crypto.scrypt(plain, salt, 64, (err, derivedKey) => {
      if (err) return reject(err);
      result = derivedKey.toString("base64");
      resolve({ pwd: result, salt });
    });
  });
};

/**
 * 비밀번호가 맞는지 체크합니다.
 * @param {string} given
 * @param {Encrypted} encrypted
 * @returns {Promise<boolean>} 맞으면 true, 틀리면 false
 */

const pwd_verify = async (given, encrypted) => {
  return new Promise((resolve, reject) => {
    let result = "";
    crypto.scrypt(given, encrypted.salt, 64, (err, derivedKey) => {
      if (err) return reject(err);
      result = derivedKey.toString("base64");
      resolve(result === encrypted.pwd);
    });
  });
};

/**
 * 유저를 구하려고 시도합니다.
 * @param {string} caller 호출하는 함수의 이름
 * @param {string} email 유저의 이메일
 * @throws 유저 찾기 실패시
 */
const _getUserByEmailOrThrow = async (caller, email) => {
  const user = await model.User.findOne({ email }).exec();
  if (!user) throw `${caller}: 이메일에 해당하는 유저를 찾을 수 없습니다.`;
  return user;
};

/**
 *
 * @typedef {DBManager} DBManager
 */

/**
 * model 에 접근하는 함수들의 집합.
 * DB의 요소를 생성, 수정, 삭제하는 역할임.
 * 이 매니저 이외에는 아무도 model에 직접 접근하지 않음.
 * model로 DB매니저를 초기화하는 식으로 이용해야 함.
 * 데이터를 얻는 것들은 모두 lean() 처리를 해서 plain java object로 리턴하도록 함.
 * 모든 함수는 async 임.
 */
class DBManager {
  /*=====================================
  일반
  =====================================*/

  /**
   * 어떤 모델에 대하여 조건을 걸어 doc 여러 개를 찾는 다용도 함수
   * @param {string} modelName 모델 이름
   * @param {Object} condition 조건
   * @returns {Object[]} 검색 결과 (다수)
   */
  async findMany(modelName, condition) {
    return await model[modelName].find(condition).lean();
  }

  /**
   * 어떤 모델에 대하여 조건을 걸어 doc 하나를 찾는 다용도 함수
   * @param {string} modelName 모델 이름
   * @param {Object} condition 조건
   * @returns {Object} 검색 결과 (하나)
   */
  async findOne(modelName, condition) {
    return await model[modelName].findOne(condition).lean();
  }

  /*=====================================
  유저
  =====================================*/

  /**
   * 이메일이 존재하는지 여부를 검사합니다.
   * @param {string} email 이메일
   * @returns {boolean} 존재한다면 true, 존재하지 않는다면 false
   */
  async isUserExist(email) {
    if (await model.User.findOne({ email })) return true;
    return false;
  }

  //@returns {?MongooseDocument} 유저 Mongoose Document
  /**
   * 이메일을 기준으로 유저를 얻습니다.
   * @param {string} email 이메일
   * @returns {Promise<Userinfo>}
   */
  async getUserByEmail(email) {
    // console.log("--getUserByEmail--");
    // console.dir(await model.User.find().lean());
    return await model.User.findOne({ email }).lean().exec();
  }

  //@returns {?MongooseDocument[]} 유저 Mongoose Document
  /**
   * 모든 유저를 구합니다.
   */
  async getAllUesrs() {
    return await model.User.find().lean();
  }

  /**
   * 새 유저를 생성합니다.
   * @param {Userinfo} userinfo 유저 정보
   * @throws 이메일이 이미 존재할 때
   */
  async createUser(userinfo) {
    const { email, name, role, verified } = userinfo;
    if (await model.User.findOne({ email }))
      throw `createUser: 이미 ${email}이 존재합니다.`;
    const { pwd, salt } = await pwd_encrypt(userinfo.pwd);
    const newUser = new model.User({ email, name, role, verified });
    const newLogin = new model.Login({ email, pwd, salt });
    await newUser.save();
    await newLogin.save();
  }

  /**
   * 이메일 기준 유저의 정보를 업데이트합니다.
   * @param {string} email 이메일
   * @param {Userinfo} userinfo 유저 정보
   * @returns {Promise<Userinfo>} 해당 유저 정보. 해당하는 이메일이 없을 시 null
   */
  async updateUser(email, userinfo) {
    const user = await model.User.findOne({ email }).exec();
    if (!user) throw `updateUser: ${email}이 존재하지 않습니다`;
    return user.updateOne(userinfo).lean();
  }

  // @returns {?DocumentQuery} 삭제된 유저
  /**
   * 이메일 기준으로 유저를 삭제합니다.
   * @param {string} email 이메일
   * @throws 이메일을 찾을 수 없을 때
   */
  async removeUserByEmail(email) {
    const user = await model.User.findOne({ email }).exec();
    if (!user) throw `removeUserByEmail: ${email} 을 찾을 수 없습니다.`;
    await model.Login.deleteMany({ email });
    await model.User.deleteMany({ email });
    await model.Token.deleteMany({ email });
  }

  /*=====================================
  비밀번호
  =====================================*/

  /**
   * 이메일 기준으로 비밀번호를 찾습니다.
   * @param {string} email 이메일
   * @returns {?string} 비밀번호
   * @throws 계정 정보를 찾을 수 없을 때
   */
  async getPassword(email) {
    const login = await model.Login.findOne({ email });
    if (!login) throw `getPassword: ${email} 의 계정 정보를 찾을 수 없습니다.`;
    const { pwd, salt } = login;
    if (pwd && salt) return { pwd, salt };
    return null;
  }

  /**
   * 이메일과 비밀번호가 맞는지 체크합니다
   * @param {string} email 이메일
   * @param {string} pwd 비밀번호
   * @returns {Promise<boolean>} 맞으면 true, 틀리면 false
   */
  async isCorrectPassword(email, pwd) {
    const login = await model.Login.findOne({ email });

    if (!login) return false;
    const { pwd: originPwd, salt } = login;
    return await pwd_verify(pwd, { pwd: originPwd, salt });
  }
  /*=====================================
  토큰
  =====================================*/
  // async createEmailVerificationToken(token)

  /**
   *
   * @param {string} token
   * @returns {Tokeninfo}
   */
  async getEmailVerificationToken(token) {
    const result = await model.Token.findOne({
      token,
      purpose: "email_verification",
    })
      .lean()
      .exec();
    if (!result) throw `토큰 ${token}이 존재하지 않습니다.`;
    return result;
  }

  async removeToken(token) {
    await model.Token.findOneAndDelete({ token });
  }
  /*=====================================
  페이지
  =====================================*/
  /**
   *
   * @param {*} pageinfo
   */
  async createPage(pageinfo) {
    const newPage = new model.Page(pageinfo);
    return newPage.save();
  }

  async getPageByPermalink(permalink) {
    return await model.Page.findOne({ permalink }).exec();
  }

  async updatePageByPermalink(permalink) {
    const page = await model.Page.findOne({ permalink }).exec();
    if (!page)
      throw `getPageByPermalink: ${permalink}에 해당하는 페이지가 존재하지 않습니다`;
    await page.updateOne(userinfo).exec();
  }

  async removePageByPermalink(permalink) {
    await model.Page.deleteMany({ permalink });
  }

  /*=====================================
  파일
  =====================================*/

  /**
   *
   * @param {Fileinfo} fileinfo
   * @param {string} owner 파일을 소유한 사람의 이메일
   * @throws 유저를 찾을수 없을 때
   */
  async createFile(fileinfo, owner) {
    const user = await _getUserByEmailOrThrow("createFile", owner);
    fileinfo["owner"] = user._id;
    const newFile = new model.File(fileinfo);
    await newFile.save();
  }

  /**
   * 파일관리자 창에서 관리할 수 있는 파일들을 가져옵니다.
   * @param {number} page 페이지
   * @param {number} perpage 한 페이지당 파일의 개수
   */
  async getFileManaged(page, perpage) {
    return model.File.find({ managed: true })
      .limit(perPage)
      .skip(perpage * page)
      .lean();
  }

  /**
   * 파일을 구합니다.
   * @param {string} filename 파일이름
   * @returns {Promise<Fileinfo>}
   */
  async getFile(filename) {
    return model.File.findOne({ filename }).lean().exec();
  }

  /**
   * 모든 파일을 구합니다.
   */
  async getFiles() {
    return model.File.find().lean().exec();
  }

  /**
   * 파일의 정보를 갱신합니다.
   * @param {string} filename
   * @param {Fileinfo} fileinfo
   * @returns {Promise<Fileinfo>}
   */
  async updateFile(filename, fileinfo) {
    return model.File.findOneAndUpdate({ filename }, fileinfo).lean().exec();
  }

  /**
   * 파일을 찾아 삭제합니다.
   * @param {string} filename
   */
  async removeFile(filename) {
    return model.File.findOneAndDelete({ filename }).lean().exec();
  }

  /*=====================================
  영화
  =====================================*/

  /*=====================================
  메뉴
  =====================================*/

  /*=====================================
  주문
  =====================================*/

  /*=====================================
  게시글(포스트)
  =====================================*/

  /*=====================================
  제품
  =====================================*/
}

/**
 * DB 매니저를 생성
 * @param {Object.<string, Model<MongooseDocument, {}>>} model 모델들의 집합
 * @returns {DBManager}
 */
const make = (modelInput) => {
  initialized = true;
  model = modelInput;
  const manager = new DBManager();
  manager.uploadFolder = "uploads";
  return manager;
};

// class DBManagerCreater extends ManagerCreater {
//   constructor(creater_func) {
//     super();
//     this.creater_func = creater_func;
//   }
//   pwd_encrypt = pwd_encrypt;
//   pwd_verify = pwd_verify;
// }

// module.exports = new DBManagerCreater(dbManagerCreaterFunc);
module.exports = {
  make,
  pwd_encrypt,
  pwd_verify,
};
