const kakao = require('passport-kakao');
const { kakaoClientId, kakaoClientSecret } = require('../../config/common');
/**
 *
 * @param {passport} passport
 * @param {DBManager} db
 */

const kakaoStrategyOptions = {
  clientID: kakaoClientId,
  clientSecret: kakaoClientSecret, // clientSecret을 사용하지 않는다면 넘기지 말거나 빈 스트링을 넘길 것
  callbackURL:
    process.env.NODE_ENV === 'production'
      ? 'https://sopaseom.com/graphql/kakao/login/oauth'
      : 'http://localhost:8080/graphql/kakao/login/oauth',
}
/**
 * 
 * @param {DBManager} db 
 */
const kakaoVerifyFunctionMaker = (db) => {
  return async (accessToken, refreshToken, profile, done) => {
    
    // 사용자의 정보는 profile에 들어있다.
    const kakaoId = profile._json.id;
    const accountInfo = profile._json.kakao_account;
    const { is_email_valid, is_email_verified, email } = accountInfo;
    if (!is_email_valid || !is_email_verified) {
      return done(
        new Error(
          '카카오에서 계정의 이메일이 인증되지 않았습니다. 카카오 계정으로 로그인할 수 없습니다.',
        ),
      );
    } 

    // 유저 정보가 이미 존재하는 경우 각종 정보를 업데이트하고 유저를 내보냄.
    // todo: 유저가 인증이 되지 않은 상태에서 정보 업데이트 하려고 하면 어떻게 되는가? - 바로 빠꾸 먹여야 함.
    const user = await db.getUserByEmail(email);
    if (user) {
      await db.updateUser(email, {
        kakao_access_token: accessToken,
        kakao_refresh_token: refreshToken,
        kakao_id: kakaoId,
        blocked_count: 0,
        wrong_pwd_count: 0,
      });
      const updated = await db.getUserByEmail(email);
      return done(null, updated);
    }

    // 카카오로 로그인했는데 기존의 로그인 정보가 없는 경우
    // 새롭게 유저를 만들어서 그 유저를 내보냄.
    await db.upsertKakaoUser(email, {
      kakao_access_token: accessToken,
      kakao_refresh_token: refreshToken,
      kakao_id: kakaoId,
      blocked_count: 0,
      wrong_pwd_count: 0,
    });
    const upserted = await db.getUserByEmail(email);
    return done(null, upserted);
  }
}

module.exports = {
  kakaoVerifyFunctionMaker,
  useKakaoStrategy(passport, db) {
  passport.use(
    new kakao.Strategy(
      kakaoStrategyOptions, 
      kakaoVerifyFunctionMaker(db),
    ),
  );
}
};