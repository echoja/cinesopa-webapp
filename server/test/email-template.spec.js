const pug = require('pug');
const fs = require('fs');
const { expect } = require('chai');
const inlineCss = require('inline-css');

// describe('email-template', function () {
//   describe('compile, render', function () {
//     it('제대로 동작해야 함', async function () {
(async () => {
  const template = fs.readFileSync('test/email-template.test.pug');

  const render = pug.compile(template.toString());
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
  fs.writeFileSync('test/email-template.test.html', inlined);
})();
// await open('test/email-template.test.html', { wait: true });
//     });
//   });
// });
