// require('../typedef');
import { DBManager } from '@/typedef';

const passport = require('passport');
const { useGraphQLLocalStrategy } = require('./strategy/graphql-local');
const { useKakaoStrategy } = require('./strategy/kakao');

export default {
  /**
   *
   * @param {DBManager} db
   */
  make(db) {
    // 헬퍼 함수들.
    const userFinder = db.getUserByEmail;
    const getUserByAuth = async (email, pwd) => {
        if (await db.isCorrectPassword(email, pwd)) {
          // console.log(`# getUserByAuth 접근이 승인되었습니다: email: ${email}`);
          return db.getUserByEmail(email);
        }
        console.error(`# getUserByAuth 접근이 거부되었습니다: email: ${email}`);
        return null;
    };


    if (typeof userFinder !== 'function' || typeof getUserByAuth !== 'function')
      throw `auth-lcoal: wrong userFinder or getUserByauth`;
    return () => {
      /**
       * 유저의 email 을 세션 구분용 id로 사용한다
       */
      passport.serializeUser((user, done) => {
        // console.log(`~~~serializing user`);
        // console.dir(user);
        // console.log(`serializing: ${user.email}`);
        done(null, user.email);
      });

      /** 세션 구분용 id인 email을 받아와서 userFinder 에게 넘긴다. */
      passport.deserializeUser(async (email, done) => {
        // const userFound = await user.getUserByEmail(email);
        // console.log(`deserializing: ${email}`);
        const userFound = await userFinder(email);
        // console.dir(userFound);
        if (userFound) {
          done(null, userFound);
        } else {
          // throw "passport-deserializeUser-해당 유저를 찾을 수 없습니다.";
          // 로그인이 되어 있는 상태이지만 유저를 찾을 수 없을 때.
          console.log(`passport-deserializeUser: ${email} 유저를 찾을 수 없습니다.`);
          done(null, null);
          // done(
          //   new Error(
          //     `passport-deserializeUser: ${email} 유저를 찾을 수 없습니다.`,
          //   ),
          // );
        }
      });

      useGraphQLLocalStrategy(passport, getUserByAuth);
      useKakaoStrategy(passport, db);
    };
  },
  /**
   * UserFinder 와 UserGetterByAuth 를 이용해 passport 인증 방법을 초기화하는 함수.
   * @param {UserFinder} userFinder
   * @param {UserGetterByAuth} getUserByAuth
   */
  init(db) {
    this.make(db)();
  },
};
