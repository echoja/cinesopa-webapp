const path = require("path");
const { makeExecutableSchema } = require("graphql-tools");
const {
  fileLoader,
  mergeResolvers,
  mergeTypes,
} = require("merge-graphql-schemas");
const graphqlHTTP = require("express-graphql");
const { buildContext } = require("graphql-passport");

const allTypes = fileLoader(
  path.join(path.resolve(), "./graphql/api/**/*.graphql")
);
const allResolvers = fileLoader(
  path.join(path.resolve(), "./graphql/api/**/*.js")
);

const schema = makeExecutableSchema({
  typeDefs: mergeTypes(allTypes),
  resolvers: mergeResolvers(allResolvers),
});

const graphQLServerMiddleware = (req, res, next) => {
  graphqlHTTP({
    schema,
    // rootValue: root,
    graphiql: true,
    context: buildContext({ req, res }),
    customFormatErrorFn: (error) => ({
      message: error.message,
      locations: error.locations,
      stack: error.stack ? error.stack.split("\n") : [],
      path: error.path,
    }),
    // context: ({ req, res }) => buildContext({ req, res }),
  })(req, res, next);
};

module.exports = {
  graphQLServerMiddleware,
  schema,
};
