/**
 * @file
 * db manager 테스트입니다.
 * 모든 스키마는 자동으로 id가 1부터 채워진다고 가정합니다.
 */

// require('../typedef');
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

    mongod = new MongoMemoryServer({ binary: { version: '4.2.9' } });
    const uri = await mongod.getUri();
    const mongooseOpts = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
      // debug: true,
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
