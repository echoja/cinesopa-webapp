const { expect } = require('chai');
// const {} = require('./graphql-request');
const { graphql } = require('graphql');
const { model, db } = require('@/loader');
const {
  createTestServer,
  graphqlSuper,
  doLogout,
  doAdminLogin,
  doGuestLogin,
  adminEmail,
  guestEmail,
} = require('./tool');

describe('product-cartitem', function () {
  // eslint-disable-next-line mocha/no-setup-in-describe
  const { agent } = createTestServer(this);
  describe('db', function () {
    describe('updateProduct', function () {
      it('이미 존재하는 cartitem 에 대한 정보도 함께 수정되어야 함.', async function () {
        // todo
      });
    });
    describe('removeProduct', function () {
      it('이미 존재하는 cartitem 도 전부 삭제되어야 함.', async function () {
        // todo
      });
    });
  });
});