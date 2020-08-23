const Hangul = require('hangul-js');

const { expect } = require('chai');

describe('hangul disassemble', function () {
  it('잘 동작하여야 함', function () {
    const result = Hangul.disassembleToString('안녕하십니까?');
    expect(result).to.equal('ㅇㅏㄴㄴㅕㅇㅎㅏㅅㅣㅂㄴㅣㄲㅏ?');
  });
  it('잘 동작하여야 함 (공백 포함)', function () {
    const result = Hangul.disassembleToString('안녕하 십니까?');
    expect(result).to.equal('ㅇㅏㄴㄴㅕㅇㅎㅏ ㅅㅣㅂㄴㅣㄲㅏ?');
  });
  it('잘 동작하여야 함 (공백 포함한 뒤 공백 없애기)', function () {
    const result = Hangul.disassembleToString('안   녕 하 십 니까?');
    const resultNoSpace = result.replace(/ /g, '');
    expect(resultNoSpace).to.equal('ㅇㅏㄴㄴㅕㅇㅎㅏㅅㅣㅂㄴㅣㄲㅏ?');
  });
});
