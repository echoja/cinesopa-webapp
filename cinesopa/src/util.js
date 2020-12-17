/**
 * 최종 upload 링크를 만들어 반환합니다.
 * @param {string} rawLink 서버로부터 받아온 링크
 * @returns {string} 최종 링크
 */
export const parseUploadLink = (rawLink) => {
  // if (process.env.NODE_ENV === 'production') {
  //   return `https://sopaseom.com${rawLink}`;
  // }
  return rawLink;
};

export const abc = 'abc';

export const fixFocusScroll = (e) => {
  const offset = 300;
  window.scroll(0, e.target.offsetTop - offset);
  // console.log('# util fixFocusScroll element');
  // console.log(e.target);
};
