require("./typedef");

// /**
//  *
//  * @param {} roleList
//  * @param {Func[args]} func
//  */
// module.exports.withAuth = (roleList, func) => {
//   return async (args, context) => {
//     if (context.isUnauthenticated()) throw Error("Not Authenticated");
//     const user = await context.getUser();
//     if (!roleList.includes(user.role))
//       throw Error(
//         `UserRole not matched. required:${roleList}, given:${user.role}`
//       );
//     return await func(args, context);
//   };
// };

// // export const withAuthPiece = (roleList) => {
// //   return
// // }

// // // resolverBuilder(withAuthPicece(["ADMIN"]))(async (args, context) => { ... })
// // export const resolverBuilder = (...args) => {
// //   return (func) => {
// //     return async (args, context) => {
// //       return await func(args)
// //     }
// //   }
// // }

/********************* */
/* LODASH MAKE ENUM!!! */
/********************* */

// const _ = require("lodash");
// const t = ["a", "b", "c", "d"];
// const arr = _.chain(t).keyBy( (o) => {
//   return o;
// }).mapValues((o) => {
//   return Symbol(o);
// }).value();
// console.log(arr);

/**
 * string 만 있는 배열을 이용하여 enum 객체를 만듭니다.
 * 이 객체는 raw_str_list 멤버가 있습니다. 순수 javascript string array 입니다.
 * @param {string[]} str_list enum할 것들의 string 배열
 */
const makeEnum = (str_list) => {
  const result = {};
  for (let key in str_list) {
    const val = str_list[key];
    result[val] = Symbol(val);
  }
  result["raw_str_list"] = str_list;
  return Object.freeze(result);
};

module.exports = {
  makeEnum,
};
