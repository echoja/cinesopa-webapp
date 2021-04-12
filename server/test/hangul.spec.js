const Hangul = require('hangul-js');
const { expect } = require('chai');
const { getFilmSearchStr, getValueOfField } = require('@/db/schema/tool');

describe('hangul', function () {
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
      // expect(result).to.equal(
      //   'ㅍㅏㅇㅣㅇㅓ#Fire#ㅇㅣㅅㅏㅇㅎㅗㅏ#LEESANGHWA#ㄱㅐ#asldfjk#ㅎㅗㅈㅜ#australia',
      // );
      expect(result).to.equal(
        'ㅍㅏㅇㅣㅇㅓ#Fire#ㅇㅣㅅㅏㅇㅎㅗㅏ#ㄱㅐ#ㅎㅗㅈㅜ#LEESANGHWA#asldfjk#australia',
      );
    });
  });
  describe('getValueOfField', function () {
    it('제대로 동작해야 함', async function () {
      const obj = { a: 1, b: { c: 512, d: 1024 }, e: 'abc' };
      expect(getValueOfField(obj, 'a')).to.equal(1);
      expect(getValueOfField(obj, 'b')).to.deep.equal({ c: 512, d: 1024 });
      expect(getValueOfField(obj, 'b.c')).to.equal(512);
      expect(getValueOfField(obj, 'b.d')).to.equal(1024);
      expect(getValueOfField(obj, 'e')).to.equal('abc');
      expect(
        getValueOfField(
          {
            a: [
              { b: '1', c: '2' },
              { b: '3', c: '4' },
              { b: '5', c: '6' },
            ],
          },
          'a.c',
        ),
      ).to.deep.equal(['2', '4', '6']);
    });
  });
});
