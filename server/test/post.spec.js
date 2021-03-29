const { expect } = require('chai');
const {
  testDatabaseServer,
  initTestServer,
  graphqlSuper,
  doLogin,
} = require('./tool');
const { db, model } = require('../loader');
const {
  postsCountQuery,
  postAdminQuery,
  postQuery,
  postsAdminQuery,
  postsQuery,
  createPostMutation,
  updatePostMutation,
  removePostMutation,
} = require('./graphql-request');
// const { model } = require('mongoose');

describe('Post', function () {
  // eslint-disable-next-line mocha/no-setup-in-describe
  const { mongod, agent } = initTestServer({
    before,
    beforeEach,
    after,
    afterEach,
  });
  // const mongod = testDatabaseServer({ before, beforeEach, after, afterEach });

  describe('db manager', function () {
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
        const doc = await db.getPost(1);
        expect(doc.status).to.equal('public');
        expect(doc.title).to.equal('헬로우 마스터의 수퍼 길');
        expect(doc.content).to.equal('<p class="common">안녕하십니까!</p>');
        expect(doc.c_date.getTime()).to.equal(new Date('2019-12-25').getTime());
      });

      it('private 가 제대로 걸러져야 함', async function () {
        await model.Post.create({ title: '비공개 게시물', status: 'private' });
        const result = await db.getPost(2, 'public');
        expect(result).to.be.null;

        const yes = await db.getPost(2, 'private');
        expect(yes.id).to.equal(2);
      });
    });
    describe('getPosts', function () {
      it('페이지네이션이 올바로 동작해야 함.', async function () {
        for (let i = 0; i < 15; i++) {
          // eslint-disable-next-line no-await-in-loop
          await model.Post.create({ title: `제목~${i}` });
        }
        const { list: yes, total } = await db.getPosts({
          page: 2,
          perpage: 5,
        });
        expect(yes.length).to.equal(5);
        expect(yes[0].id).to.equal(11);
        expect(yes[1].id).to.equal(12);
        expect(yes[2].id).to.equal(13);
        expect(yes[3].id).to.equal(14);
        expect(yes[4].id).to.equal(15);
        expect(total).to.equal(16);
      });
      it('날짜 검색이 제대로 동작해야 함.', async function () {
        const { list: yes } = await db.getPosts({
          date_gte: new Date('2019-12-24'),
        });
        expect(yes.length).to.equal(1);
      });
      it('검색이 제대로 동작해야 함.', async function () {
        const { list: yes } = await db.getPosts({
          search: 'ㅇㅏㄴㄴ',
        });
        expect(yes.length).to.equal(1);

        const { list: no } = await db.getPosts({
          search: 'common',
        });
        expect(no.length).to.equal(0);
      });
      it('status가 제대로 동작해야 한다', async function () {
        const { list: yes } = await db.getPosts({}, 'public');
        const { list: no } = await db.getPosts({}, 'private');
        expect(yes.length).to.equal(1);
        expect(no.length).to.equal(0);
      });
      it.only('board 및 permalink 가 제대로 동작해야 함.', async function () {
        const board1 = await model.Board.create({
          permalink: 'board1',
          belongs_to: 'cinesopa',
        });
        const board2 = await model.Board.create({
          permalink: 'board2',
          belongs_to: 'cinesopa',
        });
        const board3 = await model.Board.create({
          permalink: 'board3',
          belongs_to: 'sopaseom',
        });
        const promises = [
          model.Post.create({ title: 'post1', board: board1._id }),
          model.Post.create({ title: 'post2', board: board2._id }),
          model.Post.create({ title: 'post2-1', board: board2._id }),
          model.Post.create({ title: 'post3', board: board3._id }),
        ];
        await Promise.allSettled(promises);

        const result1 = await db.getPosts({
          board_permalinks: ['board1', 'board2', 'board3'],
          board_belongs_to: 'sopaseom',
        });
        expect(result1.list.length).to.equal(1).equal(result1.total);

        const result2 = await db.getPosts({
          board_permalinks: ['board1', 'board2', 'board3'],
          board_belongs_to: 'cinesopa',
        });
        expect(result2.list.length).to.equal(3).equal(result2.total);

        const result3 = await db.getPosts({
          board_permalinks: ['board2'],
          board_belongs_to: 'cinesopa',
        });
        expect(result3.list.length).to.equal(2).equal(result3.total);
      });
    });
    describe('createPost', function () {
      it('제대로 동작해야 함.', async function () {
        const yes = await db.createPost({ title: '테스트' });
        console.log(yes);
        expect(yes.id).to.equal(2);
        expect(yes.title).to.equal('테스트');
      });
    });
    describe('updatePost', function () {
      it('제대로 동작해야 함.', async function () {
        await db.updatePost(1, { title: '바뀐제목' });
        const doc = await model.Post.findOne({ id: 1 }).lean().exec();
        expect(doc.title).to.equal('바뀐제목');
      });
    });
    describe('removePost', function () {
      it('제대로 동작해야 함.', async function () {
        await db.removePost(1);
        const notFound = await model.Post.find();
        expect(notFound.length).to.equal(0);
      });
    });
    describe('getPostsCount', function () {
      beforeEach('초기세팅', async function () {
        const board1 = await model.Board.create({
          title: '',
          description: '',
          permalink: 'hi',
          belongs_to: 'cinesopa',
        });
        const board2 = await model.Board.create({
          title: '',
          description: '',
          permalink: 'hello',
          belongs_to: 'sopaseom',
        });
        const board3 = await model.Board.create({
          title: '',
          description: '',
          permalink: 'nice',
          belongs_to: 'sopaseom',
        });
        await model.Post.create({ board: board1._id, status: 'public' });
        await model.Post.create({ board: board2._id, status: 'public' });
        await model.Post.create({ board: board3._id, status: 'private' });
      });

      it('아무 조건이 없을 시 모두 찾아야 함', async function () {
        const i = await db.getPostsCount();
        expect(i).to.equal(4);
      });

      it('board 조건이 제대로 작동해야 함', async function () {
        const i1 = await db.getPostsCount({
          boards: ['hi'],
          belongs_to: 'cinesopa',
        });
        expect(i1).to.equal(1);
        const i2 = await db.getPostsCount({
          boards: ['hi'],
          belongs_to: 'sopaseom',
        });
        expect(i2).to.equal(0);
        const i3 = await db.getPostsCount({
          boards: ['hi', 'hello', 'whatsupman', 'nice'],
          belongs_to: 'sopaseom',
        });
        expect(i3).to.equal(3);
      });

      it('status 조건이 제대로 작동해야 함', async function () {
        const i = await db.getPostsCount({
          status: 'public',
        });
        expect(i).to.equal(2);
        const j = await db.getPostsCount({
          status: 'private',
        });
        expect(j).to.equal(1);
      });

      it('status와 board 조건이 제대로 작동해야 함', async function () {
        const i = await db.getPostsCount({
          status: 'public',
          boards: ['hi', 'hello', 'whatsupman', 'nice'],
          belongs_to: 'sopaseom',
        });
        expect(i).to.equal(1);
      });
    });
  });
  describe('실제 api', function () {
    beforeEach('포스트 여러개 세팅', async function () {
      await model.Post.create({
        title: '헬로',
        status: 'public',
      });
      await model.Post.create({
        title: '하읭',
        status: 'private',
      });
    });
    describe('post', function () {
      it('제대로 동작해야 함', async function () {
        const res = await graphqlSuper(agent, postQuery, {
          id: 1,
        });
        expect(res.body.data.post.id).to.equal(1);
        expect(res.body.data.post.title).to.equal('헬로');
      });
      it('private 은 보이지 않아야 함', async function () {
        const res = await graphqlSuper(agent, postQuery, {
          id: 2,
        });
        // console.log(res.body);
        expect(res.body.data.post).to.be.null;
      });
    });
    describe('posts', function () {
      it('private 은 보이지 않아야 함', async function () {
        const onlyManaged = await graphqlSuper(agent, postsQuery, {
          condition: {},
        });
        // console.log(onlyManaged.body);
        expect(onlyManaged.body.data.posts.list.length).to.equal(1);
      });
      it.only('페이지네이션 되었을 때 total과 결과가 제대로 나와야 함', async function () {
        const promises = [];
        Array.from({ length: 20 }, (x, i) => i).forEach((value, index) => {
          promises.push(
            model.Post.create({ title: `hi${index}`, status: 'public' }),
          );
        });
        await Promise.allSettled(promises);
        const onlyManaged = await graphqlSuper(agent, postsQuery, {
          condition: {
            page: 1,
            perpage: 3,
          },
        });
        const result = onlyManaged.body.data.posts;
        expect(result.list.length).to.equal(3);
        expect(result.total).to.equal(21);
      });
      it.only('카테고리가 제대로 분리되어져야함.', async function () {
        const board1 = await model.Board.create({
          title: '',
          description: '',
          permalink: 'hi',
          belongs_to: 'cinesopa',
        });
        const board2 = await model.Board.create({
          title: '',
          description: '',
          permalink: 'hello',
          belongs_to: 'sopaseom',
        });
        const board3 = await model.Board.create({
          title: '',
          description: '',
          permalink: 'nice',
          belongs_to: 'sopaseom',
        });
        await model.Post.create({ board: board1._id, status: 'public' });
        await model.Post.create({ board: board2._id, status: 'public' });
        await model.Post.create({ board: board3._id, status: 'private' });

        const res = await graphqlSuper(agent, postsQuery, {
          condition: {
            board_permalinks: ['hello'],
            board_belongs_to: 'sopaseom',
          },
        });
        console.log(res.body);
        expect(res.body.data.posts.list.length).to.equal(1);
      });
    });
    describe('postAdmin', function () {
      it('private 도 제대로 검색되어야 함', async function () {
        await doLogin(agent, 'testAdmin', 'abc');
        const res = await graphqlSuper(agent, postAdminQuery, {
          id: 2,
        });
        expect(res.body.data.postAdmin).to.not.be.null;
      });
    });
    describe('postsAdmin', function () {
      it('모든 게시물이 나와야 함', async function () {
        await doLogin(agent, 'testAdmin', 'abc');
        const all = await graphqlSuper(agent, postsAdminQuery, {
          condition: {},
        });
        // console.log(all.body);
        expect(all.body.data.postsAdmin.list.length).to.equal(2);
      });
    });
    describe('createPost', function () {
      it('제대로 동작해야 함', async function () {
        await doLogin(agent, 'testAdmin', 'abc');
        const res = await graphqlSuper(agent, createPostMutation, {
          input: { title: '제목이에요', excerpt: '요약입니다' },
        });
        expect(res.body.data.createPost).to.not.be.null;
        const all = await model.Post.find();
        expect(all.length).to.equal(3);
      });
    });
    describe('updatePost', function () {
      it('제대로 동작해야 함', async function () {
        await doLogin(agent, 'testAdmin', 'abc');
        const res = await graphqlSuper(agent, updatePostMutation, {
          id: 1,
          input: {
            title: '이것은 바뀐 제목입니다.',
            excerpt: '새로 생긴 필드',
          },
        });
        // console.log(res.body);
        expect(res.body.data.updatePost).to.not.be.null;
        const found = await model.Post.findOne({ id: 1 }).exec();
        // console.log(found);
        expect(found.title).to.equal('이것은 바뀐 제목입니다.');
        expect(found.excerpt).to.equal('새로 생긴 필드');
      });
    });
    describe('removePost', function () {
      it('제대로 동작해야 함', async function () {
        await doLogin(agent, 'testAdmin', 'abc');
        await graphqlSuper(agent, removePostMutation, {
          id: 1,
        });
        const found = await model.Post.find().exec();
        expect(found.length).to.equal(1);

        const exact = await model.Post.findOne({ id: 1 }).lean().exec();
        expect(exact).to.be.null;
      });
    });

    describe('postsCount', function () {
      it('제대로 동작해야 함', async function () {
        const board1 = await model.Board.create({
          title: '',
          description: '',
          permalink: 'hi',
          belongs_to: 'cinesopa',
        });
        const board2 = await model.Board.create({
          title: '',
          description: '',
          permalink: 'hello',
          belongs_to: 'sopaseom',
        });
        const board3 = await model.Board.create({
          title: '',
          description: '',
          permalink: 'nice',
          belongs_to: 'sopaseom',
        });
        await model.Post.create({ board: board1._id, status: 'public' });
        await model.Post.create({ board: board2._id, status: 'public' });
        await model.Post.create({ board: board3._id, status: 'private' });

        const result = await graphqlSuper(agent, postsCountQuery, {
          condition: {
            status: 'public',
            boards: ['hi', 'hello', 'whatsupman', 'nice'],
            belongs_to: 'sopaseom',
          },
        });
        expect(result.body.data.postsCount).to.equal(1);
      });
    });
  });
});
