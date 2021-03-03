const nodemailer = require('nodemailer');

const path = require('path');
const { google, Auth, gmail_v1 } = require('googleapis');
const MailComposer = require('nodemailer/lib/mail-composer');
const Mail = require('nodemailer/lib/mailer');

const SCOPES = [
  'https://mail.google.com/',
  'https://www.googleapis.com/auth/gmail.labels',
  'https://www.googleapis.com/auth/gmail.send',
  'https://www.googleapis.com/auth/gmail.readonly',
  'https://www.googleapis.com/auth/gmail.compose',
  'https://www.googleapis.com/auth/gmail.insert',
  'https://www.googleapis.com/auth/gmail.modify',
  'https://www.googleapis.com/auth/gmail.metadata',
  'https://www.googleapis.com/auth/gmail.settings.basic',
  'https://www.googleapis.com/auth/gmail.settings.sharing',
];

const ACCOUNT = 'ssong@cinesopa.kr';

// const getMessageList = async () => {
//   try {
//     const auth = new google.auth.GoogleAuth({
//       keyFile: path.resolve(__dirname, 'mailer-credentials.json'),
//       scopes: SCOPES,
//       clientOptions: {
//         subject: ACCOUNT,
//       },
//     });

//     const gmail = google.gmail({
//       auth,
//       version: 'v1',
//     });

//     const msg = new MailComposer({
//       from: {
//         name: '영화배급협동조합 씨네소파',
//         address: 'support@cinesopa.kr',
//       },
//       to: {
//         name: '김태훈',
//         address: 'eszqsc112@naver.com',
//       },
//       subject: '[테스트 메시지42] 제목입니다.',
//       html: '<b>이것은 굵게입2니4다.</b><u></u>',
//     });
//     const buf = await msg.compile().build();
//     const encoded = buf.toString('base64');

//     console.log('# CHECK Encoded');
//     console.log(encoded);

//     const res = await gmail.users.settings.sendAs.list({
//       userId: ACCOUNT,
//     });

//     console.log(res.data);
//   } catch (e) {
//     console.log('# getMessgaeList Failed');
//     console.error(e);
//   }
// };

/**
 * 메일을 주고 받는 연결점
 * @typedef {Object} MailGate
 * @property {string} senderName
 * @property {string} senderEmail
 * @property {string} recipientName
 * @property {string} recipientEmail
 */

/**
 * @typedef {MailManager} MailManager
 */

/**
 * 메일 매니저에 집어넣을 config 입니다.
 * @typedef {Object} MailManagerConfig
 * @property {TemplateMap} templateMap
 */

class MailManager {
  /**
   *
   * @param {import("nodemailer").Transporter} transporter
   * @param {MailManagerConfig} config
   */
  constructor(transporter, config) {
    const { templateMapPromise = new Map() } = config;

    /** @type {import("nodemailer").Transporter} */
    this.transporter = transporter;

    /** @type {Promise<TemplateMap>} */
    this.templateMapPromise = templateMapPromise;

    /** @type {TemplateMap} */
    this.templateMap = null;

    /** @type {Auth.GoogleAuth} */
    this.auth = new google.auth.GoogleAuth({
      keyFile: path.resolve(__dirname, '../config/mailer-credentials.json'),
      scopes: SCOPES,
      clientOptions: {
        subject: ACCOUNT,
      },
    });

    /** @type {gmail_v1.Gmail} */
    this.gmail = null;
  }

