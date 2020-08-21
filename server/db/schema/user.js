const { enumAuthmap } = require('./enum');

const role = enumAuthmap.raw_str_list.slice(0, -1);

module.exports = function (mongoose) {
  const userSchema = new mongoose.Schema({
    email: String,
    name: String,
    c_date: { type: Date, default: Date.now },
    role: {
      type: String,
      enum: role,
    },
    verified: { type: Boolean, default: false },
  });

  userSchema.methods.isCorrectPassword = async (pwd) => {
    if (pwd === undefined) return false;
    const login = await mongoose.model('Login').findOne({ email: this.email });
    return pwd === login?.pwd;
  };

  return userSchema;
};