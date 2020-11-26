const { expect } = require('chai');
const random = require('random');
// const { upload, createFileFromMockFile } = require('./tool');
const { fake } = require('sinon');
const { model, db } = require('../loader');
const {
  filmQuery,
  filmsQuery,
  createFilmMutation,
  updateFilmMutation,
  removeFilmMutation,
  filmsFeaturedQuery,
} = require('./graphql-request');
const { initTestServer, graphqlSuper, doLogin, doLogout, makeSimpleQuery, randomDate } = require('./tool');
describe('film', function () {
  // eslint-disable-next-line mocha/no-setup-in-describe
  const { agent } = initTestServer({ before, beforeEach, after, afterEach });

  describe('데이터베이스', function () {
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
        const found = await db.getFilm(1);
        expect(found.title).to.equal('헬로우 마스터의 수퍼 길');
      });
    });
    describe('getFilms', function () {
      it('페이지가 제대로 동작하여야 함', async function () {
        for (let i = 0; i < 15; i++) {
          // eslint-disable-next-line
          await model.Film.create({ title: `ho${i + 1}` });
        }
        const { list: found, total } = await db.getFilms(2, 4);
        expect(found.length).to.equal(4);
        expect(found[0].id).to.equal(9);
        expect(found[1].id).to.equal(10);
        expect(found[2].id).to.equal(11);
        expect(found[3].id).to.equal(12);
        expect(total).to.equal(16);
      });

      it('날짜 검색이 잘 되어야 함', async function () {
        const expectFound = [];
        const expectNotFound = [];
        // console.log(`made.prod_date: ${made.prod_date.toString()}`);
        expectNotFound.push(
          await db.getFilms(null, null, {
            prod_gte: null,
            prod_lte: new Date('1996-05-21'),
            open_gte: null,
            open_lte: null,
          }),
        );
        expectFound.push(
          await db.getFilms(null, null, {
            prod_gte: null,
            prod_lte: new Date('1996-05-22'),
            open_gte: null,
            open_lte: null,
          }),
        );
        expectFound.push(
          await db.getFilms(null, null, {
            prod_lte: new Date('1996-05-23'),
            open_gte: null,
            open_lte: null,
          }),
        );
        expectFound.push(
          await db.getFilms(null, null, {
            prod_gte: new Date('1996-05-21'),
            prod_lte: null,
            open_gte: null,
            open_lte: null,
          }),
        );
        expectFound.push(
          await db.getFilms(null, null, {
            prod_gte: new Date('1996-05-22'),
            prod_lte: null,
            open_gte: null,
            open_lte: null,
          }),
        );
        expectNotFound.push(
          await db.getFilms(null, null, {
            prod_gte: new Date('1996-05-23'),
            prod_lte: null,
            open_gte: null,
            open_lte: null,
          }),
        );
        expectNotFound.push(
          await db.getFilms(null, null, {
            prod_gte: null,
            prod_lte: null,
            open_gte: null,
            open_lte: new Date('2020-4-9'),
          }),
        );
        expectFound.push(
          await db.getFilms(null, null, {
            prod_gte: null,
            prod_lte: null,
            open_gte: null,
            open_lte: new Date('2020-4-10'),
          }),
        );
        expectFound.push(
          await db.getFilms(null, null, {
            prod_gte: null,
            prod_lte: null,
            open_gte: null,
            open_lte: new Date('2020-4-11'),
          }),
        );
        expectFound.push(
          await db.getFilms(null, null, {
            prod_gte: null,
            prod_lte: null,
            open_gte: new Date('2020-4-9'),
            open_lte: null,
          }),
        );
        expectFound.push(
          await db.getFilms(null, null, {
            prod_gte: null,
            prod_lte: null,
            open_gte: new Date('2020-4-10'),
            open_lte: null,
          }),
        );
        expectNotFound.push(
          await db.getFilms(null, null, {
            prod_gte: null,
            prod_lte: null,
            open_gte: new Date('2020-4-11'),
            open_lte: null,
          }),
        );
        Object.values(expectFound).forEach((value, index) => {
          expect(value.list.length).to.equal(1, `expectFound - ${index}`);
        });
        Object.values(expectNotFound).forEach((value, index) => {
          expect(value.list.length).to.equal(0, `expectNotFound - ${index}`);
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
        const { list: result } = await db.getFilms(null, null, {
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
        const { list: yes } = await db.getFilms(null, null, nullDateCondition, [
          'hi',
          'ho',
        ]);
        const { list: no } = await db.getFilms(null, null, nullDateCondition, [
          'hi',
          'nnnooooo',
        ]);
        expect(yes.length).to.equal(1);
        expect(no.length).to.equal(0);
      });

      it('open_date의 최신 순으로 나와야 함.', async function () {
        const promises = [];
        for (let i = 0; i < 15; i++) {
          // eslint-disable-next-line no-await-in-loop
          // await model.Film.create({ title: `ho${i + 1}` });
          promises.push(
            model.Film.create({
              title: `ho${i + 1}`,
              open_date: randomDate(),
            }),
          );
        }
        await Promise.allSettled(promises);
        const { list: found, total } = await db.getFilms(0, 10);
        // console.log(found);
        for (let i = 0; i < 9; i++) {
          expect(found[i].open_date).to.greaterThan(
            found[i + 1].open_date,
            `${i}번째 항목은 ${i + 1}번째 항목보다 더 작아요!`,
          );
        }
        // console.log(total);
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

          const { list: result } = await db.getFilms(
            null,
            null,
            {},
            null,
            'ㅅㅜㅍㅓㄱ',
          );
          expect(result.length).to.equal(1);
        });
        it('분해되지 않은 한글이라면 실패', async function () {
          const { list: result } = await db.getFilms(
            null,
            null,
            {},
            null,
            '마스터',
          );
          expect(result.length).to.equal(0);
        });
        it('감독이름 검색이 성공해야 함', async function () {
          const r2 = await model.Film.find({
            search: new RegExp('ㅎㅏㅇㅜㅣ'),
          }).exec();
          console.log(`length: ${r2.length}`);
          const { list: result } = await db.getFilms(
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

          const { list: yes } = await db.getFilms(
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
      //   const found = await db.getFilms(2, 4);
      //   expect(found.length).to.equal(4);
      //   expect(found[0].id).to.equal(9);
      //   expect(found[1].id).to.equal(10);
      //   expect(found[2].id).to.equal(11);
      //   expect(found[3].id).to.equal(12);
      // });
    });
    describe('createFilm', function () {
      it('제대로 동작해야 함.', async function () {
        await db.createFilm({ title: '라그나로크' });

        const found = await model.Film.findOne({ title: '라그나로크' });
        expect(found.title).to.equal('라그나로크');
        expect(found.id).to.be.a('number');
      });
    });
    describe('updateFilm', function () {
      it('제대로 동작해야 함', async function () {
        const id = 1;
        await db.updateFilm(id, { title: '라스베거스' });
        const found = await model.Film.findOne({ id });
        expect(found.title).to.equal('라스베거스');
      });
    });
    describe('removeFilm', function () {
      it('제대로 동작해야 함', async function () {
        const id = 1;
        await db.removeFilm(id);
        const found = await model.Film.find();
        expect(found.length).to.equal(0);
      });
    });
  });
  describe('실제 api', function () {
    describe('film', function () {
      it('제대로 동작해야 함', async function () {
        await model.Film.create({ title: '안녕' });
        const result = await graphqlSuper(agent, filmQuery, {
          id: 1,
        });
        expect(result.body.data.film).not.be.null;
      });
      it('존재하지 않을 때 결과가 없어야 함', async function () {
        const result = await graphqlSuper(agent, filmQuery, {
          id: 1,
        });
        expect(result.body.data.film).to.be.null;
      });
    });
    describe('films', function () {
      beforeEach('초기정보 만들기', async function () {
        await model.Film.create({
          title: '안녕',
          prod_date: new Date('2019-12-25'),
          open_date: new Date('2019-12-28'),
          title_en: 'hello',
        });
        await model.Film.create({
          title: '안녕2',
          prod_date: new Date('2020-04-25'),
          open_date: new Date('2020-05-28'),
          title_en: 'hello2',
        });
      });
      it('날짜 조건이 제대로 동작해야 함', async function () {
        const result = await graphqlSuper(agent, filmsQuery, {
          condition: {
            prod_lte: new Date('2019-12-31'),
          },
        });
        // console.log(result.body.data.films);
        expect(result.body.data.films.list).to.not.be.null;
        expect(result.body.data.films.list.length).to.equal(1);
      });
      it('검색 조건이 제대로 동작해야 함.1', async function () {
        const result2 = await graphqlSuper(agent, filmsQuery, {
          condition: {
            search: '녕',
          },
        });
        // console.log(result2.body.data.films);
        expect(result2.body.data.films.list.length).to.equal(2);
      });
      it('검색 조건이 제대로 동작해야 함.2', async function () {
        const result3 = await graphqlSuper(agent, filmsQuery, {
          condition: {
            search: '녕2',
          },
        });
        // console.log(result3.body.data.films);
        expect(result3.body.data.films.list.length).to.equal(1);
      });
      it('페이지네이션이 제대로 동작해야 함.', async function () {
        const promises = [];
        for (let i = 0; i < 10; i++) {
          promises.push(model.Film.create({ title: `movie-${i}` }));
        }
        // console.log(promises);
        await Promise.allSettled(promises);
        const result = await graphqlSuper(agent, filmsQuery, {
          condition: { page: 0, perpage: 9 },
        });
        expect(result.body.data.films.list.length).to.equal(9);
      });
    });
    describe('filmsAdmin', function () {
      it('제대로 동작해야 함', async function () {
        this.skip();
      });
    });
    describe('filmsFeatured', function () {
      it('제대로 동작해야 함', async function () {
        const jobs = [
          model.Film.create({
            status: 'public',
            is_featured: true,
            title: '1',
          }),
          model.Film.create({
            status: 'public',
            is_featured: false,
            title: '2',
          }),
          model.Film.create({
            status: 'private',
            is_featured: true,
            title: '3',
          }),
          model.Film.create({
            status: 'private',
            is_featured: false,
            title: '4',
          }),
        ];
        await Promise.allSettled(jobs);
        const res = await graphqlSuper(agent, filmsFeaturedQuery);
        const result = res.body.data.filmsFeatured;
        // console.log(res.body);
        expect(result.total).to.equal(1);
        expect(result.list.length).to.equal(1);
        expect(result.list[0].title).to.equal('1');
      });
    });
    describe("availableSubtitle", function () {
      it.only("제대로 동작해야 함.", async function () {
        const result = await makeSimpleQuery(agent, 'availableSubtitle')({}, '');
        console.log(result);
      });
    });
    describe('createfilm', function () {
      it('제대로 동작해야 함', async function () {
        await doLogin(agent, 'testAdmin', 'abc');
        await graphqlSuper(agent, createFilmMutation, {
          input: {
            title: '하이',
            companies: [
              {
                name: '영화배급협동조합 씨네소파',
              },
            ],
            prod_date: new Date('2020-8-1'),
          },
        });
        const found = await model.Film.findOne({ title: '하이' }).lean().exec();
        // console.log(found);

        expect(found.title).to.equal('하이');
        expect(found.companies[0].name).to.equal('영화배급협동조합 씨네소파');
      });
    });
    describe('updatefilm', function () {
      it('제대로 동작해야 함', async function () {
        await doLogin(agent, 'testAdmin', 'abc');
        await model.Film.create({ title: '바뀌기 전' });
        await graphqlSuper(agent, updateFilmMutation, {
          id: 1,
          input: {
            title: '바뀐 후',
          },
        });
        const doc = await model.Film.findOne({ id: 1 });
        expect(doc.title).to.equal('바뀐 후');
      });
    });
    describe('removefilm', function () {
      it('제대로 동작해야 함', async function () {
        await doLogin(agent, 'testAdmin', 'abc');
        await model.Film.create({ title: '바뀌기 전' });
        const removed = await graphqlSuper(agent, removeFilmMutation, {
          id: 1,
        });
        expect(removed.body.data.removeFilm.id).to.equal(1);
        const docs = await model.Film.find();
        expect(docs.length).to.equal(0);
      });
    });
  });
});
