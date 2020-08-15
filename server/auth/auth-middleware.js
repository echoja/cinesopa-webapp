const typedef = require("../typedef");

const { enumAuthmap } = require("../dao/db/schema/enum");

module.exports = {
  /**
   * 권한을 검사하는 express middleware를 생성합니다.
   * @param {AuthValidator} authvalidator
   * @param {string[]} condition 가능한 AUTH 목록
   */
  make(authvalidator, condition) {
    /**
     *
     * @param {Express.Request} req
     * @param {import("express").Response} res
     * @param {import("express").NextFunction} next
     */
    const result = (req, res, next) => {
      // console.log("--req.user--");
      // console.dir(req.user);
      authvalidator
        .contains(enumAuthmap[req.user?.role], condition)
        .then((value) => {
          if (value === true) {
            next();
          } else {
            res.status(401).send();
          }
        })
        .catch((err) => {
          res.status(500).send(err);
        });
    };
    return result;
  },
};
