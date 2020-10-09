const Hangul = require('hangul-js');
const {
  ACCESS_ALL,
  ACCESS_ADMIN,
  ACCESS_AUTH,
  ACCESS_UNAUTH,
  makeResolver,
  db,
  file,
  uploadBaseUrl,
} = require('../../loader');

const addFeaturedImageLink = async (obj) => {
  const result = { ...obj };
  if (result.featured_image) {
    const fileFound = await db.getFileById(result.featured_image);
    if (fileFound) {
      result.featured_image_link = `${uploadBaseUrl}${fileFound.filename}`;
    }
  }
  return result;
};

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
    board_permalinks,
    board_belongs_to,
  } = condition;

  let { search } = condition;
  // console.log(condition);
  search = search ? Hangul.disassembleToString(search) : null;
  const posts = await db.getPosts(
    {
      page,
      perpage,
      date_gte,
      date_lte,
      search,
      board_permalinks,
      board_belongs_to,
    },
    'public',
  );

  // 파일 링크 및 설명을 심어줌.
  const jobs = [];
  posts.posts.forEach((post, index) => {
    if (post.featured_image) {
      jobs.push(
        (async () => {
          const fileFound = await db.getFileById(post.featured_image);
          posts.posts[index].featured_image_link = uploadBaseUrl + fileFound.filename;
          posts.posts[index].featured_image_alt = fileFound.alt;
        })(),
      );
    }
  });
  await Promise.allSettled(jobs);
  return posts;
}).only(ACCESS_ALL);

const postAdmin = makeResolver(async (obj, args, context, info) => {
  const { id } = args;
  const post = await db.getPost(id);
  return addFeaturedImageLink(post);
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

const postsCount = makeResolver(async (obj, args, context, info) => {
  const { condition } = args;

  // const refined_input = db.importPostInput(input);
  // // const { title, content, excerpt, status, board, c_date, meta } = input;
  // const post = await db.createPost(refined_input);
  // return db.exportPost(post);
  const count = await db.getPostsCount(condition);
  return count;
}).only(ACCESS_ALL);

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
  // const { title, content, excerpt, status, board, c_date, meta, featured_image } = input;
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
    postsCount,
  },
  Mutation: {
    createPost,
    updatePost,
    removePost,
  },
};
