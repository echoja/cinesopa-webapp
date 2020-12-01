const { enumAuthmap, enumOrderMethod, enumOrderStatus } = require('./enum');
const makeDestinfo = require('./destinfo');

const role = enumAuthmap.raw_str_list.slice(0, -1);

module.exports = function (mongoose) {
  const Destinfo = makeDestinfo(mongoose);
  const UserAgreed = new mongoose.Schema({
    privacy: Boolean,
    policy: Boolean,
    advertisement: Boolean,
  });

  const User = new mongoose.Schema({
    email: String,
    has_pwd: Boolean,
    default_dest: Destinfo,
    c_date: { type: Date, default: Date.now },
    wrong_pwd_count: { type: Number, default: 0 },
    blocked_date: { type: Date },
    blocked_count: { type: Number, default: 0 },
    role: {
      type: String,
      enum: role,
    },
    kakao_access_token: String,
    kakao_refresh_token: String,
    kakao_id: String,
    verified: { type: Boolean, default: false },
    user_agreed: UserAgreed,
  });

  User.methods.isCorrectPassword = async (pwd) => {
    if (pwd === undefined) return false;
    const login = await mongoose.model('Login').findOne({ email: this.email });
    return pwd === login?.pwd;
  };

  User.index({ email: 1 });

  return User;
};
