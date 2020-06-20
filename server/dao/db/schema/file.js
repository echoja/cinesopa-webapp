const authmap = require('./authmap');
module.exports = function(mongoose){
  return new mongoose.Schema({
    encoding: String,
    mimetype: String,
    filename: String,
    label: String,
    alt: String,
    path: String,
    size: Number,
    auth: {
      type: String,
      enum: ['ADMIN', 'GUEST', 'ANYONE']
    },
  });
};