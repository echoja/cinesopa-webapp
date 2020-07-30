const authmap = require('./authmap');
const role = authmap.slice(0, -1);

module.exports = function(mongoose){
  let userSchema = new mongoose.Schema({
    email: String,
    name: String,
    c_date: { type: Date, default: Date.now },
    role: {
      type:String,
      enum: role,
    }
  });

  userSchema.methods.isCorrectPassword = async (pwd) => {
    login = await mongoose.model('Login').findOne({email: this.email})
    return pwd === login.pwd
  }

  return userSchema;
};