import { expect } from 'chai';
import random from 'random';
// const { upload, createFileFromMockFile } = require('./tool').default;
import { fake } from 'sinon';
import { db, model } from '@/loader';
import {
  updateBoardMutation,
  removeBoardMutation,
  createBoardMutation,
  boardsQuery,
  boardQuery,
} from './graphql-request';
import {
  createTestServer,
  graphqlSuper,
  doLogin,
} from './tool';

describe('board', function () {
  const { agent } = createTestServer(
    this,
  );

  describe('db', function () {
    describe('createBoard', function () {
      it('제대로 작동해야 함', async function () {
        await db.createBoard({ title: '하이' });
        const doc = await model.Board.findOne({ id: 1 }).exec();
        // console.log(doc);
        expect(doc.title).to.equal('하이');
      });
    });
    describe('getBoard', function () {
      it('제대로 작동해야 함', async function () {
        await model.Board.create({ title: '하이' });
        const doc = await db.getBoard(1);
        // console.log(doc);
        expect(doc.title).to.equal('하이');
      });
    });
    describe('getBoardByPermalink', function () {
      it('제대로 작동해야 함', async function () {
        await db.createBoard({
          title: '하이',
          permalink: 'abc',
          belongs_to: 'cinesopa',
        });
        const doc = await db.getBoardByPermalink('cinesopa', 'abc');
        // console.log(doc);
        expect(doc.title).to.equal('하이');
      });
    });
    describe('getBoards', function () {
      it('제대로 작동해야 함', async function () {
        const promise = [];
        for (let i = 0; i < 8; i++) {
          promise.push(
            db.createBoard({
              title: '하이',
              permalink: 'abc',
              belongs_to: 'cinesopa',
            }),
          );
          promise.push(
            db.createBoard({
              title: '하이',
              permalink: 'abc',
              belongs_to: 'sopaseom',
            }),
          );
        }
        await Promise.allSettled(promise);
        const docs = await db.getBoards();
        // console.log(docs);
        expect(docs.length).to.equal(16);
      });
    });
    describe('getBoardsAssigned', function () {
      it('제대로 작동해야 함', async function () {
        const promise = [];
        for (let i = 0; i < 8; i++) {
          promise.push(
            db.createBoard({
              title: '하이',
              permalink: 'abc',
              belongs_to: 'cinesopa',
            }),
          );
          promise.push(
            db.createBoard({
              title: '하이',
              permalink: 'abc',
              belongs_to: 'sopaseom',
            }),
          );
        }
        await Promise.allSettled(promise);
        const docs = await db.getBoardsAssigned('cinesopa');
        // console.log(docs);
        expect(docs.length).to.equal(8);
      });
    });
    describe('updateBoard', function () {
      it('제대로 작동해야 함', async function () {
        await model.Board.create({ title: '하이' });
        const changed = await db.updateBoard(1, { title: '바뀌었음' });
        expect(changed.title).to.equal('바뀌었음');
      });
    });
    describe('removeBoard', function () {
      it('제대로 작동해야 함', async function () {
        await model.Board.create({ title: '하이' });
        await db.removeBoard(1);
        const found = await model.Board.find().exec();
        expect(found.length).to.equal(0);
      });
    });
  });
  describe('api', function () { 
    beforeEach('보드 세팅', async function () {
      await model.Board.create({
        title: '제목',
        description: '설명',
        belongs_to: 'cinesopa',
        permalink: 'notice',
      });
    });
    describe('board', function () {
      it('id로 잘 얻어야 함', async function () {
        const res = await graphqlSuper(agent, boardQuery, {
          condition: {
            id: 1,
          },
        });
        // console.log(res.body);
        expect(res.body.data.board).to.not.be.null;
      });
      it('permalink, belongs_to로 잘 얻어야 함.', async function () {
        const res = await graphqlSuper(agent, boardQuery, {
          condition: {
            permalink: 'notice',
            belongs_to: 'cinesopa',
          },
        });
        // console.log(res.body);
        expect(res.body.data.board).to.not.be.null;
      });
    });
    describe('boards', function () {
      it('제대로 작동되어야 함', async function () {
        await doLogin(agent, 'testAdmin', 'abc');
        const res = await graphqlSuper(agent, boardsQuery, {
          belongs_to: 'cinesopa',
        });
        expect(res.body.data.boards.length).to.equal(1);
      });
      it('해당하는 belongs_to가 아닐 경우 결과가 없어야 함', async function () {
        await doLogin(agent, 'testAdmin', 'abc');
        const res = await graphqlSuper(agent, boardsQuery, {
          belongs_to: '없는것',
        });
        expect(res.body.data.boards.length).to.equal(0);
      });
    });
    describe('createBoard', function () {
      it('제대로 작동되어야 함', async function () {
        await doLogin(agent, 'testAdmin', 'abc');
        await graphqlSuper(agent, createBoardMutation, {
          input: {
            title: 'hihello',
          },
        });
        const found = await model.Board.findOne({ title: 'hihello' })
          .lean()
          .exec();
        console.log(found);
        expect(found).to.not.be.null;
      });
    });
    describe('updateBoard', function () {
      it('제대로 작동되어야 함', async function () {
        await doLogin(agent, 'testAdmin', 'abc');
        await graphqlSuper(agent, updateBoardMutation, {
          id: 1,
          input: {
            title: '변경된 타이틀',
          },
        });

        const found = await model.Board.findOne({ id: 1 }).lean().exec();
        console.log(found);
        expect(found.title).to.equal('변경된 타이틀');
      });
    });
    describe('removeBoard', function () {
      it('제대로 작동되어야 함', async function () {
        await doLogin(agent, 'testAdmin', 'abc');
        await graphqlSuper(agent, removeBoardMutation, {
          id: 1,
        });

        const found = await model.Board.find().lean().exec();
        console.log(found);
        expect(found.length).to.equal(0);
      });
    });
  });
});
