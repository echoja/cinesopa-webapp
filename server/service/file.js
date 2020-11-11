const path = require('path');
const multer = require('multer');
// const { promisify } = require('util');
const sizeOf = require('image-size');

require('../typedef');
const { aw } = require('../util');

// const sizeOf = promisify(sizeOfCallbackBased);

class FileService {
  /** @type {DBManager} */
  #db;
  /** @type {FileManager} */
  #file;
  /** @type {string} */
  #dest;
  /** @type {string} */
  #uploadField;

  uploadMiddleware;

  #initCreateFileMiddleware = (db, file) => {
    return async (req, res, next) => {
      let fullpath = '';
      try {
        // console.log('ho~~~~~~!~!~!~!~!~!~!~!~!');
        const fileinfo = {};
        const { file: fileObj } = req;
        ['filename', 'mimetype', 'path', 'encoding', 'size'].forEach((key) => {
          fileinfo[key] = fileObj[key];
        });
        fullpath = fileObj.path;
        fileinfo.origin = fileObj.originalname;
        const fileRegex = /(.+)\.([0-9a-zA-Z]+)$/;
        const [_, label, extension] = fileObj.originalname.match(fileRegex);
        fileinfo.extension = extension;
        fileinfo.label = label;
        fileinfo.alt = label;
        // 이메일
        const email = req?.user?.email;
        if (email) fileinfo.owner = email;

        // public은 기본적으로 true 여야 함.
        fileinfo.public = true;

        // managed도 기본적으로 true 여야 함.
        fileinfo.managed = true;

        fileinfo.fileurl = `/upload/${fileObj.filename}`;

        // 만약 이미지일 경우 사이즈 지정
        if (fileObj.mimetype.startsWith('image')) {
          const dimensions = sizeOf(fileObj.path);
          fileinfo.width = dimensions.width;
          fileinfo.height = dimensions.height;
        }

        // db에 새롭게 저장
        await db.createFile(fileinfo, email);

        res.send({ message: 'success', file: fileinfo });
        // next();
      } catch (error) {
        next(error);
        await file.removeFile(fullpath);
        console.log(
          '파일 업로드 중 에러로 인해 중단하고 업로드했던 파일을 삭제했습니다.',
        );
        console.error(error);
      }
    };
  };

  #initMulterMiddleware = (dest, uploadField) => {
    return multer({ dest }).single(uploadField);
  };

  constructor(db, file, dest, uploadField) {
    this.#db = db;
    this.#file = file;
    this.#dest = dest;
    this.#uploadField = uploadField;
    this.uploadMiddleware = [
      this.#initMulterMiddleware(this.#dest, this.#uploadField),
      this.#initCreateFileMiddleware(this.#db, this.#file),
    ];
  }

  getFileMiddleware = aw(async (req, res, next) => {
    // console.log(req.params.filename);
    // 파일 이름이 주어지지 않을 경우 404
    const { filename } = req.params;
    if (!filename) return res.status(404).send();

    // 파일이름으로 찾기 시도. 찾을시 바로 보냄.
    const foundByFilename = await this.#db.getFile(filename);
    // console.log(foundByFilename.path);
    // console.log(__dirname);
    if (foundByFilename) return res.sendFile(absPath(foundByFilename.path));

    // 옵션으로 파일 찾기 시도. 못찾을시 404
    const optionName = filename;
    const fileByOption = await this.#db.getFilebyOptionName(optionName);
    // if (!fileByOption) return res.status(404).send();

    // // 옵션이 주어진다면, 해당하는 파일 보내기.
    // const fileByOption = await this.#db.getFile(foundOption.value);
    if (fileByOption) return res.sendFile(absPath(fileByOption.path));

    // 해당하는 옵션의 파일도 존재하지 않는다면, 404
    return res.status(404).send();
  });

  // /**
  //  * Option Name 으로 파일을 얻어다주는 Middleware.
  //  */
  // getFileByNameMiddleware = aw(async (req, res, next) => {
  //   const { name } = req.params;
    
  //   // name 이 주어지지 않았을 경우 
  //   if (!name) return res.status(404).send();


  // })

  async getFile(filename) {
    return this.#db.getFile(filename);
  }
  async getFiles() {
    return this.#db.getFiles();
  }

  /**
   *
   * @param {string} filename 실제 저장되는 파일 이름
   * @throws 파일이 db상 존재하지 않을 때
   */
  async removeFile(filename) {
    const toRemove = await this.#db.getFile(filename);
    if (!toRemove) throw Error(`파일이 존재하지 않습니다: ${filename}`);
    const fullpath = toRemove.path;
    await this.#db.removeFile(filename);
    await this.#file.removeFile(fullpath);
  }

  /**
   * 본래 있던 파일을 삭제하고 데이터베이스는 새로운 파일로 갱신합니다.
   * @param {string} origin 원래의 filename
   * @param {Fileinfo} replacement 바꿀 파일의 정보
   * @param {string} owner 소유자의 email
   */
  async replaceFile(origin, replacement, owner) {
    await this.#file.removeFile(origin);
    await this.#db.createFile(replacement, owner);
    await this.#db.removeFile(replacement.filename);
  }
  /**
   * 실제 파일은 존재하지만 db에서 추적되지 않는 파일을 얻습니다.
   * @returns {Promise<string[]>} filename 의 배열
   */
  async getUntrackedFiles() {
    const dbFiles = await this.#db.getFiles();
    const actualFilenames = await this.#file.getFiles(this.#dest);
    const untracked = actualFilenames.filter(
      (actualFilename) =>
        // eslint-disable-next-line implicit-arrow-linebreak
        dbFiles.findIndex((dbFile) => dbFile.filename === actualFilename) ===
        -1,
    );
    return untracked;
  }
  /**
   * db 상 존재하지만 실제 파일이 없는 파일을 얻습니다. (아직 구현 안함)
   * @returns {Promise<string[]>} filename 의 배열
   */

  async getDangledFiles() {}
}
// /** @type {DBManager} */
// let db;

// /** @type {FileManager} */
// let file;

// /** @type {string} */
// let dest;

// /** @type {string} */
// let uploadField;

// const file = require("../manager/file");
// /**
//  * 파일을 새로 만듭니다.
//  * @param {Express.Multer.File} fileinfo
//  */
// const newFile = async (fileinfo) => {};

// const
// const getFile = async (filename) => db.getFile(filename);

// const
// const getFiles = async () => db.getFiles();

// const makeMulter = () => {
//   return;
// };

const absPath = (relative) => path.join(__dirname, '../', relative);

module.exports = {
  make(dbManager, fileManager, deststr, uploadFieldstr) {
    return new FileService(dbManager, fileManager, deststr, uploadFieldstr);
    // console.log(path.join(dest));
    // return {
    //   getFile,
    //   getFiles,
    //   removeFile,
    //   replaceFile,
    //   getUntrackedFiles,
    //   getDangledFiles,
    //   uploadMiddleware: makeMulter(),
    //   getFileMiddleware,
    // };
  },

  // req.user로 유저 데이터 접근 가능
  // req.isAuthenticated() 로 지금 인증된 상태인지 확인 가능
  // key를 넣어서 업로드하는 것은 외부로 공개되지 않는 파일만 가능하다. params에서 권한을 설정할 수 있다.
  // 이 기능은 authenticated 되어야 한다.
  // uploadMiddleware(req, res, next) {
  //   if (req.isAuthenticated() && req.user.role === "ADMIN") {
  //     console.log(req.params);
  //     console.log(req.body);
  //     console.log(req.file);
  //     res.status(204).send();
  //   } else {
  //     res.send("not authenticated!");
  //   }
  // },
};
