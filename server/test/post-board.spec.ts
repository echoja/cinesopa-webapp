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
import { createTestServer, graphqlSuper, doLogin } from './tool';

describe('board & post', function () {
  const { agent } = createTestServer(this);
  describe('db', function () {
    it('post가 특정 board에 속해있을 때 잘 작동해야 함', async function () {
      const bdoc = await db.createBoard({
        permalink: 'hi',
        belongs_to: 'cinesopa',
      });
      // console.log(bdoc);
      const pdoc = await db.createPost({
        title: '글제목',
        board: bdoc._id,
      });
      // console.log(pdoc);
      const found = await db.getPosts({
        board_belongs_to: 'cinesopa',
        board_permalinks: ['hi'],
      });
      // console.log(found);
      expect(found.list.length).to.equal(1);
    });

    it('post가 특정 board에 속해있지 않을 때는 결과가 없어야 함', async function () {
      const bdoc = await db.createBoard({
        permalink: 'hi',
        belongs_to: 'cinesopa',
      });
      // console.log(bdoc);
      const pdoc = await db.createPost({
        title: '글제목',
        board: bdoc._id,
      });
      // console.log(pdoc);
      const found = await db.getPosts({
        board_belongs_to: 'cinesopa',
        board_permalinks: ['him'],
      });
      // console.log(found);
      expect(found.list.length).to.equal(0);
    });
  });
});
