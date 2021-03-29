import axios from 'axios';
import FormData from 'form-data';

export default (fileObj, name) => {
  console.log('# upload-client function called');
  const fd = new FormData();
  fd.append('name', name);
  fd.append('bin', fileObj);
  return axios.post('/upload', fd, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    onUploadProgress: (progressEvent) => {
      console.log('# upload-client.js onUploadProgress');
      console.log(progressEvent.loaded);
    },
  });
};
