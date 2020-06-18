const express = require('express');
const router = express.Router();
const upload = require('multer')({dest:'uploads/'}).single('bin');
const schema = require("./graphql/schema.js");
const graphqlHTTP = require("express-graphql");
const { buildContext } = require("graphql-passport");
const createError = require('http-errors');

// default responding
router.get("/", (req, res) => {
  res.send("abcd");
});

// req.user로 유저 데이터 접근 가능
// req.isAuthenticated() 로 지금 인증된 상태인지 확인 가능
router.post("/upload", upload, (req, res, next) => {
  if (req.isAuthenticated() && req.user.role === "ADMIN" ) {
    console.log(req.body);
    console.log(req.file);
    res.status(204).send();
  } else {
    res.send("not authenticated!");
  }
});

// graphiql settings
router.use("/graphql", (req, res, next) => {
  graphqlHTTP({
    schema: schema,
    // rootValue: root,
    graphiql: true,
    context: buildContext({ req, res }),
    // context: ({ req, res }) => buildContext({ req, res }),
  })(req, res, next);
});


module.exports = router;