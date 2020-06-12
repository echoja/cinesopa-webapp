import { user, page, auth } from "../business/dao.js";
import pkg from "graphql";
const { buildSchema } = pkg;
// const { buildSchema } = require('graphql');

const schema = buildSchema(`
  
  type Query {
    users: [User]
    user(email: String!): User
    pages: [Page]
    checkAuth(redirectLink: String): CheckAuthResponse
  }

  type Mutation {
    # 1. Create new user
    createUser(authProvider: EmailAuthProvider!): User
    # createUser(email: String!, pwd: String!, name: String!): User
    createPage(title: String!, content: String!, author: String!): Page
    signinUserByEmail(provider: EmailAuthProvider! ): SignInUserPayload
    login(provider: EmailAuthProvider!, redirectLink: String ): AuthPayload
    logout(email: String!): AuthPayload
    updateUser(email: String!, userinfo: UserUpdateInfo): User
  }

  type AuthPayload {
    user: User
  }

  input EmailAuthProvider {
    email: String
    pwd: String
  }

  input UserUpdateInfo {
    pwd: String
    name: String
    role: UserRole
  }
  
  

  # SignInUserPayload bundles information about the user and token
  type SignInUserPayload {
    user: User
    token: String
  }


  # Enums

  enum UserRole {
    ADMIN
    GUEST
  }

  enum CheckAuthResponse {
    OK
    LOGIN_REQUIRED
  }

  # Types

  type User{
    id: String
    email: String
    name: String
    c_date: String
    role: UserRole
  }
  type Login{
    id: String
    email: String
    pwd: String
  }

  type Page{
    id: String
    title: String,
    content: String,
    author: User
    c_date: String
  }
`);

var resolver = {
  users: async (args, context, info) => {
    return await user.getAllUsers();
  },

  user: async (args, context, info) => {
    const { email } = args;

    return await user.getUser(email);
  },

  checkAuth: async (args, context, info) => {
    return await auth.check(args, context);
  },

  login: async (args, context, info) => {

    return await user.login(args, context);

    
  },

  logout: async (args, context, info) => {
    return await user.logout(args, context);
    
  },


  createUser: async (args, context, info) => {
    const { email, name, pwd, role } = args;
    return await user.joinUser(args);
  },

  updateUser: async(args, context, info) => {
    return await user.updateUser(args, context);
  },
  pages: async (args, context, info) => {
    return await page.getAllPages();
  },
  createPage: async (args, context, info) => {
    return await page.createPage(args);
  },
  signinUserByEmail: async (args, context, info) => {
    return await user.getUserByAuth(args.provider.email, args.provider.pwd);
  },
};
const root = resolver;
export { schema, root };
