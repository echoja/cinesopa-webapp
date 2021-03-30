import { loadTypedefsSync, loadSchemaSync } from '@graphql-tools/load';

// import application from './api/application.graphql';
// import board from './api/board.graphql';
// import cartitem from './api/cartitem.graphql';
// import common from './api/common.graphql';
// import file from './api/file.graphql';
// import film from './api/film.graphql';
// import form from './api/form.graphql';
// import order from './api/order.graphql';
// import post from './api/post.graphql';
// import product from './api/product.graphql';
// import siteoption from './api/site-option.graphql';
// import sopakit from './api/sopakit.graphql';
// import tag from './api/tag.graphql';
// import uncatagorized from './api/uncatagorized.graphql';
// import user from './api/user.graphql';

import applicationResolver from './api/application-resolver';
import boardResolver from './api/board-resolver';
import cartitemResolver from './api/cartitem-resolver';
import commonResolver from './api/common-resolver';
import fileResolver from './api/file-resolver';
import filmResolver from './api/film-resolver';
import formResolver from './api/form-resolver';
import orderResolver from './api/order-resolver';
import postResolver from './api/post-resolver';
import productResolver from './api/product-resolver';
import siteOptionResolver from './api/site-option-resolver';
import sopakitResolver from './api/sopakit-resolver';
import tagResolver from './api/tag-resolver';
import uncatagorizedResolver from './api/uncatagorized-resolver';
import userResolver from './api/user-resolver';



// const allTypes = [
//   application,
//   board,
//   cartitem,
//   common,
//   file,
//   film,
//   form,
//   order,
//   post,
//   product,
//   siteoption,
//   sopakit,
//   tag,
//   uncatagorized,
//   user,
// ];

import { GraphQLFileLoader } from '@graphql-tools/graphql-file-loader';
import glob from 'glob';
import {
  addResolversToSchema,
  makeExecutableSchema,
} from '@graphql-tools/schema';

import {
  mergeTypeDefs,
  mergeResolvers,
  mergeSchemas,
} from '@graphql-tools/merge';

import path from 'path';
// const {
//   fileLoader,
//   mergeResolvers,
//   mergeTypes,
// } = require('merge-graphql-schemas');
import { graphqlHTTP } from 'express-graphql';
import { buildContext } from 'graphql-passport';
import { GraphQLSchema } from 'graphql';

// const allTypes = fileLoader(
//   path.join(path.resolve(), './graphql/api/**/*.graphql'),
// );
// const allResolvers = fileLoader(
//   path.join(path.resolve(), './graphql/api/**/*.js'),
// );

const allResolvers = [
  applicationResolver,
  boardResolver,
  cartitemResolver,
  commonResolver,
  fileResolver,
  filmResolver,
  formResolver,
  orderResolver,
  postResolver,
  productResolver,
  siteOptionResolver,
  sopakitResolver,
  tagResolver,
  uncatagorizedResolver,
  userResolver,
];

const graphqlPaths = glob.sync(path.resolve(__dirname, './api/*.graphql'));
console.log(graphqlPaths);
const typesSchema = loadSchemaSync(graphqlPaths, {
  loaders: [new GraphQLFileLoader()],
});


const schema : GraphQLSchema = addResolversToSchema(typesSchema, mergeResolvers(allResolvers));
// const schema = makeExecutableSchema({
//   // typeDefs: typedefs,
//   typeDefs: typedefs,
//   schemaDirectives: typedefs,
//   resolvers: mergeResolvers(allResolvers),
// });

const graphQLServerMiddleware = (req, res, next) => {
  graphqlHTTP({
    schema,
    // rootValue: root,
    graphiql: true,
    context: buildContext({ req, res }),
    customFormatErrorFn: (error) => ({
      message: error.message,
      locations: error.locations,
      stack: error.stack ? error.stack.split('\n') : [],
      path: error.path,
    }),
    // context: ({ req, res }) => buildContext({ req, res }),
  })(req, res);
  // .then((result) => {
  //   console.log("RESULT!");
  //   console.log(result);
  //   next();
  // })
  // .catch((err) => {
  //   console.log("error!");
  //   console.error(err);
  //   res.status(404).send(err);
  // });
};

export default {
  graphQLServerMiddleware,
  schema,
};
