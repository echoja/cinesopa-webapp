const path = require("path");
const multer = require("multer");
require("../typedef");

/** @type {DBManager} */
let db;

/** @type {FileManager} */
let file;

/** @type {string} */
let dest;

/** @type {string} */
let uploadField;

// const file = require("../manager/file");
// /**
//  * 파일을 새로 만듭니다.
//  * @param {Express.Multer.File} fileinfo
//  */
// const newFile = async (fileinfo) => {};

/**
 *
 * @param {string} filename 실제 저장되는 파일 이름
 */
const removeFile = async (filename) => {
  const toRemove = await db.getFile(filename);
  const fullpath = toRemove.path;
  await db.removeFile(filename);
  await file.removeFile(fullpath);
};

/**
 * 본래 있던 파일을 삭제하고 데이터베이스는 새로운 파일로 갱신합니다.
 * @param {string} origin 원래의 filename
 * @param {Fileinfo} replacement 바꿀 파일의 정보
 * @param {string} owner 소유자의 email
 */
const replaceFile = async (origin, replacement, owner) => {
  await file.removeFile(origin);
  await db.createFile(replacement, owner);
  await db.removeFile(replacement.filename);
};

/**
 * 실제 파일은 존재하지만 db에서 추적되지 않는 파일을 얻습니다.
 * @returns {Promise<string[]>} filename 의 배열
 */
const getUntrackedFiles = async () => {
  const dbFiles = await db.getFiles();
  const actualFilenames = await file.getFiles(dest);
  const untracked = actualFilenames.filter((actualFilename) => {
    return dbFiles.findIndex((dbFile) => {
      return dbFile.filename === actualFilename;
    }) === -1
      ? true
      : false;
  });
  return untracked;
};

const makeMulter = () => multer({ dest }).single(uploadField);
/**
 * db 상 존재하지만 실제 파일이 없는 파일을 얻습니다. (아직 구현 안함)
 * @returns {Promise<string[]>} filename 의 배열
 */
const getDangledFiles = async () => {};

module.exports = {
  make(dbManager, fileManager, deststr, uploadFieldstr) {
    db = dbManager;
    file = fileManager;
    dest = deststr;
    uploadField = uploadFieldstr;
    // console.log(path.join(dest));
    return {
      removeFile,
      replaceFile,
      getUntrackedFiles,
      getDangledFiles,
      uploadMiddleware: makeMulter(),
    };
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
