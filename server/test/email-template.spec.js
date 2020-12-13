const pug = require('pug');
const fs = require('fs');
const util = require('util');
// const fs = require('fs');

const { expect } = require('chai');
const inlineCss = require('inline-css');
const { makeTemplateMap } = require('../mail-template/template-map');

// describe('email-template', function () {
//   describe('compile, render', function () {
//     it('제대로 동작해야 함', async function () {
describe('email-template', function () {
  describe('라이브러리 (pug 등)', function () {
    it('기본 동작 테스트 (test/output/email-template.test.html 파일 출력내용 참조)', async function () {
      // 일단 템플릿 파일로 읽음.
      const readFile = util.promisify(fs.readFile);
      const filename = 'test/template/email-implementation.pug';
      const template = await readFile(filename);

      // 렌더러를 만듬
      const render = pug.compile(template.toString(), {
        filename,
      });

      // 랜더러를 실행시킴. 실행시키면서 변수 넣기.
      const string = render({
        sopaseomLogoSrc: 'https://gdurl.com/LRl7e',
        sopaseomLogoAlt: '소파섬 로고',
        cinesopaLogoSrc: 'https://gdurl.com/7g5Q',
        cinesopaLogoAlt: '씨네소파 로고',
        verifyUrl: 'http://naver.com',
        privacyUrl: 'http://daum.net',
        policyUrl: 'http://slack.com',
        year: new Date().getFullYear(),
        name: '이름',
      });
      expect(string).to.be.a('string');
      const inlined = await inlineCss(string, {
        url: '/',
      });
      // html 파일로 작성함.
      fs.writeFileSync('test/output/email-template.test.html', inlined);
    });
  });
  describe('template-map.js', function () {
    describe('makeTemplateMap', function () {
      it('기본 동작이 제대로 되어야 함.', async function () {
        const getter = async () => ({
          name: 'hi',
        });
        const fileinfo = {
          tname: 'test/template/test.pug',
        };

        const rendererMap = await makeTemplateMap(fileinfo, getter);
        // console.dir(rendererMap);
        const keys = [...rendererMap.keys()];
        expect(keys).to.include(
          'tname',
          'templateMap에 tname 키가 존재해야 합니다.',
        ); //
        const html = await rendererMap.get('tname')();
        // console.log(html);
        expect(html).to.equal(
          '<div>name: hi</div><div>a: </div><div>b: </div><div>c: </div>',
          '결과가 일치해야 합니다.',
        );
      });
      it('default 값이 덮어써져야 함.', async function () {
        const getter = async () => ({
          name: 'hi',
          a: 'aDefault',
          b: 'bDefault',
          c: 'cDefault',
        });
        const fileinfo = {
          tname: 'test/template/test.pug',
        };

        const rendererMap = await makeTemplateMap(fileinfo, getter);
        const html = await rendererMap.get('tname')({
          b: 'b특별~',
          c: 'c도해~',
        });
        // console.log(html);
        expect(html).to.equal(
          '<div>name: hi</div><div>a: aDefault</div><div>b: b특별~</div><div>c: c도해~</div>',
          '결과가 일치해야 합니다.',
        );
      });
      it('style 이 inline 되어야 함.', async function () {
        const getter = async () => ({});
        const fileinfo = {
          tname: 'test/template/test-style.pug',
        };

        const rendererMap = await makeTemplateMap(fileinfo, getter);
        const html = await rendererMap.get('tname')();
        // console.log(html);
        expect(html).to.equal(
          '<div style="font-size: 14px;">hello world!</div>',
          '결과가 일치해야 합니다.',
        );
      });
    });
  });
});
