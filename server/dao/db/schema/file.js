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
    owner: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    public: Boolean,
    // auth: {
    //   type: String,
    //   enum: authmap
    // },
  });
};