const pug = require('pug');
const fs = require('fs');
const util = require('util');
// const fs = require('fs');

const { expect } = require('chai');
const inlineCss = require('inline-css');
const { makeTemplateMap } = require('@/mail-template/template-map');
const readFile = util.promisify(fs.readFile);
const { model, templateArgsRefiner } = require('@/loader');
const { createTestServer, guestEmail } = require('./tool');
const path = require('path');


// describe('email-template', function () {
//   describe('compile, render', function () {
//     it('제대로 동작해야 함', async function () {
const createHTMLByTemplate = async (args, filename) => {
  const template = await readFile(filename);
  const render = pug.compile(template.toString(), { filename });
  const html = render(args);
  const inlined = await inlineCss(html, { url: '/' });
  const splitted = filename.split('/');
  // console.log(inlined);
  console.log(`test/output/${splitted[splitted.length - 1]}`);
  fs.writeFileSync(`test/output/${splitted[splitted.length - 1]}.html`, inlined);
  fs.writeFileSync('test/123.html', '123');
};

describe('email-template', function () {

  // eslint-disable-next-line mocha/no-setup-in-describe
  const { agent } = createTestServer(this);

  describe('라이브러리 (pug 등)', function () {
    it('기본 동작 테스트 (test/output/email-template.test.html 파일 출력내용 참조)', async function () {
      // 일단 템플릿 파일로 읽음.
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
  describe("templates", function () {

    describe('payment-success', function () {
      it('제대로 동작해야 함', async function () {
        const filename = path.resolve(__dirname, '../src/mail-template/payment-success.pug');
        const template = await readFile(filename);
        const render = pug.compile(template.toString(), {
          filename,
        });
        // 랜더러를 실행시킴. 실행시키면서 변수 넣기.
        const items = [
          {
            product: {
              name: '양아치상품',
              featured_image_url: '/12345678',
            },
            options: [
              {
                count: 3,
                price: 1000,
                content: 'ho',
              },
              {
                count: 2,
                price: 600,
                content: 'hi',
              },
            ],
          },
          {
            product: {
              name: '그러한상품',
              featured_image_url: '/abcdefg',
            },
            options: [
              {
                count: 3,
                price: 100,
                content: 'zo',
              },
              {
                count: 1,
                price: 200,
                content: 'zi',
              },
            ],
          },
        ];
        const string = render({
          detailUrl: 'http://naver.com',
          order: {
            items,
            dest: {
              address: '주소1',
              phone: '010-****-1234',
              name: '김*훈',
            },
            fullAddress: '',
            itemFormatted: items,
          },
          year: new Date().getFullYear(),
        });
        expect(string).to.be.a('string');
        const inlined = await inlineCss(string, {
          url: '/',
        });
        // html 파일로 작성함.
        fs.writeFileSync('test/output/email-template.test.html', inlined);
      });
    });
    describe("change-password", function () {
      it("제대로 동작해야 함", async function () {
        
        const args = {
          tokenUrl: 'https://naver.com/'
        }
        await createHTMLByTemplate(args, path.resolve(__dirname, '../src/mail-template/change-password.pug'));
      });
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
  describe("refiner and template-map", function () {
    describe("payment-success", function () {
      it("제대로 잘 되어야 함.", async function () {
        const order = await model.Order.create({
          user: guestEmail,
          status: 'payment_confirming',
          transport_fee: 1324,
          method: 'card',
          dest: {
            name: '홍길동',
            address: '주소소',
            address_detail: '자세한 주소123123',
            phone: '001-1234123',
            request: '리퀘스트',
          },
          items: [
            {
              id: 1,
              product: {
                name: '비행기맨',
                featured_image_url: 'https://homepages.cae.wisc.edu/~ece533/images/airplane.png',
                featured_image_alt: '뱅뱅기',
              },
              options: [
                {
                  id: 'hi',
                  content: '옵션이름~',
                  count: 5,
                  price: 200,
                },
              ],
            },
            {
              id: 2,
              product: {
                name: '배맨',
                featured_image_url: 'https://homepages.cae.wisc.edu/~ece533/images/boat.png',
                featured_image_alt: '통통배',
              },
              options: [
                {
                  id: 'ho',
                  count: 8,
                  content: '옵션이름~2',
                  price: 250,
                },
              ],
            },
          ],
        });
        const args = templateArgsRefiner.createPaymentSuccessArgs(order.toObject());
        // console.dir(args, { depth: 5 });
        await createHTMLByTemplate(args, path.resolve(__dirname, '../src/mail-template/payment-success.pug'));
      });
    });
  });
});
