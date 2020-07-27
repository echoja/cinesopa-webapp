const authmap = require('./authmap');
module.exports = function(mongoose){
  return new mongoose.Schema({
    encoding: String,
    mimetype: String,
    filename: String,
    description: String,
    label: String,
    alt: String,
    path: String,
    size: Number,
    auth: {
      type: String,
      enum: authmap
    },
  });
};