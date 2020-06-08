import express from 'express';
import http from 'http';
import https from 'https';
import graphqlHTTP from 'express-graphql';
import { schema, root } from './graphql/schema.js';
import { privateKey, certificate, passphrase } from './cert/ssl-config.js'
import logger from 'morgan';
//var { buildSchema } = require('graphql');
import redirect_https from 'redirect-https';


var app = express();




// configuring logger
app.use(logger('combined'));

// default responding
app.get('/', (req, res) => {
  res.send('abcd');
});

// graphiql settings
app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true,
}));

// configuring http to https
const redirector = redirect_https({
  body: "<!-- Hello Developer! Please use HTTPS instead: {{ URL }} -->"
});
// const unsecure_app = express();
// unsecure_app.use("/", redirector);

// http.createServer(unsecure_app).listen(80);
app.use("/", redirector);


// configuring https connection
const options = {
  key: privateKey,
  cert: certificate,
  // passphrase 
};

// MUST connect with https : https://localhost:4000/graphql
https.createServer(options, app).listen(443, () => console.log('Now browse to localhost:4000/graphql') );