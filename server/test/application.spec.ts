import { expect } from 'chai';
import random from 'random';
// const { upload, createFileFromMockFile } = require('./tool').default;
import { fake } from 'sinon';
import { db, model } from '@/loader';
import {
  filmQuery,
  filmsQuery,
  createFilmMutation,
  updateFilmMutation,
  removeFilmMutation,
  filmsFeaturedQuery,
} from './graphql-request';
import {
  createTestServer,
  graphqlSuper,
  doLogin,
  doLogout,
  makeSimpleQuery,
  randomDate,
} from './tool';

describe('application', function () {
  const { agent, fileService, mongod, uploadDest, webapp } = createTestServer(
    this,
  );
  describe('db', function () { 
    describe('createApplication', function () {
      
      it('제대로 동작해야 함', async function () { 
        await db.createApplication({
          applicant_name: 'hi',
        });
        const found = await model.Application.find().lean().exec();
        expect(found.length).to.equal(1);
        
      });
    });
    describe('removeApplication', function () { 
      // todo
    });
    describe('updateApplication', function () { 
      it('제대로 동작하는지 확인하기', async function () { 
        // todo
      });
    });
  });

});
