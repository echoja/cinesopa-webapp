const express = require('express');
const logger = require('morgan');
const session = require('express-session');
const passport = require('passport');
const uuidv4 = require('uuid').v4;
const helmet = require('helmet');
const { configureLocalAuth } = require('./loader');
const { dbServerInit } = require('./db/db-server');
const config = require('../config/common');
const { getRouter } = require('./router');
const sessionStore = require('./service/session-store');

// running mode check
console.log(`This server is running in ${process.env.NODE_ENV} mode. `);
console.log(`This server locates in ${__dirname}`);

// create express app
const webapp = express();

// security settings
webapp.use(
  helmet.contentSecurityPolicy({
    useDefaults: true,
    directives: {
      'default-src': ["'self'", '*.cinesopa.kr', '*.sopaseom.com'],
    },
  }),
);
webapp.use(helmet.referrerPolicy());
webapp.use(helmet.dnsPrefetchControl());
webapp.use(helmet.expectCt());
webapp.use(helmet.frameguard());
webapp.use(helmet.hidePoweredBy());
webapp.use(helmet.hsts());
webapp.use(helmet.ieNoOpen());
webapp.use(helmet.noSniff());
webapp.use(helmet.permittedCrossDomainPolicies());
webapp.use(helmet.xssFilter());

// initial mongoose
dbServerInit();

// session settings
webapp.use(
  session({
    genid: (req) => uuidv4(),
    secret: config.sessionSecret, // env secret required
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 24 * 14 },
    store: sessionStore, // store
  }),
);
configureLocalAuth();
webapp.use(passport.initialize()); // passport 구동
webapp.use(passport.session());

// configuring logger
webapp.use(logger('combined'));

// router
webapp.use('/', getRouter(webapp));

webapp.use('/cinesopa', express.static('dist/cinesopa'));
webapp.use('/sopaseom', express.static('dist/sopaseom'));

webapp.listen(4000, () => console.log('soapseom and cinesopa server started!'));
