const { expect } = require("chai");

describe("symbol", function () {
  it("description 이 있어야 합니다.", function () {
    const a = Symbol("abcd");
    expect(a.description).to.equal("abcd");
    a.toString();
  });
  it("values 들을 얻었을 때, includes 에 있어야 합니다.", function () {
    const a = Symbol("a");
    const b = Symbol("b");
    const c = Symbol("c");
    const obj = {
      a: a,
      b: b,
      c: c,
    };
    expect(Object.values(obj).includes(a)).to.be.true;
    expect(Object.values(obj).includes(Symbol("a"))).to.be.false;
  });
});
