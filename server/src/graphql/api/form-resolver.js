const Hangul = require('hangul-js');
const {
  ACCESS_ALL,
  ACCESS_ADMIN,
  ACCESS_AUTH,
  ACCESS_UNAUTH,
  makeResolver,
  db,
  mail,
} = require('@/loader');

const moment = require('moment');
const { enumFilmAvailableSubtitle } = require('@/db/schema/enum');
const { isJsonObject, ApplicationTransportStatus } = require('@/typedef');
const { onlyRejected } = require('@/util');

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
  debug: '(개발모드)',
};

/**
 * 상영 신청의 내용을 포맷팅합니다.
 * @param {string} key
 * @param {*} value
 * @returns {string}
 */
const formatShowingContent = (key, value) => {
  if (value instanceof Date) {
    return moment(value).tz('Asia/Seoul').format('YYYY년 MM월 DD일');
  }
  if (typeof value === 'string') {
    return value;
  }
  return JSON.stringify(value);
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

/**
 * distribution content 를 포맷팅합니다.
 * @param {string} key key
 * @param {*} value value
 * @returns {string}
 */
const formatDiscributionContent = (key, value) => {
  if (value instanceof Date) {
    return moment(value).tz('Asia/Seoul').format('YYYY년 MM월 DD일');
  }
  if (typeof value === 'string') {
    return value;
  }
  return JSON.stringify(value);
};

/**
 *
 * @param {*} input
 * @returns {import('@/typedef').ApplicationInput}
 */
const convertInput = (input) => {
  const {
    companyName,
    festivalName,
    playdateStart,
    playdateEnd,
    playtimes,
    playplace,
    username,
    userphone,
    useremail,
    films,
    addressNew,
    addressOld,
    addressDetailed,
    howToReceive,
    visitDate,
    receiveDate,
    expectedPopulation,
    selfShowingFee,
    depositdate,
    isTaxSame,
    taxCompany,
    taxPerson,
    taxPhone,
    taxOthers,
    additionalPapers,
    others,
  } = input;

  /** @type {string[]} */
  const memos = [];
  /** @type {string[]} */
  const otherMemos = [];

  /** @type {Map<string, ApplicationTransportStatus>} */
  const tsmap = new Map([
    ['택배', 'yet_to_delivery'],
    ['온라인', 'online_or_direct'],
  ]);
  tsmap.set('택배', 'yet_to_delivery');
  tsmap.set('온라인', 'online_or_direct');

  const formatDate = (date) => moment(date).tz('Asia/Seoul').format('yyyy-MM-DD');

  /** @type {ApplicationTransportStatus} */
  const transport_status = tsmap.get(howToReceive) ?? 'online_or_direct';
  if (howToReceive === '직접') {
    memos.push(`[${formatDate(visitDate)}에 직접 수령]`);
  } else if (receiveDate) {
    memos.push(`[상영본 도착 희망일: ${formatDate(receiveDate)}]`);
  }

  if (playplace) {
    memos.push(`[상영 공간: ${playplace}]`);
  }

  if (expectedPopulation) {
    memos.push(`[예상 관객: ${expectedPopulation}]`);
  }

  if (isTaxSame) {
    memos.push('[신청자와 정산 기관이 같습니다.]');
  } else {
    memos.push(
      `[정산 정보: ${taxCompany}, ${taxPerson}, ${taxPhone}, ${taxOthers}`,
    );
  }

  if (additionalPapers) {
    otherMemos.push(`[서류 요청: ${additionalPapers.join(', ')}]`);
  }

  if (others) {
    otherMemos.push(`[기타: ${others}]`);
  }

  const formatInfos = films.map((film) =>
    [film.title, film.format, film.selected_subtitles ?? []].flat(20),
  );

  // Application Input 만들기
  /** @type {import('@/typedef').ApplicationInput} */
  const applInput = {
    applicant_email: useremail,
    applicant_name: username,
    applicant_phone: userphone,
    charge: parseInt(selfShowingFee, 10),
    deposit_date: depositdate,
    destination: `${addressNew} ${addressDetailed} (${addressOld} ${addressDetailed})`,
    host: companyName,
    festival: festivalName,
    transport_status,
    start_date: playdateStart,
    end_date: playdateEnd,
    session_count: playtimes,
    etc_req: otherMemos.join('\n'),
    memo: memos.join('\n'),
    film_title: films.map((film) => film.title).join(', '),
    format: formatInfos
      .map((formatInfo) => `(${formatInfo.join(', ')})`)
      .join(', '),
    money_status: 'pending_deposit',
  };
  return applInput;
};

module.exports = {
  Query: {},
  Mutation: {
    /** 상영신청 받았을 때 실행되는 resolver */
    requestShowing: makeResolver(async (obj, args, context, info) => {
      const { input } = args;
      // console.log('# form-resolver requestShowing');
      // console.log(input);

      const applInput = convertInput(input);
      await db.createApplication(applInput);

      const { films, debug } = input;

      // 메일을 보내는 준비를 합니다.
      const trs = Object.entries(input).map(
        ([inputKey, inputValue]) => `<tr><td style="min-width: 150px;">
        ${requestShowingLabelMap[inputKey]}</td><td>${formatShowingContent(
          inputKey,
          inputValue,
        )}</td></tr>`,
      );

      const html = `<table>${trs.join('')}</table>`;
      console.log('# form-resolver requestShowing html');
      console.log(html);

      const subject = `${films.map((film) => film.title).join(', ')} 상영 신청`;
      console.log(subject);

      // 디버그 모드일 때에는 메일을 보내지 않습니다.
      if (!debug) {
        const optionRes = await db.getSiteOption('show_application_email');
        if (!Array.isArray(optionRes.value))
          return { success: false, code: 'unexpected_option_type' };
        const emails = optionRes?.value ?? [];
        // const emails =  await db.getEmailsFromSiteOption('show_application_email');

        // /** @type {Array<*>} */
        // const emails =
        //   // @ts-ignore
        //   (await db.getSiteOption('show_application_email'))?.value ?? [];

        // 각각 찾은 이메일 Obj
        const promises = emails.map((emailObject) => {
          // need check
          if (
            !isJsonObject(emailObject) ||
            typeof emailObject.email !== 'string'
          )
            return async () => {
              /* empty */
            };
          const gate = {
            recipientEmail: emailObject.email ?? '',
          };
          return mail.sendGmail(gate, subject, html);
        });

        const results = await Promise.allSettled(promises);
        onlyRejected(results).forEach((result) => console.log(result.reason)); // need check
        if (results.some((result) => result.status === 'rejected')) {
          return { success: false, code: 'error_while_mail' };
        }
      }
      return { success: true };
    }).only(ACCESS_ALL),

    /** 배급 의뢰 받았을 때 실행되는 resolver */
    requestDistribution: makeResolver(async (obj, args, context, info) => {
      const { input } = args;
      // console.log('# form-resolver requestDistribution input');
      // console.log(input);
      const userEntries = Object.keys(input.user ?? []).map((userKey) => {
        const titleKey = `user_${userKey}`;
        return {
          title: requestDistributionLabelMap[titleKey],
          content: formatDiscributionContent(titleKey, input.user[userKey]),
        };
      });

      const filmEntries = Object.keys(input.film ?? []).map((filmKey) => {
        const titleKey = `film_${filmKey}`;
        return {
          title: requestDistributionLabelMap[titleKey],
          content: formatDiscributionContent(titleKey, input.film[filmKey]),
        };
      });

      const entries = [...userEntries, ...filmEntries];
      const trs = entries.map(
        (entry) =>
          `<tr><td style="min-width: 150px;">${entry.title}</td><td>${entry.content}</td></tr>`,
      );

      const html = `<table>${trs.join('')}</table>`;
      // console.log('# form-resolver requestDistribution html');
      // console.log(html);

      const subject = `${input.film.title} 배급 의뢰`;
      // console.log(subject);

      const optionRes = await db.getSiteOption(
        'distribution_application_email',
      );

      const opt = optionRes.value;
      if (!Array.isArray(opt))
        return { success: false, code: 'unexpected_option_type' };

      const promises = opt.map((emailObject) => {
        // need check
        if (!isJsonObject(emailObject) || typeof emailObject.email !== 'string')
          return async () => {
            /* empty */
          };

        const gate = {
          recipientEmail: emailObject.email ?? '',
        };
        return mail.sendGmail(gate, subject, html);
      });

      const results = await Promise.allSettled(promises);
      if (results.some((result) => result.status === 'rejected')) {
        return { success: false };
      }
      return { success: true };
    }).only(ACCESS_ALL),
  },
};
