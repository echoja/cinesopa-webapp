const express = require("express");
const http = require("http");
const https = require("https");
const graphqlHTTP = require("express-graphql");
const schema = require("./graphql/schema.js");
const { privateKey, certificate, passphrase } = require("./cert/ssl-config.js");
const logger = require("morgan");
//var { buildSchema } = require('graphql');
const redirect_https = require("redirect-https");
const session = require("express-session");
const passport = require("passport");
const { localAuthConfig } = require("./auth/local.js");
const { GraphQLLocalStrategy, buildContext } = require("graphql-passport");
const createError = require('http-errors');
const upload = require('multer')({dest:'uploads/'}).single('bin');

const uuidv4 = require("uuid").v4;
const MongoStore = require("connect-mongo")(session);

var app = express();
app.use(
  session({
    genid: (req) => uuidv4(),
    secret: "thisissecretman",
    resave: false,
    saveUninitialized: false,
    // cookie: {secure: true}, // send cookies over https
    store: new MongoStore({
      url: "mongodb://localhost/cinesopa",
      collection: "sessions",
    }), // store
  })
);
localAuthConfig();
app.use(passport.initialize()); // passport 구동
app.use(passport.session());

// configuring logger
app.use(logger("dev"));

// default responding
app.get("/", (req, res) => {
  res.send("abcd");
});

// req.user로 유저 데이터 접근 가능
// req.isAuthenticated() 로 지금 인증된 상태인지 확인 가능
app.post("/upload", upload, (req, res, next) => {
  if (req.isAuthenticated() && req.user.role === "ADMIN" ) {
    console.log(req.body);
    console.log(req.file);
    res.status(204).send();
  } else {
    res.send("not authenticated!");
  }
});

// graphiql settings
app.use("/graphql", (req, res, next) => {
  graphqlHTTP({
    schema: schema,
    // rootValue: root,
    graphiql: true,
    context: buildContext({ req, res }),
    // context: ({ req, res }) => buildContext({ req, res }),
  })(req, res, next);
});

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
  key: privateKey,
  cert: certificate,
  // passphrase
};

// MUST connect with https : https://localhost:4000/graphql
https
  .createServer(options, app)
  .listen(4000, () => console.log("Now browse to localhost:4000/graphql"));
