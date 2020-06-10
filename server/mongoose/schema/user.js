export default function(mongoose){
  let userSchema = new mongoose.Schema({
    email: String,
    name: String,
    c_date: { type: Date, default: Date.now }
  });

  userSchema.methods.isCorrectPassword = async (pwd) => {
    login = await mongoose.model('Login').findOne({email: this.email})
    console.log(pwd)
    console.log(login.pwd)
    return pwd === login.pwd
  }

  return userSchema;
};