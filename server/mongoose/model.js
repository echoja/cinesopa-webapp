const mongoose = require('mongoose');
const pageBuilder = require('./schema/page.js');
const userBuilder = require('./schema/user.js');
const loginBuilder = require('./schema/login.js');


module.exports = (function(){
  const URI = process.env.MONGO_URI || "localhost"; // your mongodb uri
  const DB = process.env.MONGO_DB || "cinesopa"; // your db

  const db = mongoose.connection;
  db.on('error', console.error);
  db.once('open', function(){
      // CONNECTED TO MONGODB SERVER
      console.log("Connected to mongod server");
  });

  mongoose.connect(`mongodb://${URI}/${DB}`, { useNewUrlParser: true });

  const schema = {};
  const model = {};

  schema.Page = pageBuilder(mongoose);
  schema.User = userBuilder(mongoose);
  schema.Login = loginBuilder(mongoose);

  // console.log(schema)
  for(let k in schema){
    model[k] = mongoose.model(k, schema[k]);
  }

  return model;
})();