/**
 * @file
 * db manager 테스트입니다.
 * 모든 스키마는 자동으로 id가 1부터 채워진다고 가정합니다.
 */

require('../typedef');
const { expect } = require('chai');
const { isTypedArray } = require('lodash');
const { it } = require('mocha');
const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');
const modelMaker = require('../db/model');

const { make: makeDB } = require('../manager/db');
const tool = require('./tool');

describe('실제 모델기반 DB 테스트', function () {
  /** @type {MongoMemoryServer} */
  let mongod;
  /** @type {DBManager} */
  let manager;
  /** @type {ModelWrapper} */
  let model;

  before('DB 초기화', async function () {
    // mongoose.deleteModel(/.+/);
    this.timeout(10000);
    model = modelMaker.make(mongoose);
    console.log(model);
    manager = makeDB(model);

    mongod = new MongoMemoryServer();
    const uri = await mongod.getConnectionString();
    const mongooseOpts = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
      debug: true,
    };
    await mongoose.connect(uri, mongooseOpts);
  });

  afterEach('DB 내용 제거', async function () {
    const { collections } = mongoose.connection;
    const promises = [];
    Object.keys(collections).forEach((key) => {
      const collection = collections[key];
      promises.push(collection.deleteMany());
    });
    await Promise.allSettled(promises);
  });

  after('DB 종료', async function () {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await mongod.stop();
  });

  describe('findMany 테스트', function () {
    it('제대로 작동해야 함', function (done) {
      const newPost = async (title) => {
        const p = model.Post({ title });
        return p.save();
      };
      Promise.allSettled([newPost('1'), newPost('1'), newPost('2')])
        .then((resultho) => {
          manager
            .findMany('Post', { title: '1' })
            .then((result) => {
              expect(result.length).to.equal(2);
              done();
            })
            .catch((err) => {
              done(err);
            });
        })
        .catch((err) => {
          done(err);
        });
    });
  });

  describe('User', function () {
    it('createUser 테스트', async function () {
      await manager.createUser({
        email: 'eszqsc112@naver.com',
        name: '김태훈',
        pwd: '13241324',
      });
      const found = await model.User.find().lean();
      const login = await model.Login.findOne().lean();
      const user = found[0];
      expect(found).to.not.be.a('null');
      expect(user.email).to.equal('eszqsc112@naver.com');
      expect(user.verified).to.equal(false);
      expect(login.pwd).to.be.a('string');
      expect(login.salt).to.be.a('string');
      expect(login.email).to.be.a('string');
    });

    it('createUser - getUserByEmail 테스트', async function () {
      await manager.createUser({
        email: 'eszqsc112@naver.com',
        name: '김태훈',
        pwd: '13241324',
      });
      expect(
        await manager.getUserByEmail('eszqsc112@naver.com'),
        'email 키가 존재해야 함',
      ).to.have.any.keys(['email']);
      expect(
        await manager.getUserByEmail('wierd@naver.com'),
        'email 키가 없어야 함',
      ).to.be.a('null');
    });

    it('isUserExist : False', async function () {
      const result = await manager.isUserExist('eszqsc112@naver.com');
      expect(result).equal(false);
    });

    it('isUserExist : True', async function () {
      await manager.createUser({
        email: 'eszqsc112@naver.com',
        name: '김태훈',
        pwd: '13241324',
      });
      const result = await manager.isUserExist('eszqsc112@naver.com');
      expect(result).equal(true);
    });

    it('createUser후 removeUserByEmail', async function () {
      await manager.createUser({
        email: 'eszqsc112@naver.com',
        name: '김태훈',
        pwd: '13241324',
      });
      await manager.removeUserByEmail('eszqsc112@naver.com');
      const found = await model.User.find().lean();
      expect(found.length).to.equal(0);
    });

    it('updateUser', async function () {
      await manager.createUser({
        email: 'eszqsc112@naver.com',
        name: '김태훈',
        pwd: '13241324',
      });
      await manager.updateUser('eszqsc112@naver.com', { name: '안녕' });
      const user = await manager.getUserByEmail('eszqsc112@naver.com');
      expect(user.name).equal('안녕');
    });
  });

  describe('Password', function () {
    it('유저 생성 후 비번이 같아야 함 - isCorrectPassword', async function () {
      await manager.createUser({
        email: 'eszqsc112@naver.com',
        name: '김태훈',
        pwd: '13241324',
      });
      const result = await manager.isCorrectPassword(
        'eszqsc112@naver.com',
        '13241324',
      );
      expect(result).equal(true);
      // await tool.makeHtmlReport(
      //   this,
      //   `<!DOCTYPE html>
      // <html lang="en">
      // <head>
      //   <meta charset="UTF-8">
      //   <meta name="viewport" content="width=device-width, initial-scale=1.0">
      //   <title>Document</title>
      // </head>
      // <body>
      //   <p>hahaha</p>
      // </body>
      // </html>`,
      // );
    });
    it('유저 생성 후 비번이 틀려야 함 - isCorrectPassword', async function () {
      await manager.createUser({
        email: 'eszqsc112@naver.com',
        name: '김태훈',
        pwd: '13241324',
      });
      const result = await manager.isCorrectPassword(
        'eszqsc112@naver.com',
        '12345678',
      );
      expect(result).equal(false);
    });
  });

  describe('Page', function () {
    it('.createPage', function (done) {
      manager
        .createPage({
          belongs_to: 'cinesopa',
          content: 'ho',
          permalink: 'ha',
        })
        .then(() => {
          model.Page.findOne({ content: 'ho' })
            .then((result) => {
              expect(result.belongs_to).to.equal('cinesopa');
              expect(result.permalink).to.equal('ha');
              done();
            })
            .catch((err) => {
              done(err);
            });
        })
        .catch((err) => {
          done(err);
        });
    });
    it('.getPage', function (done) {
      const p = new model.Page({ title: 'ho', id: 100 });
      p.save()
        .then(() => {
          manager
            .getPage(1) // AutoIncrement 때문에 자동으로 1로 됨.
            .then((result) => {
              expect(result.title).to.equal('ho');
              done();
            })
            .catch((err) => {
              done(err);
            });
        })
        .catch((err) => {
          done(err);
        });
      // manager.page
    });
    it('.getPages', function (done) {
      (async () => {
        for (let index = 0; index < 30; index++) {
          const p = new model.Page({
            id: index,
            title: `제목${index}`,
            belongs_to: 'sopaseom',
          });
          await p.save();
        }
      })()
        .then(() => {
          manager
            .getPages('sopaseom', 3, 6)
            .then((result) => {
              // console.log(result);
              expect(result.length).to.equal(6);
              expect(result[0].id).to.equal(19);
              expect(result[3].id).to.equal(22);
              expect(result[5].id).to.equal(24);
              done();
            })
            .catch((err) => {
              done(err);
            });
        })
        .catch((err) => {
          done(err);
        });
    });
    it('.getPageView', async function () {
      const p = new model.Page({
        permalink: 'ho',
        belongs_to: 'sopaseom',
      });
      await p.save();
      const found = await manager.getPageView('ho', 'sopaseom');
      expect(found).to.be.not.null;
    });
    it('.removePage', async function () {
      const p = new model.Page({
        permalink: 'ho',
        belongs_to: 'sopaseom',
        id: 100,
      });
      await p.save();
      await manager.removePage(1); // AutoIncrement 때문에 자동으로 1로 됨.
      const result = await model.Page.find();
      expect(result.length).to.equal(0);
    });
    it('.removePage - 존재하지 않을 때 에러', async function () {
      let err = null;
      try {
        const p = new model.Page({
          permalink: 'ho',
          belongs_to: 'sopaseom',
          id: 100,
        });
        await p.save();
        await manager.removePage(101);
      } catch (error) {
        // console.error(error);
        err = error;
      }
      if (err) console.log(err);
      expect(err).to.be.not.null;
    });
    it('.updatePage', async function () {
      const p = new model.Page({
        permalink: 'ho',
        belongs_to: 'sopaseom',
        id: 100,
      });
      await p.save();
      await manager.updatePage(1, {
        // AutoIncrement 때문에 자동으로 1로 됨.
        permalink: 'hi',
      });
      const found = await model.Page.findOne({ id: 1 }); // AutoIncrement 때문에 자동으로 1로 됨.
      expect(found.permalink).to.equal('hi');
    });
    it('.updatePage 존재하지 않을 때 에러', function (done) {
      const p = new model.Page({
        permalink: 'ho',
        belongs_to: 'sopaseom',
        id: 100,
      });
      p.save()
        .then(() => {
          manager
            .updatePage(101, {
              permalink: 'hi',
            })
            .then(() => {
              done(new Error('에러가 나야 합니다.'));
            })
            .catch(() => {
              done();
            });
        })
        .catch((err) => {
          done(err);
        });
    });
  });

  describe('Film', function () {
    beforeEach('덤프 Film 만들기', async function () {
      await model.Film.create({
        title: '헬로우 마스터의 수퍼 길',
        title_en: "hello master super's load",
        people: [{ name: '하위' }],
        prod_date: new Date('1996-05-22'),
        open_date: new Date('2020-4-10'),
        tags: ['hi', 'ho', 'hu'],
      });
      // console.log(made._doc);
      // model.Film.syncIndexes();
    });

    describe('getFilm', function () {
      it('제대로 동작하여야 함.', async function () {
        const found = await manager.getFilm(1);
        expect(found.title).to.equal('헬로우 마스터의 수퍼 길');
      });
    });
    describe('getFilms', function () {
      it('페이지가 제대로 동작하여야 함', async function () {
        for (let i = 0; i < 15; i++) {
          // eslint-disable-next-line
          await model.Film.create({ title: `ho${i + 1}` });
        }
        const found = await manager.getFilms(2, 4);
        expect(found.length).to.equal(4);
        expect(found[0].id).to.equal(9);
        expect(found[1].id).to.equal(10);
        expect(found[2].id).to.equal(11);
        expect(found[3].id).to.equal(12);
      });

      it('날짜 검색이 잘 되어야 함', async function () {
        const expectFound = [];
        const expectNotFound = [];
        // console.log(`made.prod_date: ${made.prod_date.toString()}`);
        expectNotFound.push(
          await manager.getFilms(null, null, {
            prod_gte: null,
            prod_lte: new Date('1996-05-21'),
            open_gte: null,
            open_lte: null,
          }),
        );
        expectFound.push(
          await manager.getFilms(null, null, {
            prod_gte: null,
            prod_lte: new Date('1996-05-22'),
            open_gte: null,
            open_lte: null,
          }),
        );
        expectFound.push(
          await manager.getFilms(null, null, {
            prod_lte: new Date('1996-05-23'),
            open_gte: null,
            open_lte: null,
          }),
        );
        expectFound.push(
          await manager.getFilms(null, null, {
            prod_gte: new Date('1996-05-21'),
            prod_lte: null,
            open_gte: null,
            open_lte: null,
          }),
        );
        expectFound.push(
          await manager.getFilms(null, null, {
            prod_gte: new Date('1996-05-22'),
            prod_lte: null,
            open_gte: null,
            open_lte: null,
          }),
        );
        expectNotFound.push(
          await manager.getFilms(null, null, {
            prod_gte: new Date('1996-05-23'),
            prod_lte: null,
            open_gte: null,
            open_lte: null,
          }),
        );
        expectNotFound.push(
          await manager.getFilms(null, null, {
            prod_gte: null,
            prod_lte: null,
            open_gte: null,
            open_lte: new Date('2020-4-9'),
          }),
        );
        expectFound.push(
          await manager.getFilms(null, null, {
            prod_gte: null,
            prod_lte: null,
            open_gte: null,
            open_lte: new Date('2020-4-10'),
          }),
        );
        expectFound.push(
          await manager.getFilms(null, null, {
            prod_gte: null,
            prod_lte: null,
            open_gte: null,
            open_lte: new Date('2020-4-11'),
          }),
        );
        expectFound.push(
          await manager.getFilms(null, null, {
            prod_gte: null,
            prod_lte: null,
            open_gte: new Date('2020-4-9'),
            open_lte: null,
          }),
        );
        expectFound.push(
          await manager.getFilms(null, null, {
            prod_gte: null,
            prod_lte: null,
            open_gte: new Date('2020-4-10'),
            open_lte: null,
          }),
        );
        expectNotFound.push(
          await manager.getFilms(null, null, {
            prod_gte: null,
            prod_lte: null,
            open_gte: new Date('2020-4-11'),
            open_lte: null,
          }),
        );
        Object.values(expectFound).forEach((value, index) => {
          expect(value.length).to.equal(1, `expectFound - ${index}`);
        });
        Object.values(expectNotFound).forEach((value, index) => {
          expect(value.length).to.equal(0, `expectNotFound - ${index}`);
        });
      });

      it('날짜 두 개 이상이 잘 되어야 함', async function () {
        await model.Film.create({ prod_date: new Date('2000-02-01') });
        await model.Film.create({ prod_date: new Date('2000-02-02') });
        await model.Film.create({ prod_date: new Date('2000-02-03') });
        await model.Film.create({ prod_date: new Date('2000-02-04') });
        await model.Film.create({ prod_date: new Date('2000-02-05') });
        await model.Film.create({ prod_date: new Date('2000-02-06') });
        await model.Film.create({ prod_date: new Date('2000-02-07') });
        const result = await manager.getFilms(null, null, {
          prod_gte: new Date('2000-02-04'),
        });
        expect(result.length).to.equal(4);
      });

      it('태그 검색이 잘 되어야 함', async function () {
        const nullDateCondition = {
          open_lte: null,
          open_gte: null,
          prod_lte: null,
          prod_gte: null,
        };
        const yes = await manager.getFilms(null, null, nullDateCondition, [
          'hi',
          'ho',
        ]);
        const no = await manager.getFilms(null, null, nullDateCondition, [
          'hi',
          'nnnooooo',
        ]);
        expect(yes.length).to.equal(1);
        expect(no.length).to.equal(0);
      });
      describe('검색', function () {
        afterEach('인덱스 상태 출력', function () {
          // model.Film.collection.getIndexes({ full: true }).then((indexes) => {
          //   console.log('indexes:', indexes);
          //   // ...
          // }).catch(console.error);
        });
        it('한글 검색이 잘 되어야 함', async function () {
          // const r0 = await model.Film.find().exec();
          // console.log(`length: ${r0.length}`);
          // const r1 = await model.Film.find({ $text: { $search: 'hello' } }).exec();
          // console.log(`length: ${r1.length}`);
          const r2 = await model.Film.find({
            search: new RegExp('hellom'),
          }).exec();
          console.log(`length: ${r2.length}`);

          const result = await manager.getFilms(
            null,
            null,
            {},
            null,
            'ㅅㅜㅍㅓㄱ',
          );
          expect(result.length).to.equal(1);
        });
        it('분해되지 않은 한글이라면 실패', async function () {
          const result = await manager.getFilms(null, null, {}, null, '마스터');
          expect(result.length).to.equal(0);
        });
        it('감독이름 검색이 성공해야 함', async function () {
          const r2 = await model.Film.find({
            search: new RegExp('ㅎㅏㅇㅜㅣ'),
          }).exec();
          console.log(`length: ${r2.length}`);
          const result = await manager.getFilms(
            null,
            null,
            {},
            null,
            'ㅎㅏㅇㅜㅣ',
          );
          expect(result.length).to.equal(1);
        });
        it('복합 검색이 잘 되어야 함', async function () {
          const made = await model.Film.create({
            title: '간다로맨',
            prod_date: new Date('1996-05-22'),
            open_date: new Date('2020-4-10'),
            tags: ['hi', 'ho', 'hu'],
          });

          const yes = await manager.getFilms(
            0,
            5,
            {
              prod_lte: new Date('2000-01-01'),
              open_gte: new Date('2020-3-10'),
            },
            ['hi', 'ho'],
            'ㄷㅏㄹㅗ',
          );
          expect(yes.length).to.equal(1);
        });
      });

      // it('페이지가 제대로 동작하여야 함', async function () {
      //   for (let i = 0; i < 20; i++) {
      //     // eslint-disable-next-line
      //     await model.Film.create({title: `ho${i+1}`});
      //   }
      //   const found = await manager.getFilms(2, 4);
      //   expect(found.length).to.equal(4);
      //   expect(found[0].id).to.equal(9);
      //   expect(found[1].id).to.equal(10);
      //   expect(found[2].id).to.equal(11);
      //   expect(found[3].id).to.equal(12);
      // });
    });
    describe('createFilm', function () {
      it('제대로 동작해야 함.', async function () {
        await manager.createFilm({ title: '라그나로크' });

        const found = await model.Film.findOne({ title: '라그나로크' });
        expect(found.title).to.equal('라그나로크');
        expect(found.id).to.be.a('number');
      });
    });
    describe('updateFilm', function () {
      it('제대로 동작해야 함', async function () {
        const id = 1;
        await manager.updateFilm(id, { title: '라스베거스' });
        const found = await model.Film.findOne({ id });
        expect(found.title).to.equal('라스베거스');
      });
    });
    describe('removeFilm', function () {
      it('제대로 동작해야 함', async function () {
        const id = 1;
        await manager.removeFilm(id);
        const found = await model.Film.find();
        expect(found.length).to.equal(0);
      });
    });
  });

  describe('Post', function () {
    beforeEach('Dump 만들기', async function () {
      await model.Post.create({
        title: '헬로우 마스터의 수퍼 길',
        content: '<p class="common">안녕하십니까!</p>',
        c_date: new Date('2019-12-25'),
        status: 'public',
      });
    });
    describe('getPost', function () {
      it('제대로 동작해야 함.', async function () {
        const doc = await manager.getPost(1);
        expect(doc.status).to.equal('public');
        expect(doc.title).to.equal('헬로우 마스터의 수퍼 길');
        expect(doc.content).to.equal('<p class="common">안녕하십니까!</p>');
        expect(doc.c_date.getTime()).to.equal(new Date('2019-12-25').getTime());
      });

      it('private 가 제대로 걸러져야 함', async function () {
        await model.Post.create({ title: '비공개 게시물', status: 'private' });
        const result = await manager.getPost(2, 'public');
        expect(result).to.be.null;

        const yes = await manager.getPost(2, 'private');
        expect(yes.id).to.equal(2);
      });
    });
    describe('getPosts', function () {
      describe('페이지네이션', function () {
        it('제대로 동작해야 함.', async function () {
          for (let i = 0; i < 15; i++) {
            await model.Post.create({ title: `제목~${i}` });
          }
          const yes = await manager.getPosts({
            page: 2,
            perpage: 5,
          });
          expect(yes.length).to.equal(5);
          expect(yes[0].id).to.equal(11);
          expect(yes[1].id).to.equal(12);
          expect(yes[2].id).to.equal(13);
          expect(yes[3].id).to.equal(14);
          expect(yes[4].id).to.equal(15);
        });
      });
      describe('날짜', function () {
        it('제대로 동작해야 함.', async function () {
          const yes = await manager.getPosts({
            date_gte: new Date('2019-12-24'),
          });
          expect(yes.length).to.equal(1);
        });
      });
      describe('검색', function () {
        it('제대로 동작해야 함.', async function () {
          const yes = await manager.getPosts({
            search: 'ㅇㅏㄴㄴ',
          });
          expect(yes.length).to.equal(1);

          const no = await manager.getPosts({
            search: 'common',
          });
          expect(no.length).to.equal(0);
        });
      });
      describe('status', function () {
        it('제대로 동작해야 한다', async function () {
          const yes = await manager.getPosts({}, 'public');
          const no = await manager.getPosts({}, 'private');
          expect(yes.length).to.equal(1);
          expect(no.length).to.equal(0);
        });
      });
    });
    describe('createPost', function () {
      it('제대로 동작해야 함.', async function () {
        const yes = await manager.createPost({ title: '테스트' });
        console.log(yes);
        expect(yes.id).to.equal(2);
        expect(yes.title).to.equal("테스트");
      });
    });
    describe('updatePost', function () {
      it('제대로 동작해야 함.', async function () {
        await manager.updatePost(1, { title: '바뀐제목' });
        const doc = await model.Post.findOne({ id: 1 }).lean().exec();
        expect(doc.title).to.equal('바뀐제목');
      });
    });
    describe('removePost', function () {
      it('제대로 동작해야 함.', async function () {
        await manager.removePost(1);
        const notFound = await model.Post.find();
        expect(notFound.length).to.equal(0);
      });
    });
  });

  describe('Board', function () {
    describe('createBoard', function () {
      it('제대로 작동해야 함', async function () {
        await manager.createBoard({ title: '하이' });
        const doc = await model.Board.findOne({ id: 1 }).exec();
        // console.log(doc);
        expect(doc.title).to.equal('하이');
      });
    });
    describe('getBoardById', function () {
      it('제대로 작동해야 함', async function () {
        await model.Board.create({ title: '하이' });
        const doc = await manager.getBoardById(1);
        // console.log(doc);
        expect(doc.title).to.equal('하이');
      });
    });
    describe('getBoardByPermalink', function () {
      it('제대로 작동해야 함', async function () {
        await manager.createBoard({
          title: '하이',
          permalink: 'abc',
          belongs_to: 'cinesopa',
        });
        const doc = await manager.getBoardByPermalink('cinesopa', 'abc');
        // console.log(doc);
        expect(doc.title).to.equal('하이');
      });
    });
    describe('getBoards', function () {
      it('제대로 작동해야 함', async function () {
        for (let i = 0; i < 8; i++) {
          await manager.createBoard({
            title: '하이',
            permalink: 'abc',
            belongs_to: 'cinesopa',
          });
          await manager.createBoard({
            title: '하이',
            permalink: 'abc',
            belongs_to: 'sopaseom',
          });
        }
        const docs = await manager.getBoards();
        // console.log(docs);
        expect(docs.length).to.equal(16);
      });
    });
    describe('getBoardsAssigned', function () {
      it('제대로 작동해야 함', async function () {
        for (let i = 0; i < 8; i++) {
          await manager.createBoard({
            title: '하이',
            permalink: 'abc',
            belongs_to: 'cinesopa',
          });
          await manager.createBoard({
            title: '하이',
            permalink: 'abc',
            belongs_to: 'sopaseom',
          });
        }
        const docs = await manager.getBoardsAssigned('cinesopa');
        // console.log(docs);
        expect(docs.length).to.equal(8);
      });
    });
    describe('updateBoard', function () {
      it('제대로 작동해야 함', async function () {
        await model.Board.create({ title: '하이' });
        const changed = await manager.updateBoard(1, { title: '바뀌었음' });
        expect(changed.title).to.equal('바뀌었음');
      });
    });
    describe('removeBoard', function () {
      it('제대로 작동해야 함', async function () {
        await model.Board.create({ title: '하이' });
        await manager.removeBoard(1);
        const found = await model.Board.find().exec();
        expect(found.length).to.equal(0);
      });
    });
  });

  describe('복합', function () {
    describe('Post and Board', function () {
      it('post가 특정 board에 속해있을 때 잘 작동해야 함', async function () {
        const bdoc = await manager.createBoard({
          permalink: 'hi',
          belongs_to: 'cinesopa',
        });
        // console.log(bdoc);
        const pdoc = await manager.createPost({
          title: '글제목',
          board: bdoc._id,
        });
        // console.log(pdoc);
        const found = await manager.getPosts({
          board_belongs_to: 'cinesopa',
          board_permalink: 'hi',
        });
        // console.log(found);
        expect(found.length).to.equal(1);
      });

      it('post가 특정 board에 속해있지 않을 때는 결과가 없어야 함', async function () {
        const bdoc = await manager.createBoard({
          permalink: 'hi',
          belongs_to: 'cinesopa',
        });
        // console.log(bdoc);
        const pdoc = await manager.createPost({
          title: '글제목',
          board: bdoc._id,
        });
        // console.log(pdoc);
        const found = await manager.getPosts({
          board_belongs_to: 'cinesopa',
          board_permalink: 'him',
        });
        // console.log(found);
        expect(found.length).to.equal(0);
      });
    });
  });
});
