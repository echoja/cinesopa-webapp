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
import path from 'path';
import fs from 'fs';

import {makeApplicationExcel, unlinkApplicationExcel} from '@/manager/excel';

describe('excel', function () {
  const {agent} = createTestServer(this); 
  describe('manager', function () {
    describe('makeApplicationExcel', function () { 
      it('제대로 동작해야 함', async function () {
        await model.Application.create({applicant_name: 'ho'}); 
        await model.Application.create({applicant_name: 'hi'}); 
        const found = await model.Application.find().lean().exec();
        await makeApplicationExcel(found, path.resolve(__dirname, 'temp'));
        addContext(this, { title: 'found', value: found});
        const exists = fs.existsSync(path.resolve(__dirname, 'temp', 'application.xlsx'));
        expect(exists).to.be.true;
      });
    });
    describe('unlinkApplicationExcel', function () { 
      it('제대로 동작해야 함', async function () { 
        fs.writeFileSync(path.resolve(__dirname, 'temp', 'application.xlsx'), '123');
        await unlinkApplicationExcel(path.resolve(__dirname, 'temp'));
        const exists = fs.existsSync(path.resolve(__dirname, 'temp', 'application.xlsx'));
        expect(exists).to.be.false;
      });
    });
  });
});