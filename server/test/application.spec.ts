const { expect } = require('chai');
const random = require('random');
// const { upload, createFileFromMockFile } = require('./tool');
const { fake } = require('sinon');
const { model, db } = require('@/loader');
const {
  filmQuery,
  filmsQuery,
  createFilmMutation,
  updateFilmMutation,
  removeFilmMutation,
  filmsFeaturedQuery,
} = require('./graphql-request');
const {
  initTestServer,
  graphqlSuper,
  doLogin,
  doLogout,
  makeSimpleQuery,
  randomDate,
} = require('./tool');

describe('application', function() {
  it('simple test', function() {

  });
})