/* 다른 모듈들 */

const mongoose = require('mongoose');
const nodemailer = require('nodemailer');

/* manager */
const mailManagerMaker = require('./manager/mail');
const { gmailEmail, gmailPassword } = require('./config/common');

const mailTransporter = mailManagerMaker.makeWeakTransporter(
  nodemailer.createTransport,
  'gmail',
  gmailEmail,
  gmailPassword,
);
const mail = mailManagerMaker.make({}, mailTransporter);

const model = require('./db/model').make(mongoose);
const db = require('./manager/db').make(model);

/* service */
const user = require('./service/user').make(db, mail);

const page = require('./service/page').make(db);

const fileManager = require('./manager/file');

const auth = require('./service/auth').make(db);

const dest = 'uploads/';
const field = 'bin';
const file = require('./service/file').make(db, fileManager, dest, field);

/* validator */
const validatorInitializer = require('./auth/validator');

const validator = validatorInitializer.make(auth.authmapLevel);

/* authMiddleware */
const makeAuthMiddleware = require('./auth/auth-middleware').make;

/* passport graphql lodal strategy */
const local = require('./auth/passport');

const localAuthConfig = local.make(db);

// const localAuthConfig = local.make(db.getUserByEmail, async (email, pwd) => {
//   if (await db.isCorrectPassword(email, pwd)) {
//     console.log(`getUserByAuth successed: email: ${email}, pwd: ${pwd}`);
//     return db.getUserByEmail(email);
//   }
//   console.error('getUserByAuth failed');
//   return null;
// });

/** resolver */
const { enumAuthmap } = require('./db/schema/enum');

const alist = enumAuthmap.raw_str_list;
const ACCESS_ALL = alist;
const ACCESS_AUTH = alist.slice(0, -1);
const ACCESS_UNAUTH = alist.slice(-1);
const ACCESS_ADMIN = alist.slice(0, 1);
const makeResolver = require('./graphql/make-resolver').init(ACCESS_UNAUTH[0]);

// eslint-disable-next-line operator-linebreak
const uploadBaseUrl =
  process.env.NODE_ENV === 'production'
    ? 'https://sopaseom.com/upload/'
    : '/upload/';
// eslint-disable-next-line operator-linebreak
const downloadBaseUrl =
  process.env.NODE_ENV === 'production'
    ? 'https://sopaseom.com/download/'
    : '/download/';

module.exports = {
  mail,
  model,
  db,
  user,
  auth,
  page,
  fileManager,
  validator,
  file,
  localAuthConfig,
  makeAuthMiddleware,
  makeResolver,
  uploadBaseUrl,
  downloadBaseUrl,
  ACCESS_ALL,
  ACCESS_AUTH,
  ACCESS_UNAUTH,
  ACCESS_ADMIN,
};
