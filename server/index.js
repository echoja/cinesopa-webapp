const express = require("express");
// const http = require("http");
// const https = require("https");
const logger = require("morgan");
// const redirect_https = require("redirect-https");
const session = require("express-session");
const passport = require("passport");
const { localAuthConfig } = require("./auth/local");
const { dbServerInit } = require("./dao/db/db-server");
const config = require("./config");
const { getRouter } = require("./router");
const uuidv4 = require("uuid").v4;
const MongoStore = require("connect-mongo")(session);

// running mode check
console.log(`This server is running in ${process.env.NODE_ENV} mode. `);
console.log(`This server locates in ${__dirname}`);

// create express app
const sopaseom = express();

// initial mongoose
dbServerInit();

// session settings
sopaseom.use(
  session({
    genid: (req) => uuidv4(),
    secret: config.sessionSecret, // env secret required
    resave: false,
    saveUninitialized: false,
    // cookie: {secure: true}, // send cookies over https
    store: new MongoStore({
      url: config.mongodbUrl, // env required
      collection: "sessions",
    }), // store
  })
);
localAuthConfig();
sopaseom.use(passport.initialize()); // passport 구동
sopaseom.use(passport.session());

// configuring logger
sopaseom.use(logger("combined"));

// router
sopaseom.use("/", getRouter(sopaseom));

// configuring http to https
/*const redirector = redirect_https({
  body: "<!-- Hello Developer! Please use HTTPS instead: {{ URL }} -->",
});*/
// const unsecure_sopaseom = express();
// unsecure_sopaseom.use("/", redirector);

// http.createServer(unsecure_sopaseom).listen(80);
/*sopaseom.use("/", redirector);*/
// sopaseom.use(authenticateLocal);

// configuring https connection
// const options = {
//   key: config.privateKey,
//   cert: config.certificate,
//   // passphrase
// };

// greenlock.init({
//   packageRoot: __dirname,
//   configDir: './greenlock.d',
//   maintainerEmail: "eszqsc112@naver.com", // env required 
//   cluster: false,
// }).serve(sopaseom);

// MUST connect with https : https://localhost:4000/graphql
// https
//   .createServer(options, sopaseom)
//   .listen(4000, () => console.log("Now browse to localhost:4000/graphql"));

sopaseom.listen(4000, () => console.log("soapseom server started!"));
// http.createServer(sopaseom).listen();

const cinesopa = express();
cinesopa.use(express.static('dist/cinesopa'));
cinesopa.listen(5000, () => console.log("cinesopa started!"));