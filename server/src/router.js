const express = require('express');
const history = require('connect-history-api-fallback');
const passport = require('passport');

// const upload = require("multer")({ dest: "uploads/" }).single("bin");
const { graphQLServerMiddleware } = require('./graphql');
const {
  file: {
    uploadMiddleware,
    getFileMiddleware,
    uploadPublicMiddleware,
    getExcelMiddleware,
    getEstimateMiddleware,
  },
  makeAuthMiddleware,
  validator,
  user,
  db,
} = require('./loader');
const { setDevelopmentRouter } = require('./service/router-development');
const {
  OAuthHandler,
  makeAuthActionMiddleware,
} = require('./auth/middlewares');

const router = express.Router();
// 업로드 하는 endpoint
router.post(
  '/upload',
  makeAuthMiddleware(validator, ['ADMIN']),
  uploadMiddleware,
);

// 일반 유저가 업로드하는 endpoint
router.post('/graphql/public-upload', uploadPublicMiddleware);

// 이미 업로드된 파일을 가져오는 endpoint
router.get('/upload/:filename', getFileMiddleware);

router.get(
  '/graphql/pdf/:templateName/:id',
  makeAuthMiddleware(validator, ['ADMIN']),
  getEstimateMiddleware,
);

// 로그인되어 있는지 모르는 상태에서 로그인 시도(이미 로그인되어 있다면 세션 갱신)하는 경로
router.get('/graphql/kakao/login', (req, res, next) => {
  // console.log('# /graphql/kakao/login middleware');
  // console.log(req.query);
  if (typeof req.query.redirection_url === 'string') {
    req.session.redirectLink = req.query.redirection_url;
  }
  next();
},passport.authenticate('kakao'));

// 카카오에서 로그인한 후 리디랙션하는 경로
// router.get('/graphql/kakao/login/oauth', (req, res, next) => {
//   passport.authenticate('kakao', (err, user) => {
//     // console.log('passport.authenticate(kakao) 실행됨');
//     if (err) {
//       // console.log('graphql kakao login oauth 에러 발생!!!');
//       // console.error(err);
//       req.logout();
//       res.redirect('/');
//       return;
//     }
//     if (!user) {
//       console.error('graphql kakao login oauth 유저를 찾을 수 없습니다.');
//       res.redirect('/');
//       return;
//     }
//     req.login(user, function (err) {
//       // console.log('로그인 성공! >> kakao/callback user : ', user);
//       res.redirect('/');
//     });
//   })(req, res);
// });
router.get(
  '/graphql/kakao/login/oauth',
  passport.authenticate('kakao'),
  OAuthHandler,
);

// 카카오와 현재 로그인된 계정의 연결을 끊는 것.
// router.get(
//   '/graphql/kakao/detach',
//   makeAuthActionMiddleware(passport, 'kakao', 'kakaoDetach', null),
// );
// router.get('/graphql/kakao/detach', KakaoDetachMiddleware(passport));

router.get(
  '/graphql/get-excel',
  makeAuthMiddleware(validator, ['ADMIN']),
  getExcelMiddleware,
);

// graphql
router.post('/graphql', graphQLServerMiddleware);

// 개발 전용 라우터 세팅
setDevelopmentRouter({ router, db, user });

/**
 *
 * @param {import("express").Express} app
 */
module.exports.getRouter = (app) => {
  app.use(
    '/cinesopa',
    history({
      //   // rewrites: [
      //   //   { from: /\/graphql/, to: '/graphql'}
      //   // ],
      //   // index: '/cinesopa/index.html',
      verbose: true, // production settings required
    }),
  );
  app.use(
    '/sopaseom',
    history({
      // rewrites: [
      //   { from: /\/graphql/, to: '/graphql'}
      // ],
      // index: '/sopaseom/index.html',
      verbose: true, // production settings required
    }),
  );
  // app.use(express.static('dist'));
  return router;
};
