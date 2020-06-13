const {user, page, auth} = require("../business/dao.js");
const { buildSchema } = require("graphql");
const path = require('path');
const {makeExecutableSchema} = require('graphql-tools');
const {fileLoader, mergeResolvers, mergeTypes} = require('merge-graphql-schemas');


const allTypes = fileLoader(path.join(path.resolve(), "./graphql/api/**/*.graphql"));
const allResolvers = fileLoader(path.join(path.resolve(), "./graphql/api/**/*.js"));

// console.log(allTypes);
console.log(allResolvers);
const schema = makeExecutableSchema({
  typeDefs: mergeTypes(allTypes),
  resolvers: mergeResolvers(allResolvers),
})

// const { buildSchema } = require('graphql');

// const schema = buildSchema(`
  
  
// `);



module.exports = schema;
// const root = resolver;
// export { schema, root };
