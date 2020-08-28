import store from './store';
import router from './router';
import boardQuery from './api/query/board';
import { graphql } from './api/graphql-client';

const queryString = {
  board: boardQuery,
};

export { store, router, queryString, graphql };
