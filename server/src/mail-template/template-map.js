const fs = require('fs');
const pug = require('pug');
const util = require('util');
const inlineCss = require('inline-css');
const { MailRendererWrapper, TemplateMap } = require('@/typedef');
require('../typedef');

const _fileinfo = {
  'verify-mail': 'mail-template/verify-mail.pug',
};
/**
 * 기본 arguments를 항상 포함하는 rednerer 함수를 반한합니다.
 * 실제로 호출될 때는 이 함수로 만들어진 renderer 만 호출됩니다.
 * css inline 화도 수행합니다.
 * @param {import('pug').compileTemplate} renderer
 * @param {Object.<string, string>} defaultArgs
 * @return {MailRendererWrapper}
 */
const makeRendererWrapper = (renderer, defaultArgs) => {
  return async (args = {}) => {
    const string = renderer({
      currentYear: new Date().getFullYear(),
      ...defaultArgs,
      ...args,
    });
    const inlined = await inlineCss(string, {
      url: '/',
    });
    return inlined;
  };
};

/**
 * 기본 arguments 를 받습니다.
 */
const _getDefaultArgs = async () => {
  // 각종 기본 Args를 받아옴.
  return {
    name: 'hi',
    // todo: 관리자 이메일을 받아올 수 있어야 함.
  };
};

/**
 * @callback DefaultArgsGetter
 * @return {Promise<Object.<string, string>>}
 */

/**
 * 메일 템플릿 맵을 만들어주는 async 함수입니다.
 * @param {Object.<string, string>} fileinfo {별칭:파일이름}
 * @param {DefaultArgsGetter} getDefaultArgs async 함수여야 함!!
 * @return {Promise<TemplateMap>}
 */
const makeTemplateMap = async (
  fileinfo = _fileinfo,
  getDefaultArgs = _getDefaultArgs,
) => {
  const readFile = fs.promises.readFile;

  // fileinfo 의 값을 하나하나 읽어서 [name, pug renderer] 를 내뱉는
  // Promise 의 배열을 만듭니다.
  console.log("# template-map.js makeTemplateMap start");
  console.log(fileinfo);

  const promises = Object.keys(fileinfo).map((name) => {
    const filename = fileinfo[name];

    // Promise 를 반환합니다. (async 함수는 그냥 실행하면 Promise 를 리턴함.)
    const promise = (async () => {
      // 템플릿 문자열과 defaultArgs 을 동시에 가져옴.
      const templateStringProm = readFile(filename);
      const defaultArgsProm = getDefaultArgs();

      const templateString = await Promise.resolve(templateStringProm);
      const defaultArgs = await Promise.resolve(defaultArgsProm);

      // 렌더러 함수를 만들고 거기에 대한 래퍼 함수도 만듬.
      const renderer = pug.compile(templateString.toString(), { filename });
      const rendererWrapper = makeRendererWrapper(renderer, defaultArgs);

      /** @type {[string, MailRendererWrapper]} */
      const result = [name, rendererWrapper];
      return result;
    })();
    return promise;
  });

  // value 들을 불러옵니다.
  const results = await Promise.allSettled(promises);
  const mapInputs = results.map((result) => {
    if (result.status === 'fulfilled') {
      return result.value;
    } else {
      return null;
    }
  });
  // console.log('# template-map.js makeTemplateMap 34');
  // console.log(results);
  // console.log(mapInputs);

  // const o = [1, 2, 3];
  // o[4] = '12';
  
  return new Map(mapInputs);
};

module.exports = {
  makeTemplateMap,
};
