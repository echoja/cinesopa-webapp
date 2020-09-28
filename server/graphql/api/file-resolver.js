const Hangul = require('hangul-js');
const {
  ACCESS_ALL,
  ACCESS_ADMIN,
  ACCESS_AUTH,
  ACCESS_UNAUTH,
  makeResolver,
  db,
  file,
  fileManager,
} = require('../../loader');

// 관리자

// 파일 업로드는 별도의 multer 링크로 진행된다.
// getFileById .. 일단 네트워크 요청 횟수가 많아진다 하더라도 일단 하나하나 대응하도록 한다.

// 이용자
// extend type Query {
//   file(filename: String, id: Int): File
//   files(public: Boolean true): [File]
//   # fileByName(name: String!): File
// }

// extend type Mutation {
//   updateFile(filename: String!, input: FileInput!): File
//   removeFile(filename: String!): File
// }

const fileQueryResolver = makeResolver(async (obj, args, context, info) => {
  const { filename, id } = args;
  if (filename) {
    // eslint-disable-next-line no-return-await
    return file.getFile(filename);
  }
  if (id) {
    // todo
  }
  return null;
}).only(ACCESS_ALL);
// 파일들 얻기
const filesQueryResolver = makeResolver(async (obj, args, context, info) => {
  const { onlyManaged, page, perpage } = args;
  if (onlyManaged) {
    return db.getFilesManaged(page, perpage);
  }
  return db.getFiles();
}).only(ACCESS_ADMIN);
// 파일 업데이트
const updateFile = makeResolver(async (obj, args, context, info) => {
  const { filename, input } = args;
  await db.updateFile(filename, input);
  return file.getFile(filename);
}).only(ACCESS_ADMIN);
// 파일 삭제
const removeFile = makeResolver(async (obj, args, context, info) => {
  const { filename } = args;
  const found = file.getFile(filename);
  await file.removeFile(filename);
  return found;
}).only(ACCESS_ADMIN);

module.exports = {
  Query: {
    file: fileQueryResolver,
    files: filesQueryResolver,
  },
  Mutation: {
    updateFile,
    removeFile,
  },
};
