const { makeEnum } = require("../util");
const util = require("util");
const expect = require('chai').expect

describe("makeEnum test", function () {
  const ABC = makeEnum(["a", "b", "c"]);
  it("키", () => {
    expect(ABC).to.have.property("a");
    expect(ABC).to.have.property("b");
    expect(ABC).to.have.property("c");
    expect(ABC).to.have.property("raw_str_list");
  });

  it("같음 테스트", function () {
    const a = ABC.a;
    expect(ABC.a).to.equal(a, "ABC.a 와 a는 같아야 합니다.");
  });

  it("다름 테스트", function () {
    const b = ABC.b;
    expect(ABC.a).not.to.equal(b, "ABC.a 와 b 는 달라야 합니다.");
  });
  
});
