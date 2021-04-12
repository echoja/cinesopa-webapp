const { expect } = require('chai');
const random = require('random');
// const { upload, createFileFromMockFile } = require('./tool').default;
const { fake } = require('sinon');
const { model, db } = require('@/loader');
const {
  createTestServer,
  graphqlSuper,
  doLogin,
  doLogout,
  makeSimpleQuery,
  randomDate,
  doGuestLogin,
} = require('./tool').default;
describe('tag', function () {
  // eslint-disable-next-line mocha/no-setup-in-describe
  const { agent } = createTestServer(this);
  describe('api', function () {
    describe('getTags', function () {
      it('잘 동작해야 함', async function () {
        const results = await Promise.allSettled([
          model.Film.create({ title: '하이' }),
          model.Film.create({ title: '호우' }),
          model.Film.create({ title: '호야' }),
          model.Tag.create({
            name: '태그원',
            related_films: [
              {
                id: 1,
              },
              {
                id: 2,
              },
            ],
          }),
          model.Tag.create({
            name: '태그투',
            related_films: [
              {
                id: 1,
              },
              {
                id: 3,
              },
            ],
          }),
          model.Tag.create({
            name: '태그쓰리',
            related_films: [
              {
                id: 3,
              },
              {
                id: 1,
              },
              {
                id: 2,
              },
            ],
          }),
        ]);
        // console.log(results);
        // const films = await model.Film.find().lean().exec();
        // console.log('# tag-spec.js films');
        // console.log(films);
        const req = makeSimpleQuery(agent, 'tags');
        const result = await req(
          {},
          `{
          total
          list {
            name
            related_films {
              id
              title
            }
          }
        }`,
        );
        const p3 = result.list[0];
        expect(result.total).to.equal(3);
        expect(result.list.length).to.equal(3);
        // title 을 모두 가지고 있어야 함.
        result.list.forEach((tag) => {
          tag.related_films.forEach((film) => {
            expect(film.id).to.be.a('number');
            expect(film.title).to.be.a('string');
          });
        });
        // 수가 많은 게 앞에 와야함.
        expect(p3.related_films.length).to.equal(3);
        // console.dir(result, { depth: 4 });
      });
      it('limit 이 잘 동작해야 함.', async function () {
        await Promise.allSettled([
          model.Tag.create({
            name: '태그원',
            related_films: [
              {
                id: 1,
              },
              {
                id: 2,
              },
            ],
          }),
          model.Tag.create({
            name: '태그투',
            related_films: [
              {
                id: 1,
              },
              {
                id: 3,
              },
            ],
          }),
          model.Tag.create({
            name: '태그쓰리',
            related_films: [
              {
                id: 3,
              },
              {
                id: 1,
              },
              {
                id: 2,
              },
            ],
          }),
        ]);

        // console.log();
        const req = makeSimpleQuery(agent, 'tags');
        const result = await req(
          { condition: { limit: 2 } },
          `{
          total
          list {
            name
            related_films {
              id
              title
            }
          }
        }`,
        );
        expect(result.total).to.equal(3);
        expect(result.list.length).to.equal(2);
      });
    });
  });
});
