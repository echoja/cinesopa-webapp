import addContext from 'mochawesome/addContext';
import { expect } from 'chai';
import random from 'random';
// const { upload, createFileFromMockFile } = require('./tool').default;
import { fake } from 'sinon';
import { db, model } from '@/loader';
import { execute } from 'graphql';
import { unwrap } from '@/util';
import { IApplication } from '@/typedef';
import {
  createTestServer,
  graphqlSuper,
  doLogin,
  doLogout,
  makeSimpleQuery,
  randomDate,
  doAdminLogin,
  makeSimpleMutation,
} from './tool';
import {
  filmQuery,
  filmsQuery,
  createFilmMutation,
  updateFilmMutation,
  removeFilmMutation,
  filmsFeaturedQuery,
} from './graphql-request';

describe('token', function () {
  const { agent, fileService, mongod, uploadDest, webapp } = createTestServer(
    this,
  );
  describe('db', function () {
    describe('createToken', function () {
      it('제대로 동작해야 함', async function () {
        await db.createToken({
          email: 'naver.com',
          purpose: 'email_verification',
          token: 'ho',
        });
        const res = await model.Token.find().lean().exec();
        addContext(this, { title: 'res', value: res});
        expect(res.length).to.equal(1);
      });
    });
    describe('getToken', function () {
      it('제대로 동작해야 함', async function () {
        await model.Token.create({token: 'abc', purpose: 'change_password'});
        const got = await db.getToken('abc', 'change_password');
        addContext(this, { title: 'got', value: got});
        expect(got.doc.token).to.equal('abc');
      });
    });
    describe('removeToken', function () {
      it('제대로 동작해야 함', async function () {
        await model.Token.create({ token: 'abc'});
        await db.removeToken('abc');
        const found = await model.Token.find().lean().exec();
        addContext(this, { title: 'found', value: found});
        expect(found.length).to.equal(0);
      });
    });
    describe('clearToken', function () {
      it('제대로 동작해야 함', async function () {
        await model.Token.create({ email: 'email', token: 'abc'});
        await model.Token.create({ email: 'email', token: 'abcd'});
        await model.Token.create({ email: 'email', token: 'abce'});
        await model.Token.create({ email: 'email', token: 'abcf'});
        await db.clearToken({email: 'email'});
        const found = await model.Token.find().lean().exec();
        addContext(this, { title: 'found', value: found});
        expect(found.length).to.equal(0);
      });
    });
  });
});
