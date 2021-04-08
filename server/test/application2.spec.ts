const { expect } = require('chai');
const random = require('random');
// const { upload, createFileFromMockFile } = require('./tool').default;
const { fake } = require('sinon');
const {
  filmQuery,
  filmsQuery,
  createFilmMutation,
  updateFilmMutation,
  removeFilmMutation,
  filmsFeaturedQuery,
} = require('./graphql-request');
const {
  createTestServer,
  graphqlSuper,
  doLogin,
  doLogout,
  makeSimpleQuery,
  randomDate,
} = require('./tool').default;

describe('application', function() {
  it('simple test', function() {
    
  });
})