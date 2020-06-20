const express = require("express");

const upload = require("multer")({ dest: "uploads/" }).single("bin");
const { graphQLServerMiddleware } = require("./graphql");
const { file } = require("./dao");


const router = express.Router();

// default responding
router.get("/", (req, res) => {
  res.send("abcd");
});

// upload secure things.
router.post("/upload/:key", upload, (req, res, next) => {});



router.post("/upload", upload, file.uploadMiddleware);

// graphiql
router.use("/graphql", graphQLServerMiddleware);

module.exports = router;
