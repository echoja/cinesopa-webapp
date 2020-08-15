const { mongodbUrl } = require("../../config");
const mongoose = require("mongoose");
const autoIncrement = require("mongoose-auto-increment");

// 
const setAutoIncrement = (model, field) => {
  const schema = mongoose.model(model).schema;
  schema.plugin(autoIncrement.plugin, {
    model,
    field, // auto-increment할 field
    startAt: 0, // 0에서 부터
    increment: 1, // 1씩 증가
  });
};

module.exports.dbServerInit = () => {
  const db = mongoose.connection;
  db.on("error", console.error);
  db.once("open", function () {
    // CONNECTED TO MONGODB SERVER
    console.log("Connected to mongo server !!");
  });

  mongoose.connect(mongodbUrl, { useNewUrlParser: true });
  autoIncrement.initialize(mongoose.connection);
  setAutoIncrement("Order", "id");
  setAutoIncrement("Product", "id");
  setAutoIncrement("Film", "id");
  setAutoIncrement("Post", "id");
  
};
