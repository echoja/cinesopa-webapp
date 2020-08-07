const { makeEnum } = require("../../../util");

const enumAuthmap = makeEnum(["ADMIN", "GUEST", "ANYONE"]);
const enumPeopleRoleType = makeEnum(["director", "actor", "staff"]);
const enumMenuType = makeEnum([
  "link",
  "page",
  "board",
  "nouse",
  "post",
  "file",
]);
const enumOrderStatus = makeEnum([
  "order_received", // "주문접수",
  "payment_confirming", // "결제확인중",
  "payment_success", // "결제완료",
  "product_loading", // "상품준비중",
  "transport_preparing", // "배송준비중",
  "transporting", // "배송중",
  "transport_success", // "배송완료",
  "deal_success", // "거래완료",
  "returning", // "반송중",
  "order_cancelling", // "주문취소중",
  "order_cancelled", // "주문취소",
]);
const enumOrderMethod = makeEnum([
  "card",
  "phone",
  "bank",
  "vbank",
  "auth",
  "card_rebill",
  "easy",
]);
const enumProductType = makeEnum(["sopakit"]);
const enumTokenPurpose = makeEnum(["email_verification", "find_password"]);
const enumPageRole = makeEnum(["cinesopa", "sopaseom", "sopakit"]);
const enumPageBelongsTo = makeEnum(["cinesopa", "sopaseom"]);
const enumPostStatus = makeEnum(["public", "private"]);
module.exports = {
  enumAuthmap,
  enumPeopleRoleType,
  enumMenuType,
  enumOrderMethod,
  enumOrderStatus,
  enumTokenPurpose,
  enumProductType,
  enumPageBelongsTo,
  enumPageRole,
  enumPostStatus,
};