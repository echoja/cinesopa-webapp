const { getDateFromObj } = require('@/util');
const {expect} = require('chai');

// describe('makeEnum test', function () {
//   const ABC = makeEnum(['a', 'b', 'c']);
//   it('키', function() {
//     expect(ABC).to.have.property('a');
//     expect(ABC).to.have.property('b');
//     expect(ABC).to.have.property('c');
//     expect(ABC).to.have.property('raw_str_list');
//   });

//   it('같음 테스트', function () {
//     const a = ABC.a;
//     expect(ABC.a).to.equal(a, 'ABC.a 와 a는 같아야 합니다.');
//   });

//   it('다름 테스트', function () {
//     const b = ABC.b;
//     expect(ABC.a).not.to.equal(b, 'ABC.a 와 b 는 달라야 합니다.');
//   });
// });

describe('util', function () {
  describe('getDateFromObj', function () {
    it('제대로 동작해야 함', function () {
      const date = getDateFromObj({
        year: 1923,
        month: 2,
        day: 23,
        hour: 13,
        minute: 1,
        second: 22,
      });
      expect(date.getFullYear()).to.equal(1923);
      expect(date.getMonth()).to.equal(2);
      expect(date.getDate()).to.equal(23);
      expect(date.getHours()).to.equal(13);
      expect(date.getMinutes()).to.equal(1);
      expect(date.getSeconds()).to.equal(22);
    });
  });
});
