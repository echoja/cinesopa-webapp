const Hangul = require('hangul-js');

const { expect } = require('chai');
const { getFilmSearchStr } = require('../db/schema/tool');

describe('hangul', function () {
  describe('라이브러리', function () {
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

  describe('getFilmSearchStr', function () {
    it('제대로 동작하여야 함', function () {
      const result = getFilmSearchStr({
        title: '파이어',
        title_en: 'Fire',
        people: [
          {
            name: '이상화',
            name_en: 'LEESANGHWA',
          },
          {
            name: '개',
            name_en: 'asldfjk',
          },
          {
            name: '호주',
            name_en: 'australia',
          },
        ],
      });
      expect(result).to.equal(
        'ㅍㅏㅇㅣㅇㅓFireㅇㅣㅅㅏㅇㅎㅗㅏLEESANGHWAㄱㅐasldfjkㅎㅗㅈㅜaustralia',
      );
    });
  });
});
