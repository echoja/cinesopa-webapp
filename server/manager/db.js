const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
require('../typedef');
const {
  MongooseDocument,
  DocumentQuery,
  Model,
  SchemaTypes: { ObjectId },
} = require('mongoose');
const { enumTokenPurpose } = require('../db/schema/enum');
// const { ManagerCreater } = require("./manager-loader");

/** @typedef {Object.<string, Model<MongooseDocument, {}>>} ModelWrapper */
/** @typedef {DBManager} DBManager */

/** @type {ModelWrapper} */
let model;

/** @type {boolean} */
let initialized;

/*= ====================================
내부 편의 함수
===================================== */

/**
 * 비밀번호 암호화 함수. 평문을 암호화하여 저장함.
 *
 * @param {string} plain 평문
 * @returns {Promise<Encrypted>} 암호화된 base64 기반 암호.
 */
const pwd_encrypt = async (plain) =>
  new Promise((resolve, reject) => {
    const salt = crypto.randomBytes(64).toString('base64');
    let result = '';
    crypto.scrypt(plain, salt, 64, (err, derivedKey) => {
      if (err) return reject(err);
      result = derivedKey.toString('base64');
      return resolve({ pwd: result, salt });
    });
  });

/**
 * 비밀번호가 맞는지 체크합니다.
 * @param {string} given
 * @param {Encrypted} encrypted
 * @returns {Promise<boolean>} 맞으면 true, 틀리면 false
 */

const pwd_verify = async (given, encrypted) =>
  new Promise((resolve, reject) => {
    let result = '';
    crypto.scrypt(given, encrypted.salt, 64, (err, derivedKey) => {
      if (err) return reject(err);
      result = derivedKey.toString('base64');
      return resolve(result === encrypted.pwd);
    });
  });

/**
 * 유저를 구하려고 시도합니다.
 * @param {string} caller 호출하는 함수의 이름
 * @param {string} email 유저의 이메일
 * @throws 유저 찾기 실패시
 */
