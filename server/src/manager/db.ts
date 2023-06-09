import {
  SiteOptionType,
  Userinfo,
  OrderSearch,
  SopakitSearch,
  FileCondition,
  Encrypted,
  ModelWrapper,
  TagSearch,
  Productinfo,
  Fulfilled,
  ProductSearch,
  CartiteminfoSearch,
  Cartiteminfo,
  ApplicationInput,
  ApplicationSearch,
  GetOrderCountGroupedByStatusResult,
  TokenPurpose,
  Tokeninfo,
  IToken,
  CreateTokenOptions,
  Pageinfo,
  TagFilminfo,
  Taginfo,
  IFilm,
  DateCond,
  PromGetDBItems,
  DateCondition,
  IFile,
  UserSearch,
  IUser,
  Boardinfo,
  IBoard,
  PromLD,
  PromLDList,
  IPost,
  Logininfo,
  GetDBItems,
  IPage,
  Fileinfo,
  Filminfo,
  FilmInput,
  ITag,
  TaginfoAggregated,
  Postinfo,
  PostSearch,
  PostStatus,
  ISopakit,
  Sopakitinfo,
  IProduct,
  ICartitem,
  IOrder,
  OrderInput,
  ISiteOption,
  IApplication,
  Orderinfo,
  isJsonObject,
  UpdateUserinfo,
} from '@/typedef';

// const crypto = require('crypto');
import crypto from 'crypto';
import { LeanDocument, Query, UpdateWriteOpResult } from 'mongoose';
import { allSettledFiltered, isStringArray } from '@/util';
import { JsonObject, JsonValue } from 'type-fest';

// const {
//   MongooseDocument,
//   DocumentQuery,
//   Model,
//   SchemaTypes: { ObjectId },
// } = require('mongoose');
// const { ManagerCreater } = require("./manager-loader");

// /** @typedef {Object.<string, Model<import('mongoose').Document<any, {}>, {}>>} ModelWrapper */
// /** @typedef DBManager */

// /** @type */
let model: ModelWrapper;

// /** @type */
// let initialized: boolean;

/*= ====================================
내부 편의 함수
===================================== */

/**
 * 비밀번호 암호화 함수. 평문을 암호화하여 저장함.
 *
 * @param plain 평문
 * @returns  암호화된 base64 기반 암호.
 */
export const pwd_encrypt = async (plain: string): Promise<Encrypted> =>
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
 * @param given
 * @param encrypted
 * @returns 맞으면 true, 틀리면 false
 */

export const pwd_verify = async (
  given: string,
  encrypted: Encrypted,
): Promise<boolean> =>
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
 * @param caller 호출하는 함수의 이름
 * @param email 유저의 이메일
 * @throws 유저 찾기 실패시
 */
const _getUserByEmailOrThrow = async (caller: string, email: string) => {
  const user = await model.User.findOne({ email }).exec();
  if (!user) {
    throw Error(`${caller}: 이메일에 해당하는 유저를 찾을 수 없습니다.`);
  }
  return user;
};

// export type DBManager = typeof DBManagerImpl;

