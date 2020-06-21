const { user, page, auth } = require("../../dao");

module.exports = {
  Mutation: {
    async login (obj, args, context, info){
      return await user.login(args, context);
    },
    
    async logout (obj, args, context, info){
      return await user.logoutMe(args, context);
    },
    async logoutMe (obj, args, context, info){
      return await user.logoutMe(args, context);
    },
    // async createUser (obj, args, context, info){
    //   const { email, name, pwd, role } = args;
    //   return await user.joinUser(args);
    // },
    async createAdmin (obj, args, context, info){
      return await user.createAdmin(args, context);
    },
    async createGuest (obj, args, context, info){
      return await user.createGuest(args, context);
    },
    async updateUser (obj, args, context, info){
      return await user.updateUser(args, context);
    },
    async createPage (obj, args, context, info){
      return await page.createPage(args);
    },
    async signinUserByEmail (obj, args, context, info){
      return await user.getUserByAuth(args.provider.email, args.provider.pwd);
    },
    async singleUpload (obj, args, context, info){
      const file = { args };
      const { filename, mimetype, encoding } = await file;
      const returnFile = { filename, mimetype, encoding };
      return returnFile;
    },
  },
  Query: {
    async users (obj, args, context, info){
      return await user.getAllUsers(args, context);
    },
    async user (obj, args, context, info){
      const { email } = args;
      return await user.getUser(email, context);
    },

    async page (obj, args, context, info){
      return await page.getPageByPermalink(args, context);
    },
    async pages (obj, args, context, info) {
      return await page.getAllPages(args, context);
    },
    async pageById(obj, args, context, info) {
      return await page.getPageById(args, context);
    },
    async checkAuth (obj, args, context, info){
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
