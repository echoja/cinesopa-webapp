import axios from 'axios';
import FormData from 'form-data';

const defaultOnUploadProgress = (progressEvent) => {
  console.log('# upload-client.js onUploadProgress');
  console.log(progressEvent.loaded);
};

const defaultUrl = '/upload';

/**
 * @callback OnUploadProgress
 * @param {ProgressEvent} progressEvent
 */

/**
 * @typedef {object} UploadOptions
 * @property {OnUploadProgress} onUploadProgress 이벤트 콜백 함수
 * @property {string} url 업로드 요청 주소. '/'로 시작함.
 */

/**
 * @param {File} fileObj
 * @param {string} name
 * @param {UploadOptions} options
 */
export default (fileObj, name, options = {}) => {
  // console.log('# upload-client function called');
  const { onUploadProgress = defaultOnUploadProgress, url = defaultUrl } = options;
  const fd = new FormData();
  fd.append('name', name);
  fd.append('bin', fileObj);
  return axios.post(url, fd, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    onUploadProgress,
  });
};
