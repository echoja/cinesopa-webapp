const pug = require("pug");
const file = require("../service/file");
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
const makeAgent = require("supertest").agent;
const app = express();

describe("multer", function () {
  /** @type {import("supertest").SuperAgentTest} */
  let agent;

  before("웹앱 초기화", async function () {
    const uploadMiddleware = require("multer")({
      dest: "test/upload-middlewares/",
    }).single("bin");

    app.post("/upload", uploadMiddleware, (req, res, next) => {
      console.dir(req.file);
      res.send({ message: "success" });
    });
    app.use()
    // app.get("/upload", function (req, res, next) {
    //   res.send(pug.compileFile(path.join(__dirname, "upload-test.pug"))());
    // });
    agent = makeAgent(app);
  });

  it("업로드 성공 테스트", async function (done) {
    try {
      const result = await agent
        .post("/upload")
        .attach("bin", path.join(__dirname, "tool.js"));
      console.dir(result.body);
      expect(result.body.message).to.equal("success");
      done();
    } catch (error) {
      done(error);
    }
  });
});
