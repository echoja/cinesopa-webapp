const { mongodbUrl } = require('../../config');
const mongoose = require('mongoose');

module.exports.dbServerInit = () => {
  const db = mongoose.connection;
  db.on('error', console.error);
  db.once('open', function(){
      // CONNECTED TO MONGODB SERVER
      console.log("Connected to mongo server !!");
  });

  mongoose.connect(mongodbUrl, { useNewUrlParser: true });
}


  
