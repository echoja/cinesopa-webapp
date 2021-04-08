import { expect } from 'chai';
import random from 'random';
// const { upload, createFileFromMockFile } = require('./tool').default;
import { fake } from 'sinon';
import { db, model } from '@/loader';
import addContext from 'mochawesome/addContext';
import {
  updateBoardMutation,
  removeBoardMutation,
  createBoardMutation,
  boardsQuery,
  boardQuery,
  getPageByIdQuery,
  createPageMutation,
  updatePageMutation,
  removePageMutation,
  getPageQuery,
  getPagesQuery,
} from './graphql-request';
import { createTestServer, graphqlSuper, doLogin } from './tool';

describe('page', function () {
  // eslint-disable-next-line mocha/no-setup-in-describe
  const { agent } = createTestServer(this);
  describe('db', function () {
    it('.createPage', function (done) {
      db.createPage({
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
          db.getPage(1) // AutoIncrement 때문에 자동으로 1로 됨.
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
      // db.page
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
          db.getPages('sopaseom', 3, 6)
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
      const found = await db.getPageView('ho', 'sopaseom');
      expect(found).to.be.not.null;
    });
    it('.removePage', async function () {
      const p = new model.Page({
        permalink: 'ho',
        belongs_to: 'sopaseom',
        id: 100,
      });
      await p.save();
      await db.removePage(1); // AutoIncrement 때문에 자동으로 1로 됨.
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
        await db.removePage(101);
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
      await db.updatePage(1, {
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
          db.updatePage(101, {
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

  describe('api', function () {
    // describe.skip("createPage");
    describe('createPage', function () {
      it('제대로 동작해야 함', function (done) {
        model.Page.create({ title: 'hi', content: 'ho' })
          .then((result) => {
            // console.log(result);
          })
          .catch((err) => {});
        doLogin(agent, 'testAdmin', 'abc')
          .then(() => {
            // console.log(login);
            graphqlSuper(agent, createPageMutation, {
              permalink: 'hi',
              belongs_to: 'sopaseom',
              pageinfo: {
                title: 'hello',
                content: '<p>hello</p>',
                belongs_to: 'sopaseom.kr',
              },
            })
              .then((result) => {
                addContext(this, {
                  title: 'result',
                  value: result.body.data.createPage,
                });
                expect(result.body.data.createPage.id).to.not.be.null;
                expect(result.body.data.createPage.title).to.equal('hello');
                expect(result.body.data.createPage.content).to.equal(
                  '<p>hello</p>',
                );
                return done();
              })
              .catch((err) => {
                console.error(err);
                return done(err);
              });
          })
          .catch((err) => {
            console.error(err);
            return done(err);
          });
      });
      it('중복되었을 때 에러가 발생해야 함', async function () {
        let err = null;
        let rightCount = 0;
        try {
          const loginResult = await doLogin(agent, 'testAdmin', 'abc');
          addContext(this, { title: 'loginResult', value: loginResult.body });

          const result1 = await graphqlSuper(agent, createPageMutation, {
            permalink: 'hi',
            belongs_to: 'sopaseom',
            pageinfo: { title: 'hi1' },
          });
          rightCount++;
          // console.log(result1.body);
          const result2 = await graphqlSuper(agent, createPageMutation, {
            permalink: 'hi',
            belongs_to: 'sopaseom',
            pageinfo: { title: 'hi2' },
          });
          rightCount++;
          // console.log(result2.body);
          err = null;
        } catch (error) {
          err = error;
        }
        // console.log(err);
        expect(err).to.not.equal(null);
        expect(rightCount).to.equal(1);
      });
      it('권한이 없을 때 아무런 결과도 나오지 않아야 함', function (done) {
        graphqlSuper(agent, createPageMutation, {
          permalink: 'hi',
          belongs_to: 'sopaseom',
          pageinfo: {
            title: 'hello',
            content: '<p>hello</p>',
            belongs_to: 'sopaseom.kr',
          },
        })
          .then((result) => {
            addContext(this, { title: '결과', value: result });
            done(result);
          })
          .catch((err) => {
            done();
          });
      });
    });
    describe('updatePage', function () {
      it('제대로 동작해야 함', async function () {
        try {
          const loginres = await doLogin(agent, 'testAdmin', 'abc');
          addContext(this, { title: 'loginres', value: loginres });
          const managerres = await db.createPage({
            permalink: 'hello',
            belongs_to: 'sopaseom',
            title: 'hoho',
            id: 100,
          });
          addContext(this, { title: 'managerres', value: managerres });
          const result = await graphqlSuper(agent, updatePageMutation, {
            permalink: 'hello',
            belongs_to: 'sopaseom',
            pageinfo: {
              title: 'mass',
            },
          });
          addContext(this, { title: '결과', value: result });
          const r = await model.Page.find({ id: 1 }).lean().exec();
          console.log(r);
        } catch (error) {
          console.error(error);
          throw error;
        }
      });
      it('권한이 없을 때 아무런 결과도 나오지 않아야 함', function (done) {
        graphqlSuper(agent, updatePageMutation, {
          permalink: 'hi',
          belongs_to: 'sopaseom',
          pageinfo: {
            title: 'hello',
            content: '<p>hello</p>',
            belongs_to: 'sopaseom.kr',
          },
        })
          .then((result) => {
            addContext(this, { title: '결과', value: result });
            // expect(result.body.data.updatePage).to.equal(null);
            done(result);
          })
          .catch((err) => {
            done();
          });
      });
    });
    describe('removePage', function () {
      it('제대로 동작해야 함', async function () {
        try {
          const loginres = await doLogin(agent, 'testAdmin', 'abc');
          addContext(this, { title: 'loginres', value: loginres });
          const managerres = await db.createPage({
            permalink: 'hello',
            belongs_to: 'sopaseom',
            title: 'hoho',
            id: 100,
          });
          addContext(this, { title: 'managerres', value: managerres });
          const result = await graphqlSuper(agent, removePageMutation, {
            permalink: 'hello',
            belongs_to: 'sopaseom',
          });
          addContext(this, { title: '결과', value: result });
          let found = false;
          db.getPage(100)
            .then((result) => {
              found = true;
            })
            .catch((err) => {
              found = false;
            });
          expect(found).to.be.false;
        } catch (error) {
          console.error(error);
          throw error;
        }
      });
      it('권한이 없을 때 아무런 결과도 나오지 않아야 함', function (done) {
        graphqlSuper(agent, removePageMutation, {
          permalink: 'hi',
          belongs_to: 'sopaseom',
        })
          .then((result) => {
            addContext(this, { title: '결과', value: result });
            done(result);
          })
          .catch((err) => {
            done();
          });
      });
    });
    describe('page (getPage)', function () {
      it('제대로 동작해야 함', async function () {
        try {
          // const loginres = await doLogin(agent, "testAdmin", "abc");
          // addContext(this, { title: "loginres", value: loginres });
          const managerres = await db.createPage({
            permalink: 'hi',
            belongs_to: 'sopaseom',
            title: 'hoho',
            id: 100,
          });
          // addContext(this, { title: "managerres", value: managerres });
          const result = await graphqlSuper(agent, getPageQuery, {
            permalink: 'hi',
            belongs_to: 'sopaseom',
          });
          // console.dir(result.body);
          addContext(this, { title: '결과', value: result.body });
          // console.log("--result--");
          // console.dir(result.body, {'maxArrayLength': null});
          expect(result.body.data.page.title).to.equal('hoho');
          // console.log(result)
        } catch (error) {
          // console.log("--error show--");
          // console.dir(error, {'maxArrayLength': null});
          addContext(this, { title: '에러', value: error });
          throw error;
        }
      });
    });
    describe('pages', function () {
      it('제대로 동작해야 함', async function () {
        await doLogin(agent, 'testAdmin', 'abc');
        // const promises = [];
        for (let i = 0; i < 30; i++) {
          const p = new model.Page({
            // id: i, // Auto Increment 때문에 무조건 1부터 시작함.
            title: `제목-${i}`,
            belongs_to: 'sopaseom',
          });
          await p.save();
        }
        const result = await graphqlSuper(agent, getPagesQuery, {
          belongs_to: 'sopaseom',
          page: 2,
          perpage: 5,
        });
        const ls = result.body.data.pages;
        expect(ls.length).to.equal(5);
        // console.log(ls);
        expect(ls[0].id).to.equal(11);
        expect(ls[1].id).to.equal(12);
        expect(ls[2].id).to.equal(13);
        expect(ls[4].id).to.equal(15);
      });
    });
    describe('pageById', function () {
      it('제대로 동작해야 함', async function () {
        await doLogin(agent, 'testAdmin', 'abc');
        const page = await model.Page.create({
          id: 132413,
          title: '제목',
          belongs_to: 'sopaseom',
        });
        expect(page.id).to.equal(1); // AutoIncrement 때문에 본래 설정이 무시되고 1부터 설정됨.
        const result = await graphqlSuper(agent, getPageByIdQuery, {
          id: 1,
        });
        expect(result.body.data.pageById.title).to.equal('제목');
      });
      it('페이지가 없으면 결과가 null이어야 함.', async function () {
        await doLogin(agent, 'testAdmin', 'abc');
        const result = await graphqlSuper(agent, getPageByIdQuery, {
          id: 1,
        });
        expect(result.body.data.pageById).to.be.null;
      });
    });
  });
});
