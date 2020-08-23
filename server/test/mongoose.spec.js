/**
 * @file
 * 여기서는 mongoose 에서 정의한 schema 및 model 에 대해서 테스트합니다.
 */

const { expect } = require('chai');

const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

const { model } = require('../loader');

describe('mongoose schema and model', function () {
  /** @type {MongoMemoryServer} */
  let mongod;

  before('db 세팅', async function () {
    mongod = new MongoMemoryServer();
    const uri = await mongod.getUri();
    const mongooseOpts = {
      useNewUrlParser: true,
      // autoReconnect: true,
      // reconnectTries: Number.MAX_VALUE,
      // reconnectInterval: 1000,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    };
    await mongoose.connect(uri, mongooseOpts);
  });
  afterEach('DB 내용 초기화', async function () {
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

  describe('Film', function () {
    const filmInput = {
      title: '이것은 슈퍼파워 제목이다.',
      title_en: 'This is super power title.',
      kobis_code: '123',
      genres: ['genre1', 'genre2'],
      show_time: 1324,
      type_name: '애니메이션',
      prod_year: '13324',
      open_year: '1325',
      people: [
        {
          role_type: 'director',
          name: '하',
          name_en: 'ha',
        },
        {
          role_type: 'actor',
          name: '호',
          name_en: 'gh',
          role: '김수정',
        },
        {
          role_type: 'staff',
          name: '헤헤',
          name_en: 'hehe',
          role: '촬영감독',
        },
      ],
      companies: [{
        name: '뒷회사',
        name_en: 'back company',
        role: '제작사',
      }],
      watch_grade: '전체관람가',
      reviews: [
        {
          title: '1',
          url: '2',
          source: '3',
          author: '4',
        },
      ],
      star_naver: 2,
      star_daum: 3,
      // star_cine21: 5,
      // poster: { type: mongoose.Schema.Types.ObjectId, ref: 'File' },
      // photos: [{ type: mongoose.Schema.Types.ObjectId, ref: 'File' }],
      // // id: Number, AutoIncrement 로 인해서 명시적으로 적어줄 필요 없음.
      // videos: [Video],
      // synopsis: String,
      // note: String,
      // meta: mongoose.Schema.Types.Mixed,
    };

    it('새 doc을 만들었을 때 search 가 무사히 생겨야 함. (훅에 의해 생성됨.)', async function () {
      const test = await model.Film.create(filmInput);
      expect(test.search).to.equal('ㅇㅣㄱㅓㅅㅇㅡㄴㅅㅠㅍㅓㅍㅏㅇㅜㅓㅈㅔㅁㅗㄱㅇㅣㄷㅏ.Thisissuperpowertitle.ㅎㅏhaㅎㅗghㅎㅔㅎㅔhehe');
    });

    it('새 doc을 만든 후 수정했을 때 search 가 수정되어야 함 (UpdateOne에 의해 수정됨.)', async function () {
      await model.Film.create(filmInput);
      await model.Film.updateOne({ id: 1 }, { title: '헬로맨~', title_en: 'helloman~' });

      const updated = await model.Film.findOne({ id: 1 }).lean().exec();
      // console.log(updated);
      expect(updated.search).to.equal('ㅎㅔㄹㄹㅗㅁㅐㄴ~helloman~ㅎㅏhaㅎㅗghㅎㅔㅎㅔhehe');
    });
  });
});
