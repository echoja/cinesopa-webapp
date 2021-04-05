export async function mochaGlobalSetup() {
  // this.server = await startSomeServer({port: process.env.TEST_PORT});
  console.log(`server running on port ${this.server.port}`);
}

// can be async or not
export async function mochaGlobalTeardown() {
  // await this.server.stop();
  console.log('server stopped!');
}
