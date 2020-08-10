const fs = require("fs");
const path = require("path");
const foldername = "generated-html";
const sanitizeFilename = require("sanitize-filename");

module.exports = {
  /**
   * 테스트용 html를 만듭니다. 경로는 test 이름 기반입니다. Mocha 전용입니다.
   * 만들어진 html 파일은 직접 삭제하세요. 삭제 코드는 위험하여 넣지 않았습니다.
   * 하위 폴더도 직접 만들어야 합니다. 아니면 에러가 발생합니다. (기본 폴더명: generated-html)
   * @param {Mocha.Context} self 해당하는 테스트에서 this를 넘깁니다.
   * @param {string} html
   * @returns {Promise<void>}
   */
  async makeHtmlReport(self, html) {
    return new Promise((resolve, reject) => {
      const filename = sanitizeFilename(self.test.fullTitle()) + ".html";
      const fullpath = path.join(__dirname, foldername, filename);
      fs.writeFile(fullpath, html, function (err) {
        if (err) {
          return reject(err);
        }
        return resolve();
      });
    });
  },
};
