const mongoose = require('mongoose');
import { mongodbUrl } from '../../config/common';

/**
 *
 * @param {*} autoIncrement
 * @param {*} model
 * @param {*} field
 */
// const setAutoIncrement = (autoIncrement, model, field) => {
//   // console.log(autoIncrement);
//   const { schema } = mongoose.model(model);
//   // console.log(schema.paths);
//   schema.plugin(autoIncrement, { inc_field: field });
// };

/**
 * db 서버를 초기화합니다.
 * mongoose.connection 에 실제 몽고db 서버를 연결시킵니다.
 * 그리고 autoIncrement 플러그인 설정을 합니다.
 */
export function dbServerInit() {
  const db = mongoose.connection;
  db.on('error', console.error);
  db.once('open', function () {
    // CONNECTED TO MONGODB SERVER
    console.log('Connected to mongo server !!');
  });

  mongoose.connect(mongodbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  });
  // const autoIncrement = AutoIncrementFactory(mongoose.connection);
  // setAutoIncrement(autoIncrement, 'Order', 'id');
  // setAutoIncrement(autoIncrement, 'Product', 'id');
  // setAutoIncrement(autoIncrement, 'Film', 'id');
  // setAutoIncrement(autoIncrement, 'Post', 'id');
  // setAutoIncrement(autoIncrement, 'Page', 'id');
}
// setAutoIncrement,
