const { mongodbUrl } = require("../config");
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

/**
 * db 서버를 초기화합니다.
 * mongoose.connection 에 실제 몽고db 서버를 연결시킵니다.
 * 그리고 autoIncrement 플러그인 설정을 합니다.
 */
module.exports.dbServerInit = () => {
  const db = mongoose.connection;
  db.on("error", console.error);
  db.once("open", function () {
    // CONNECTED TO MONGODB SERVER
    console.log("Connected to mongo server !!");
  });

  mongoose.connect(mongodbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  });
  autoIncrement.initialize(mongoose.connection);
  setAutoIncrement("Order", "id");
  setAutoIncrement("Product", "id");
  setAutoIncrement("Film", "id");
  setAutoIncrement("Post", "id");
  setAutoIncrement("Page", "id");
};
