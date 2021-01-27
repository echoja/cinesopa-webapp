import { makeSimpleQuery } from "./graphql-client";

/**
 * 최종 upload 링크를 만들어 반환합니다.
 * @param {string} rawLink 서버로부터 받아온 링크
 * @returns {string} 최종 링크
 */
export const parseUploadLink = (rawLink) => rawLink;
// if (process.env.NODE_ENV === 'production') {
//   return `https://sopaseom.com${rawLink}`;
// }

export const abc = 'abc';

export const fixFocusScroll = (e) => {
  const offset = 300;
  window.scroll(0, e.target.offsetTop - offset);
  // console.log('# util fixFocusScroll element');
  // console.log(e.target);
};

export const getOptionsFromServer = async (...names) => {
  const req = makeSimpleQuery('siteOptions');
  const optionResults = await req(
    {
      names,
    },
    `{
    name value success code
  }`,
  );
  return optionResults;
};
