import { cm, page }  from '../business/dao.js';
import pkg from 'graphql';
const { buildSchema } = pkg;
// const { buildSchema } = require('graphql');

const schema = buildSchema(`
  type Query {
    users: [User]
    user(email: String!): User
    pages: [Page]
  }

  type Mutation {
    createUser(email: String!, pwd: String!, name: String!): User
    createPage(title: String!, content: String!, author: String!): Page
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
    return await cm.getAllUsers();
  },
  user: async (args, context, info) => {
    const {email} = args;

    return await cm.getUser(email);
  },
  createUser: async (args, context, info) => {
    const {email, name, pwd} = args;

    return await cm.joinUser(email, name, pwd);
  },
  pages: async (args, context, info) => {
    return await page.getAllPages();
  },
  createPage: async (args, context, info) => {
    return await page.createPage(args);
  },
};
const root = resolver;
export { schema, root }