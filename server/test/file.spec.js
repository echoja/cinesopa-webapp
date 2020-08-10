const { inspect } = require("util");
const axios = require("axios");
const express = require("express");
const app = express();
const upload = require("multer")({ dest: "uploads/" }).single("bin");
app.use("/upload", upload, (req, res, next) => {
  res.send(
    `req: ${inspect(req)}


res: ${inspect(res)}

`
  );
});


describe("multer", function () {
  let server;

  before("웹앱 초기화", async function () {
    server = app.listen(4000);
  });

  it("multer 작동시 파일 생성", async function() {
    
  });

  after("웹앱 종료", async function () {
    server.close();
  })
  
})