const _getUserByEmailOrThrow = async (caller, email) => {
  const user = await model.User.findOne({ email }).exec();
  if (!user) {
    throw Error(`${caller}: 이메일에 해당하는 유저를 찾을 수 없습니다.`);
  }
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
 * 이 매니저에서는 symbol 관련된 처리를 하지 않음.
 */
class DBManager {
  /*= ====================================
  일반
  ===================================== */

  /**
   * 어떤 모델에 대하여 조건을 걸어 doc 여러 개를 찾는 다용도 함수
   * @param {string} modelName 모델 이름
   * @param {Object} condition 조건
   * @returns {Object[]} 검색 결과 (다수)
   */
  async findMany(modelName, condition) {
    return model[modelName].find(condition).lean().exec();
  }

  /**
   * 어떤 모델에 대하여 조건을 걸어 doc 하나를 찾는 다용도 함수
   * @param {string} modelName 모델 이름
   * @param {Object} condition 조건
   * @returns {Object} 검색 결과 (하나)
   */
  async findOne(modelName, condition) {
    return model[modelName].findOne(condition).lean().exec();
  }

  /*= ====================================
  유저
  ===================================== */

  /**
   * 이메일이 존재하는지 여부를 검사합니다.
   * @param {string} email 이메일
   * @returns {boolean} 존재한다면 true, 존재하지 않는다면 false
   */
  async isUserExist(email) {
    if (await model.User.findOne({ email })) return true;
    return false;
  }

  // @returns {?MongooseDocument} 유저 Mongoose Document
  /**
   * 이메일을 기준으로 유저를 얻습니다.
   * @param {string} email 이메일
   * @returns {Promise<Userinfo>}
   */
  async getUserByEmail(email) {
    // console.log(`db.getUserByEmail start: ${email}`);
    // console.dir(await model.User.find().lean());
    return model.User.findOne({ email }).lean().exec();
  }

  // @returns {?MongooseDocument[]} 유저 Mongoose Document
  /**
   * 모든 유저를 구합니다.
   */
  async getAllUesrs() {
    return model.User.find().lean().exec();
  }

  /**
   * 새 유저를 생성합니다.
   * @param {Userinfo} userinfo 유저 정보
   * @throws 이메일이 이미 존재할 때
   */
  async createUser(userinfo) {
    const { email, name, role, verified } = userinfo;
    if (await model.User.findOne({ email })) {
      throw Error(`createUser: 이미 ${email}이 존재합니다.`);
    }
    const { pwd, salt } = await pwd_encrypt(userinfo.pwd);
    const newUser = new model.User({
      email,
      name,
      role,
      verified,
    });
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
    if (!user) throw Error(`updateUser: ${email}이 존재하지 않습니다`);
    return user.updateOne(userinfo).lean();
  }

  // @returns {?DocumentQuery} 삭제된 유저
  /**
   * 이메일 기준으로 유저를 삭제합니다.
   * @param {string} email 이메일
   * @throws 이메일을 찾을 수 없을 때
   */
  async removeUserByEmail(email) {
    // console.dir(model.User);
    const user = await model.User.findOne({ email }).exec();
    if (!user) throw Error(`removeUserByEmail: ${email} 을 찾을 수 없습니다.`);
    await model.Login.deleteMany({ email });
    await model.User.deleteMany({ email });
    await model.Token.deleteMany({ email });
  }

  /*= ====================================
  비밀번호
  ===================================== */

  /**
   * 이메일 기준으로 비밀번호를 찾습니다.
   * @param {string} email 이메일
   * @returns {?string} 비밀번호
   * @throws 계정 정보를 찾을 수 없을 때
   */
  async getPassword(email) {
    const login = await model.Login.findOne({ email });
    if (!login) {
      throw Error(`getPassword: ${email} 의 계정 정보를 찾을 수 없습니다.`);
    }
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
    // console.log("--model keys--");
    // console.log(Object.keys(model));
    const login = await model.Login.findOne({ email });

    if (!login) return false;
    const { pwd: originPwd, salt } = login;
    // console.log(salt);
    // console.log(originPwd);
    return pwd_verify(pwd, { pwd: originPwd, salt });
  }
  /*= ====================================
  토큰
  ===================================== */

  /**
   * 새로운 이메일 생성용 토큰을 만듭니다.
   * @param {string} email
   * @param {Tokeninfo} token
   */
  async createEmailVerificationToken(email, token) {
    const tokenDoc = new model.Token({
      token,
      purpose: 'email_verification',
      email,
      ttl: 1800,
    });
    await tokenDoc.save();
  }

  /**
   * 토큰을 얻습니다. ttl에 대한 계산을 하지는 않습니다.
   * @param {string} token
   * @returns {Tokeninfo}
   */
  async getEmailVerificationToken(token) {
    console.log(`db-getEmailVefificationToken-token: ${token}`);
    const result = await model.Token.findOne({
      token,
      purpose: 'email_verification',
    })
      .lean()
      .exec();
    if (!result) throw Error(`토큰 ${token}이 존재하지 않습니다.`);
    return result;
  }

  async removeToken(token) {
    await model.Token.findOneAndDelete({ token });
  }

  /*= ====================================
  페이지
  ===================================== */
  /**
   * 새로운 페이지를 생성합니다.
   * @param {Pageinfo} pageinfo
   * @throws 같은 permalink의 페이지가 있을 때.
   */
  async createPage(pageinfo) {
    const { permalink, belongs_to } = pageinfo;
    console.log(`db.createPage-${permalink}, ${belongs_to}`);
    if (await model.Page.findOne({ permalink, belongs_to })) {
      throw Error(`${belongs_to}의 ${permalink} 페이지가 이미 존재합니다.`);
    }
    const newPage = new model.Page(pageinfo);
    await newPage.save();
  }

  /**
   * Permalink와 belongs_to를 기준으로 페이지를 가져옵니다.
   * @param {string} permalink
   * @param {string} belongs_to
   * @returns {Promise<Pageinfo>}
   */
  async getPageView(permalink, belongs_to) {
    return model.Page.findOne({ permalink, belongs_to }).lean().exec();
  }

  /**
   * number를 기준으로 페이지를 가져옵니다.
   * @param {number} id
   * @returns {Promise<Pageinfo>}
   */
  async getPage(id) {
    return model.Page.findOne({ id }).lean().exec();
  }

  /**
   * 페이지 리스트를 얻습니다.
   * @param {string} belongs_to
   * @param {number} page 페이지. 0이 1페이지임.
   * @param {number} perpage 한 페이지당 파일의 개수
   */
  async getPages(belongs_to, page, perpage) {
    return model.Page.find({ belongs_to })
      .limit(perpage)
      .skip(perpage * page)
      .lean()
      .exec();
  }

  /**
   * 페이지를 갱신합니다.
   * @param {number} id
   * @param {Pageinfo} pageinfo
   * @throws 페이지를 찾을 수 없을 때
   */
  async updatePage(id, pageinfo) {
    const page = await model.Page.findOne({ id }).exec();
    if (!page) {
      throw Error(`updatePage: ${id}에 해당하는 페이지가 존재하지 않습니다`);
    }
    await page.updateOne(pageinfo).exec();
  }

  /**
   * 페이지를 삭제합니다.
   * @param {number} id
   * @throws 페이지를 찾을 수 없을 때
   */
  async removePage(id) {
    const deletionResult = await model.Page.deleteOne({ id }).exec();
    // console.log();
    if (deletionResult.n === 0) {
      throw Error(`removePage: ${id}에 해당하는 페이지가 존재하지 않습니다`);
    }
  }
  /*= ====================================
  옵션 (Global Variables 등)
  ===================================== */

  /**
   * 옵션을 얻습니다.
   * @param {string} name 옵션 이름
   */
  async getOption(name) {
    return null;
  }

  /**
   * 옵션을 설정합니다.
   * @param {string}} name
   * @param {object} param1
   */
  async setOption(name, { type, value }) {
    return null;
  }
  /*= ====================================
  파일
  ===================================== */

  /**
   *
   * @param {Fileinfo} fileinfo
   * @param {string} owner 파일을 소유한 사람의 이메일
   * @throws 유저를 찾을수 없을 때
   */
  async createFile(fileinfo, owner) {
    const user = await _getUserByEmailOrThrow('createFile', owner);
    const file = fileinfo;
    file.owner = user.owner;
    const newFile = new model.File(file);
    await newFile.save();
    // console.log('createFilE!!!!');
    // console.log(newFile.c_date);
  }

  /**
   * 파일관리자 창에서 관리할 수 있는 파일들을 가져옵니다.
   * @param {number} page 페이지
   * @param {number} perpage 한 페이지당 파일의 개수
   */
  async getFilesManaged(page, perpage) {
    // console.log('getFilesManaged!!!!');
    // console.log(`page: ${page}, perpage: ${perpage}`);
    return model.File.find({ managed: true })
      .sort({ c_date: -1 })
      .limit(perpage)
      .skip(perpage * page)
      .lean()
      .exec();
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
    return model.File.updateOne({ filename }, fileinfo).lean().exec();
  }

  /**
   * 파일을 찾아 삭제합니다.
   * @param {string} filename
   */
  async removeFile(filename) {
    return model.File.deleteOne({ filename }).lean().exec();
  }

  /*= ====================================
  영화
  ===================================== */

  /**
   * 영화의 정보를 가져옵니다.
   * @param {number} id
   */
  async getFilm(id) {
    return model.Film.findOne({ id }).lean().exec();
  }

  /**
   * 영화 검색시 날짜 조건에 대한 타입
   * @typedef {object} DateCondition
   * @property {Date} prod_gte 제작일이 ~ 이후인 영화 필터링
   * @property {Date} prod_lte 제작일이 ~ 이전인 영화 필터링
   * @property {Date} open_gte 개봉일이 ~ 이후인 영화 필터링
   * @property {Date} open_lte 개봉일이 ~ 이전인 영화 필터링
   */

  /**
   * 영화를 조건에 맞게 검색합니다.
   * @param {number} page 해당하는 페이지 (1페이지가 0임)
   * @param {number} perpage 한 페이지당 항목 개수
   * @param {DateCondition} param2 날짜 조건
   * @param {[string]} tags 해당하는 태그들
   * @param {string} search 검색할 문자열. 한글이 분리된 상태, 띄어쓰기가 없는 상태여야 함.
   * @returns {Promise<MongooseDocument[]>}
   */

  async getFilms(
    page,
    perpage,
    { prod_gte = null, prod_lte = null, open_gte = null, open_lte = null } = {},
    tags,
    search,
  ) {
    let query = model.Film.find();
    if (prod_lte || prod_gte) {
      console.log('getFilms: prod!!');
      const prod_date = {};
      if (prod_lte) prod_date.$lte = prod_lte;
      if (prod_gte) prod_date.$gte = prod_gte;
      query = query.find({ prod_date });
    }
    if (open_lte || open_gte) {
      console.log('getFilms: open!!');
      const open_date = {};
      if (open_lte) open_date.$lte = open_lte;
      if (open_gte) open_date.$gte = open_gte;
      query = query.find({ open_date });
    }
    if (search) {
      console.log(`getFilms: search: ${search}`);
      // query = query.find({ $text: { $search: search } }); // 단어 단위로 검색을 할 때 필요함. 검색 엔진 같은 느낌임.
      query = query.find({ search: new RegExp(`${search}`) });
    }
    if (tags) {
      console.log('getFilms: tags!!');
      query = query.find({ tags: { $all: tags } });
    }
    if (page && perpage) {
      console.log('getFilms: page, perpage!!');
      query = query.limit(perpage).skip(perpage * page);
    }
    return query.lean().exec();
    // TODO
  }

  /**
   * 새 영화를 만듭니다.
   * @param {Filminfo} filminfo
   * @returns {Promise<>}
   */
  async createFilm(filminfo) {
    const film = await model.Film.create(filminfo);
    if (film) return film.toObject();
    return null;
  }

  /**
   * 영화의 정보를 갱신합니다.
   * @param {number} id
   * @param {Filminfo} filminfo
   * @returns {Promise<Filminfo>}
   */
  async updateFilm(id, filminfo) {
    return model.Film.updateOne({ id }, filminfo).lean().exec();
  }

  /**
   * 영화을 찾아 삭제합니다.
   * @param {number} id
   */
  async removeFilm(id) {
    const doc = await model.Film.findOne({ id }).lean().exec();
    await model.Film.deleteOne({ id }).exec();
    return doc;
  }

  /*= ====================================
  메뉴
  ===================================== */

  /*= ====================================
  게시판
  ===================================== */

  /**
   * 새로운 게시판을 만듭니다.
   * @param {Boardinfo} input
   */
  async createBoard(input) {
    const board = await model.Board.create(input);
    if (board) return board.toObject();
    return null;
  }

  /**
   * id에 따라서 게시판을 얻습니다.
   * @param {number} id
   */
  async getBoardById(id) {
    return model.Board.findOne({ id }).lean().exec();
  }

  /**
   * 어디에 위치해있는지에 따라 게시판을 얻습니다.
   * @param {string} belongs_to
   * @param {string} permalink
   */
  async getBoardByPermalink(belongs_to, permalink) {
    return model.Board.findOne({ belongs_to, permalink }).lean().exec();
  }

  /**
   * 모든 게시판을 얻습니다.
   */
  async getBoards() {
    return model.Board.find().lean().exec();
  }

  /**
   * 소속된 모든 게시판을 얻습니다.
   * @param {string} belongs_to
   */
  async getBoardsAssigned(belongs_to) {
    return model.Board.find({ belongs_to }).lean().exec();
  }

  /**
   * 게시판을 갱신합니다.
   * @param {number} id
   * @param {Boardinfo} input
   */
  async updateBoard(id, input) {
    await model.Board.updateOne({ id }, input).exec();
    return model.Board.findOne({ id }).lean().exec();
  }

  /**
   * 게시판을 삭제합니다.
   * @param {number} id
   */
  async removeBoard(id) {
    const doc = await model.Board.findOne({ id }).lean().exec();
    await model.Board.deleteOne({ id }).exec();
    return doc;
  }

  /*= ====================================
  게시글(포스트)
  ===================================== */

  // /**
  //  * api로부터 전달된 id를 다듬습니다.
  //  * @param {Postinfo} input
  //  */
  // async importPostInput(input) {
  //   const refined_input = input;
  //   if (input.board) {
  //     refined_input.board = (
  //       await model.File.findOne({ id: input.board }).exec()
  //     )?._id;
  //   }
  //   if (input.featured_image) {
  //     refined_input.featured_image = (
  //       await model.Board.findOne({ id: input.featured_image }).exec()
  //     )?._id;
  //   }
  //   // console.log(`refined_input: ${JSON.stringify(refined_input)}`);
  //   return refined_input;
  // }

  // async exportPost(postinfo) {

  // }

  /**
   * 게시물을 만듭니다.
   * @param {Postinfo} input
   */
  async createPost(input) {
    // const refined_input = await this.importPostInput(input);
    // refined_input.m_date = new Date();

    const doc = await model.Post.create(input);
    if (doc) return doc.toObject();
    return null;
  }

  /**
   * 게시물 하나를 얻습니다.
   * @param {number} id
   * @param {string} status
   */
  async getPost(id, status) {
    const cond = { id };
    if (status) cond.status = status;
    return model.Post.findOne(cond).lean().exec();
  }

  /**
   * 조건에 따라 포스트를 필터링합니다.
   * @param {PostSearch} condition
   * @param {*} status public 또는 private
   * @throws 만약 board 조건이 있지만 해당하는 게시판을 찾을 수 없을 때
   */
  async getPosts(condition, status) {
    const {
      page,
      perpage,
      date_gte,
      date_lte,
      search,
      board_permalink,
      board_belongs_to,
    } = condition;

    let query = model.Post.find();

    if (search) {
      console.log('getPosts: search!!');
      query = query.find({ search: new RegExp(`${search}`) });
    }

    if (board_permalink && board_belongs_to) {
      const boardDoc = await model.Board.findOne({
        permalink: board_permalink,
        belongs_to: board_belongs_to,
      }).exec();
      if (!boardDoc) {
        return [];
      }
      // if (!boardDoc) throw Error(`${board_belongs_to}의 ${board_permalink} 게시판을 찾을 수 없습니다.`);
    }

    // query date
    if (date_lte || date_gte) {
      console.log(
        `getPosts: date lte or date gte!! date_lte: ${date_lte}, date_gte: ${date_gte}`,
      );
      const c_date = {};
      if (date_lte) c_date.$lte = date_lte;
      if (date_gte) c_date.$gte = date_gte;
      query = query.find({ c_date });
    }

    // status
    if (status) {
      console.log(`getPosts: status: ${status}`);
      query = query.find({ status });
    }

    // pagination
    if (page && perpage) {
      console.log('getPosts: pagenation!!');
      query = query.limit(perpage).skip(perpage * page);
    }

    return query.lean().exec();
  }

  /**
   * 게시물을 업데이트합니다.
   * @param {number} id
   * @param {Postinfo} input
   */
  async updatePost(id, input) {
    // const refined_input = input;
    // refined_input.m_date = new Date();
    // const refined_input = await this.importPostInput(input);
    await model.Post.updateOne({ id }, input).exec();
    return model.Post.findOne({ id }).lean().exec();
  }

  /**
   * 게시글을 찾아 삭제합니다.
   * @param {number} id
   * @returns 삭제될 doc
   */
  async removePost(id) {
    const doc = await model.Post.findOne({ id }).lean().exec();
    await model.Post.deleteOne({ id }).exec();
    return doc;
  }

  /*= ====================================
  제품
  ===================================== */

  /*= ====================================
  주문
  ===================================== */
}

/**
 * DB 매니저를 생성
 * @param {Object.<string, Model<MongooseDocument, {}>>} model 모델들의 집합
 * @returns {DBManager}
 */
const make = (modelInput) => {
  console.log(`db making: ${Object.keys(modelInput).join(', ')}`);
  if (modelInput.make) throw Error('dbManager: model not initialized!');
  initialized = true;
  model = modelInput;
  const manager = new DBManager();
  manager.uploadFolder = 'uploads';
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
