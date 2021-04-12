/**
 * @file
 * db manager 테스트입니다.
 * 모든 스키마는 자동으로 id가 1부터 채워진다고 가정합니다.
 */

// require('@/typedef');
import { expect } from 'chai';
import { isTypedArray } from 'lodash';
import { it } from 'mocha';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { DBManager, ModelWrapper } from '@/typedef';
// const { db, model } = require('@/loader');
import { make as modelMake } from '@/db/model';

// import  from './tool';

describe('loader', function () {
  // /** @type {MongoMemoryServer} */
  // let mongod;
  // /** @type {DBManager} */
  // let manager;
  // /** @type {ModelWrapper} */
  // let model;

  // before('DB 초기화', async function () {
  //   // mongoose.deleteModel(/.+/);
  //   // this.timeout(10000);
  //   model = modelMaker.make(mongoose);
  //   // console.log(model);
  //   manager = makeDB(model);

  //   mongod = new MongoMemoryServer({ binary: { version: '4.2.9' } });
  //   const uri = await mongod.getUri();
  //   const mongooseOpts = {
  //     useNewUrlParser: true,
  //     useUnifiedTopology: true,
  //     useCreateIndex: true,
  //     useFindAndModify: false,
  //     // debug: true,
  //   };
  //   await mongoose.connect(uri, mongooseOpts);
  // });

  // afterEach('DB 내용 제거', async function () {
  //   const { collections } = mongoose.connection;
  //   const promises = [];
  //   Object.keys(collections).forEach((key) => {
  //     const collection = collections[key];
  //     promises.push(collection.deleteMany({}));
  //   });
  //   await Promise.allSettled(promises);
  // });

  // after('DB 종료', async function () {
  //   await mongoose.connection.dropDatabase();
  //   await mongoose.connection.close();
  //   await mongod.stop();
  // });
  describe('model', function () {
    it('모델이 다 완성되어 있어야 합니다.', async function () {
      const modelWrapper = modelMake(mongoose);
      const keys = Object.keys(modelWrapper);
      keys.forEach((key) => {
        expect(modelWrapper[key].find).to.be.a(
          'function',
          `modelWrapper[${key}] should be a mongoose model.`,
        );
      });
    });
  });
});
