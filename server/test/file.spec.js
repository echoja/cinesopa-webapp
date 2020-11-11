const sinon = require('sinon');
const path = require('path');
const fs = require('fs');
const express = require('express');
const { expect } = require('chai');
const makeAgent = require('supertest').agent;
// const { upload, createFileFromMockFile } = require('./tool');
const { fake } = require('sinon');
const { model } = require('../loader');
const fileServiceFactory = require('../service/file');
const fileManager = require('../manager/file');
const {
  fileQuery,
  filesQuery,
  updateFileMutation,
  removeFileMutation,
} = require('./graphql-request');
const { initTestServer, graphqlSuper, doLogin, doLogout } = require('./tool');

const app = express();

const dest = 'test/uploads';
const field = 'bin';

const removeFilesInDir = (destString, done) => {
  fs.readdir(destString, (err, files) => {
    if (err) return done(err);
    // eslint-disable-next-line no-restricted-syntax
    for (const file of files) {
      try {
        fs.unlinkSync(path.join(destString, file));
      } catch (error) {
        done(error);
      }
    }
    done();
    return null;
  });
};
describe('file', function () {
  describe('path and fs', function () {
    // eslint-disable-next-line mocha/no-setup-in-describe
    const pathed = path.resolve('test/imsi');
    it('mkdir works', function (done) {
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
  describe('file Service', function () {
    describe('uploadMiddleware', function () {
      /** @type {import("supertest").SuperAgentTest} */
      let agent;
      /** @type {import('sinon').SinonSpy} */
      let createFile;
      /** @type {import('sinon').SinonSpy} */
      let updateFile;
      /** @type {import('sinon').SinonSpy} */
      let removeFile;

      before('웹앱 초기화', async function () {
        createFile = fake();
        updateFile = fake();
        removeFile = fake();
        const file = fileServiceFactory.make(
          {
            createFile,
            updateFile,
            removeFile,
          },
          fileManager,
          dest,
          field,
        );
        const { uploadMiddleware } = file;

        app.post(
          '/upload',
          (req, res, next) => {
            req.user = { email: 'eszqsc112@naver.com' };
            next();
          },
          uploadMiddleware,
          (req, res, next) => {
            console.dir(req.file);
            res.send({ message: 'success', file });
          },
        );
        // app.get("/upload", function (req, res, next) {
        //   res.send(pug.compileFile(path.join(__dirname, "upload-test.pug"))());
        // });
        agent = makeAgent(app);
      });

      afterEach('업로드된 파일 삭제', function (done) {
        removeFilesInDir(dest, done);
      });

      it('업로드 성공 테스트', function (done) {
        agent
          .post('/upload')
          .attach('bin', path.join(__dirname, 'tool.js'))
          .expect(200)
          .end((err, res) => {
            if (err) return done(err);
            // 응답이 성공인지 체크
            expect(res.body.message).to.equal('success');
            // 응답에서 file이 있는지 체크
            expect(res.body.file).to.be.a('object');
            const filepath = res.body.file.path;
            // 파일이 실제 존재하는지 체크
            expect(fs.existsSync(filepath));
            // db에 createFile 이 호출되었는지 체크
            expect(createFile.calledOnce).to.be.true;
            return done();
          });
        // const result = await agent
        //   .post("/upload")
        //   .attach("bin", path.join(__dirname, "tool.js"));
        // console.dir(result.body);

        // done();
      });
    });

    describe('.removeFile', function () {
      it('파일이 있을 시 올바르게 삭제', function (done) {
        const fullpath = path.join(dest, 'abcde');
        fs.writeFileSync(fullpath, 'hiho');
        const dbTest = {
          getFile: sinon.fake.returns({ filename: 'abcde', path: fullpath }),
          removeFile: sinon.fake(),
        };
        const fileMgr = {
          removeFile: sinon.fake(),
        };
        const file = fileServiceFactory.make(dbTest, fileMgr, dest, field);
        file
          .removeFile('abcde')
          .then((/* result */) => {
            expect(dbTest.removeFile.firstCall.args[0]).to.equal('abcde');
            expect(fileMgr.removeFile.firstCall.args[0]).to.equal(fullpath);
            done();
          })
          .catch((err) => {
            done(err);
          });
      });
    });
    describe('.replaceFile', function () {
      const filename = 'abcde';
      // eslint-disable-next-line mocha/no-setup-in-describe
      const fullpath = path.join(dest, filename);

      const dbTest = {
        // eslint-disable-next-line mocha/no-setup-in-describe
        createFile: sinon.fake.returns({ filename, path: fullpath }),
        // eslint-disable-next-line mocha/no-setup-in-describe
        removeFile: sinon.fake(),
      };
      const fileMgr = {
        // eslint-disable-next-line mocha/no-setup-in-describe
        removeFile: sinon.fake((fn) => {
          if (fn !== filename) throw Error('파일이 존재하지 않습니다.');
        }),
      };

      beforeEach('기본 파일 생성', function () {
        fs.writeFileSync(fullpath, 'hiho');
        sinon.reset();
      });
      it('파일이 올바르게 대체', function (done) {
        const file = fileServiceFactory.make(dbTest, fileMgr, dest, field);
        file
          .replaceFile(filename, { filename: 'ho' }, 'ezkorry')
          .then(() => {
            expect(dbTest.createFile.calledOnce).to.be.true;
            expect(dbTest.removeFile.calledOnce).to.be.true;
            expect(fileMgr.removeFile.calledOnce).to.be.true;
            done();
          })
          .catch((err) => {
            done(err);
          });
      });
      it('파일이 없을 시 에러', function (done) {
        const file = fileServiceFactory.make(dbTest, fileMgr, dest, field);
        file
          .replaceFile('noexist', { filename: 'ho' }, 'ezkorry')
          .then(() => done(new Error('에러가 일어나야 합니다.')))
          .catch((err) => {
            expect(fileMgr.removeFile.threw()).to.be.true;
            expect(dbTest.createFile.called).to.be.false;
            expect(dbTest.removeFile.called).to.be.false;
            return done();
          })
          .catch((err) => done(err));
      });
    });
    describe('.getUntrackedFiles', function () {
      it('올바르게 동작', function (done) {
        const dbTest = {
          getFiles: sinon.fake.returns([
            { filename: 'a' },
            { filename: 'b' },
            { filename: 'c' },
          ]),
        };
        const fm = {
          getFiles: sinon.fake.returns(['c', 'd', 'e']),
        };
        // fs.writeFileSync(path.join(dest, "test1"), "hiho");
        // fs.writeFileSync(path.join(dest, "test2"), "hiho");
        const file = fileServiceFactory.make(dbTest, fm, dest, field);
        file
          .getUntrackedFiles()
          .then((result) => {
            expect(result).have.all.members(['d', 'e']);
            done();
          })
          .catch((err) => {
            done(err);
          });
      });
    });
    describe('.getDangledFiles', function () {
      it('올바르게 동작', function () {
        // todo!
      });
    });
  });

  describe('file Manager', function () {
    afterEach('폴더에 있는 파일들 초기화(삭제)', function (done) {
      removeFilesInDir(dest, done);
    });

    describe('.removeFile', function () {
      it('존재하는 파일을 삭제해야 함', function (done) {
        const fullpath = path.join(dest, 'testoo');
        fs.writeFileSync(fullpath, 'abcde');

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

      it('존재하지 않는 파일은 에러를 일으켜야 함', function (done) {
        const fullpath = path.join(dest, 'testoo');
        fileManager
          .removeFile(fullpath)
          .then((result) => {
            done('에러가 일어나야 합니다.');
          })
          .catch((err) => {
            done();
          });
      });
    });

    describe('.getFiles', function () {
      it('올바르게 동작', function (done) {
        fs.writeFileSync(path.join(dest, 'abc1'), 'abc');
        fs.writeFileSync(path.join(dest, 'abc2'), 'abc');
        fileManager
          .getFiles(dest)
          .then((ls) => {
            expect(ls).to.have.all.members(['abc1', 'abc2']);
            done();
          })
          .catch((err) => {
            done(err);
          });
      });
    });
  });

  describe('실제 api 테스트', function () {
    // eslint-disable-next-line mocha/no-setup-in-describe
    const { agent, uploadDest, fileService: fileTestService } = initTestServer({
      before,
      beforeEach,
      afterEach,
      after,
    });
    // console.log(fileTestService);
    const adminLogin = async () => {
      await doLogin(agent, 'testAdmin', 'abc');
    };
    const guestLogin = async () => {
      await doLogin(agent, 'testGuest', 'abc');
    };

    afterEach('업로드된 파일 삭제', function (done) {
      removeFilesInDir(uploadDest, done);
    });

    describe('upload Middleware', function () {
      it('업로드시 성공해야 함', async function () {
        await doLogin(agent, 'testAdmin', 'abc');
        const res = await agent
          .post('/upload')
          .attach('bin', path.join(__dirname, 'tool.js'))
          .expect(200);
        const { filename } = res.body.file;
        console.log(await model.File.find().lean().exec());
        const found = await model.File.find({ filename }).lean().exec();
        console.log(found);
        console.log(fs.readdirSync(uploadDest));
        expect(found.length).to.equal(1);
        expect(found[0].extension).to.equal('js');
        expect(found[0].origin).to.equal('tool.js');
        expect(found[0].label).to.equal('tool');
        expect(found[0].alt).to.equal('tool');
      });
      it('업로드 시 public이 기본적으로 true 여야 함', async function () {
        await doLogin(agent, 'testAdmin', 'abc');
        const res = await agent
          .post('/upload')
          .attach('bin', path.join(__dirname, 'tool.js'))
          .expect(200);
        const { filename } = res.body.file;
        const found = await model.File.findOne({ filename }).lean().exec();
        expect(found.public).to.equal(true);
      });
      it('/upload post 요청은 권한이 ADMIN 이 아니면 실패해야 함', async function () {
        await doLogout(agent);
        const res = await agent
          .post('/upload')
          .attach('bin', path.join(__dirname, 'TestForUpload'))
          .expect(401);
        // await doLogout(agent);
        // await doLogin(agent, 'testGuest', 'abc');
        await doLogin(agent, 'testGuest', 'abc');
        console.log(1);
        const res2 = await agent
          .post('/upload')
          .attach('bin', path.join(__dirname, 'tool.js'))
          .expect(401);
        console.log(2);
      });
      it('여러개의 파일은 모두 제대로 저장되어야 함.', async function () {
        await doLogin(agent, 'testAdmin', 'abc');
        const res1 = await agent
          .post('/upload')
          .attach('bin', path.join(__dirname, 'tool.js'));
        const res2 = await agent
          .post('/upload')
          .attach('bin', path.join(__dirname, 'tool.js'));
        const res3 = await agent
          .post('/upload')
          .attach('bin', path.join(__dirname, 'tool.js'));

        const found = await model.File.find().lean().exec();
        // console.log(found);
        expect(found.length).to.equal(3);
        expect(found[0].filename).to.be.a('string');
        expect(found[1].filename).to.be.a('string');
        expect(found[2].filename).to.be.a('string');
        expect(found[0].filename).to.not.equal(found[1].filename);
        expect(found[0].filename).to.not.equal(found[2].filename);
        expect(found[1].filename).to.not.equal(found[2].filename);
        expect(fs.existsSync(found[0].path)).to.be.true;
        expect(fs.existsSync(found[1].path)).to.be.true;
        expect(fs.existsSync(found[2].path)).to.be.true;
      });
    });
    describe('get Middleware', function () {
      it('업로드된 파일은 제대로 가져올 수 있어야 함', async function () {
        // 일단 파일 업로드
        await doLogin(agent, 'testAdmin', 'abc');
        const res = await agent
          .post('/upload')
          .attach('bin', path.join(__dirname, 'tool.js'))
          .expect(200);
        const { filename } = res.body.file;
        const res2 = await agent.get(`/upload/${filename}`).expect(200);
        expect(res2.body).to.not.be.null;
      });

      it.only('옵션으로 제대로 갖고와야 함.', async function () {
        // 일단 파일 업로드
        await doLogin(agent, 'testAdmin', 'abc');
        const res = await agent
          .post('/upload')
          .attach('bin', path.join(__dirname, 'tool.js'))
          .expect(200);
        const { filename } = res.body.file;

        // 옵션이 존재한다고 가정
        await model.SiteOption.create({
          name: 'power_name',
          value: filename,
          type: 'file',
        })

        const res2 = await agent.get(`/upload/power_name`).expect(200);
        console.log(res2.body);
        expect(res2.body).to.not.be.null;

        // this.skip();
      });
      // todo
      it('옵션으로 갖고 오는데, 파일이 아니면 404여야 함', async function () {
        this.skip();
      });
      // todo
      it('옵션으로 갖고 오는데, 파일이 존재하지 않으면 404여야 함', async function () {
        this.skip();
      });

      it('존재하지 않는 파일은 404여야 함', async function () {
        const res2 = await agent.get('/upload/hello').expect(404);
        expect(res2.body).to.not.have.any.keys;
      });
    });

    describe('graphql api', function () {
      /** @type {import('supertest').Response} */
      let res1;
      /** @type {import('supertest').Response} */
      let res2;

      beforeEach('파일 두 개 업로드', async function () {
        await adminLogin();
        res1 = await agent
          .post('/upload')
          .attach('bin', path.join(__dirname, 'tool.js'));
        res2 = await agent
          .post('/upload')
          .attach('bin', path.join(__dirname, '../util.js'));
      });

      // beforeEach('파일 하나 업로드 해놓기', async function () {

      // });
      describe('file', function () {
        it('filename 만 넣었을 때 제대로 동작해야 함', async function () {
          // 일단 업로드
          // await adminLogin();
          const res = await agent
            .post('/upload')
            .attach('bin', path.join(__dirname, 'tool.js'))
            .expect(200);
          const { filename } = res.body.file;
          // 요청하여 갖고 오기
          const res3 = await graphqlSuper(agent, fileQuery, {
            filename,
          });
          expect(res3.body.data.file.origin).to.equal('tool.js');
        });
        // todo
        it('id를 넣었을 때 제대로 동작해야 함', function () {
          this.skip();
        });
        // todo
        it('id와 filename을 둘다 넣었을 때 filename 만 제대로 동작해야 함', function () {
          this.skip();
        });
      });
      describe('files', function () {
        it('제대로 동작해야 함', async function () {
          const res = await graphqlSuper(agent, filesQuery);
          expect(res.body.data.files.length).to.equal(2);
        });
        it('기본 값으로 관리되는 것만 불러와져야 함', async function () {
          await model.File.updateOne({ managed: false });
          const res = await graphqlSuper(agent, filesQuery);
          // console.log(res.body);
          expect(res.body.data.files.length).to.equal(1);
        });
      });
      describe('updateFile', function () {
        it('제대로 동작해야 함', async function () {
          const { filename } = res2.body.file;
          await graphqlSuper(agent, updateFileMutation, {
            filename,
            input: {
              description: '테스트 설명',
            },
          });
          const found = await model.File.findOne({ filename }).lean().exec();
          expect(found.description).to.equal('테스트 설명');
        });
      });
      describe('removeFile', function () {
        it.only('제대로 동작해야 함', async function () {
          const { filename } = res2.body.file;
          await graphqlSuper(agent, removeFileMutation, {
            filename,
          });
          const found = await model.File.findOne({ filename }).lean().exec();
          expect(found).to.be.null;
          const all = await model.File.find().lean().exec();
          expect(all.length).to.equal(1);
          const files = fs.readdirSync(dest);
          expect(files.length).to.equal(1, '파일 개수 - 파일이 하나만 남아있어야 합니다.');
        });
      });
    });

    describe('File Service', function () {
      describe('getFile', function () {
        it('있는 파일을 잘 가져와야 함', async function () {
          await doLogin(agent, 'testAdmin', 'abc');
          const res3 = await agent
            .post('/upload')
            .attach('bin', path.join(__dirname, 'tool.js'));
          const { filename } = res3.body.file;
          const file = await fileTestService.getFile(filename);

          // 파일이 db에 기록되었는지 체크
          expect(file.filename).to.not.be.null;
          // 파일이 존재하는지 체크
          expect(fs.existsSync(file.path)).to.be.true;
        });
        it('없는 파일은 결과값이 null이어야 함.', function (done) {
          fileTestService
            .getFile('not-existing')
            .then((result) => {
              expect(result).to.be.null;
              done();
            })
            .catch((err) => {
              done(`에러가 났어요.. 에러값: ${err}`);
            });
        });
      });
      describe('getFiles', function () {
        it('제대로 작동해야 함.', async function () {
          // 일단 업로드
          await doLogin(agent, 'testAdmin', 'abc');
          const res3 = await agent
            .post('/upload')
            .attach('bin', path.join(__dirname, 'tool.js'));
          const res4 = await agent
            .post('/upload')
            .attach('bin', path.join(__dirname, 'tool.js'));
          const result = await fileTestService.getFiles();
          expect(result.length).to.be.equal(2);
        });
      });
      describe('removeFile', function () {
        it('제대로 작동해야 함', async function () {
          // 일단 업로드
          await doLogin(agent, 'testAdmin', 'abc');
          const res3 = await agent
            .post('/upload')
            .attach('bin', path.join(__dirname, 'tool.js'));
          const { file } = res3.body;
          const { filename } = file;
          const result = await fileTestService.removeFile(filename);

          const found = await model.File.find().lean().exec();
          // 파일이 db에서 사라졌는지 체크
          expect(found.length).to.equal(0);
          // 파일이 사라졌는지 체크
          expect(fs.existsSync(file.path)).to.be.false;
        });
        it('없는 파일은 작동하지 않아야 함', async function () {
          // 일단 업로드
          await doLogin(agent, 'testAdmin', 'abc');
          const res3 = await agent
            .post('/upload')
            .attach('bin', path.join(__dirname, 'tool.js'));
          let errored = false;
          try {
            await fileTestService.removeFile('not-exist-name');
          } catch (error) {
            errored = true;
            console.log(error);
          }
          expect(errored).to.equal(true);

          const { filename, path: pathCheck } = res3.body.file;
          // 파일이 db에 아직 있는지 체크
          const found = await model.File.find({ filename }).lean().exec();
          expect(found.length).to.equal(1);
          expect(found[0].filename).to.equal(filename);
          // 파일이 존재하는지 체크
          expect(fs.existsSync(pathCheck)).to.be.true;
        });
      });

      // todo
      describe('replaceFile', function () {});
      // todo
      describe('getUntrackedFiles', function () {});
      // todo
      describe('getDangledFiles', function () {});
    });

    // it('그냥 성공해야 함', async function () {
    //   const found = await model.User.find();
    //   console.log(found);
    // });
    // it('그냥 성공해야 함2', async function () {});
  });
});
