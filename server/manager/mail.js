const nodemailer = require("nodemailer");

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
  to: "eszqsc112@naver.com",
  subject: "안녕하신가!",
  text: "Hello world?",
  html: "<b>Hello world?</b>",
};

class MailManager {
  constructor(gate, transporter) {
    /** @type {import("nodemailer").Transporter} */
    this.transporter = transporter;

    /** @type {MailGate} */
    this.gate = gate;
  }

  /**
   * 사전 설정된 세팅을 바탕으로 메일을 보내는 함수
   * @param {string} subject 제목
   * @param {string} html 내용
   */
  async sendMail(subject, html) {
    return new Promise((resolve, reject) => {
      const from = `"${this.gate.senderName}" <${this.gate.senderEmail}>`;
      const to = `"${this.gate.recipientName}" <${this.gate.recipientEmail}>`;
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
   * @param {MailGate} gate
   * @param {import("nodemailer").Transporter} transporter
   * @returns {MailManager}
   */
  make(gate, transporter) {
    return new MailManager(gate, transporter);
  },
};
