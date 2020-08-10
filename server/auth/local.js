require("../typedef");

const passport = require("passport");
const gp = require("graphql-passport");

module.exports = {
  /**
   *
   * @param {UserFinder} userFinder
   * @param {UserGetterByAuth} getUserByAuth
   */
  make(userFinder, getUserByAuth) {
    return () => {
      /**
       * 유저의 email 을 세션 구분용 id로 사용한다
       */
      passport.serializeUser((user, done) => {
        done(null, user.email);
      });

      /** 세션 구분용 id인 email을 받아와서 userFinder 에게 넘긴다. */
      passport.deserializeUser(async (email, done) => {
        // const userFound = await user.getUserByEmail(email);
        
        const userFound = await userFinder(email);
        done(null, userFound);
      });

      passport.use(
        new gp.GraphQLLocalStrategy(async (email, pwd, done) => {
          const userFound = await getUserByAuth(email, pwd);
          const error = userFound ? null : new Error(`GraphQLLocalStrategy: 비밀번호가 틀립니다: ${email}`);
          done(error, userFound);
        })
      );
    };
  },
};
