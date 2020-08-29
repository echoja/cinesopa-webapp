import store from './store';
import router from './router';
import boardQuery from './api/query/board';
import postQuery from './api/query/post';
import { graphql } from './api/graphql-client';

const queryString = {
  board: boardQuery,
  post: postQuery,
};

export { store, router, queryString, graphql };
