const fs = require('fs');

module.exports = {
  /**
   * 
   * @param {string} fullpath 
   */
  async removeFile(fullpath) {
    return new Promise((resolve, reject) => {
      fs.unlink(fullpath, (err) => {
        if(err) return reject(err);
        return resolve();
      });
    })
  }
}