const mongoose = require('mongoose');
const schemaBuilder = {};
schemaBuilder.Page = require('./schema/page.js');
schemaBuilder.User = require('./schema/user.js');
schemaBuilder.Login = require('./schema/login.js');
schemaBuilder.File = require('./schema/file.js');
schemaBuilder.Board = require('./schema/board.js');
schemaBuilder.Film = require('./schema/film.js');
schemaBuilder.Menu = require('./schema/menu.js');
schemaBuilder.Order = require('./schema/order.js');
schemaBuilder.Post = require('./schema/post.js');
schemaBuilder.Product = require('./schema/product.js');



module.exports = (function(){
  // const URI = process.env.MONGO_URI || "localhost"; // your mongodb uri
  // const DB = process.env.MONGO_DB || "cinesopa"; // your db

  // const db = mongoose.connection;
  // db.on('error', console.error);
  // db.once('open', function(){
  //     // CONNECTED TO MONGODB SERVER
  //     console.log("Connected to mongod server");
  // });

  // mongoose.connect(`mongodb://${URI}/${DB}`, { useNewUrlParser: true });

  const schema = {};
  const model = {};
  for (let key in schemaBuilder) {
    schema[key] = schemaBuilder[key](mongoose);
    model[key] = mongoose.model(key, schema[key]);
  }

  // schema.Page = pageBuilder(mongoose);
  // schema.User = userBuilder(mongoose);
  // schema.Login = loginBuilder(mongoose);
  // schema.File = fileBuilder(mongoose);

  // // console.log(schema)
  // for(let k in schema){
  //   model[k] = mongoose.model(k, schema[k]);
  // }

  return model;
})();