export const withAuth = (roleList, func) => {
  return async (args, context) => {
    if (context.isUnauthenticated()) throw Error("Not Authenticated");
    const user = await context.getUser();
    if (!roleList.includes(user.role))
      throw Error(
        `UserRole not matched. required:${roleList}, given:${user.role}`
      );
    return await func(args);
  };
};

// export const withAuthPiece = (roleList) => {
//   return 
// }

// // resolverBuilder(withAuthPicece(["ADMIN"]))(async (args, context) => { ... })
// export const resolverBuilder = (...args) => {
//   return (func) => {
//     return async (args, context) => {
//       return await func(args)
//     }
//   }
// }