const express = require("express");
const path = require("path");
const history = require("connect-history-api-fallback");

const upload = require("multer")({ dest: "uploads/" }).single("bin");
const { graphQLServerMiddleware } = require("./graphql");
const { file, user } = require("./dao");

const router = express.Router();

// default responding
// router.get("/index.html", (req, res) => {
//   res.sendFile(path.join(__dirname, './dist', 'index.html'));
// });

// upload secure things.
router.post("/upload/:key", upload, (req, res, next) => {});

router.post("/upload", upload, file.uploadMiddleware);

// graphiql
router.use("/graphql", graphQLServerMiddleware);

router.get("/test", (req, res, next) => {
  console.dir(require("mongoose").model("Film").schema);
  next();
});

// router.get("/email_verify/:id", (req, res, next) => {
//   const { id } = req.params;
//   user.verifyEmail(id);
// });

router.get("/test/remove-user/:email", (req, res, next) => {
  user
    .removeUserByEmail({email: req.params.email})
    .then((user) => {
      res.send(user);
    })
    .catch((error) => {
      res.send(error);
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

module.exports.getRouter = (app) => {
  // app.use("/cinesopa", history({
  //   // rewrites: [
  //   //   { from: /\/graphql/, to: '/graphql'}
  //   // ],
  //   // index: '/cinesopa/index.html',
  //   verbose: true, // production settings required
  // }));
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
