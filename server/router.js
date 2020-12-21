const express = require('express');
const path = require('path');
const history = require('connect-history-api-fallback');
const { enumAuthmap } = require('./db/schema/enum');
const passport = require('passport');

// const upload = require("multer")({ dest: "uploads/" }).single("bin");
const { graphQLServerMiddleware } = require('./graphql');
const {
  file: { uploadMiddleware, getFileMiddleware },
  makeAuthMiddleware,
  validator,
  user,
  db,
} = require('./loader');

const router = express.Router();

// upload
router.post(
  '/upload',
  makeAuthMiddleware(validator, [enumAuthmap.ADMIN]),
  uploadMiddleware,
);

router.get('/upload/:filename', getFileMiddleware);

// 카카오에서 로그인한 후 리디랙션하는 경로
router.get('/graphql/kakao/login/oauth', (req, res, next) => {
  passport.authenticate('kakao', function (err, user) {
    // console.log('passport.authenticate(kakao) 실행됨');
    if (err) {
      // console.log('graphql kakao login oauth 에러 발생!!!');
      // console.error(err);
      req.logout();
      return res.redirect('/');
    }
    if (!user) {
      console.error('graphql kakao login oauth 유저를 찾을 수 없습니다.');
      return res.redirect('/');
    }
    req.login(user, function (err) {
      // console.log('로그인 성공! >> kakao/callback user : ', user);
      return res.redirect('/');
    });
  })(req, res);
});

// 로그인되어 있는지 모르는 상태에서 로그인 시도(이미 로그인되어 있다면 세션 갱신)하는 경로
router.get('/graphql/kakao/login', passport.authenticate('kakao'));

router.get('/graphql/bootpay', (req, res, next) => {
  // todo: bootpay 에서 정보를 이리로 넘겨줌.
});

// graphiql
router.post('/graphql', graphQLServerMiddleware);
router.get('/graphql', (req, res, next) => {
  res.sendStatus(404);
});

router.get('/test/remove-user/:email', (req, res, next) => {
  const { email } = req.params;
  db.removeUserByEmail(req.params.email)
    .then(() => {
      res.send(`success deleting ${email}`);
    })
    .catch((error) => {
      // console.error(error);
      res.status(500).send(error);
    });
});

// todo 나중에 삭제해야 함.
router.get('/test/make-super-user', (req, res, next) => {
  user
    .initAdmin()
    .then((/* result */) => {
      res.send('admin create successed!');
    })
    .catch((error) => {
      res.send(error);
    });
});

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
