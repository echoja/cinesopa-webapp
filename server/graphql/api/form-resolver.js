const Hangul = require('hangul-js');
const {
  ACCESS_ALL,
  ACCESS_ADMIN,
  ACCESS_AUTH,
  ACCESS_UNAUTH,
  makeResolver,
  db,
  mail,
} = require('../../loader');

const { enumFilmAvailableSubtitle } = require('../../db/schema/enum');

const requestShowingLabelMap = {
  companyName: '기관 이름',
  festivalName: '행사 이름',
  playdateStart: '상영 시작일',
  playdateEnd: '상영 종료일',
  playtimes: '상영 횟수',
  playplace: '상영 공간',
  username: '신청자 이름',
  userphone: '신청자 연락처',
  useremail: '신청자 이메일',
  films: '영화',
  addressNew: '상영본 받을 주소 (새주소)',
  addressOld: '상영본 받을 주소 (지번 주소)',
  addressDetailed: '상영본 받을 상세 주소',
  howToReceive: '상영본 수령 방법',
  visitDate: '상영본 수령 방문 예정일',
  receiveDate: '상영본 배송도착 희망일',
  expectedPopulation: '예상 관객 수',
  selfShowingFee: '상영료(자가 입력)',
  depositdate: '입금 예정일',
  isTaxSame: '정산 기관과 주최 기관이 같은가?',
  taxCompany: '정산 기관 이름',
  taxPerson: '정산 담당자 이름',
  taxPhone: '정산 담당자 연락처',
  taxOthers: '정산 비고',
  additionalPapers: '서류 요청',
  others: '기타 요청 사항',
};
const requestDistributionLabelMap = {
  user_name: '신청인 이름',
  user_email: '신청인 메일',
  user_phone: '신청인 연락처',
  user_role: '신청인 역할',
  film_title: '영화 이름(국문)',
  film_title_en: '영화 이름(영문)',
  film_director_name: '감독 이름',
  film_type: '영화 구분',
  film_runningtime: '러닝타임',
  film_prod_date: '제작일',
  film_synopsis: '시놉시스',
  film_purpose: '연출의도',
  film_festival_list: '시상식',
  film_link: '스크리너 링크',
  film_linkpw: '스크리너 링크 비밀번호',
  film_etc: '비고',
};

module.exports = {
  Query: {},
  Mutation: {
    // todo 언젠가 고쳐야 함. 지금은 간단하게 임시로 메일을 보내는 정도임.
    requestShowing: makeResolver(async (obj, args, context, info) => {
      const { input } = args;
      console.log('# form-resolver requestShowing');
      console.log(input);
      const trs = Object.entries(input).map(([inputKey, inputValue]) => {
        return `<tr><td style="min-width: 150px;">
        ${requestShowingLabelMap[inputKey]}</td><td>${JSON.stringify(
          inputValue,
        )}</td></tr>`;
      });

      const html = `<table>${trs.join('')}</table>`;
      console.log('# form-resolver requestShowing html');
      console.log(html);

      const subject = `${input.films
        .map((film) => film.title)
        .join(', ')} 상영 신청`;
      console.log(subject);

      await mail.sendMail(
        // todo 주소를 관리자 주소로 해야 함.
        { recipientEmail: 'eszqsc112@naver.com' },
        subject,
        html,
      );
      return { success: true };
    }).only(ACCESS_ALL),
    requestDistribution: makeResolver(async (obj, args, context, info) => {
      const { input } = args;
      console.log('# form-resolver requestDistribution input');
      console.log(input);
      const userEntries = Object.keys(input.user).map((userKey) => {
        const titleKey = `user_${userKey}`;
        return {
          title: requestDistributionLabelMap[titleKey],
          content: JSON.stringify(input.user[userKey]),
        };
      });

      const filmEntries = Object.keys(input.film).map((filmKey) => {
        const titleKey = `film_${filmKey}`;
        return {
          title: requestDistributionLabelMap[titleKey],
          content: JSON.stringify(input.film[filmKey]),
        };
      });
      const entries = [...userEntries, ...filmEntries];
      const trs = entries
        .map(
          (entry) =>
            `<tr><td style="min-width: 150px;">${entry.title}</td><td>${entry.content}</td></tr>`,
        );
      const html = `<table>${trs.join('')}</table>`;
      console.log('# form-resolver requestDistribution html');
      console.log(html);

      const subject = `${input.film.title} 배급 의뢰`;
      console.log(subject);

      await mail.sendMail(
        // todo 주소를 관리자 주소로 해야 함.
        { recipientEmail: 'eszqsc112@naver.com' },
        subject,
        html,
      );


      // const { id } = args;
      // return db.removeFilm(id);
      return {success: true};
    }).only(ACCESS_ALL),
  },
};