const nodemailer = require("nodemailer");
const { gmailEmail, gmailPassword } = require("../config");

// let transporter = nodemailer.createTransport({
//     //port: 587,
//     secure: false, // true for 465, false for other ports
//     auth: {
//         user: 'no-reply@cinesopa.kr',
//         pass: '13241324'
//     },
//     tls: { rejectUnauthorized: false },
//     debug: true,
// });

const googleTransporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: gmailEmail,
    pass: gmailPassword,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

let mailOptions = {
  from: '"영화배급협동조합 씨네소파" <coop.cinesopa@gmail.com>',
  to: "eszqsc112@naver.com",
  subject: "안녕하신가!",
  text: "Hello world?",
  html: "<b>Hello world?</b>",
};

// let mailOptions = {
//   from: '"영화배급협동조합 씨네소파" <coop.cinesopa@gmail.com>',
//   to: 'eszqsc112@naver.com',
//   subject: '안녕하신가!',
//   text: 'Hello world?',
//   html: '<b>Hello world?</b>'
// };

module.exports = {
  abc:"1324",
  async sendGoogleMail({
    from = '"영화배급협동조합 씨네소파" <coop.cinesopa@gmail.com>',
    to = "eszqsc112@naver.com",
    subject = "제목",
    html = "내용",
  }) {
    const mailOptions = { from, to, subject, html };
    googleTransporter.verify((error) => {
      if (error) {
        return console.error(error);
      }

      googleTransporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          return console.error(error);
        }
        console.log(info);
      });
    });
  },
};
