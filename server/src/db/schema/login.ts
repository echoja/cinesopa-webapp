export default function(mongoose){
  return new mongoose.Schema({
    email: String,
    pwd: String,
    salt: String,
  });
};