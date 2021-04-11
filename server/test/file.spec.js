const sinon = require('sinon');
const path = require('path');
const fs = require('fs');
const express = require('express');
const { expect } = require('chai');
const makeAgent = require('supertest').agent;
const Throttle = require('superagent-throttle');
// const { upload, createFileFromMockFile } = require('./tool').default;
const { fake } = require('sinon');
const { model } = require('@/loader');
const fileServiceFactory = require('@/service/file').default;
const fileManager = require('@/manager/file').default;
const rimraf = require('rimraf');
const supertest = require('supertest');

const { promisify } = require('util');
const { totalmem } = require('os');
const { nodeModuleNameResolver } = require('typescript');
const { graphql } = require('graphql');
const {
  createTestServer,
  graphqlSuper,
  doLogin,
  doLogout,
} = require('./tool').default;
const {
  fileQuery,
  filesQuery,
  updateFileMutation,
  removeFileMutation,
} = require('./graphql-request');
const { makeSimpleQuery, doAdminLogin } = require('./tool').default;
const { absPath } = require('@/service/file');

const app = express();

const dest = 'test/uploads';
const field = 'bin';
const rimrafAsync = promisify(rimraf);

const removeFilesInDirAsync = async (destString) => {
  const files = fs.readdirSync(destString);
  const results = files.map((file) => rimrafAsync(path.join(destString, file)));
  await Promise.allSettled(results);
};

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
    const pathed = path.resolve('test/temp');
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

      // afterEach('업로드된 파일 삭제', function (done) {
      //   removeFilesInDir(dest, done);
      // });
      afterEach('업로드된 파일 삭제 (Async 버전)', async function () {
        removeFilesInDirAsync(dest);
      });

      it('업로드 성공 테스트', function (done) {
        agent
          .post('/upload')
          .attach('bin', path.join(__dirname, './res/TestForUpload'))
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

    describe('removeFile', function () {
      it('파일이 있을 시 올바르게 삭제', function (done) {
        const fullpath = path.join(dest, 'abcde');
        fs.writeFileSync(fullpath, 'hiho');
        const dbTest = {
          getFile: sinon.fake.returns({ filename: 'abcde', path: fullpath }),
          removeFile: sinon.fake(),
        };
        const fileMgr = {
          removeFile: sinon.fake(),
          resizeOptionMap: new Map(),
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
    describe('replaceFile', function () {
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
        resizeOptionMap: new Map(),
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
    describe('getUntrackedFiles', function () {
      it('올바르게 동작', function (done) {
        const dbTest = {
          getFiles: sinon.fake.returns({
            total: 3,
            list: [{ filename: 'a' }, { filename: 'b' }, { filename: 'c' }],
          }),
        };
        const fm = {
          getFiles: sinon.fake.returns(['c', 'd', 'e']),
          resizeOptionMap: new Map(),
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
    describe('getDangledFiles', function () {
      it('올바르게 동작', function () {
        // todo!
      });
    });
    describe('absPath', function () {
      it('제대로 동작해야 함', async function () {
        expect(absPath('test')).equal(path.resolve(__dirname, '../test'));
      });
    });
  });

  describe('file Manager', function () {
    // afterEach('폴더에 있는 파일들 초기화(삭제)', function (done) {
    //   removeFilesInDir(dest, done);
    // });
    afterEach('업로드된 파일 삭제 (Async 버전)', async function () {
      removeFilesInDirAsync(dest);
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
            done(new Error('에러가 일어나야 합니다.'));
          })
          .catch((err) => {
            done();
          });
      });
    });

    describe('safeRemoveFile', function () {
      it('파일이 있을 경우 제대로 동작해야 함.', async function () {
        const p = 'test/temp/abcde.txt';
        fs.writeFileSync(p, 'testyo');
        const result = await fileManager.safeRemoveFile(p);
        expect(result.success).to.be.true;
      });
      it('파일이 없을 경우 그냥 success 만 false 여야 함. 에러가 발생해서는 안 됨.', async function () {
        const p = 'test/temp/abcde.txt';
        // fs.writeFileSync(p, 'testyo');
        const result = await fileManager.safeRemoveFile(p);
        expect(result.success).to.be.false;
        expect(result.code).to.equal('file_not_exists');
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

  describe('api', function () {
    // eslint-disable-next-line mocha/no-setup-in-describe
    const {
      agent,
      uploadDest,
      fileService: fileTestService,
    } = createTestServer(this);
    // console.log(fileTestService);
    const adminLogin = async () => {
      await doLogin(agent, 'testAdmin', 'abc');
    };
    const guestLogin = async () => {
      await doLogin(agent, 'testGuest', 'abc');
    };

    // afterEach('업로드된 파일 삭제', function (done) {
    //   removeFilesInDir(uploadDest, done);
    // });
    afterEach('업로드된 파일 삭제 (Async 버전)', async function () {
      removeFilesInDirAsync(dest);
    });

    describe('upload Middleware', function () {
      it('일반 파일 업로드시 성공해야 함', async function () {
        await doLogin(agent, 'testAdmin', 'abc');
        const res = await agent
          .post('/upload')
          .attach('bin', path.join(__dirname, './res/hello.txt'))
          .expect(200);
        const { filename } = res.body.file;
        // console.log(await model.File.find().lean().exec());
        const found = await model.File.find({ filename }).lean().exec();
        // console.log(found);
        // console.log(fs.readdirSync(uploadDest));
        expect(found.length).to.equal(1);
        expect(found[0].extension).to.equal('txt');
        expect(found[0].origin).to.equal('hello.txt');
        expect(found[0].label).to.equal('hello');
        expect(found[0].alt).to.equal('hello');
      });
      it('점이 많은 파일을 업로드시 성공해야 함', async function () {
        await doLogin(agent, 'testAdmin', 'abc');
        const res = await agent
          .post('/upload')
          .attach('bin', path.join(__dirname, './res/a.lot.of.dots.txt'))
          .expect(200);
        const { filename } = res.body.file;
        // console.log(await model.File.find().lean().exec());
        const found = await model.File.find({ filename }).lean().exec();
        // console.log(found);
        // console.log(fs.readdirSync(uploadDest));
        expect(found.length).to.equal(1);
        expect(found[0].extension).to.equal('txt');
        expect(found[0].origin).to.equal('a.lot.of.dots.txt');
        expect(found[0].label).to.equal('a.lot.of.dots');
        expect(found[0].alt).to.equal('a.lot.of.dots');
      });
      it('업로드 시 public이 기본적으로 true 여야 함', async function () {
        await doLogin(agent, 'testAdmin', 'abc');
        const res = await agent
          .post('/upload')
          .attach('bin', path.join(__dirname, './res/TestForUpload'))
          .expect(200);
        const { filename } = res.body.file;
        const found = await model.File.findOne({ filename }).lean().exec();
        expect(found.public).to.equal(true);
      });
      it('/upload post 요청은 권한이 ADMIN 이 아니면 실패해야 함', async function () {
        await doLogout(agent);
        const res = await agent
          .post('/upload')
          .attach('bin', path.join(__dirname, './res/TestForUpload'))
          .expect(401);
        // await doLogout(agent);
        // await doLogin(agent, 'testGuest', 'abc');
        await doLogin(agent, 'testGuest', 'abc');
        // console.log(1);
        const res2 = await agent
          .post('/upload')
          .attach('bin', path.join(__dirname, './res/TestForUpload'))
          .expect(401);
        // console.log(2);
      });
      it('여러개의 파일은 모두 제대로 저장되어야 함.', async function () {
        await doLogin(agent, 'testAdmin', 'abc');
        const res1 = await agent
          .post('/upload')
          .attach('bin', path.join(__dirname, './res/TestForUpload'));
        const res2 = await agent
          .post('/upload')
          .attach('bin', path.join(__dirname, './res/TestForUpload'));
        const res3 = await agent
          .post('/upload')
          .attach('bin', path.join(__dirname, './res/TestForUpload'));
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
      it('업로드 중간에 취소되었을 시 관련된 파일과 데이터베이스가 깔끔해야 함.', async function () {
        // 기술적으로 불가능함. 다음 번 업로드나 주기적으로 빈 파일을 청소하면 됨.
        // multer 업로드 도중에 종료되면 그냥 파일만 남고 데이터베이스에는 정보가 하나도 남지 않음.
        this.skip();
        await doAdminLogin(agent);
        const throttle = new Throttle({
          active: true, // set false to pause queue
          rate: 5, // how many requests can be sent every `ratePer`
          ratePer: 10000, // number of ms in which `rate` requests may be sent
          concurrent: 2, // how many requests can be sent concurrently
        });
        throttle
          .on('sent', (request) => {
            console.log('# file.spec.js upload throttle onSent');
            // console.dir(request, { depth: 1 });
          })
          .on('received', (request) => {
            console.log('# file.spec.js upload throttle onReceived');
            // console.dir(request, { depth: 1 });
          })
          .on('drained', () => {
            console.log('# file.spec.js upload throttle onDrained');
          });
        const stream = fs.createWriteStream(
          path.join(__dirname, 'uploads', 'test'),
        );
        try {
          const server = app.listen(9000, () => {
            setTimeout(() => {
              server.close((err) => {
                console.log('close error');
                console.log(err);
              });
            }, 1000);
          });
          const res = await agent
            .post('/upload')
            .use(throttle.plugin())
            .attach('bin', path.join(__dirname, 'res', 'bigfile'))
            .on('progress', (e) => {
              // console.log('# throttle progress');
              // console.log(e);
              // if (typeof e.total === 'number') {
              //   const percent = e.loaded / e.total;
              //   if (percent >= 0.5) {
              //     console.dir(throttle);
              //     throw Error('stop!!');
              //   }
              // }
            });
          // .pipe(stream).on('error', (error) => {
          //   console.log('# pipe error');
          //   console.log(error);
          // })
          // .on('error', (err) => {
          //   console.log('# on error error');
          //   console.log(err);
          // })
          // .end((err, res) => {
          //   console.log('# end err');
          //   console.log(err);
          // });
          console.log(res.body);
        } catch (e) {
          console.log('# agent try catch error');
          console.log(e);
        }
        // // expect(res.status).to.equal(200);
        // await (async () => new Promise((resolve, reject) => {
        //   if (!setTimeout(resolve, 10000))
        //     reject();
        // }))();
        console.log('# throttle upload end');
      });
      it('확장자가 없는 파일이라도 제대로 업로드 되어야 함.', async function () {
        await doAdminLogin(agent);
        const res = await agent
          .post('/upload')
          .attach('bin', path.join(__dirname, 'res', 'smallfile'));
        expect(res.status).to.equal(200);
      });
    });
    describe('getFileMiddleware', function () {
      it('업로드된 파일은 제대로 가져올 수 있어야 함', async function () {
        // 일단 파일 업로드
        await doLogin(agent, 'testAdmin', 'abc');
        const res = await agent
          .post('/upload')
          .attach('bin', path.join(__dirname, './res/smallfile'))
          .expect(200);
        const { filename } = res.body.file;
        const res2 = await agent.get(`/upload/${filename}`).expect(200);
        expect(res2.body).to.not.be.null;
      });

      it('옵션으로 제대로 갖고와야 함.', async function () {
        // 일단 파일 업로드
        await doLogin(agent, 'testAdmin', 'abc');
        const res = await agent
          .post('/upload')
          .attach('bin', path.join(__dirname, './res/smallfile'))
          .expect(200);
        const { filename } = res.body.file;

        // 옵션이 존재한다고 가정
        await model.SiteOption.create({
          name: 'power_name',
          value: filename,
          type: 'file',
        });

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

    describe('getExcelMiddleware', function () { 
      it('type 이 application 일 경우 제대로 동작해야 함 - 실제 파일을 확인해야 하므로 패스', async function () { 
        this.skip();
        const res = await agent.get('/excel').query({
          type: 'application',
          date_lte: '2020-10-10',
          date_gte: '2021-10-10',
          transport_status: '',
          doc_status: '',
          money_status: '',
          receipt_status: '',
          search: '',
        });
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
          .attach('bin', path.join(__dirname, './res/smallfile'));
        res2 = await agent
          .post('/upload')
          .attach('bin', path.join(__dirname, './res/TestForUpload'));
      });

      // beforeEach('파일 하나 업로드 해놓기', async function () {

      // });
      describe('file', function () {
        it('filename 만 넣었을 때 제대로 동작해야 함', async function () {
          // 일단 업로드
          // await adminLogin();
          const res = await agent
            .post('/upload')
            .attach('bin', path.join(__dirname, './res/TestForUpload'))
            .expect(200);
          const { filename } = res.body.file;
          // 요청하여 갖고 오기
          const res3 = await graphqlSuper(agent, fileQuery, {
            filename,
          });
          expect(res3.body.data.file.origin).to.equal('TestForUpload');
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
        // eslint-disable-next-line mocha/no-setup-in-describe
        const filesReq = makeSimpleQuery(agent, 'files');

        it('제대로 동작해야 함', async function () {
          const result = await filesReq(
            {},
            `
            {
              total 
              list {
                id filename fileurl path
              }
            }`,
          );
          expect(result.total).to.equal(2);
        });
        it('기본 값으로 관리되는 것만 불러와져야 함', async function () {
          await model.File.updateOne({ managed: false });
          const result = await filesReq(
            {},
            `
            {
              total 
              list {
                id filename fileurl path
              }
            }`,
          );
          expect(result.total).to.equal(1);
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
        it('제대로 동작해야 함', async function () {
          const { filename } = res2.body.file;
          await graphqlSuper(agent, removeFileMutation, {
            filename,
          });
          const found = await model.File.findOne({ filename }).lean().exec();
          expect(found).to.be.null;
          const all = await model.File.find().lean().exec();
          expect(all.length).to.equal(1);
          const files = fs.readdirSync(dest);
          expect(files.length).to.equal(
            1,
            '파일 개수 - 파일이 하나만 남아있어야 합니다.',
          );
        });
      });
    });

    describe('File Service', function () {
      describe('getFile', function () {
        it('있는 파일을 잘 가져와야 함', async function () {
          await doLogin(agent, 'testAdmin', 'abc');
          const res3 = await agent
            .post('/upload')
            .attach('bin', path.join(__dirname, './res/TestForUpload'));
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
            .attach('bin', path.join(__dirname, './res/TestForUpload'));
          const res4 = await agent
            .post('/upload')
            .attach('bin', path.join(__dirname, './res/TestForUpload'));
          const result = await fileTestService.getFiles();
          expect(result.total).to.be.equal(2);
        });
      });
      describe('removeFile', function () {
        it('제대로 작동해야 함', async function () {
          // 일단 업로드
          await doLogin(agent, 'testAdmin', 'abc');
          const res3 = await agent
            .post('/upload')
            .attach('bin', path.join(__dirname, './res/TestForUpload'));
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
            .attach('bin', path.join(__dirname, './res/TestForUpload'));
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
      describe('replaceFile', function () {
        // todo
      });
      describe('getUntrackedFiles', function () {
        // todo
      });
      describe('getDangledFiles', function () {
        // todo
      });
    });

    // it('그냥 성공해야 함', async function () {
    //   const found = await model.User.find();
    //   console.log(found);
    // });
    // it('그냥 성공해야 함2', async function () {});
  });
});
