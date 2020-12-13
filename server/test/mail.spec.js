const nodemailer = require('nodemailer');
const { expect } = require('chai');
const { gmailEmail, gmailPassword } = require('../config/common');
const { makeTemplateMap } = require('../mail-template/template-map');

const mail = require('../manager/mail');

describe('mail', function () {
  describe('makeWeakTransporter', function () {
    it('잘 동작해야 함', function () {
      const test = mail.makeWeakTransporter(
        (args) => {
          return args;
        },
        'naver',
        'myname',
        'mypassword',
      );
      expect(test.service).to.equal('naver');
      expect(test.auth.user).to.equal('myname');
      expect(test.auth.pass).to.equal('mypassword');
      expect(test.tls.rejectUnauthorized).to.equal(false);
    });
    it('nodemailer Transporter 가 잘 만들어져야 함 (올바른 계정)', function () {
      const test = mail.makeWeakTransporter(
        nodemailer.createTransport,
        'Google',
        gmailEmail,
        gmailPassword,
      );
      expect(test.sendMail).to.be.a('function');
    });
    it('옳지 않은 계정이라도 일단 Transporter 가 만들어져야 함', function () {
      const test = mail.makeWeakTransporter(
        nodemailer.createTransport,
        'Naver',
        'abc',
        'dev',
      );
      expect(test.sendMail).to.be.a('function');
    });
  });
  describe('make', function () {
    it('옳지 않은 계정이라도 일단 mailManager 가 만들어져야 함', function () {
      const test = mail.makeWeakTransporter(
        nodemailer.createTransport,
        'Naver',
        'abc',
        'dev',
      );
      const manager = mail.make({}, test);
      expect(manager).to.be.a('object');
    });
  });
  // makeWeakTransporter 와 make 를 우선 만듭니다.
  // 이 테스트는 makeWeakTransporter, make, template-map 의 makeTemplateMap 이 모두
  // 올바르게 동작해야 합니다.
  describe('manager', function () {
    /** @type {MailManager} */
    let mailManager;

    before('mail manager 초기화', async function () {
      const transporter = mail.makeWeakTransporter(
        nodemailer.createTransport,
        'Google',
        gmailEmail,
        gmailPassword,
      );
      const templateMap = await makeTemplateMap(
        {
          test: 'test/template/test.pug',
        },
        async () => ({
          name: 'defaultName',
          a: 'defaultA',
        }),
      );
      // console.log(templateMap);
      mailManager = mail.make(transporter, { templateMap });
    });
    describe('sendMail', function () {
      it('실제 구글 계정으로 보내져야 함', function (done) {
        this.skip(); // 스킵하고 싶지 않다면 코멘트를 하세용.
        this.timeout(10000);
        const test = mail.makeWeakTransporter(
          nodemailer.createTransport,
          'Google',
          gmailEmail,
          gmailPassword,
        );
        const manager = mail.make(
          {
            recipientEmail: 'eszqsc112@naver.com',
            recipientName: '김태훈 고객님',
          },
          test,
        );
        manager
          .sendMail('테스트 제목', '<p><b>내용</b></p>')
          .then((value) => {
            done();
          })
          .catch((error) => {
            console.error(error);
            done('에러가 나지 않아야 함');
          });
      });

      it('옳지 않은 계정으로 메일이 보내지지 않아야함. ', function (done) {
        const test = mail.makeWeakTransporter(
          nodemailer.createTransport,
          'Naver',
          'abc',
          'dev',
        );
        const manager = mail.make({}, test);
        manager
          .sendMail('제목', '내용')
          .then((value) => {
            // console.log(value);
            done('에러가 나야 함');
          })
          .catch((error) => {
            done();
          });
      });
    });

    describe('sendMailTemplate', function () {
      it('제대로 동작해야 함', async function () {
        this.skip() // 메일을 실제로 보내고 싶다면 주석으로 하세요.
        this.timeout(10000);
        const result = await mailManager.sendMailTemplate(
          { recipientEmail: 'eszqsc112@naver.com', recipientName: '고객님' },
          '메일 제목~',
          'test',
          { b: 'ho' },
        );
        expect(result.success).to.be.true;
      });
    });
  });
});
