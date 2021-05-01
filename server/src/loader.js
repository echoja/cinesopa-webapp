/* 외부 모듈들 */
const path = require('path');

const mongoose = require('mongoose');
const passport = require('passport');
const nodemailer = require('nodemailer');

/* db */
const model = require('./db/model').make(mongoose);
const db = require('./manager/db').make(model);

/* mail template */

const mailTemplateFileInfo = {
  'verify-mail': path.resolve(__dirname, 'mail-template/verify-mail.pug'),
  'payment-success': path.resolve(
    __dirname,
    'mail-template/payment-success.pug',
  ),
  'change-password': path.resolve(
    __dirname,
    'mail-template/change-password.pug',
  ),
  'changed-agreed': path.resolve(__dirname, 'mail-template/changed-agreed.pug'),
  advertisement: path.resolve(__dirname, 'mail-template/advertisement.pug'),
};
const { makeTemplateMap } = require('./mail-template/template-map');

/**
 * mail Template Map
 * 파일로부터 템플릿 정보를 받아오므로 일단 Promise 형태입니다.
 * 추후 이용할 때 Promise.resolve() 함수를 이용해 Promise 형태를 풀어야 합니다.
 */
const mailTemplateMap = makeTemplateMap(mailTemplateFileInfo);

/* mail manager */
const mailManagerMaker = require('./manager/mail').default;
const { gmailEmail, gmailPassword } = require('../config/common');

const mailTransporter = mailManagerMaker.makeWeakTransporter(
  nodemailer.createTransport,
  'gmail',
  gmailEmail,
  gmailPassword,
);
const mail = mailManagerMaker.make(mailTransporter, {
  templateMapPromise: mailTemplateMap,
});

/* mail template refiner */
const templateArgsRefiner = require('./mail-template/template-args-refiner').make();

/* bootpay */
const bootpay = require('./manager/bootpay').make();

/* service */
const user = require('./service/user').make(db, mail);

// const page = require('./service/page').make(db);
const payment = require('./service/payment').make(db, bootpay);

const auth = require('./service/auth').make(db);

const dest = 'uploads/';
const field = 'bin';
const fileManager = require('./manager/file');
const file = require('./service/file').default.make(
  db,
  fileManager,
  dest,
  field,
);

/* validator */
const validatorInitializer = require('./auth/validator');

const validator = validatorInitializer.make(auth.authmapLevel);

/* authMiddleware */
const { makeAuthMiddleware } = require('./auth/middlewares');

/* passport graphql lodal strategy */
const {
  configureLocalAuth: configureLocalAuthImpl,
} = require('./auth/passport-config').default;

const configureLocalAuth = () => {
  configureLocalAuthImpl(passport, db);
};

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

const alist = enumAuthmap;
// /** @type {import('./typedef').AuthTypes} */
const ACCESS_ALL = [...alist];
const ACCESS_AUTH = alist.slice(0, -1);
const ACCESS_UNAUTH = alist.slice(-1);
const ACCESS_ADMIN = alist.slice(0, 1);
const makeResolver = require('./graphql/make-resolver').default.init(
  ACCESS_UNAUTH[0],
);

// eslint-disable-next-line operator-linebreak
// const uploadBaseUrl =
//   process.env.NODE_ENV === 'production'
//     ? 'https://sopaseom.com/upload/'
//     : '/upload/';
const uploadBaseUrl = '/upload/';
// eslint-disable-next-line operator-linebreak
const downloadBaseUrl = '/download/';
// const downloadBaseUrl =
//   process.env.NODE_ENV === 'production'
//     ? 'https://sopaseom.com/download/'
//     : '/download/';

/* mail template */

// const mailGenerator = require('./mail-template/generate');
// console.log(mailGenerator('verify-mail', {}));

module.exports = {
  mail,
  templateArgsRefiner,
  model,
  db,
  user,
  auth,
  // page,
  fileManager,
  validator,
  file,
  payment,
  configureLocalAuth,
  makeAuthMiddleware,
  makeResolver,
  uploadBaseUrl,
  downloadBaseUrl,
  mailTemplateMap,
  ACCESS_ALL,
  ACCESS_AUTH,
  ACCESS_UNAUTH,
  ACCESS_ADMIN,
};
