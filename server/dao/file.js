module.exports = {
  async newFile() {},

  async removeFile() {},

  // req.user로 유저 데이터 접근 가능
// req.isAuthenticated() 로 지금 인증된 상태인지 확인 가능
// key를 넣어서 업로드하는 것은 외부로 공개되지 않는 파일만 가능하다. params에서 권한을 설정할 수 있다.
// 이 기능은 authenticated 되어야 한다.
  uploadMiddleware(req, res, next) {
    if (req.isAuthenticated() && req.user.role === "ADMIN") {
      console.log(req.params);
      console.log(req.body);
      console.log(req.file);
      res.status(204).send();
    } else {
      res.send("not authenticated!");
    }
  },
};
