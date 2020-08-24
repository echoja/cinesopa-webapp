const Hangul = require('hangul-js');
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
  let {
    page,
    perpage,
    prod_gte,
    prod_lte,
    open_gte,
    open_lte,
    tags,
    search,
  } = args;
  prod_gte = prod_gte ? new Date(prod_gte) : null;
  prod_lte = prod_lte ? new Date(prod_lte) : null;
  open_gte = open_gte ? new Date(open_gte) : null;
  open_lte = open_lte ? new Date(open_lte) : null;
  search = search ? Hangul.disassembleToString(search) : null;

  return db.getFilms(
    page,
    perpage,
    {
      prod_gte,
      prod_lte,
      open_gte,
      open_lte,
    },
    tags,
    search,
  );
}).only(ACCESS_ALL);
// createFilm(filminfo: Film): Film
const createFilm = makeResolver(async (obj, args, context, info) => {
  const { input } = args;
  console.log(input);
  return null;
  const film = await db.createFilm(filminfo);
  return film;
}).only(ACCESS_ADMIN);
// updateFilm(id: Int!, filminfo: Film): Film
const updateFilm = makeResolver(async (obj, args, context, info) => {
}).only(
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
