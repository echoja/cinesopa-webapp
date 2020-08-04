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
const webapp = express();

// initial mongoose
dbServerInit();

// session settings
webapp.use(
  session({
    genid: (req) => uuidv4(),
    secret: config.sessionSecret, // env secret required
    resave: false,
    saveUninitialized: false,
    //cookie: {secure: true, domain: 'sopaseom.com'}, // send cookies over https
    store: new MongoStore({
      url: config.mongodbUrl, // env required
      collection: "sessions",
    }), // store
  })
);
localAuthConfig();
webapp.use(passport.initialize()); // passport 구동
webapp.use(passport.session());

// configuring logger
webapp.use(logger("combined"));

// router
webapp.use("/", getRouter(webapp));

// configuring http to https
/*const redirector = redirect_https({
  body: "<!-- Hello Developer! Please use HTTPS instead: {{ URL }} -->",
});*/
// const unsecure_webapp = express();
// unsecure_webapp.use("/", redirector);

// http.createServer(unsecure_webapp).listen(80);
/*webapp.use("/", redirector);*/
// webapp.use(authenticateLocal);

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
// }).serve(webapp);

// MUST connect with https : https://localhost:4000/graphql
// https
//   .createServer(options, webapp)
//   .listen(4000, () => console.log("Now browse to localhost:4000/graphql"));
webapp.use("/", (req, res, next) => {
   console.log(req.session);
   next();
});
webapp.use("/cinesopa", express.static("dist/cinesopa"));
webapp.use("/sopaseom", express.static("dist/sopaseom"));
// webapp.use(express.static('dist'));
webapp.listen(4000, () => console.log("soapseom and cinesopa server started!"));
// http.createServer(webapp).listen();

// const cinesopa = express();

// cinesopa.listen(5000, () => console.log("cinesopa started!"));
