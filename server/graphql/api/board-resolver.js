const Hangul = require('hangul-js');
const {
  ACCESS_ALL,
  ACCESS_ADMIN,
  ACCESS_AUTH,
  ACCESS_UNAUTH,
  makeResolver,
  db,
} = require('../../loader');

const boardResolver = makeResolver(async (obj, args, context, info) => {
  const { condition } = args;
  const { id, permalink, belongs_to } = condition;

  if (id) {
    return db.getBoardById(id);
  }
  if (permalink && belongs_to) {
    return db.getBoardByPermalink(belongs_to, permalink);
  }
  return null;
}).only(ACCESS_ALL);

const boardsResolver = makeResolver(async (obj, args, context, info) => {
  const { belongs_to } = args;
  let result;
  if (belongs_to) {
    result = await db.getBoardsAssigned(belongs_to);
  } else {
    result = await db.getBoards();
  }
  // console.log(result);
  // console.log(result[0]._id);
  // result = result.map((value) => {
  //   const o = { ...value };
  //   o.id = value._id;
  //   console.log(value._id);
  //   return o;
  // });
  // result.id = result._id;
  return result;
}).only(ACCESS_ADMIN);

const createBoard = makeResolver(async (obj, args, context, info) => {
  const { input } = args;
  const { title, description, permalink, belongs_to, board_type, meta } = input;
  return db.createBoard({
    title,
    description,
    permalink,
    belongs_to,
    board_type,
    meta,
  });
}).only(ACCESS_ADMIN);

// getArgrs

const updateBoard = makeResolver(async (obj, args, context, info) => {
  const { id, input } = args;
  // const { title, description, permalink, belongs_to, board_type, meta } = input;
  return db.updateBoard(id, input);
}).only(ACCESS_ADMIN);

const removeBoard = makeResolver(async (obj, args, context, info) => {
  const { id } = args;
  return db.removeBoard(id);
}).only(ACCESS_ADMIN);

module.exports = {
  Query: {
    board: boardResolver,
    boards: boardsResolver,
  },
  Mutation: {
    createBoard,
    updateBoard,
    removeBoard,
  },
};
