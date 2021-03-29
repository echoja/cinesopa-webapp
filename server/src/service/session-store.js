const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const config = require('../../config/common');

const sessionStore = new MongoStore({
  url: config.mongodbUrl, // env required
  collection: 'sessions',
});

module.exports = sessionStore;
