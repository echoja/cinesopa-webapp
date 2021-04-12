const MongoStore = require('connect-mongo');
const config = require('../../config/common');


const sessionStore = MongoStore.create({
  mongoUrl: config.mongodbUrl,
  collectionName: 'sessions',
});

module.exports = sessionStore;
