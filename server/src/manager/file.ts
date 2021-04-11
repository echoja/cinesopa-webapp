const fs = require('fs');

/**
 *
 * @param {string} fullpath
 */
const removeFile = async (fullpath: string): Promise<void> =>
  new Promise<void>((resolve, reject) => {
    fs.unlink(fullpath, (err) => {
      if (err) return reject(err);
      return resolve();
    });
  });

// 파일이 존재할 때 삭제하고, 아니면 아무 일도 일어나지 않습니다.
export const safeRemoveFile = async (
  fullpath: string,
): Promise<{ success: boolean; code: string }> => {
  if (fs.existsSync(fullpath)) {
    await fs.promises.unlink(fullpath);
    return { success: true, code: 'normal' };
  }
  return { success: false, code: 'file_not_exists' };
};

/**
 * dir 내에 있는 파일들을 얻습니다.
 */
export const getFiles = async (dir: string): Promise<string[]> =>
  new Promise((resolve, reject) => {
    fs.readdir(dir, (err, files) => {
      if (err) return reject(err);
      return resolve(files);
    });
  });

export const resizeOptionMap = new Map([
  ['file_preview', { width: 190, height: 190 }],
  ['featured', { width: 400, withoutEnlargement: true }],
  ['common', { width: 1300, withoutEnlargement: true }],
]);

export default {
  removeFile,
  safeRemoveFile,
  getFiles,
  resizeOptionMap,
};
