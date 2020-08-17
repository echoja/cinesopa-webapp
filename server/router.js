const express = require("express");
const { enumAuthmap } = require("./db/schema/enum");
const path = require("path");
const history = require("connect-history-api-fallback");

// const upload = require("multer")({ dest: "uploads/" }).single("bin");
const { graphQLServerMiddleware } = require("./graphql");
const {
  file: { uploadMiddleware },
  makeAuthMiddleware,
  validator,
  user,
  db,
} = require("./loader");

const router = express.Router();

// upload
router.post("/upload", makeAuthMiddleware(validator, [enumAuthmap.ADMIN]), uploadMiddleware);

// graphiql
router.use("/graphql", graphQLServerMiddleware);


router.get("/test/remove-user/:email", (req, res, next) => {
  db
    .removeUserByEmail(req.params.email)
    .then((user) => {
      res.send(user);
    })
    .catch((error) => {
      // console.error(error);
      res.status(500).send(error);
    });
});

router.get("/test/make-super-user", (req, res, next) => {
  user
    .initAdmin()
    .then((result) => {
      res.send("admin create successed!");
    })
    .catch((error) => {
      res.send(error);
    });
});

/**
 * 
 * @param {import("express").Express} app 
 */
module.exports.getRouter = (app) => {
  app.use("/cinesopa", history({
  //   // rewrites: [
  //   //   { from: /\/graphql/, to: '/graphql'}
  //   // ],
  //   // index: '/cinesopa/index.html',
    verbose: true, // production settings required
  }));
  app.use(
    "/sopaseom",
    history({
      // rewrites: [
      //   { from: /\/graphql/, to: '/graphql'}
      // ],
      // index: '/sopaseom/index.html',
      verbose: true, // production settings required
    })
  );
  // app.use(express.static('dist'));
  return router;
};
