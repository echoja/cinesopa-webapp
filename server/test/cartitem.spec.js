const { expect } = require('chai');
// const {} = require('./graphql-request');
const {
  initTestServer,
  graphqlSuper,
  doLogout,
  doAdminLogin,
  doGuestLogin,
  adminEamil,
  guestEmail,
} = require('./tool');
const { graphql } = require('graphql');
const { model, db } = require('../loader');

describe('cartitem', function () {
  // eslint-disable-next-line mocha/no-setup-in-describe
  const { agent } = initTestServer({ before, beforeEach, after, afterEach });
  describe('db', function () {
    describe('getCartitems', function () {
      it('잘 동작해야 함', async function () {
        await model.Cartitem.create({
          user: guestEmail,
        });
        const cartitems = await db.getCartitems(guestEmail);
        // console.log(cartitems);
        expect(cartitems.length).to.equal(1);
        
      });
    });
  });
});
