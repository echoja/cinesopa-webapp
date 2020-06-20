module.exports = function(mongoose){
  return new mongoose.Schema({
    email: String,
    pwd: String,
  });
};