export default function(mongoose){
  return new mongoose.Schema({
    email: String,
    name: String,
    c_date: { type: Date, default: Date.now }
  });
};