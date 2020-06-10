import { user, page } from "../business/dao.js";
import pkg from "graphql";
const { buildSchema } = pkg;
// const { buildSchema } = require('graphql');

const schema = buildSchema(`
  
  type Query {
    users: [User]
    user(email: String!): User
    pages: [Page]
    signinUserByEmail(provider: EmailAuthProvider! ): SignInUserPayload
  }

  type Mutation {
    # 1. Create new user
    createUser(authProvider: EmailAuthProvider!): User
    # createUser(email: String!, pwd: String!, name: String!): User
    createPage(title: String!, content: String!, author: String!): Page
  }

  input EmailAuthProvider {
    email: String
    pwd: String
  }
  
  # 2. Login existing user
  

  # SignInUserPayload bundles information about the user and token
  type SignInUserPayload {
    user: User
    token: String
  }

  type User{
    id: String
    email: String
    name: String
    c_date: String
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
// 맞춤 스칼라 타입 지정은 어떻게?
var resolver = {
  users: async (args, context, info) => {
    return await user.getAllUsers();
  },
  user: async (args, context, info) => {
    const { email } = args;

    return await user.getUser(email);
  },
  createUser: async (args, context, info) => {
    const { email, name, pwd } = args;

    return await user.joinUser(email, name, pwd);
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
