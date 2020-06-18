const { user, page, auth } = require("../../business/dao.js");

module.exports = {
  Mutation: {
    login: async (obj, args, context, info) => {
      return await user.login(args, context);
    },
    logout: async (obj, args, context, info) => {
      return await user.logoutMe(args, context);
    },
    logoutMe: async (obj, args, context, info) => {
      return await user.logoutMe(args, context);
    },
    createUser: async (obj, args, context, info) => {
      const { email, name, pwd, role } = args;
      return await user.joinUser(args);
    },
    updateUser: async (obj, args, context, info) => {
      return await user.updateUser(args, context);
    },
    createPage: async (obj, args, context, info) => {
      return await page.createPage(args);
    },
    signinUserByEmail: async (obj, args, context, info) => {
      return await user.getUserByAuth(args.provider.email, args.provider.pwd);
    },
    singleUpload: async (obj, args, context, info) => {
      const file = { args };
      const { filename, mimetype, encoding } = await file;
      const returnFile = { filename, mimetype, encoding };
      return returnFile;
    },
  },
  Query: {
    users: async (obj, args, context, info) => {
      return await user.getAllUsers();
    },
    user: async (obj, args, context, info) => {
      const { email } = args;
      return await user.getUser(email);
    },

    page: async (obj, args, context, info) => {
      return await page.getPageByPermalink(args, context);
    },
    pages: async (obj, args, context, info) => {
      return await page.getAllPages();
    },
    checkAuth: async (obj, args, context, info) => {
      return await auth.check(args, context);
    },
  },
};

// var resolver = {

// };
// var resolver = {
//   users: async (args, context, info) => {
//     return await user.getAllUsers();
//   },

//   user: async (args, context, info) => {
//     const { email } = args;

//     return await user.getUser(email);
//   },

//   pages: async (args, context, info) => {
//     return await page.getAllPages();
//   },

//   checkAuth: async (args, context, info) => {
//     return await auth.check(args, context);
//   },

//   login: async (args, context, info) => {
//     return await user.login(args, context);
//   },

//   logout: async (args, context, info) => {
//     return await user.logoutMe(args, context);
//   },

//   logoutMe: async (args, context, info) => {
//     return await user.logoutMe(args, context);
//   },

//   createUser: async (args, context, info) => {
//     const { email, name, pwd, role } = args;
//     return await user.joinUser(args);
//   },

//   updateUser: async (args, context, info) => {
//     return await user.updateUser(args, context);
//   },

//   createPage: async (args, context, info) => {
//     return await page.createPage(args);
//   },
//   signinUserByEmail: async (args, context, info) => {
//     return await user.getUserByAuth(args.provider.email, args.provider.pwd);
//   },
// };
