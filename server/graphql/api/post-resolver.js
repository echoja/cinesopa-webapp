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
  const {
    page,
    perpage,
    date_gte,
    date_lte,
    board_permalink,
    board_belongs_to,
  } = condition;

  let { search } = condition;
  search = search ? Hangul.disassembleToString(search) : null;

  return db.getPosts(
    {
      page,
      perpage,
      date_gte,
      date_lte,
      search,
      board_permalink,
      board_belongs_to,
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
  const { page, perpage, date_gte, date_lte } = condition;
  let { search } = condition;

  search = search ? Hangul.disassembleToString(search) : null;

  return db.getPosts({
    page,
    perpage,
    date_gte,
    date_lte,
    search,
  });
}).only(ACCESS_ADMIN);

const objWithoutNull = (obj) => {
  const keys = Object.keys(obj);
  const result = {};
  keys.forEach((key) => {
    if (obj[key]) result[key] = obj[key];
  });
  return result;
};

const createPost = makeResolver(async (obj, args, context, info) => {
  const { input } = args;

  // const refined_input = db.importPostInput(input);
  // // const { title, content, excerpt, status, board, c_date, meta } = input;
  // const post = await db.createPost(refined_input);
  // return db.exportPost(post);
  const refined_input = objWithoutNull(input);
  return db.createPost(refined_input);
}).only(ACCESS_ADMIN);

// const test = {
//   a: 123,
//   b: null,
//   c: undefined,
// };
// console.log(
//   `objWithoutNull ==> ${JSON.stringify(objWithoutNull(test))}`,
// );

const updatePost = makeResolver(async (obj, args, context, info) => {
  const { id, input } = args;
  const { title, content, excerpt, status, board, c_date, meta } = input;
  const refined_input = objWithoutNull(input);

  // if (status) refined_input.status = status;

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
