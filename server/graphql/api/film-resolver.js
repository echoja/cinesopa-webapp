const {
  ACCESS_ALL,
  ACCESS_ADMIN,
  ACCESS_AUTH,
  ACCESS_UNAUTH,
  makeResolver,
  db,
} = require('../../loader');

// (id: Int!): Film
const filmResolver = makeResolver(async (obj, args, context, info) => {
  const { id } = args;
  return db.getFilm(id);
}).only(ACCESS_ALL);
/*
page: Int
perpage: Int
prod_gt: Int
prod_lt: Int
open_gt: Int
open_lt: Int
tags: [String]
search: String
*/
const films = makeResolver(async (obj, args, context, info) => {
  const {
    page, perpage, prod_gt, prod_lt, open_gt, open_lt, tags, search,
  } = args;
  return db.getFilms(page, perpage, prod_gt, prod_lt, open_gt, open_lt, tags, search);
}).only(ACCESS_ALL);
// createFilm(filminfo: Film): Film
const createFilm = makeResolver(async (obj, args, context, info) => {
  const { filminfo } = args;
  const film = await db.createFilm(filminfo);
  return film;
}).only(
  ACCESS_ADMIN,
);
// updateFilm(id: Int!, filminfo: Film): Film
const updateFilm = makeResolver(async (obj, args, context, info) => {}).only(
  ACCESS_ADMIN,
);
// removeFilm(id: Int!): Film
const removeFilm = makeResolver(async (obj, args, context, info) => {}).only(
  ACCESS_ADMIN,
);

module.exports = {
  Query: {
    film: filmResolver,
    films,
  },
  Mutation: {
    createFilm,
    updateFilm,
    removeFilm,
  },
};
