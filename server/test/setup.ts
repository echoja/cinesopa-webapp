export const mochaHooks = {
  beforeAll: [
    function (done) {
      console.log('beforeAllSync');
      done();
    },
    async function () {
      console.log('beforeAllasync');
    },
  ],
  beforeEach: [
    function (done) {
      console.log('beforeEachSync');
      done();
    },
    async function () {
      console.log('beforeEachAsync');
    },
  ],
  afterEach: [
    function (done) {
      console.log('afterEachSync');
      done();
    },
    async function () {
      console.log('afterEachAsync');
    },
  ],
  afterAll: [
    function (done) {
      console.log('afterAllSync');
      done();
    },
    async function () {
      // async or Promise-returning functions allowed
      console.log('afterAllAsync');
    },
  ],
};
