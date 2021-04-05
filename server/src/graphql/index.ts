import { loadTypedefsSync, loadSchemaSync } from '@graphql-tools/load';

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
import { graphqlHTTP } from 'express-graphql';
import { buildContext } from 'graphql-passport';
import { GraphQLSchema } from 'graphql';

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
import { Handler } from 'express';

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
// console.log(graphqlPaths);
const typesSchema = loadSchemaSync(graphqlPaths, {
  loaders: [new GraphQLFileLoader()],
});


const schema : GraphQLSchema = addResolversToSchema(typesSchema, mergeResolvers(allResolvers));

const graphQLServerMiddleware: Handler = (req, res, next) => {
  const isDevelopment: boolean = process.env.NODE_ENV === 'development';
  graphqlHTTP({
    schema,
    // rootValue: root,
    graphiql: isDevelopment,
    context: buildContext({ req, res }),
    customFormatErrorFn: (error) => ({
      message: error.message,
      locations: error.locations,
      stack: isDevelopment && error.stack ? error.stack.split('\n') : [],
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
