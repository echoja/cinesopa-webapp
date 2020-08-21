const path = require('path');
const {
  fileLoader,
  mergeResolvers,
  mergeTypes,
} = require('merge-graphql-schemas');

const allTypes = fileLoader(
  path.join(path.resolve(), '../server/graphql/api/**/*.graphql'),
);
const allResolvers = fileLoader(
  path.join(path.resolve(), '../server/graphql/api/**/*.js'),
);
describe('엉', function () {
  it('아', function () {

  });
});
