// require('@/typedef');
import { DBManager } from '@/typedef';
import { PassportStatic } from 'passport';
import { UserGetterByAuth } from '@/typedef';
import { GraphQLLocalStrategy } from 'graphql-passport';
import { useKakaoStrategy } from './kakao';

export const useGraphQLLocalStrategy = (
  passport: PassportStatic,
  getUserByAuth: UserGetterByAuth,
): void => {
  passport.use(
    new GraphQLLocalStrategy(async (email, pwd, done) => {
      const userFound = await getUserByAuth(email, pwd);
      const error = userFound
        ? null
        : new Error(`GraphQLLocalStrategy: 비밀번호가 틀립니다: ${email}`);
      done(error, userFound);
    }),
  );
};

/**
 * 내부에서 passport 의 serializeUser, deserializeUser,
 * 기타 passport 관련 설정을 함수.
 * @param passport 객체
 * @param db db매니저
 * @returns LocalAuth 와 관련된 Configuration 을 설정하는 함수를 생성한다.
 * 이 함수는 passport.initialize() 호출되기 전에 실행된다.
 */
export const configureLocalAuth = (
  passport: PassportStatic,
  db: DBManager,
): void => {
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

  // if (typeof userFinder !== 'function' || typeof getUserByAuth !== 'function')
  //   throw Error(`auth-lcoal: wrong userFinder or getUserByauth`);

  /** 유저의 email 을 세션 구분용 id로 사용한다 */
  passport.serializeUser((user, done) => {
    // console.log(`~~~serializing user`);
    // console.dir(user);
    // console.log(`serializing: ${user.email}`);
    done(null, user.email);
  });

  /** 세션 구분용 id인 email을 받아와서 userFinder 에게 넘긴다. */
  passport.deserializeUser(async (email: string, done) => {
    // const userFound = await user.getUserByEmail(email);
    // console.log(`deserializing: ${email}`);
    const userFound = await userFinder(email);
    // console.dir(userFound);
    if (userFound) {
      done(null, userFound);
    } else {
      // 로그인이 되어 있는 상태이지만 유저를 찾을 수 없을 때.
      console.log(
        `passport-deserializeUser: ${email} 유저를 찾을 수 없습니다.`,
      );
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

export default {
  /**
   *
   * @param {DBManager} db
   */
  configureLocalAuth,
  useGraphQLLocalStrategy,
  /**
   * UserFinder 와 UserGetterByAuth 를 이용해 passport 인증 방법을 초기화하는 함수.
   * @param {UserFinder} userFinder
   * @param {UserGetterByAuth} getUserByAuth
   */
  // init(db) {
  //   this.make(db)();
  // },
};
