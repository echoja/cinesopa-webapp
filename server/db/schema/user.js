const { enumAuthmap, enumOrderMethod, enumOrderStatus } = require('./enum');
const makeCartItem = require('./cartitem');
const makeDestinfo = require('./destinfo');

const role = enumAuthmap.raw_str_list.slice(0, -1);

module.exports = function (mongoose) {
  const CartItem = makeCartItem(mongoose);
  const Destinfo = makeDestinfo(mongoose);

  const Order = new mongoose.Schema({
    status: { type: String, enum: enumOrderStatus.raw_str_list },
    method: { type: String, enum: enumOrderMethod.raw_str_list },
    c_date: { type: Date, default: Date.now },
    expected_date: Date, // 도착 예정일
    cash_receipt: String, // 현금영수증 번호
    transport_number: String, // 송장 번호
    transport_company: String, // 택배 회사
    meta: mongoose.Schema.Types.Mixed,
    items: [CartItem],
    dest: Destinfo,
  });

  const User = new mongoose.Schema({
    email: String,
    default_dest: Destinfo,
    c_date: { type: Date, default: Date.now },
    wrong_pwd_count: { type: Number, default: 0 },
    blocked_date: { type: Date },
    blocked_count: { type: Number, default: 0 },
    role: {
      type: String,
      enum: role,
    },
    orders: [Order],
    kakao_access_token: String,
    kakao_refresh_token: String,
    kakao_id: String,
    verified: { type: Boolean, default: false },
  });

  User.methods.isCorrectPassword = async (pwd) => {
    if (pwd === undefined) return false;
    const login = await mongoose.model('Login').findOne({ email: this.email });
    return pwd === login?.pwd;
  };

  User.index({ email: 1 });

  return User;
};
