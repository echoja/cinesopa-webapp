import express from "express";
import http from "http";
import https from "https";
import graphqlHTTP from "express-graphql";
import { schema, root } from "./graphql/schema.js";
import { privateKey, certificate, passphrase } from "./cert/ssl-config.js";
import logger from "morgan";
//var { buildSchema } = require('graphql');
import redirect_https from "redirect-https";
import session from "express-session";
import passport from "passport";
import { localAuthConfig } from "./auth/local.js";
// import { GraphQLLocalStrategy, buildContext } from 'graphql-passport';
import gp from "graphql-passport";
const { GraphQLLocalStrategy, buildContext } = gp;
import { v4 as uuidv4 } from "uuid";
import connectMongo from "connect-mongo";
const MongoStore = connectMongo(session);

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

// graphiql settings
app.use("/graphql", (req, res, next) => {
  graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true,
    context: buildContext({req, res}),
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