/**
 * @typedef DBManager
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
export class DBManager {
  /*= ====================================
  유저
  ===================================== */

  /**
   * 이메일이 존재하는지 여부를 검사합니다.
   * @param email 이메일
   * @returns 존재한다면 true, 존재하지 않는다면 false
   */
  async userExists(email: string): Promise<boolean> {
    if (await model.User.findOne({ email })) return true;
    return false;
  }

  // @returns {?MongooseDocument} 유저 Mongoose Document
  /**
   * 이메일을 기준으로 유저를 얻습니다.
   * @param email 이메일
   * @returns {Promise<Userinfo>}
   */
  async getUserByEmail(email: string): Promise<Userinfo> {
    // console.log(`db.getUserByEmail start: ${email}`);
    // console.dir(await model.User.find().lean());
    return model.User.findOne({ email }).lean().exec();
  }

  // @returns {?MongooseDocument[]} 유저 Mongoose Document
  /**
   * 모든 유저를 구합니다.
   * @param condition 0 이 1페이지를 뜻함.
   */
  async getUsers(condition: UserSearch): PromGetDBItems<IUser> {
    const { page, perpage, email } = condition;
    let query = model.User.find();

    if (typeof email === 'string') {
      query.find({ email: new RegExp(`${email}`) });
    }
    const total = (await query.lean().exec()).length;
    // page와 perpage 가 동시에 있어야만 페이지네이션 가능
    if (typeof page === 'number' && typeof perpage === 'number') {
      query = query.limit(perpage).skip(perpage * page);
    }
    const list = await query.lean().exec();
    return {
      total,
      list,
    };
  }

  /**
   * 로그인 정보만 db에 기록합니다. 유저(User)는 일체 건드리지 않습니다.
   * 반드시 다른 기능과 조합되어야 합니다!
   * @param email 해당 이메일
   * @param pwd 암호화되기 전
   */
  async upsertOnlyLogin(email: string, pwd: string): Promise<void> {
    if (typeof email !== 'string' || typeof pwd !== 'string') {
      throw Error('upsertOnlyLogin: 인수가 잘못되었습니다.');
    }
    // 패스워드 정보는 유일해야 하므로 관련된건 전부 삭제함.
    await model.Login.deleteMany({ email });

    const { pwd: pwdEncrypted, salt } = await pwd_encrypt(pwd);
    await model.Login.create({ email, pwd: pwdEncrypted, salt });
  }

  /**
   * 새 유저(비밀번호 기반)를 생성합니다. 카카오는 그냥 로그인만 하도록 합니다.
   * @param email 이메일
   * @param pwd 비밀번호 (아직 암호화 전)
   * @param userinfo 유저 정보
   * @throws 이메일이 이미 존재할 때, 비밀번호 정보가 없을 때.
   */
  async createUser(
    email: string,
    pwd: string,
    userinfo: Userinfo = {},
  ): Promise<void> {
    // email이 겹친다면 에러
    if (await model.User.findOne({ email }).exec()) {
      throw Error(`createUser: 이미 ${email}이 존재합니다.`);
    }
    // 비밀번호가 없을 때에는 에러
    if (!pwd) {
      throw Error('유저 비밀번호 정보가 없습니다.');
    }

    // 비밀번호가 있을 때에는 일반 계정 생성한다는 뜻.
    userinfo.email = email;
    userinfo.has_pwd = true;
    const newUser = new model.User(userinfo);
    await newUser.save();
    await this.upsertOnlyLogin(email, pwd);
  }

  /**
   * 카카오 유저를 새롭게 갱신하는 함수. 이미 이메일이 존재한다면 업데이트만 하고,
   * 아예 계정이 없다면 새롭게 유저를 만듭니다.
   * 무조건 role은 guest 입니다.
   * @param email
   * @param userinfo
   */
  async upsertKakaoUser(email: string, userinfo: Userinfo): Promise<void> {
    if (
      typeof email !== 'string' ||
      typeof userinfo !== 'object' ||
      !userinfo.kakao_id
    ) {
      console.error('email');
      console.error(email);
      console.error('userinfo');
      console.error(userinfo);
      throw Error('upsertKakaoUser: 인수가 올바르지 않습니다.');
    }
    const { kakao_access_token, kakao_refresh_token, kakao_id } = userinfo;
    const found = await model.User.findOne({ email }).exec();

    // 만약 유저가 있다면 업데이트 시키고 종료
    if (found) {
      await model.User.updateOne(
        { email },
        {
          kakao_access_token,
          kakao_refresh_token,
          kakao_id,
          verified: true,
        },
      );
      return;
    }

    // 만약 유저가 없다면 새롭게 만듬.
    await model.User.create({
      email,
      role: 'GUEST',
      kakao_access_token,
      kakao_refresh_token,
      kakao_id,
      verified: true,
      has_pwd: false,
    });
  }

  // async agreementForKakaoUser(email, user_agreed) {

  // }

  /**
   * 이메일 기준 유저의 정보를 업데이트합니다.
   * @param email 이메일
   * @param userinfo 유저 정보
   * @throws 이메일이 존재하지 않을 때.
   */
  async updateUser(email: string, userinfo: Userinfo): PromLD<IUser> {
    const user = await model.User.findOne({ email }).exec();
    if (!user) throw Error(`updateUser: ${email}이 존재하지 않습니다`);
    const { user_agreed, ...rest } = userinfo;
    const updateUserinfo: UpdateUserinfo = { ...rest };

    if (typeof user_agreed?.advertisement === 'boolean') {
      updateUserinfo['user_agreed.advertisement'] = user_agreed?.advertisement;
    }
    if (typeof user_agreed?.policy === 'boolean') {
      updateUserinfo['user_agreed.policy'] = user_agreed?.policy;
    }
    if (typeof user_agreed?.privacy === 'boolean') {
      updateUserinfo['user_agreed.privacy'] = user_agreed?.privacy;
    }

    return user.updateOne(updateUserinfo).exec();
  }

  // @returns {?DocumentQuery} 삭제된 유저
  /**
   * 이메일 기준으로 유저를 삭제합니다.
   * @param email 이메일
   */
  async removeUserByEmail(
    email: string,
  ): Promise<
    PromiseSettledResult<{
      ok?: number;
      n?: number;
      deletedCount?: number;
    }>[]
  > {
    return Promise.allSettled([
      model.User.deleteMany({ email }).exec(),
      model.Login.deleteMany({ email }).exec(),
      model.Token.deleteMany({ email }).exec(),
    ]);
  }

  /*= ====================================
  비밀번호
  ===================================== */

  /**
   * 이메일 기준으로 비밀번호를 찾습니다.
   * @param email 이메일
   * @returns 비밀번호
   * @throws 계정 정보를 찾을 수 없을 때
   */
  async getPassword(email: string): Promise<Encrypted> | null {
    const login: Logininfo = await model.Login.findOne({ email });
    if (!login) {
      throw Error(`getPassword: ${email} 의 계정 정보를 찾을 수 없습니다.`);
    }
    const { pwd, salt } = login;
    if (pwd && salt) return { pwd, salt };
    return null;
  }

  /**
   * 이메일과 비밀번호가 맞는지 체크합니다
   * @param email 이메일
   * @param pwd 비밀번호
   * @returns 맞으면 true, 틀리면 false
   */
  async isCorrectPassword(email: string, pwd: string): Promise<boolean> {
    const login: Logininfo = await model.Login.findOne({ email });

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
   * 새로운 토큰을 만듭니다. 이전에 있던 토큰은 모두 삭제합니다.
   */

  async createToken(input: CreateTokenOptions): PromLD<IToken> {
    if (!input.ttl) input.ttl = 60 * 30;
    if (!input.unique) input.unique = true;

    // // 토큰이 올바른 purpose 인지 체크. --> typescript 덕분에 필요없어짐.
    // const purposeFoundIndex = enumTokenPurpose.findIndex(
    //   (value) => value == purpose,
    // );
    // if (purposeFoundIndex === -1) {
    //   throw Error(`createToken: 올바르지 않은 purpose입니다.: ${purpose}`);
    // }

    // 이미 존재하는 토큰을 삭제함.
    if (input.unique) {
      await model.Token.deleteMany({
        email: input.email,
        purpose: input.purpose,
      });
    }
    const tokenDoc = new model.Token(input);

    // 토큰을 저장함.
    await tokenDoc.save();
    return tokenDoc.toObject();
  }

  /**
   * 토큰을 얻습니다. ttl에 대한 계산을 하지는 않습니다.
   * (ttl 계산은 service 단에서 하도록 함.)
   * @throws 토큰을 찾지 못했을 때
   */
  async getToken(
    token: string,
    purpose: TokenPurpose,
  ): Promise<{ isValidTTL: boolean; doc: Tokeninfo; expireDate: Date }> {
    // console.log(`db-getEmailVefificationToken-token: ${token}`);
    const result = await model.Token.findOne({
      token,
      purpose,
    })
      .lean()
      .exec();
    if (!result) return { isValidTTL: false, doc: null, expireDate: null };

    const isValidTTL =
      Date.now() - result.c_date.getTime() <= result.ttl * 1000;
    const expireDate = new Date(result.c_date.getTime() + result.ttl * 1000);
    // if (!result) throw Error(`토큰 ${token}이 존재하지 않습니다.`);
    return { isValidTTL, doc: result, expireDate };
  }

  /** 일치하는 토큰 하나를 삭제합니다. */
  async removeToken(token: string): Promise<void> {
    await model.Token.deleteOne({ token });
  }

  /** 조건에 맞는 토큰을 모두 삭제합니다. */
  async clearToken(condition: Tokeninfo): Promise<void> {
    await model.Token.deleteMany(condition);
  }

  /*= ====================================
  페이지
  ===================================== */
  /**
   * 새로운 페이지를 생성합니다.
   * @param pageinfo
   * @throws 같은 permalink의 페이지가 있을 때.
   */
  async createPage(pageinfo: Pageinfo): Promise<void> {
    const { permalink, belongs_to } = pageinfo;
    // console.log(`db.createPage-${permalink}, ${belongs_to}`);
    if (await model.Page.findOne({ permalink, belongs_to })) {
      throw Error(`${belongs_to}의 ${permalink} 페이지가 이미 존재합니다.`);
    }
    const newPage = new model.Page(pageinfo);
    await newPage.save();
  }

  /**
   * Permalink와 belongs_to를 기준으로 페이지를 가져옵니다.
   * @param permalink
   * @param belongs_to
   * @returns {Promise<Pageinfo>}
   */
  async getPageView(permalink: string, belongs_to: string): Promise<Pageinfo> {
    return model.Page.findOne({ permalink, belongs_to }).lean().exec();
  }

  /**
   * number를 기준으로 페이지를 가져옵니다.
   * @param id
   * @returns {Promise<Pageinfo>}
   */
  async getPage(id: number): Promise<Pageinfo> {
    return model.Page.findOne({ id }).lean().exec();
  }

  /**
   * 페이지 리스트를 얻습니다.
   * @param belongs_to
   * @param page 페이지. 0이 1페이지임.
   * @param perpage 한 페이지당 파일의 개수
   */
  async getPages(
    belongs_to: string,
    page: number,
    perpage: number,
  ): PromLDList<IPage> {
    return model.Page.find({ belongs_to })
      .limit(perpage)
      .skip(perpage * page)
      .lean()
      .exec();
  }

  /**
   * 페이지를 갱신합니다.
   * @param id
   * @param pageinfo
   * @throws 페이지를 찾을 수 없을 때
   */
  async updatePage(id: number, pageinfo: Pageinfo): Promise<void> {
    const page = await model.Page.findOne({ id }).exec();
    if (!page) {
      throw Error(`updatePage: ${id}에 해당하는 페이지가 존재하지 않습니다`);
    }
    await page.updateOne(pageinfo).exec();
  }

  /**
   * 페이지를 삭제합니다.
   * @param id
   * @throws 페이지를 찾을 수 없을 때
   */
  async removePage(id: number): Promise<void> {
    const deletionResult = await model.Page.deleteOne({ id }).exec();
    // console.log();
    if (deletionResult.n === 0) {
      throw Error(`removePage: ${id}에 해당하는 페이지가 존재하지 않습니다`);
    }
  }

  /*= ====================================
  파일
  ===================================== */

  /**
   *
   * @param fileinfo
   * @param owner 파일을 소유한 사람의 이메일
   * @throws 유저를 찾을수 없을 때
   */
  async createFile(fileinfo: Fileinfo, owner: string): Promise<void> {
    const user = await _getUserByEmailOrThrow('createFile', owner);
    const file = fileinfo;
    file.owner = user.email;
    const newFile = new model.File(file);
    await newFile.save();
    // console.log('createFilE!!!!');
    // console.log(newFile.c_date);
  }

  /**
   * 파일관리자 창에서 관리할 수 있는 파일들을 가져옵니다.
   * @param condition 페이지
   */
  // async getFiles(condition) {
  //   const {page = 0, perpage = 20} = condition;
  //   // console.log('getFilesManaged!!!!');
  //   // console.log(`page: ${page}, perpage: ${perpage}`);
  //   return model.File.find({ managed: true })
  //     .sort({ c_date: -1 })
  //     .limit(perpage)
  //     .skip(perpage * page)
  //     .lean()
  //     .exec();
  // }

  /**
   * 파일을 구합니다.
   * @param filename 파일이름
   */
  async getFile(filename: string): Promise<LeanDocument<IFile>> {
    return model.File.findOne({ filename }).lean().exec();
  }

  /**
   * 파일을 id 기준으로 구합니다.
   * @param id
   */
  async getFileById(id: string): Promise<LeanDocument<IFile>> {
    return model.File.findOne({ _id: id }).lean().exec();
  }

  /**
   * 사이트 옵션의 이름으로 파일을 구합니다.
   * @param name 파일이름
   * @returns
   */
  async getFilebyOptionName(name: string): Promise<LeanDocument<IFile>> {
    const option = await model.SiteOption.findOne({ name }).lean().exec();
    // console.log('# getFilebyOptionName');
    // console.log(name);
    // console.log(option);
    if (
      !option ||
      !isJsonObject(option.value) ||
      typeof option.value.filename !== 'string'
    )
      return null;
    return model.File.findOne({ filename: option.value.filename })
      .lean()
      .exec();
  }

  /**
   * 조건에 따른 파일을 구합니다.
   * @param condition 페이지
   */
  async getFiles(condition: FileCondition = {}): PromGetDBItems<IFile> {
    const { page = 0, perpage = 20, managed = true } = condition;
    const query = model.File.find({ managed }).sort({
      c_date: -1,
    });
    // .limit(perpage)
    // .skip(perpage * page)
    // .lean()
    // .exec();
    const total = (await query.lean().exec()).length;
    const list = await query
      .limit(perpage)
      .skip(perpage * page)
      .lean()
      .exec();
    return { total, list };
  }

  /**
   * 파일의 정보를 갱신합니다.
   * @param filename
   * @param fileinfo
   * @returns {Promise<Fileinfo>}
   */
  async updateFile(filename: string, fileinfo: Fileinfo): PromLD<IFile> {
    await model.File.updateOne({ filename }, fileinfo).lean().exec();
    return model.File.findOne({ filename }).lean().exec();
  }

  /**
   * 파일을 찾아 삭제합니다.
   * @param filename
   */
  async removeFile(filename: string): Promise<void> {
    await model.File.deleteOne({ filename }).lean().exec();
  }

  /*= ====================================
  영화
  ===================================== */

  /**
   * 영화의 정보를 가져옵니다.
   * @param id
   */
  async getFilm(id: number): PromLD<IFilm> {
    return model.Film.findOne({ id }).lean().exec();
  }

  /**
   * 영화를 조건에 맞게 검색합니다.
   * @param page 해당하는 페이지 (1페이지가 0임)
   * @param perpage 한 페이지당 항목 개수
   * @param param2 날짜 조건
   * @param tags 해당하는 태그들
   * @param search 검색할 문자열. 한글이 분리된 상태, 띄어쓰기가 없는 상태여야 함.
   */

  async getFilms(
    page: number,
    perpage: number,
    {
      prod_gte = null,
      prod_lte = null,
      open_gte = null,
      open_lte = null,
    }: DateCondition = {},
    tags: string[] = null,
    search: string = null,
    is_opened = null,
    status = null,
  ): PromGetDBItems<IFilm> {
    const query = model.Film.find().sort({ open_date: -1 });

    if (prod_lte || prod_gte) {
      // console.log('getFilms: prod!!');
      const prod_date: DateCond = {};
      if (prod_lte) prod_date.$lte = prod_lte;
      if (prod_gte) prod_date.$gte = prod_gte;
      query.find({ prod_date });
    }
    if (open_lte || open_gte) {
      // console.log('getFilms: open!!');
      const open_date: DateCond = {};
      if (open_lte) open_date.$lte = open_lte;
      if (open_gte) open_date.$gte = open_gte;
      query.find({ open_date });
    }

    if (search !== null && search.length > 0) {
      // console.log(`getFilms: search: ${search}`);
      // query.find({ $text: { $search: search } }); // 단어 단위로 검색을 할 때 필요함. 검색 엔진 같은 느낌임.
      query.find({ search: new RegExp(`${search}`) });
    }

    if (tags && tags.length > 0) {
      // console.log('getFilms: tags!!');
      query.find({ 'tags.name': { $all: tags } });
    }

    if (is_opened !== null) {
      query.find({ is_opened });
    }

    if (status) {
      query.find({ status });
    }

    // 페이지 하기 전의 영화 총 개수 구하기
    const total = (await query.exec()).length;

    // 페이지 설정 및 open_date 로 정렬
    if (page !== null && perpage) {
      // console.log('getFilms: page, perpage!!');
      query
        .limit(perpage)
        .skip(perpage * page)
        .sort({ open_date: -1 });
    }

    return {
      total,
      list: await query.lean().exec(),
    };
  }

  /**
   * 공개 상태의 Featured 인 모든 영화를 구합니다.
   */
  async getFeaturedFilms(): PromGetDBItems<IFilm> {
    const featureds = await model.Film.find({
      status: 'public',
      is_featured: true,
    });
    return {
      total: featureds.length,
      list: featureds,
    };
  }

  /**
   * 새 영화를 만듭니다.
   * @param filminfo
   */
  async createFilm(filminfo: FilmInput): PromLD<IFilm> {
    // 만약 태그가 있다면, model 에 맞게 태그를 변형시켜줌.
    const args: Filminfo = {
      ...filminfo,
      tags: filminfo.tags ? filminfo.tags.map((name) => ({ name })) : [],
    };

    // film 생성
    const film = await model.Film.create(args);

    // 태그가 있는 경우 태그도 생성시켜줌.
    if (args.tags) {
      const promises = args.tags.map(({ name }) =>
        this.addFilmToTag(name, { id: film.id, title: film.title }),
      );
      await Promise.allSettled(promises);
    }

    return film;
  }

  /**
   * 영화의 정보를 갱신합니다.
   * 태그는 이름의 배열로 받습니다. 예: ['태그1', '태그2', '태그3]
   * @param id
   * @param filminfo
   * @returns
   */

  async updateFilm(
    // need check 확인필요.
    id: number,
    filminfo: FilmInput,
  ): Promise<UpdateWriteOpResult> {
    // 만약 태그가 있다면, model 에 맞게 태그를 변형시켜줌.
    const args: Filminfo = {
      ...filminfo,
      tags: filminfo.tags ? filminfo.tags.map((name) => ({ name })) : null,
    };

    // 태그 항목이 없다면 아예 키를 삭제해야 함.
    if (!args.tags) delete args.tags;

    // 우선 영화를 찾고, 없을시 null 리턴합니다.
    const film = await model.Film.findOne({ id }).lean().exec();
    if (!film) return null;

    // 삭제해야 하는 태그와 추가해야 하는 태그를 선택합니다.
    const tagsToRemove = (film.tags ?? []).filter(
      (originTag) =>
        (args.tags ?? []).findIndex(
          (newTag) => originTag.name === newTag.name,
        ) === -1,
    );
    const tagsToAdd = (args.tags ?? []).filter(
      (newTag) =>
        (film.tags ?? []).findIndex(
          (originTag) => originTag.name === newTag.name,
        ) === -1,
    );
    // console.log('# db updateFilm tag tagsToRemove');
    // console.log(tagsToRemove);
    // console.log('# db updateFilm tag tagsToAdd');
    // console.log(tagsToAdd);

    // 각각 태그에 대해 영화 정보를 추가/삭제 합니다.
    const addPromises = tagsToAdd.map((tag) =>
      this.addFilmToTag(tag.name, { id: film.id, title: film.title }),
    );
    const removePromises = tagsToRemove.map((tag) =>
      this.removeFilmFromTag(tag.name, film.id),
    );
    await Promise.allSettled([...addPromises, ...removePromises]);

    // console.log('# db updateFilm ta promiseResult');
    // console.dir(promiseResult, { depth: 4 });
    // 영화에 대해 태그를 설정합니다.
    return model.Film.updateOne({ id }, args).lean().exec();
  }

  /**
   * 영화을 찾아 삭제합니다.
   * @param id
   * @return {Promise<Filminfo>}
   */
  async removeFilm(id: number): Promise<Filminfo> {
    const doc = await model.Film.findOne({ id }).lean().exec();
    await Promise.allSettled([
      model.Film.deleteOne({ id }).exec(),
      ...doc.tags.map((tag) => this.removeFilmFromTag(tag.name, id)),
    ]);
    return doc;
  }

  /*= ====================================
  태그
  ===================================== */

  async getTags(condition: TagSearch = {}): PromGetDBItems<ITag> {
    const { limit = 20 } = condition;

    const total = (await model.Tag.find().lean().exec()).length;
    const tags: TaginfoAggregated[] = await model.Tag.aggregate([
      {
        $addFields: {
          size: { $size: { $ifNull: ['$related_films', []] } },
        },
      },
      {
        $sort: { size: -1 },
      },
    ])
      .limit(limit)
      .exec();
    // console.log('# db getTags tag1');
    // console.log(tags);

    // 영화 정보를 태그에 넣기.
    // console.log(tags);

    const films = new Set(
      tags.map((tag) => tag.related_films.map((film) => film.id)).flat(20),
    );
    // console.log('# db getTags films');
    // console.log(films);
    // console.log([...films.values()])
    const filmPromises = [...films.values()].map((id) =>
      (async () => ({
        filmId: id,
        doc: await this.getFilm(id),
      }))(),
    );
    const filmResults = await Promise.allSettled(filmPromises);
    // console.log('# db getTags');
    // console.log(filmResults);
    const filmDocs = new Map(
      filmResults
        .filter(
          (result): result is Fulfilled<typeof result> =>
            result.status === 'fulfilled',
        )
        .map((result) => [result.value.filmId, result.value.doc]),
    );

    // console.log(filmDocs);

    tags.forEach((tag) => {
      tag.related_films = tag.related_films.map((film) =>
        filmDocs.get(film.id),
      );
    });

    // console.log('# db getTags tag2');
    // console.log(tags);
    return { total, list: tags };
  }

  /**
   * 해당 태그에 영화 정보를 추가합니다. 만약 태그가 없을시
   * 새로 생성합니다. Film 모델은 건드리지 않습니다.
   * @param name 태그의 이름
   * @param filminfo 영화 정보
   */
  async addFilmToTag(name: string, filminfo: TagFilminfo): PromLD<ITag> {
    // 일단 tag name 을 검색하고, 없으면 새로운 태그를 만들어 리턴합니다.
    let tag = await model.Tag.findOne({ name }).lean().exec();
    if (!tag) {
      tag = await model.Tag.create({ name, related_films: [filminfo] });
      return tag;
    }
    // film id 와 함께 검색합니다. 없으면 추가시킵니다.
    tag = await model.Tag.findOne({ name, 'related_films.id': filminfo.id })
      .lean()
      .exec();
    if (!tag) {
      await model.Tag.updateOne(
        { name },
        { $push: { related_films: filminfo } },
      );
    }
    // 있으면 그냥 그대로 리턴합니다.
    return tag;
  }

  /**
   * 태그에서 해당 영화 정보를 삭제합니다.
   * 태그에서 모든 영화가 삭제되었다고 해서 태그는 사라지지 않습니다.
   * 영화에서의 정보는 건드리지 않습니다.
   * @param name 태그의 이름
   * @param filmId 영화 id
   */
  async removeFilmFromTag(name: string, filmId: number): Promise<void> {
    await model.Tag.updateOne(
      { name },
      { $pull: { related_films: { id: filmId } } },
    );
  }

  /**
   * 태그를 삭제합니다. 연관된 영화도 전부 삭제합니다.
   * @param {string}} name 태그의 이름
   */
  async removeTag(name) {
    // todo
  }

  /*= ====================================
  메뉴
  ===================================== */

  /*= ====================================
  게시판
  ===================================== */

  /**
   * 새로운 게시판을 만듭니다.
   * @param input
   */
  async createBoard(input: Boardinfo): PromLD<IBoard> {
    const board = await model.Board.create(input);
    if (board) return board.toObject();
    return null;
  }

  /**
   * id에 따라서 게시판을 얻습니다.
   * id는 mongodb의 _id 입니다.
   * @param id
   */
  async getBoard(id: string): PromLD<IBoard> {
    return model.Board.findOne({ _id: id }).lean().exec();
  }

  /**
   * 어디에 위치해있는지에 따라 게시판을 얻습니다.
   * @param belongs_to
   * @param permalink
   */
  async getBoardByPermalink(
    belongs_to: string,
    permalink: string,
  ): PromLD<IBoard> {
    return model.Board.findOne({ belongs_to, permalink }).lean().exec();
  }

  /**
   * 모든 게시판을 얻습니다.
   */
  async getBoards(): PromLDList<IBoard> {
    return model.Board.find().lean().exec();
  }

  /**
   * 소속된 모든 게시판을 얻습니다.
   * @param belongs_to
   */
  async getBoardsAssigned(belongs_to: string): PromLDList<IBoard> {
    return model.Board.find({ belongs_to }).lean().exec();
  }

  /**
   * 게시판을 갱신합니다.
   * @param id
   * @param input
   */
  async updateBoard(id: number, input: Boardinfo): PromLD<IBoard> {
    await model.Board.updateOne({ id }, input).exec();
    return model.Board.findOne({ id }).lean().exec();
  }

  /**
   * 게시판을 삭제합니다.
   * @param id
   */
  async removeBoard(id: number): PromLD<IBoard> {
    const doc = await model.Board.findOne({ id }).lean().exec();
    await model.Board.deleteOne({ id }).exec();
    return doc;
  }

  /*= ====================================
  게시글(포스트)
  ===================================== */

  // /**
  //  * api로부터 전달된 id를 다듬습니다.
  //  * @param input
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
   * @param input
   */
  async createPost(input: Postinfo): PromLD<IPost> {
    // const refined_input = await this.importPostInput(input);
    // refined_input.m_date = new Date();

    const doc = await model.Post.create(input);
    if (doc) return doc.toObject();
    return null;
  }

  /**
   * 게시물 하나를 얻습니다.
   * @param id
   * @param status
   */
  async getPost(id: number, status?: PostStatus): PromLD<IPost> {
    const cond: { id: number; status?: PostStatus } = { id };
    if (status) cond.status = status;
    return model.Post.findOne(cond).lean().exec();
  }

  /**
   * 조건에 따라 포스트를 필터링합니다.
   * @param condition
   * @param  status public 또는 private
   * @throws 만약 board 조건이 있지만 해당하는 게시판을 찾을 수 없을 때
   */
  async getPosts(
    condition: PostSearch,
    status?: PostStatus,
  ): PromGetDBItems<IPost> {
    const {
      page,
      perpage,
      date_gte,
      date_lte,
      search,
      board_permalinks,
      board_belongs_to,
    } = condition;

    let query = model.Post.find().sort({ c_date: -1 });

    if (search && search !== '') {
      // console.log('getPosts: search!!');
      query = query.find({ search: new RegExp(`${search}`) });
    }

    // todo 테스트 필요
    if (board_permalinks && board_permalinks.length !== 0 && board_belongs_to) {
      // console.log('post finding -- board!!');
      const foundDocs = await model.Board.find({
        permalink: { $in: board_permalinks },
        belongs_to: board_belongs_to,
      }).exec();
      const boardIds = foundDocs.map((doc) => doc?._id);
      query = query.find({ board: { $in: boardIds } });

      // const boardDoc = await model.Board.findOne({
      //   permalink: board_permalink,
      //   belongs_to: board_belongs_to,
      // }).exec();
      // if (!boardDoc) {
      //   return [];
      // }
      // query = query.find({ board: boardDoc._id });
      // if (!boardDoc) throw Error(`${board_belongs_to}의 ${board_permalink} 게시판을 찾을 수 없습니다.`);
    }

    // query date
    if (date_lte || date_gte) {
      // console.log(
      //   `getPosts: date lte or date gte!! date_lte: ${date_lte}, date_gte: ${date_gte}`,
      // );
      const c_date: { $lte?: Date; $gte?: Date } = {};
      if (date_lte) c_date.$lte = date_lte;
      if (date_gte) c_date.$gte = date_gte;
      query = query.find({ c_date });
    }

    // status
    if (status) {
      // console.log(`getPosts: status: ${status}`);
      query = query.find({ status });
    }

    // 페이지 하기 전의 포스트 총 개수 구하기
    const total = (await query.exec()).length;

    // pagination
    if (typeof page === 'number' && typeof perpage === 'number') {
      // console.log('getPosts: pagenation!!');
      query = query.limit(perpage).skip(perpage * page);
    }

    return { total, list: await query.lean().exec() };
  }

  /**
   * @typedef getPostsCountParams
   * @property boards 보드들 permalink. or 연산됨.
   * @property belongs_to 어디에 속해 있는지.
   * @property status `public` 또는 `private`
   */

  /**
   * 게시물의 개수를 알 수 있는 것
   * @returns 게시물 개수
   */
  async getPostsCount(
    param: {
      boards?: string[];
      belongs_to?: string;
      status?: string;
    } = {},
  ): Promise<number> {
    const { boards, belongs_to, status } = param;
    let query = model.Post.find();

    // 만약 보드 permalinks들이 있다면, 각 보드에 해당하는
    // id를 구하여 하나라도 포함될 수 있도록 $in 연산 먹임.
    if (boards && boards.length !== 0 && belongs_to) {
      // const promises = [];
      // boards.forEach((permalink) => {
      //   const promise = model.Board.findOne({
      //     permalink,
      //     belongs_to,
      //   });
      //   promises.push(promise);
      // });
      // const foundDocs = await Promise.allSettled(promises);

      const foundDocs = await model.Board.find({
        permalink: { $in: boards },
        belongs_to,
      }).exec();
      const boardIds = foundDocs.map((doc) => doc?._id);
      query = query.find({ board: { $in: boardIds } });
    }

    if (status) {
      // console.log(`getPosts: status: ${status}`);
      query = query.find({ status });
    }

    const result = await query.lean().exec();
    // console.log('#db getPostsCount last');
    // console.log(result);
    return result.length;
  }

  /**
   * 게시물을 업데이트합니다.
   * @param id
   * @param input
   */
  async updatePost(id: number, input: Postinfo): PromLD<IPost> {
    // const refined_input = input;
    // refined_input.m_date = new Date();
    // const refined_input = await this.importPostInput(input);
    await model.Post.updateOne({ id }, input).exec();
    return model.Post.findOne({ id }).lean().exec();
  }

  /**
   * 게시글을 찾아 삭제합니다.
   * @param id
   * @returns 삭제될 doc
   */
  async removePost(id: number): PromLD<IPost> {
    const doc = await model.Post.findOne({ id }).lean().exec();
    await model.Post.deleteOne({ id }).exec();
    return doc;
  }
  /*= ====================================
  소파킷 키워드 Sopakit
  ===================================== */

  /**
   * 소파킷 키워드 정보를 얻습니다.
   * @param id 소파킷 키워드 id
   */
  async getSopakit(id: number): PromLD<ISopakit> {
    return model.Sopakit.findOne({ id }).lean().exec();
  }

  /**
   * 소파킷 정보들을 얻습니다.
   * @param condition
   */
  async getSopakits(condition: SopakitSearch = {}): PromGetDBItems<ISopakit> {
    const { page, perpage, status } = condition;
    let query = model.Sopakit.find().sort({ managing_date: -1 });

    // status 처리
    if (status) {
      query = query.find({ status });
    }
    const total = (await query.lean().exec()).length;

    // page, perpage 처리
    if (typeof page === 'number' && typeof perpage === 'number') {
      query = query.limit(perpage).skip(perpage * page);
    }

    const list = await query.lean().exec();
    return {
      total,
      list,
    };
  }

  /**
   * 소파킷 키워드를 새로 만듭니다.
   * @param input
   */
  async createSopakit(input: Sopakitinfo): PromLD<ISopakit> {
    return model.Sopakit.create(input);
  }

  /**
   * 해당 소파킷 키워드의 정보를 갱신합니다.
   * @param id
   * @param {Sopakitinfo}} input
   */
  async updateSopakit(id: number, input: Sopakitinfo): PromLD<ISopakit> {
    await model.Sopakit.updateOne({ id }, input).exec();
    return model.Sopakit.findOne({ id }).lean().exec();
  }

  /**
   * 소파킷 키워드를 삭제합니다.
   * @param id
   */
  async removeSopakit(id: number): PromLD<ISopakit> {
    const doc = await model.Sopakit.findOne({ id }).lean().exec();
    await model.Sopakit.deleteOne({ id }).exec();
    return doc;
  }

  /*= ====================================
  상품. 
  ===================================== */

  /**
   * 상품 하나에 대한 정보를 얻습니다. 관련된 영화 정보와 소파킷 키워드 까지 얻습니다.
   */
  async getProduct(id: number): Promise<Productinfo> {
    const product = await model.Product.findOne({ id }).lean().exec();
    // console.log("# db getProduct");
    // console.log(product);
    const promises = [
      model.Film.findOne({ id: product.related_film }).lean().exec(),
      model.Sopakit.findOne({ id: product.kit_id }).lean().exec(),
    ] as const;
    const [filmResult, sopakitResult] = await Promise.allSettled(promises);
    const productResult: Productinfo = {
      ...product,
      related_film: null,
    };
    productResult.kit =
      sopakitResult.status === 'fulfilled' ? sopakitResult.value : null;
    productResult.related_film =
      filmResult.status === 'fulfilled' ? filmResult.value : null;
    return productResult;
  }

  /**
   * 상품들을 얻습니다.
   * page 는 값이 0이 들어와야 1페이지에 해당하는 상품들을 얻습니다.
   * @param condition
   */
  async getProducts(
    condition: ProductSearch = {},
  ): Promise<{ total: number; list: Productinfo[] }> {
    const { product_type, page, perpage, status, search } = condition;
    let query = model.Product.find();

    // 조건 필터링
    if (product_type) {
      query = query.find({ product_type });
    }
    if (status) {
      query = query.find({ status });
    }
    if (typeof search === 'string' && search.length > 0) {
      query = query.find({ search: new RegExp(`${search}`) });
    }
    const total = (await query.lean().exec()).length;

    if (typeof page === 'number' && typeof perpage === 'number') {
      query = query.limit(perpage).skip(perpage * page);
    }

    // 리스트 생성
    const list = await query.lean().exec();
    const resultList: Productinfo[] = list.map((item) => ({
      ...item,
      related_film: null,
    }));

    // 각 상품에 대한 영화 정보와 sopakit 정보를 불러온다.
    const nested_promises = list.map((product) => {
      const promises = [
        model.Film.findOne({ id: product.related_film }).lean().exec(),
        model.Sopakit.findOne({ id: product.kit_id }).lean().exec(),
      ] as const;
      return Promise.allSettled(promises);
    });

    const results = await Promise.allSettled(nested_promises);
    console.dir(results, { depth: 5 });

    results.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        const { value } = result;
        const [filmResult, sopakitResult] = value;
        resultList[index].kit =
          sopakitResult.status === 'fulfilled' ? sopakitResult.value : null;
        resultList[index].related_film =
          filmResult.status === 'fulfilled' ? filmResult.value : null;
      }
    });
    return { total, list: resultList };
  }

  /**
   * 새 상품을 생성합니다.
   * @param input
   */
  async createProduct(input: Productinfo): PromLD<IProduct> {
    return model.Product.create(input);
  }

  /**
   * 상품의 정보를 업데이트합니다. 관련된 cartitem 도 모두 업데이트 합니다.
   * 이 때 해당 cartitem 이 존재하지 않는다면 가볍게 무시하고, 해당 cartitem 을 삭제합니다.
   * @param id
   * @param input
   */

  async updateProduct(
    id: number,
    input: Productinfo,
  ): Promise<{ success?: boolean; code?: string; id?: number }> {
    const product = await model.Product.findOne({ id });

    // product 가 존재하지 않을 경우 success 는 false
    if (!product) {
      return { success: false, code: 'no_product' };
    }

    // related_cartitems 에 연결되어 있는 cartitems 를 업데이트 하면서
    // 존재하지 않는 related_cartitems 를 삭제함.
    const promises = product.related_cartitems.map((cartitemId) =>
      (async () => {
        const cartitem = await model.Cartitem.findOne({
          id: cartitemId,
        }).exec();
        // 만약 cartitem 이 존재하지 않는다면, 나중에 삭제하려고 알려줌.
        if (!cartitem) {
          return { result: 'not_exist_cartitem' };
        }
        cartitem.product = { ...input };
        await cartitem.save();
        return { result: 'success', id: cartitemId };
      })(),
    );

    const results = await Promise.allSettled(promises);
    // console.log('results!!!!!');
    // console.log(results);

    // not_exist_cartitem 인 cartitem 을 제외한 것들을 걸러내어 새로 갱신함.
    const remainedCartitems = results
      .filter(
        (promResult): promResult is Fulfilled<typeof promResult> =>
          promResult.status === 'fulfilled' &&
          promResult.value.result === 'success',
      )
      .map((promResults) => promResults.value.id);
    // console.log('remainedCartitems!!!!!');
    // console.log(remainedCartitems);
    product.related_cartitems = remainedCartitems;

    // console.log('# db updateProduct input!!!!!');
    // console.log(input);

    product.set(input);
    await product.save();

    // console.log('product doc!!!!!');
    // console.log(product._doc);
    return { success: true };
  }

  /**
   * 해당 제품을 삭제합니다. 관련된 cartitem 도 모두 삭제합니다.
   * @param id
   */
  async removeProduct(id: number): Promise<void> {
    // todo: 관련된 cartitem 삭제

    await model.Product.deleteOne({ id });
  }

  /*= ====================================
  장바구니 cart cartitem
  ===================================== */
  /**
   * Cartitem 을 id 값에 따라서 불러옵니다.
   * @param id id 값
   */
  async getCartitem(id: number): PromLD<ICartitem> {
    return model.Cartitem.findOne({ id }).lean().exec();
  }

  /**
   * @typedef GetCartitemsCondition
   * @property [usage=normal] normal or instant_payment. 기본값이 'normal' 이므로 모든 usage 를 찾으려면 null 로 설정해야 함.
   */

  /**
   * 카트아이템을 얻습니다. instant_payment 는 걸러야 하므로 normal 만 가져옵니다.
   */
  async getCartitems(
    email: string,
    condition: CartiteminfoSearch = { usage: 'normal' },
  ): PromLDList<ICartitem> {
    const { usage } = condition;
    let query = model.Cartitem.find({ user: email });
    if (usage) {
      query = query.find({ usage });
    }
    // const all = await model.Cartitem.find().lean().exec();
    // console.log('# db - getCartitems');
    // console.log(all);
    return query.lean().exec();
  }

  /**
   * 카트 아이템을 추가한다. 만약 이미 존재한다면 개수만 추가한다.
   * input 에 user, options, product_id, modified 인수가 들어와야 한다.
   * @param input
   */
  async addCartitem(
    input: Cartiteminfo = {},
  ): Promise<{
    success?: boolean;
    code?: string;
    doc?: LeanDocument<ICartitem>;
  }> {
    const { user, options, product_id, modified, usage } = input;

    // const productId = input.product_id;
    // 인수 검사
    if (
      typeof product_id !== 'number' ||
      modified === undefined ||
      options === undefined ||
      user === undefined
    ) {
      return { success: false, code: 'invalid_arg' };
    }

    // product 가 있는지 검사
    const product = await model.Product.findOne({ id: product_id }).exec();
    if (!product) {
      return { success: false, code: 'no_product' };
    }

    // 관리하기 쉽도록 id 기반으로 option map 을 만듬.
    const prodOptionMap = new Map(
      product.options.map((option) => [option.id, option]),
    );

    // option 이 있는지 검사. 하나라도 실제 product 에 없는 option 이 검출된다면
    // 가차없이 종료
    if (!options.every((option) => prodOptionMap.has(option.id))) {
      return { success: false, code: 'invalid_option' };
    }

    // 이미 카트에 담겨있는 물품일 경우를 찾음. (user와 product_id를 기준으로 함)
    // 이 때, 즉시 구매(usage가 instant_payment)일 경우에는
    // 물품이 중복되든 안 되든 기존에 있던 카트에는 영향을 끼치지 않고
    // 무조건 카트를 생성해야 하므로, if 문을 건너뛸 수 있도록 null 로 설정.
    const cartitem =
      usage !== 'instant_payment'
        ? await model.Cartitem.findOne({
            user,
            product_id,
            usage: 'normal',
          }).exec()
        : null;

    if (cartitem) {
      // input 으로 들어왔던 각 option을 순회
      options.forEach((option) => {
        // 이미 존재하는 카트에서 해당 option 을 검색
        const foundOption = cartitem.options.find(
          (optInner) => optInner.id === option.id,
        );

        // 해당 option이 존재한다면 개수를 추가시켜줌.
        if (foundOption) {
          foundOption.count += option.count;
        }

        // 만약 못 찾았다면 새로운 옵션을 추가했다는 뜻이므로
        // 새롭게 push 해줌.
        else {
          cartitem.options.push({
            ...option,
            price: prodOptionMap.get(option.id)?.price,
            content: prodOptionMap.get(option.id)?.content,
          });
        }
      });

      // 수정일 갱신
      cartitem.modified = modified;
      await cartitem.save();
      return { success: true, code: 'added', doc: cartitem.toObject() };
    }

    // 카트에 없다면 새로 만들면 됨.
    // 이미 존재하는 product 의 option 관련 정보 (price, content 등)를 newInput에 넣어줌.
    const newInput = {
      ...input,
      options: options.map((option) => ({
        ...option,
        price: prodOptionMap.get(option.id)?.price,
        content: prodOptionMap.get(option.id)?.content,
      })),
      product: { ...product.toObject() },
    };
    // newInput.product = ;
    delete newInput.product._id; // product 복사하돼 mongodb id 값은 삭제함.
    // console.log('newInput!!');
    // console.log(newInput);

    // 이미 존재하는 product 의 option 관련 정보 (price, content 등)를 newInput에 넣어줌.
    // const newOptions = options.map((option) => ({
    //   ...option,
    //   price: prodOptionMap.get(option.id)?.price,
    //   content: prodOptionMap.get(option.id)?.content,
    // }));
    // newInput.options = newOptions;

    // const keysForCopy = ['content', 'price'];
    // newInput.options.forEach((newOption) => {
    //   const { id } = newOption;

    //   const foundProdOption = product.options.find(
    //     (prodOption) => prodOption.id === id,
    //   );
    //   if (foundProdOption) {
    //     keysForCopy.forEach((key) => {
    //       newOption[key] = foundProdOption[key];
    //     });
    //   }
    // });
    const created = await model.Cartitem.create(newInput);

    // product에 해당하는 cartitem 추가
    product.related_cartitems.push(created.id);
    await product.save();

    return { success: true, code: 'created', doc: created.toObject() };
  }

  /**
   * 카트아이템 id 와 해당 옵션 id를 이용하여 count를 수정합니다.
   * modified 가 current 보다 최근일 경우, 수정하지 않습니다.
   * 해당 카트아이템이 해당 이메일(유저) 것이 아니라면, 수정하지 않습니다.
   * @param id
   * @param optionId
   * @param count
   * @param current
   * @param email
   */
  async updateCartitemOption(
    id: number,
    optionId: string,
    count: number,
    current: Date,
    email: string,
  ): Promise<{ success: boolean; code: string }> {
    const item = await model.Cartitem.findOne({ id, user: email });

    // 아이템이 존재하지 않는다면 에러.
    if (!item) return { success: false, code: 'no_item' };

    // 갱신하는 시간이 더 오래되었다면 아무것도 하지 않음.
    if (item.modified > current) {
      return { success: false, code: 'time_elapsed' };
    }

    const found = item.options.find((i) => i.id === optionId);

    // 옵션을 찾을 수 없다면 에러.
    if (!found) return { success: false, code: 'no_option' };

    found.count = count;
    item.modified = current;
    await item.save();

    // console.log('#db updateCartitemOption');
    // console.log(saved);
    return { success: true, code: '' };
  }

  /**
   * cartitem 을 삭제합니다. product 에 있는 id는 삭제하지 않습니다.
   * @param id
   */
  async removeCartitem(id: number): Promise<{ success: boolean }> {
    await model.Cartitem.deleteOne({ id }).lean().exec();
    return { success: true };
  }

  /**
   * 오래된 instant_payment cartitem 을 삭제합니다. 기본 기준 값은 14일입니다.
   * @param dateBefore
   */
  async removeOldInstantPaymentCartitem(dateBefore = 14): Promise<void> {
    const now = new Date();
    const lte = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() - dateBefore,
    );
    await model.Cartitem.deleteMany({
      usage: 'instant_payment',
      added: {
        $lte: lte,
      },
    });
  }

  /*= ====================================
  주문
  ===================================== */

  /** 주문을 얻을 때 사용하는 쿼리를 만듭니다. */
  buildOrdersQuery(condition: OrderSearch = {}): Query<IOrder[], IOrder> {
    const {
      date_gte = new Date(0),
      date_lte = new Date(),
      status,
      status_list = [],
      user,
      method,
      id,
    } = condition;

    // 우선 정렬

    const query = model.Order.find().sort({ c_date: -1 });

    // id 정확하게 검색
    if (id) {
      query.find({ id });
    }

    // 유저 이메일 필터
    if (user) {
      query.find({ user });
    }

    // 날짜 필터
    if (date_gte instanceof Date && date_lte instanceof Date) {
      query.find({
        c_date: {
          $gte: date_gte,
          $lte: date_lte,
        },
      });
    }
    // 상태 필터
    if (status) {
      query.find({ status });
    } else if (status_list.length > 0) {
      query.find({ status: { $in: status_list } });
    }
    // 결제수단 필터
    if (method) {
      query.find({ method });
    }

    return query;
  }

  /** 주문 여러개를 얻습니다. */
  async getOrders(
    condition: OrderSearch = {},
  ): Promise<GetDBItems<IOrder> & { transporting: number }> {
    const { page, perpage } = condition;
    // console.log('# db getOrders condition');
    // console.log(condition);

    const query = this.buildOrdersQuery(condition);

    // 총 갯수 구하기
    const total = (await query.exec()).length;

    // 총 배송중 개수 구하기 (지금까지의 조건에 추가하여 적용. 별도로 작동되는 건 아님.)
    const transporting = (
      await this.buildOrdersQuery()
        .find({ status: 'transporting' })
        .lean()
        .exec()
    ).length;

    // const transportingQuery = query.find({status: 'transporting"});
    // const transportingQuery = query.find({status: 'payment_success'});
    // const transporting = (await transportingQuery.lean().exec()).length

    // console.log('# db getOrders transporting, condition');
    // console.log(transporting);
    // console.log(condition);

    // 페이지별로 잘라내기
    if (typeof page === 'number' && typeof perpage === 'number') {
      query.limit(perpage).skip(perpage * page);
    }
    const list = await query.lean().exec();

    // console.log('# db getOrders transporting');
    // console.log(list);

    // 결과 리턴
    return {
      total,
      list,
      transporting,
    };
  }

  /**
   * 주문 하나에 대한 상세 정보를 얻습니다.
   * @returns {Promise<Orderinfo>}
   */
  async getOrder(id): PromLD<IOrder> {
    return model.Order.findOne({ id }).lean().exec();
  }

  /**
   * 주문을 새롭게 만듭니다.
   * @param input
   */
  async createOrder(input: Orderinfo): PromLD<IOrder> {
    const order = await model.Order.create(input);
    if (order) return order.toObject();
    return null;
  }

  /**
   * 주문 정보를 갱신합니다.
   * @param id
   * @param input
   */
  async updateOrder(id: number, input: OrderInput): Promise<void> {
    await model.Order.updateOne({ id }, input).lean().exec();
  }

  /**
   * 주문을 삭제합니다.
   * @param id
   */
  async removeOrder(id: number): Promise<void> {
    await model.Order.deleteOne({ id });
  }

  /**
   * 어떤 유저의 유효하지 않은 주문을 모두 삭제합니다.
   * 유효하지 않은 주문이란, 결제 수단이 무통장입금이 아닌 데에도 아직
   * 결제 대기중인 주문을 이야기합니다.
   * 이 주문들은 결제 모듈에서 결제에 실패했기 때문에 계속 남아있습니다.
   * 호출 시점은 특정 주문이 마치고 난 이후입니다.
   * @param email
   */
  async removeDangledOrder(email: string): Promise<void> {
    await model.Order.deleteMany({
      user: email,
      method: { $ne: 'nobank' },
      status: 'payment_confirming',
    });
  }

  /**
   * 각 Status 마다 주문의 갯수를 구합니다.
   */
  async getOrderCountGroupedByStatus(
    condition: OrderSearch,
  ): Promise<GetOrderCountGroupedByStatusResult> {
    const refined_condition = { ...condition };
    delete refined_condition.page;
    delete refined_condition.perpage;
    return model.Order.aggregate([
      {
        $match: {
          ...condition,
        },
      },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]);
  }

  /*= ====================================
  사이트 옵션 site option
  ===================================== */
  /**
   * 사이트 옵션을 설정합니다. 이미 있는 설정일 경우 덮어씌웁니다.
   * @param name
   * @param {*} value
   * @param type
   */
  async setSiteOption(
    name: string,
    value: JsonValue,
    type: SiteOptionType,
  ): Promise<{ name?: string; success?: boolean; code?: string }> {
    const found = await model.SiteOption.findOne({ name }).exec();
    if (found) {
      found.type = type;
      found.value = value;
      found.markModified('value');
      await found.save();
      return { name, success: true, code: 'updated' };
    }
    await model.SiteOption.create({
      name,
      value,
      type,
    });
    return { name, success: true, code: 'created' };
  }

  /**
   * 사이트 옵션 값을 얻습니다. (파일일 경우는 받지 않습니다.)
   * @param name
   */
  async getSiteOption(name: string): PromLD<ISiteOption> {
    return model.SiteOption.findOne({ name }).lean().exec();
  }

  /**
   * 이메일이 저장되어 있는 사이트 옵션을 읽어서 이메일 리스트를 가져옵니다.
   * 옵션은 반드시 value: [{email: ...}, {email: ...}] 와 같이 저장되어 있어야 합니다.
   */
  async getEmailsFromSiteOption(optionName: string): Promise<string[]> {
    const option = await model.SiteOption.findOne({ name: optionName });
    if (!option || !Array.isArray(option.value)) return [];
    const emailObjs = option.value ?? [];
    const emails = emailObjs.map((emailObj: JsonObject) => emailObj.email);
    // 하나라도 형태가 이상하면 아무 행동도 하지 않음.
    if (!isStringArray(emails)) return [];
    return emails;
  }

  /**
   * 사이트 옵션을 삭제합니다.
   * @param name
   */
  async removeSiteOption(name: string): Promise<{ success: boolean }> {
    const result = await model.SiteOption.deleteOne({ name });
    // console.log('# removesiteOption');
    // console.log(result);
    if (result.deletedCount !== 1) return { success: false };
    return { success: true };
  }

  /*= ====================================
  공동체 상영 신청 Application
  ===================================== */

  /** 상영 신청 하나를 id로 찾습니다. */
  async getApplication(id: number): PromLD<IApplication> {
    const applDoc = await model.Application.findOne({ id }).lean().exec();
    const tokenDoc = await model.Token.findOne({ appl_id: applDoc.id })
      .lean()
      .exec();
    if (tokenDoc) {
      applDoc.reqdoc_token = tokenDoc.token;
      applDoc.reqdoc_expire_date = new Date(
        tokenDoc.c_date.getTime() + tokenDoc.ttl * 1000,
      );
    }
    return applDoc;
  }

  /** 조건에 따른 상영 신청들을 찾습니다. */
  async getApplications(
    input: ApplicationSearch,
  ): PromGetDBItems<IApplication> {
    const {
      page = 0,
      perpage = 20,
      date_gte,
      date_lte,
      doc_status,
      money_status,
      receipt_status,
      search,
      transport_status,
    } = input;

    const query = model.Application.find();

    if (date_lte || date_gte) {
      // console.log('getFilms: prod!!');
      const start_date: DateCond = {};
      if (date_lte) start_date.$lte = date_lte;
      if (date_gte) start_date.$gte = date_gte;
      query.find({ start_date });
    }

    if (search && search.length > 0) {
      // console.log(`getApplications: search: ${search}`);
      // query.find({ $text: { $search: search } }); // 단어 단위로 검색을 할 때 필요함. 검색 엔진 같은 느낌임.
      query.find({ search: new RegExp(`${search}`) });
    }

    // 각종 상태 필터링
    if (doc_status && doc_status.length !== 0) {
      query.find({ doc_status: { $in: doc_status } });
    }
    if (money_status && money_status.length !== 0) {
      query.find({ money_status: { $in: money_status } });
    }
    if (receipt_status && receipt_status.length !== 0) {
      query.find({ receipt_status: { $in: receipt_status } });
    }
    if (transport_status && transport_status.length !== 0) {
      query.find({ transport_status: { $in: transport_status } });
    }

    // 페이지 하기 전의 총 개수 구하기
    const total = (await query.exec()).length;

    // 페이지 설정 및 start_date 로 정렬
    if (page !== null && perpage) {
      // console.log('getApplications: page, perpage!!');
      query
        .limit(perpage)
        .skip(perpage * page)
        .sort({ start_date: -1 });
    }
    const docs = await query.lean().exec();

    // Token 정보를 읽어와서 doc 에 기입함.
    const proms = docs.map((applDoc) =>
      (async () => {
        const tokenDoc = await model.Token.findOne({ appl_id: applDoc.id });
        const copied = { ...applDoc };

        // tokenDoc 을 찾을 때만 값을 넣음.
        if (tokenDoc) {
          copied.reqdoc_token = tokenDoc.token;
          copied.reqdoc_expire_date = new Date(
            tokenDoc.c_date.getTime() + tokenDoc.ttl * 1000,
          );
        }
        return copied;
      })(),
    );
    const filtered = await allSettledFiltered(proms);

    return {
      total,
      list: filtered,
    };
  }

  /** 상영 신청을 생성합니다. */
  async createApplication(input: ApplicationInput): PromLD<IApplication> {
    return model.Application.create(input);
  }

  /**
   * 상영 신청을 삭제합니다.
   * @param id 신청서의 id
   */
  async removeApplication(id: number): Promise<{ success: boolean }> {
    await model.Application.deleteOne({ id });
    return { success: true };
  }

  /**
   * 상영 신청을 업데이트합니다.
   * @param id 신청서의 id
   * @param input 신청서 수정할 내용
   */
  async updateApplication(
    id: number,
    input: ApplicationInput,
  ): Promise<{ success: boolean }> {
    await model.Application.updateOne({ id }, input);
    return { success: true };
  }
}

/**
 * DB 매니저를 생성
 * @param {Object.<string, Model<MongooseDocument, {}>>} model 모델들의 집합
 * @returns {DBManager}
 */
export const make = (modelInput: ModelWrapper): DBManager => {
  // console.log(`DBManager make started: ${Object.keys(modelInput).join(', ')}`);
  // if (modelInput.make) throw Error('dbManager: model not initialized!');
  // initialized = true;
  model = modelInput;
  const manager = new DBManager();
  // manager.uploadFolder = 'uploads'; // removed! need check
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
// module.exports = {
//   make,
//   pwd_encrypt,
//   pwd_verify,
// };
