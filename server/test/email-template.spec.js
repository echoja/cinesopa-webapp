const pug = require('pug');
const fs = require('fs');
const util = require('util');
// const fs = require('fs');

const { expect } = require('chai');
const inlineCss = require('inline-css');

// describe('email-template', function () {
//   describe('compile, render', function () {
//     it('제대로 동작해야 함', async function () {
describe('pug', function () {
  it('기본 동작 테스트 (email-template.test.html 파일 출력내용 참조)', async function () {
    // 일단 템플릿 파일로 읽음.
    const readFile = util.promisify(fs.readFile);
    const template = await readFile('test/email-template.test.pug');

    // 렌더러를 만듬
    const render = pug.compile(template.toString());

    // 랜더러를 실행시킴. 실행시키면서 변수 넣기.
    const string = render({
      sopaseomLogoSrc: 'https://gdurl.com/LRl7e',
      sopaseomLogoAlt: '소파섬 로고',
      cinesopaLogoSrc: 'https://gdurl.com/7g5Q',
      cinesopaLogoAlt: '씨네소파 로고',
      verifyUrl: '#',
      privacyUrl: '#',
      policyUrl: '#',
      year: new Date().getFullYear(),
      name: '이름',
    });
    expect(string).to.be.a('string');
    const inlined = await inlineCss(string, {
      url: '/',
    });
    // html 파일로 작성함.
    fs.writeFileSync('test/email-template.test.html', inlined);
  });
});

