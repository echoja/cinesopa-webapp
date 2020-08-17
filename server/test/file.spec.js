const sinon = require("sinon");
const pug = require("pug");
const fileService = require("../service/file");
const fileManager = require("../manager/file");
const path = require("path");
const fs = require("fs");
const FormData = require("form-data");
const { inspect } = require("util");
const { upload, createFileFromMockFile } = require("./tool");
const axios = require("axios");
const express = require("express");
const e = require("express");
const { expect } = require("chai");
const { connect } = require("http2");
const makeAgent = require("supertest").agent;
const app = express();

const dest = "test/upload-middlewares";
const field = "bin";

describe("path and fs", function () {
  const pathed = path.resolve("test/imsi");
  const imsi = "test/imsi";
  // console.log(pathed);
  it("mkdir works", function (done) {
    this.skip();
    if (!fs.existsSync(pathed)) {
      fs.mkdir(pathed, function (err) {
        if (err) return done(err);
        return done();
      });
    } else {
      done(new Error(`${pathed}가 이미 존재해요.`));
    }
  });

  // console.log(path.join("test/upload-middlewares"));
  // console.log(fs.mkdir(path))
});

const removeFilesInDir = (dest, done) => {
  fs.readdir(dest, (err, files) => {
    if (err) return done(err);
    for (const file of files) {
      try {
        fs.unlinkSync(path.join(dest, file));
      } catch (error) {
        done(error);
      }
    }
    done();
  });
};

describe("file Service", function () {
  describe("uploadMiddleware", function () {
    /** @type {import("supertest").SuperAgentTest} */
    let agent;

    before("웹앱 초기화", async function () {
      const file = fileService.make({}, fileManager, dest, field);
      const { uploadMiddleware } = file;

      app.post("/upload", uploadMiddleware, (req, res, next) => {
        const file = req.file;
        console.dir(req.file);
        res.send({ message: "success", file });
      });
      // app.get("/upload", function (req, res, next) {
      //   res.send(pug.compileFile(path.join(__dirname, "upload-test.pug"))());
      // });
      agent = makeAgent(app);
    });

    afterEach("업로드된 파일 삭제", function (done) {
      removeFilesInDir(dest, done);
    });

    it("업로드 성공 테스트", function (done) {
      agent
        .post("/upload")
        .attach("bin", path.join(__dirname, "tool.js"))
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body.message).to.equal("success");
          expect(res.body.file).to.be.a("object");
          const filepath = res.body.file.path;
          expect(fs.existsSync(filepath));
          return done();
        });
      // const result = await agent
      //   .post("/upload")
      //   .attach("bin", path.join(__dirname, "tool.js"));
      // console.dir(result.body);

      // done();
    });
  });

  describe(".removeFile", function (done) {
    it("파일이 있을 시 올바르게 삭제", function (done) {
      const fullpath = path.join(dest, "abcde");
      fs.writeFileSync(fullpath, "hiho");
      const db = {
        getFile: sinon.fake.returns({ filename: "abcde", path: fullpath }),
        removeFile: sinon.fake(),
      };
      const fileMgr = {
        removeFile: sinon.fake(),
      };
      const file = fileService.make(db, fileMgr, dest, field);
      file
        .removeFile("abcde")
        .then((result) => {
          expect(db.removeFile.firstCall.args[0]).to.equal("abcde");
          expect(fileMgr.removeFile.firstCall.args[0]).to.equal(fullpath);
          done();
        })
        .catch((err) => {
          done(err);
        });
    });
  });
  describe(".replaceFile", function () {
    const filename = "abcde";
    const fullpath = path.join(dest, filename);

    const db = {
      createFile: sinon.fake.returns({ filename, path: fullpath }),
      removeFile: sinon.fake(),
    };
    const fileMgr = {
      removeFile: sinon.fake((fn) => {
        if (fn !== filename) throw "파일이 존재하지 않습니다.";
      }),
    };

    beforeEach("기본 파일 생성", function () {
      fs.writeFileSync(fullpath, "hiho");
      sinon.reset();
    });
    it("파일이 올바르게 대체", function (done) {
      const file = fileService.make(db, fileMgr, dest, field);
      file
        .replaceFile(filename, { filename: "ho" }, "ezkorry")
        .then((result) => {
          expect(db.createFile.calledOnce).to.be.true;
          expect(db.removeFile.calledOnce).to.be.true;
          expect(fileMgr.removeFile.calledOnce).to.be.true;
          done();
        })
        .catch((err) => {
          done(err);
        });
    });
    it("파일이 없을 시 에러", function (done) {
      const file = fileService.make(db, fileMgr, dest, field);
      file
        .replaceFile("noexist", { filename: "ho" }, "ezkorry")
        .then((result) => {
          return done(new Error("에러가 일어나야 합니다."));
        })
        .catch((err) => {
          expect(fileMgr.removeFile.threw()).to.be.true;
          expect(db.createFile.called).to.be.false;
          expect(db.removeFile.called).to.be.false;
          return done();
        })
        .catch((err) => {
          return done(err);
        });
    });
  });
  describe(".getUntrackedFiles", function () {
    it("올바르게 동작", function (done) {
      const db = {
        getFiles: sinon.fake.returns([
          { filename: "a" },
          { filename: "b" },
          { filename: "c" },
        ]),
      };
      const fm = {
        getFiles: sinon.fake.returns(["c", "d", "e"]),
      };
      // fs.writeFileSync(path.join(dest, "test1"), "hiho");
      // fs.writeFileSync(path.join(dest, "test2"), "hiho");
      const file = fileService.make(db, fm, dest, field);
      file
        .getUntrackedFiles()
        .then((result) => {
          expect(result).have.all.members(["d", "e"]);
          done();
        })
        .catch((err) => {
          done(err);
        });
    });
  });
  describe(".getDangledFiles", function () {
    it("올바르게 동작", function () {
      // todo!
    });
  });
});

describe("file Manager", function () {
  afterEach("폴더에 있는 파일들 초기화(삭제)", function (done) {
    removeFilesInDir(dest, done);
  });

  describe(".removeFile", function () {
    it("존재하는 파일을 삭제해야 함", function (done) {
      const fullpath = path.join(dest, "testoo");
      fs.writeFileSync(fullpath, "abcde");

      fileManager
        .removeFile(fullpath)
        .then((result) => {
          expect(fs.existsSync(fullpath)).to.be.false;
          done();
        })
        .catch((err) => {
          done(err);
        });
    });

    it("존재하지 않는 파일은 에러를 일으켜야 함", function (done) {
      const fullpath = path.join(dest, "testoo");
      fileManager
        .removeFile(fullpath)
        .then((result) => {
          done("에러가 일어나야 합니다.");
        })
        .catch((err) => {
          done();
        });
    });
  });

  describe(".getFiles", function () {
    it("올바르게 동작", function (done) {
      fs.writeFileSync(path.join(dest, "abc1"), "abc");
      fs.writeFileSync(path.join(dest, "abc2"), "abc");
      fileManager
        .getFiles(dest)
        .then((ls) => {
          expect(ls).to.have.all.members(["abc1", "abc2"]);
          done();
        })
        .catch((err) => {
          done(err);
        });
    });
  });
});
