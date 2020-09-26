import store from './store';
import router from './router';
import boardQuery from './api/query/board';
import postQuery from './api/query/post';
import fileQuery from './api/query/file';
import { graphql } from './api/graphql-client';

export const queryString = {
  board: boardQuery,
  post: postQuery,
  file: fileQuery,
};

export {
  store,
  router,
  graphql,
};
