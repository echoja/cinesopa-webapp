const Hangul = require('hangul-js');
const {
  ACCESS_ALL,
  ACCESS_ADMIN,
  ACCESS_AUTH,
  ACCESS_UNAUTH,
  makeResolver,
  db,
} = require('../../loader');

const postQuery = makeResolver(async (obj, args, context, info) => {
  const { id } = args;
  return db.getPost(id, 'public');
}).only(ACCESS_ALL);

const postsQuery = makeResolver(async (obj, args, context, info) => {
  const { condition } = args;
  const { page, perpage, date_gte, date_lte, search } = condition;

  return db.getPosts(
    {
      page,
      perpage,
      date_gte,
      date_lte,
      search,
    },
    'public',
  );
}).only(ACCESS_ALL);

const postAdmin = makeResolver(async (obj, args, context, info) => {
  const { id } = args;
  return db.getPost(id);
}).only(ACCESS_ADMIN);

const postsAdmin = makeResolver(async (obj, args, context, info) => {
  const { condition } = args;
  const { page, perpage, date_gte, date_lte, search } = condition;

  return db.getPosts({
    page,
    perpage,
    date_gte,
    date_lte,
    search,
  });
}).only(ACCESS_ADMIN);

const createPost = makeResolver(async (obj, args, context, info) => {
  const { input } = args;
  const { title, content, excerpt, status, board, c_date, meta } = input;

  return db.createPost({
    title,
    content,
    excerpt,
    status,
    board,
    c_date,
    meta,
  });
}).only(ACCESS_ADMIN);

const updatePost = makeResolver(async (obj, args, context, info) => {
  const { id, input } = args;
  const { title, content, excerpt, status, board, c_date, meta } = input;
  const refined_input = { title, content, excerpt, board, c_date, meta };
  if (status) refined_input.status = status;
  
  return db.updatePost(id, refined_input);
}).only(ACCESS_ADMIN);

const removePost = makeResolver(async (obj, args, context, info) => {
  const { id } = args;
  return db.removePost(id);
}).only(ACCESS_ADMIN);

module.exports = {
  Query: {
    post: postQuery,
    posts: postsQuery,
    postAdmin,
    postsAdmin,
  },
  Mutation: {
    createPost,
    updatePost,
    removePost,
  },
};