  /**
   * 사전 설정된 세팅을 바탕으로 메일을 보내는 함수
   * @param {MailGate} gate
   * @param {string} subject 제목
   * @param {string} html 내용
   */
  async sendMail(gate, subject, html) {
    this.gate = gate;
    return new Promise((resolve, reject) => {
      const from = `"${this.gate.senderName ?? '영화향유플랫폼 소파섬'}" <${
        this.gate.senderEmail ?? 'coop.cinesopa@gmail.com'
      }>`;
      const to = `"${this.gate.recipientName ?? ''} " <${
        this.gate.recipientEmail ?? ''
      }>`;
      const mailOptions = { from, to, subject, html };
      this.transporter.verify((error) => {
        if (error) {
          console.error(error);
          return reject(error);
        }

        this.transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.error(error);
            return reject(error);
          }
          console.log(info);
          return resolve();
        });
      });
    });
  }

  /**
   * @typedef {Object} sendTemplatedMailResult
   * @property {boolean} success 성공했는지 여부.
   * @property {string} code 실패/성공 사유
   */

  /**
   * 템플릿 이름 기반으로 보냅니다.
   * @param {MailGate} gate
   * @param {subject} subject 제목
   * @param {string} templateName 템플릿 이름
   * @param {Object} args 템플릿에 렌더링 시 들어갈 것들.
   * @return {Promise<sendTemplatedMailResult>}
   */
  async sendTemplatedMail(gate, subject, templateName, args) {
    await this.makeTemplateMapResolve();
    const renderer = this.templateMap.get(templateName);
    // console.log('# mail.js sendTemplatedMail');
    // console.dir(this.templateMap);
    if (!renderer) {
      console.error(`${templateName} 템플릿이 존재하지 않습니다.`);
      return { success: false, code: 'no-such-template' };
    }
    const html = await renderer(args);

    // 실제로 메일을 보내는 부분.
    try {
      await this.sendMail(gate, subject, html);
    } catch (error) {
      console.error(error);
      return { success: false, code: error.name };
    }
    return { success: true };
  }

  /**
   * templateMap은 처음에 파일로부터 가져와야 하므로
   * 비동기로 작업되기 때문에 Promise 형태이다.
   * 이제 templateMap 을 실제로 이용해야 하기 때문에
   * Promise.resolve 함수를 이용한다.
   */
  async makeTemplateMapResolve() {
    if (!this.templateMap) {
      this.templateMap = await Promise.resolve(this.templateMapPromise);
    }
  }

  /**
   * 사전 설정된 세팅을 바탕으로 Gmail을 보내는 함수
   * @param {MailGate} gate
   * @param {string} subject 제목
   * @param {string} html 내용
   */
  async sendGmail(gate, subject, html)
  {
    // gmail
    this.gmail = google.gmail({
      auth: this.auth,
      version: 'v1',
    });

    // 메일 msg 생성
    const msg = new MailComposer({
      from: {
        name: '영화배급협동조합 씨네소파',
        address: 'support@cinesopa.kr',
      },
      to: {
        name: gate.recipientName,
        address: gate.recipientEmail,
      },
      subject,
      html,
    });
    const buf = await msg.compile().build();
    const encoded = buf.toString('base64');

    const sendRes = await this.gmail.users.messages.send({
      userId: ACCOUNT,
      requestBody: {
        raw: encoded,
      },
    });

    console.log('# mailManager sendGmail res data');
    console.dir(sendRes.data);
  }

  async sendTemplatedGmail(gate, subject, templateName, args) {
    await this.makeTemplateMapResolve();
    const renderer = this.templateMap.get(templateName);
    if (!renderer) {
      console.error(`${templateName} 템플릿이 존재하지 않습니다.`);
      return { success: false, code: 'no-such-template' };
    }
    const html = await renderer(args);
    try {
      // auth. auth 설정과 gmail 설정은 토큰 등이 만료될 때마다 하면 되지만
      // 언제 만료가 되는지를 상당히 맞추기 까다로울 것 같음. 그러므로 보낼 때마다 보내기.
      await this.sendGmail(gate, subject, html);
    } catch (error) {
      console.error('sendTemplatedGmail failed');
      console.error(error);
      return { success: false, code: error.name };
    }
    return { success: true };
  }
}

module.exports = {
  /**
   * transporter 를 만드는 함수
   *
   * @callback Creater
   * @param {*} args
   * @returns {import("nodemailer").Transporter}
   */

  /**
   *
   * @param {Creater} creator transporter 를 만드는 함수
   * @param {string} service 서비스 이름
   * @param {string} user 계정 이름
   * @param {string} pass 계정 비밀번호
   * @returns {import("nodemailer").Transporter}
   */
  makeWeakTransporter(creator, service, user, pass) {
    return creator({
      service,
      auth: { user, pass },
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      tls: {
        rejectUnauthorized: false,
      },
    });
  },

  /**
   * mailManager 만드는 함수
   * @param {import("nodemailer").Transporter} transporter
   * @param {MailManagerConfig} config config 파일
   * @returns {MailManager}
   */
  make(transporter, config = {}) {
    return new MailManager(transporter, config);
  },
};
