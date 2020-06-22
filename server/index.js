const express = require("express");
const http = require("http");
const https = require("https");
const logger = require("morgan");
const redirect_https = require("redirect-https");
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

// create express app
var app = express();

// initial mongoose
dbServerInit();

// session settings
app.use(
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
app.use(passport.initialize()); // passport 구동
app.use(passport.session());

// configuring logger
app.use(logger("combined"));

// router
app.use("/", getRouter(app));

// configuring http to https
const redirector = redirect_https({
  body: "<!-- Hello Developer! Please use HTTPS instead: {{ URL }} -->",
});
// const unsecure_app = express();
// unsecure_app.use("/", redirector);

// http.createServer(unsecure_app).listen(80);
app.use("/", redirector);
// app.use(authenticateLocal);

// configuring https connection
const options = {
  key: config.privateKey,
  cert: config.certificate,
  // passphrase
};

// MUST connect with https : https://localhost:4000/graphql
https
  .createServer(options, app)
  .listen(4000, () => console.log("Now browse to localhost:4000/graphql"));
