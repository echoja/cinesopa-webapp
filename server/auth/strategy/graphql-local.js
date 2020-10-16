const gp = require('graphql-passport');
const passport = require('passport');

/**
 * 
 * @param {passport} passport 
 * @param {UserGetterByAuth} getUserByAuth 
 */
module.exports.useGraphQLLocalStrategy = (passport, getUserByAuth) => {
  passport.use(
    new gp.GraphQLLocalStrategy(async (email, pwd, done) => {
      const userFound = await getUserByAuth(email, pwd);
      const error = userFound
        ? null
        : new Error(`GraphQLLocalStrategy: 비밀번호가 틀립니다: ${email}`);
      done(error, userFound);
    }),
  );
};
