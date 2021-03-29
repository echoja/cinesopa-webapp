const Hangul = require('hangul-js');
const {
  ACCESS_ALL,
  ACCESS_ADMIN,
  ACCESS_AUTH,
  ACCESS_UNAUTH,
  makeResolver,
  db,
} = require('../../loader');
const { enumFilmAvailableSubtitle } = require('../../db/schema/enum');

// (id: Int!): Film
const filmResolver = makeResolver(async (obj, args, context, info) => {
  const { id } = args;
  return db.getFilm(id);
}).only(ACCESS_ALL);

const films = makeResolver(async (obj, args, context, info) => {
  let {
    page = null,
    perpage = null,
    prod_gte = null,
    prod_lte = null,
    open_gte = null,
    open_lte = null,
    tags = null,
    search = null,
    is_opened = null,
  } = args.condition;
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
    is_opened,
    'public',
  );
}).only(ACCESS_ALL);

const filmsAdmin = makeResolver(async (obj, args, context, info) => {
  let {
    page = null,
    perpage = null,
    prod_gte = null,
    prod_lte = null,
    open_gte = null,
    open_lte = null,
    tags = null,
    search = null,
    is_opened = null,
  } = args.condition;
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
    is_opened,
  );
}).only(ACCESS_ADMIN);

const filmsFeatured = makeResolver(async (obj, args, context, info) => {
  return db.getFeaturedFilms();
}).only(ACCESS_ALL);

const availableSubtitle = makeResolver(async (obj, args, context, info) => {
  return enumFilmAvailableSubtitle;
}).only(ACCESS_ALL);

// MUTATION
// createFilm(filminfo: Film): Film
const createFilm = makeResolver(async (obj, args, context, info) => {
  const { input } = args;
  // console.log(input);
  return db.createFilm(input);
}).only(ACCESS_ADMIN);
// updateFilm(id: Int!, filminfo: Film): Film
const updateFilm = makeResolver(async (obj, args, context, info) => {
  const { id, input } = args;
  await db.updateFilm(id, input);
  return db.getFilm(id);
}).only(ACCESS_ADMIN);
// removeFilm(id: Int!): Film
const removeFilm = makeResolver(async (obj, args, context, info) => {
  const { id } = args;
  return db.removeFilm(id);
}).only(ACCESS_ADMIN);

module.exports = {
  Query: {
    film: filmResolver,
    films,
    filmsAdmin,
    filmsFeatured,
    availableSubtitle,
  },
  Mutation: {
    createFilm,
    updateFilm,
    removeFilm,
  },
};
