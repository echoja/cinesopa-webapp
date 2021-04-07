import { MongoMemoryServer } from "mongodb-memory-server";
import {Func, AsyncFunc} from "mocha";

export async function mochaGlobalSetup() {
  // this.mongod = new MongoMemoryServer({ binary: { version: 'latest' } });
  // this.test = 'abcd';
  // console.log(this);
  // this.server = await startSomeServer({port: process.env.TEST_PORT});
  // console.log(`server running on port`);
}

// can be async or not
export async function mochaGlobalTeardown() {
  // await this.server.stop();
  // console.log('server stopped!');
}

interface Hooks {
  beforeAll: (Func | AsyncFunc)[],
  beforeEach: (Func | AsyncFunc)[],
  afterEach: (Func | AsyncFunc)[],
  afterAll: (Func | AsyncFunc)[],
}

export const mochaHooks: Hooks = {
  beforeAll: [
    function (done) {
      // console.log('beforeAllSync');
      // console.dir(Object.keys(this));
      // console.log(this.test);
      done();
      
    },
    async function () {
      // console.log('beforeAllasync');
    },
  ],
  beforeEach: [
    function (done) {
      // console.log('beforeEachSync');
      done();
    },
    async function () {
      // console.log('beforeEachAsync');
    },
  ],
  afterEach: [
    function (done) {
      // console.log('afterEachSync');
      done();
    },
    async function () {
      // console.log('afterEachAsync');
    },
  ],
  afterAll: [
    function (done) {
      // console.log('afterAllSync');
      done();
    },
    async function () {
      // async or Promise-returning functions allowed
      // console.log('afterAllAsync');
    },
  ],
};
