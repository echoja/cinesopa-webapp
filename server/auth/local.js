import passport from "passport";
import passportLocal from "passport-local";
const LocalStrategy = passportLocal.Strategy;
import { user } from "../business/dao.js";
import gp from "graphql-passport";

export const localAuthConfig = () => {

  passport.serializeUser((user, done) => {
    done(null, user.email);
  });

  passport.deserializeUser(async (email, done) => {
    const userFound = await user.getUser(email);
    done(null, userFound);
  });

  passport.use(
    new gp.GraphQLLocalStrategy(async (email, pwd, done) => {
      const userFound = await user.getUserByAuth(email, pwd);
      const error = userFound ? null : new Error("no matching user");
      done(error, userFound);
    })
  );

  // use(
  //   new LocalStrategy(
  //     {
  //       // local 전략을 세움
  //       usernameField: "email",
  //       passwordField: "pw",
  //       session: true, // 세션에 저장 여부
  //       passReqToCallback: true,
  //     },
  //     (req, email, pwd, done) => {
  //       user
  //         .getUserByAuth(email, pwd)
  //         .then((trusted_user) => {
  //           return done(null, trusted_user);
  //         })
  //         .catch((error) => {
  //           return done(null, false, error);
  //         });

  // }, async (req, email, pwd, done) => {

  //   const trusted_user = await user.getUserByAuth(email, pwd);
  //   if (trusted_user) {
  //     return done(null, trusted_user);
  //   } else {
  //     return done(null, false, "존재하지 않는 이메일이거나 비밀번호가 옳지 않습니다.");
  //   }

  // const found_user = await user.getUser(email);

  // user.getUser({ email }, (findError, user) => {
  //   if (findError) return done(findError); // 서버 에러 처리
  //   if (!user) return done(null, false, { message: '존재하지 않는 아이디입니다' }); // 임의 에러 처리
  //   return user.comparePassword(password, (passError, isMatch) => {
  //     if (isMatch) {
  //       return done(null, user); // 검증 성공
  //     }
  //     return done(null, false, { message: '비밀번호가 틀렸습니다' }); // 임의 에러 처리
  //   });
  // });
  //     }
  //   )
  // );
  // serializeUser(function (us, done) {
  //   done(null, us.email);
  // });
  // // user ID를 클라이언트한테 쿠키로 보내기 설정

  // deserializeUser(function (email, done) {
  //   user.getUser(email);
  //   User.findById(id, function (err, user) {
  //     done(err, user);
  //   });
  // });
};

// passport.serializeUser((user, done) => { // Strategy 성공 시 호출됨
//   done(null, user._id); // 여기의 user._id가 req.session.passport.user에 저장
// });
// passport.deserializeUser((id, done) => { // 매개변수 id는 req.session.passport.user에 저장된 값
//   User.findById(id, (err, user) => {
//     done(null, user); // 여기의 user가 req.user가 됨
//   });
// });

// export const authenticateLocal = (req, res, next) => {
//   passport.authenticate(
//     "local",
//     {
//       failureRedirect: "/",
//     },
//     (res, req) => {
//       console.log(res);
//       console.log(req);
//       next();
//       // express에서는 미들웨어를 지나서 라우트가 실행돼. 토큰을 받아서 해석,사용자찾고 사용자 존재하면 req객체에 사용자 추가하고 나면 graphql 함수를 실행하는거야.
//       // 로그인 되어 있다면 모든 gql 요청에 사용자 정보가 추가되어서 요청되는거지.
//     }
//   )(req, res, next);
// };
