export default function(mongoose){
  let userSchema = new mongoose.Schema({
    email: String,
    name: String,
    c_date: { type: Date, default: Date.now },
    role: {
      type:String,
      enum: ['ADMIN', 'GUEST'],
    }
  });

  userSchema.methods.isCorrectPassword = async (pwd) => {
    login = await mongoose.model('Login').findOne({email: this.email})
    return pwd === login.pwd
  }

  return userSchema;
};