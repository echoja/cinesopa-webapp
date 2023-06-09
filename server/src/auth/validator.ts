// /**
//  * @typedef {AuthValidator} AuthValidator
//  */

import { AuthmapLevel, CustomPassportContext, AuthType } from '@/typedef';

const _ = require('lodash');

/** 권한 등을 검증하는 객체 */
export class AuthValidator {
  authmapLevel: AuthmapLevel;

  /**
   * AuthValidator 를 생성합니다.
   * @param {Object.<symbol, number>} authmapLevel
   */
  constructor(authmapLevel: AuthmapLevel) {
    this.authmapLevel = authmapLevel;
  }

  /**
   * 현재 콘텍스트(graphql로 들어온 요청)가 조건에 부합하는지 체크.
   * context 의 role이 condition 이상이기만 하면 됨.
   * @param context 콘텍스트 객체
   * @param condition 조건
   * @param enumAuthmap 문자를 symbol로 바꾸는 수단
   * @returns 올바르면 true, 틀리면 false.
   */
  async isOkContext(
    context: CustomPassportContext,
    condition: AuthType,
  ): Promise<boolean> {
    // need check
    return new Promise((resolve, reject) => {
      try {
        // console.log("## isOkContext");
        // console.log(condition);
        // console.log(`--- isUnauthenticated: ${context.isUnauthenticated()}`);
        // console.log(`--- getUser:`);
        // console.dir(context.getUser());
        const { isUnauthenticated, getUser } = context;
        const role: AuthType = isUnauthenticated() ? 'ANYONE' : getUser().role;
        this.isOk(role, condition)
          .then((result) => resolve(result))
          .catch((err) => reject(err));
      } catch (e) {
        return reject(e);
      }
    });
  }

  /**
   * 권한이 올바른지 체크하는 함수. 주어진 권한이 조건 권한보다 더 상위의 권한인지 체크.
   * @param {symbol} given 주어진 권한
   * @param {symbol} condition 조건 권한
   * @returns {Promise<boolean>} 올바르면 true, 틀리면 false.
   */
  async isOk(given: AuthType, condition: AuthType): Promise<boolean> {
    return new Promise((resolve, reject) => {
      let result = false;
      try {
        // console.log(this.authmapLevel);
        // console.log(`given: ${given.toString()}, condition: ${condition.toString()}`);
        result = this.authmapLevel[given] >= this.authmapLevel[condition];
        return resolve(result);
      } catch (err) {
        console.log(err);
        return reject(
          Error(`given(${given.toString()}) or condition(${condition.toString()}) should be in [
          ${Object.getOwnPropertySymbols(this.authmapLevel)
            .map((value) => value.toString())
            .join(', ')}]`),
        );
      }
    });
  }

  /**
   * 주어진 권한이 조건에 포함되는지 체크하는 함수.
   * @param given 주어진 권한
   * @param condition 조건 권한의 리스트
   * @returns 포함되면 true, 포함되지 않으면 false.
   */
  async contains(given: AuthType, condition: AuthType[]): Promise<boolean> {

    if (condition.includes(given)) {
      return (true);
    }
    return (false);

    // return new Promise((resolve, reject) => {
    //   const symbolKeys = Object.getOwnPropertySymbols(this.authmapLevel);
    //   condition.forEach((value) => {
    //     if (!symbolKeys.includes(value)) {
    //       return reject(
    //         Error(
    //           `condition에 있는 모든 요소(${value})는 [${_.map(
    //             symbolKeys,
    //             (item) => item.toString(),
    //           )}]에 포함되어야 합니다.`,
    //         ),
    //       );
    //     }
    //   });
    //   if (condition.includes(given)) {
    //     return resolve(true);
    //   }
    //   return resolve(false);
    // });
  }

  //   /**
  //    * 클라이언트에서 해당 페이지에 권한이 있는지 없는지 체크하는 리졸버와 이어지는 함수.
  //    * 각 api에 대해 체크하는 게 아니라서 에러를 일으킬 필요가 없고,
  //    * 클라이언트에게 로그인이 필요하거나 권한이 없다고 알려주는 역할임.
  //    * 로그인에 필요한 페이지에 접속했을 시, 현재 링크를 req.session.redirectLink 에 저장하여
  //    * 나중에 로그인이 성공했을 시 redirectLink 로 즉시 이동할 수 있도록 함.
  //    *
  //    * @param {string} redirectLink
  //    * @param {symbol[]} roleAvailable 조건 권한. 유저는 roleAvailable 안에 있어야 가능함.
  //    * @param {PassportContext} context Resolver 로부터 받는 context 객체
  //    * @returns {Promise<{permissionStatus: string, user?: object}>} 권한 상태와 유저 객체
  //    */
  //   async accessCheck(redirectLink, roleAvailable, context) {
  //     // console.log(roleAvailable);
  //     // console.log;
  //     return new Promise((resolve, reject) => {
  //       const {
  //         isUnauthenticated,
  //         req: { session },
  //         getUser,
  //       } = context;
  //       // console.log(`accessCheck - session print:${context.req.sessionID}`);
  //       // console.dir(session);
  //       if (isUnauthenticated()) {
  //         // 리다이렉트 링크 설정
  //         if (redirectLink !== '') {
  //           session.redirectLink = redirectLink;
  //         }
  //         return resolve({
  //           permissionStatus: 'LOGIN_REQUIRED',
  //         });
  //       }
  //       const user = getUser();

