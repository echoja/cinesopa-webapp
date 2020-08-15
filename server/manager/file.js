const fs = require("fs");

module.exports = {
  /**
   *
   * @param {string} fullpath
   */
  async removeFile(fullpath) {
    return new Promise((resolve, reject) => {
      fs.unlink(fullpath, (err) => {
        if (err) return reject(err);
        return resolve();
      });
    });
  },

  /**
   * 
   * @param {string} dir 폴더 경로
   * @returns {Promise<string[]>} 파일 이름들
   */
  async getFiles(dir) {
    return new Promise((resolve, reject) => {
      fs.readdir(dir, (err, files) => {
        if (err) return reject(err);
        return resolve(files);
      });
    });
  },
};
