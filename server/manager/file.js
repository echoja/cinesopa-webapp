const fs = require('fs');

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

  // 파일이 존재할 때 삭제하고, 아니면 아무 일도 일어나지 않습니다.
  async safeRemoveFile(fullpath) {
    if (fs.existsSync(fullpath)) {
      await fs.promises.unlink(fullpath);
      return { success: true, code: 'normal' };
    }
    return { success: false, code: 'file_not_exists' };
  },

  /**
   * dir 내에 있는 파일들을 얻습니다.
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

  resizeOptionMap: new Map([
    ['file_preview', { width: 190, height: 190 }],
    ['featured', { width: 400, withoutEnlargement: true }],
    ['common', { width: 1300, withoutEnlargement: true }],
  ]),
};
