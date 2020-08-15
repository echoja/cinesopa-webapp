const pug = require("pug");
const path = require("path");
const fs = require("fs");
const FormData = require("form-data");
const { inspect } = require("util");
const { upload, createFileFromMockFile } = require("./tool");
const axios = require("axios");
const express = require("express");
const { title } = require("process");
const e = require("express");
const { expect } = require("chai");
const app = express();

const uploadMiddleware = require("multer")({
  dest: "test/upload-middlewares/",
}).single("bin");

app.post("/upload", uploadMiddleware, (req, res, next) => {
  res.send(
    `req: ${inspect(req, { compact: false })}
    
res: ${inspect(res.file)}

`
  );
  console.log(inspect(req, { compact: false, colors: true }));
});

app.get("/uploaded/:id", (req, res, next) => {
  const { id } = req.params;
  const filepath = `${__dirname}/upload-middlewares/${id}`;
  res.sendFile(filepath, { headers: { 'Content-disposition': 'attachment; filename=haha.power' } });
  // Content-Disposition: attachment; filename="filename.jpg"
  // res.download(filepath, "abc", {headers: {'Content-Type': 'image/jpeg'}});
});
app.use(require("morgan")("combined"));
app.get("/upload", function (req, res, next) {
  res.send(pug.compileFile(path.join(__dirname, "multer-test-client.pug"))());
});
app.get("/hi", function (req, res, next) {
  res.send("1234");
});
app.listen(4000, function () {
  console.log("server listen start");
});
