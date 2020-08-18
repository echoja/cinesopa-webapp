/* 다른 모듈들 */

const mongoose = require("mongoose");
const nodemailer = require("nodemailer");

/* manager */
const mailManagerMaker = require("./manager/mail");
const { gmailEmail, gmailPassword } = require("./config");
const mailTransporter = mailManagerMaker.makeWeakTransporter(
  nodemailer.createTransport,
  "gmail",
  gmailEmail,
  gmailPassword
);
const mail = mailManagerMaker.make({}, mailTransporter);

const model = require("./db/model").make(mongoose);
const db = require("./manager/db").make(model);

/* service */
const user = require("./service/user").make(db, mail);

const page = require("./service/page").make(db);

const fileManager = require("./manager/file");

const auth = require("./service/auth");

const dest = "uploads/";
const field = "bin";
const file = require("./service/file").make(db, fileManager, dest, field);

/* validator */
const validatorInitializer = require("./auth/validator");
const validator = validatorInitializer.make(auth.authmapLevel);

/* authMiddleware */
const makeAuthMiddleware = require("./auth/auth-middleware").make;

/* passport graphql lodal strategy*/
const local = require("./auth/local");
const localAuthConfig = local.make(
  db.getUserByEmail,
  async (email, pwd) => {
    if (await db.isCorrectPassword(email, pwd)) {
      console.log(`getUserByAuth successed: email: ${email}, pwd: ${pwd}`);
      return db.getUserByEmail(email);
    } else {
      console.error("getUserByAuth failed");
      return null;
    }
  }
);

module.exports = {
  mail,
  model,
  db,
  user,
  page,
  fileManager,
  validator,
  file,
  localAuthConfig,
  makeAuthMiddleware,
};
