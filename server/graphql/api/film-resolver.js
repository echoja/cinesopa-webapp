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

const films = makeResolver(async (obj, args, context, info) => {
  const {
    page, perpage, prod_gte, prod_lte, open_gte, open_lte, tags, search,
  } = args;
  return db.getFilms(page, perpage, prod_gte, prod_lte, open_gte, open_lte, tags, search);
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