  //       /**
  //        *  만약 user.role 이 string이라면, 해당하는 symbol 로 변환하도록 함.
  //        */
  //       const role = typeof user.role === 'string'
  //         ? this.symbolArray.find((value) => value.description === user.role)
  //         : user.role;
  //       this.contains(role, roleAvailable)
  //         .then((value) => {
  //           if (value) {
  //             return resolve({
  //               permissionStatus: 'OK',
  //               user,
  //             });
  //           }
  //           return resolve({
  //             permissionStatus: 'NO_PERMISSION',
  //           });
  //         })
  //         .catch((error) => reject(error));
  //     });
  //   }
}

/** authMapLevel 로 초기화합니다. */
export const make = (authmapLevel: AuthmapLevel): AuthValidator =>
  new AuthValidator(authmapLevel);

// export default {
//   /**
//    *
//    * @param {Object.<string, number>} authmapLevel
//    */
//   make(authmapLevel) {
//     return new AuthValidator(authmapLevel);
//   },
// };

// /**
//  * @typedef {AuthValidator} AuthValidator
//  */

// const _ = require("lodash");

// /** 권한 등을 검증하는 객체 */
// class AuthValidator {
//   /**
//    * AuthValidator 를 생성합니다.
//    * @param {Object.<string, number>} authmapLevel
//    */
//   constructor(authmapLevel) {
//     this.authmapLevel = authmapLevel;
//   }
//   /**
//    * 권한이 올바른지 체크하는 함수. 주어진 권한이 조건 권한보다 더 상위의 권한인지 체크.
//    * @param {string} given 주어진 권한
//    * @param {string} condition 조건 권한
//    * @returns {boolean} 올바르면 true, 틀리면 false.
//    */
//   async isOk(given, condition) {
//     return new Promise((resolve, reject) => {
//       let result = false;
//       try {
//         result = this.authmapLevel[given] >= this.authmapLevel[condition];
//         return resolve(result);
//       } catch {
//         return reject(`given(${given}) or condition(${condition}) should be in [
//           ${_.keys(this.authmapLevel).join(", ")}]`);
//       }
//     });
//   }

//   /**
//    * 주어진 권한이 조건에 포함되는지 체크하는 함수.
//    * @param {string} given 주어진 권한
//    * @param {string[]} condition 조건 권한의 리스트
//    * @returns {Promise<boolean>} 포함되면 true, 포함되지 않으면 false.
//    */
//   async contains(given, condition) {
//     return new Promise((resolve, reject) => {
//       const keys = _.keys(this.authmapLevel);
//       condition.forEach((value) => {
//         if (!keys.includes(value))
//           return reject(
//             `condition에 있는 모든 요소는 [${keys.join(
//               ", "
//             )}]에 포함되어야 합니다.`
//           );
//       });
//       if (condition.includes(given)) {
//         return resolve(true);
//       } else {
//         return resolve(false);
//       }
//     });
//   }

//   /**
//    * 클라이언트에서 해당 페이지에 권한이 있는지 없는지 체크하는 리졸버와 이어지는 함수.
//    * 각 api에 대해 체크하는 게 아니라서 에러를 일으킬 필요가 없고,
//    * 클라이언트에게 로그인이 필요하거나 권한이 없다고 알려주는 역할임.
//    * 로그인에 필요한 페이지에 접속했을 시, 현재 링크를 req.session.redirectLink 에 저장하여
//    * 나중에 로그인이 성공했을 시 redirectLink 로 즉시 이동할 수 있도록 함.
//    *
//    * @param {string} redirectLink
//    * @param {string[]} roleAvailable 조건 권한. 유저는 roleAvailable 안에 있어야 가능함.
//    * @param {PassportContext} context Resolver 로부터 받는 context 객체
//    * @returns {Promise<{permissionStatus: string, user?: object}>} 권한 상태와 유저 객체
//    */
//   async accessCheck(redirectLink, roleAvailable, context) {
//     return new Promise((resolve, reject) => {
//       const {
//         isUnauthenticated,
//         req: { session },
//         getUser,
//       } = context;
//       // console.log(`accessCheck - session print:${context.req.sessionID}`);
//       // console.dir(session);
//       if (isUnauthenticated()) {
//         // 리다이렉트 링크 설정
//         if (redirectLink !== "") {
//           session.redirectLink = redirectLink;
//         }
//         return resolve({
//           permissionStatus: "LOGIN_REQUIRED",
//         });
//       }
//       const user = getUser();
//       this.contains(user.role, roleAvailable)
//         .then((value) => {
//           if (value) {
//             return resolve({
//               permissionStatus: "OK",
//               user,
//             });
//           } else {
//             return resolve({
//               permissionStatus: "NO_PERMISSION",
//             });
//           }
//         })
//         .catch((error) => {
//           return reject(error);
//         });
//     });
//   }
// }

// module.exports = {
//   /**
//    * authMapLevel 로 초기화합니다.
//    * @param {Object.<string, number>} authmapLevel
//    */
//   make(authmapLevel) {
//     return new AuthValidator(authmapLevel);
//   },
// };
