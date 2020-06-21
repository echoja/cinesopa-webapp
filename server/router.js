const express = require("express");
const path = require("path");
const history = require('connect-history-api-fallback');

const upload = require("multer")({ dest: "uploads/" }).single("bin");
const { graphQLServerMiddleware } = require("./graphql");
const { file } = require("./dao");


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

module.exports.getRouter = (app) => {
  app.use(history({
    rewrites: [
      { from: /\/graphql/, to: '/graphql'}
    ],
    // index: '/dist/index.html',
    verbose: true, // production settings required
  }));
  app.use(express.static('dist'));
  return router;
}


