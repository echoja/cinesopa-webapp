const fs = require("fs");
const axios = require("axios");
const FormData = require("form-data");
const path = require("path");
const foldername = "generated-html";
const sanitizeFilename = require("sanitize-filename");
const { promises } = require("dns");

class Blob {
  constructor(a, b) {}
}

/**
 * supertest 의 agent 기반으로 graphql 요청을 보냅니다.
 * 요청주소는 /graphql 로 고정입니다.
 * @param {import("supertest").SuperAgentTest} agent
 * @param {string} query
 * @param {string} variables
 */
const graphqlSuper = async (agent, query, variables) => {
  return new Promise((resolve, reject) => {
    agent
      .post(`/graphql`)
      .set("Content-Type", "application/json")
      .set("Accept", "application/json")
      .withCredentials()
      .send(
        JSON.stringify({
          query,
          variables,
        })
      )
      .expect(200)
      .end((err, res) => {
        if (err) return reject(res.body.errors[0]);
        return resolve(res);
      });
  });
};

/**
 * @typedef {object} MockFile
 * @property {string} name
 * @property {string} body
 * @property {string} mimeType
 */

module.exports = {
  graphqlSuper,

  /**
   * HTML File 객체를 만듭니다.
   * @param {MockFile} file
   * @returns {File}
   */
  createFileFromMockFile(file) {
    const blob = new Blob([file.body], { type: file.mimeType });
    blob["lastModifiedDate"] = new Date();
    blob["name"] = file.name;
    return blob;
  },

  /**
   * HTML FileList 객체를 만듭니다.
   * @param {MockFile[]} files
   * @returns {FileList}
   */
  createMockFileList(files) {
    const fileList = {
      length: files.length,
      item(index) {
        return fileList[index];
      },
    };
    files.forEach(
      (file, index) => (fileList[index] = createFileFromMockFile(file))
    );

    return fileList;
  },

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
  /**
   *
   * @param {string} url
   * @param {FormData} fd
   */
  async upload(url, fd) {
    fd.append("bin", fd);
    return axios.post(url, fd, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
};
