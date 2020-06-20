module.exports = function(mongoose){
  return new mongoose.Schema({
    encoding: String,
    mimetype: String,
    filename: String,
    label: String,
    alt: String,
    path: String,
    size: Number,
  });
};