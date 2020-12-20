const nodemailer = require('nodemailer');

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

// const googleTransporter = nodemailer.createTransport({
//   service: "Gmail",
//   auth: {
//     user: gmailEmail,
//     pass: gmailPassword,
//   },
//   tls: {
//     rejectUnauthorized: false,
//   },
// });

let mailOptions = {
  from: '"영화배급협동조합 씨네소파" <coop.cinesopa@gmail.com>',
  to: 'eszqsc112@naver.com',
  subject: '안녕하신가!',
  text: 'Hello world?',
  html: '<b>Hello world?</b>',
};

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
    const { templateMap = new Map() } = config;

    /** @type {import("nodemailer").Transporter} */
    this.transporter = transporter;

    // /** @type {MailGate} */
    // this.gate = gate;

    /** @type {TemplateMap} */
    this.templateMap = templateMap;
    // console.log('# mail.js constructor templateMap');
    // console.log(templateMap);
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
   * @typedef {Object} SendMailTemplateResult
   * @property {boolean} success 성공했는지 여부.
   * @property {string} code 실패/성공 사유
   */

  /**
   * 템플릿 이름 기반으로 보냅니다.
   * @param {MailGate} gate
   * @param {subject} subject 제목
   * @param {string} templateName 템플릿 이름
   * @param {Object} args 템플릿에 렌더링 시 들어갈 것들.
   * @return {Promise<SendMailTemplateResult>}
   */
  async sendMailTemplate(gate, subject, templateName, args) {
    // render 함수를 불러온다.
    await this.makeTemplateMapResolve();
    const renderer = this.templateMap.get(templateName);
    console.log('# mail.js sendMailTemplate');
    console.dir(this.templateMap);
    if (!renderer) {
      console.error(`${templateName} 템플릿이 존재하지 않습니다.`);
      return { success: false, code: 'no-such-template' };
    }
    const html = await renderer(args);
    try {
      await this.sendMail(gate, subject, html);
    } catch (error) {
      console.error(error);
      return { success: false, code: error.name };
    }
    return { success: true };
  }

  async makeTemplateMapResolve() {
    this.templateMap = await Promise.resolve(this.templateMap);
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
