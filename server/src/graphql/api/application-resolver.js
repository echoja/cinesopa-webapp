const Hangul = require('hangul-js');
const { model } = require('mongoose');
const {
  ACCESS_ALL,
  ACCESS_ADMIN,
  ACCESS_AUTH,
  ACCESS_UNAUTH,
  makeResolver,
  db,
  payment,
  mail,
  templateArgsRefiner,
} = require('../../loader');
require('../../typedef');

module.exports = {
  Query: {
    applicationAdmin: makeResolver(async (obj, args, context, info) => {
      const { id } = args;
      return db.getApplication(id);
    }).only(ACCESS_ADMIN),
    applicationsAdmin: makeResolver(async (obj, args, context, info) => {
      const { condition } = args;
      return db.getApplications(condition);
    }).only(ACCESS_ADMIN),
  },
  Mutation: {
    /** 제출 */
    submitApplication: makeResolver(async (obj, args, context, info) => {
      const { input } = args;
    }).only(ACCESS_ALL),

    /** 세금계산서 관련 정보 제출 */
    submitTaxInformation: makeResolver(async (obj, args, context, info) => {
      const { token, input } = args;
    }).only(ACCESS_ALL),

    /** 관리자가 새로운 신청서를 만들고자 할 때 */
    createApplication: makeResolver(async (obj, args, context, info) => {

    }).only(ACCESS_ADMIN),

    /** 신청서 삭제 */
    removeApplication: makeResolver(async (obj, args, context, info) => {
      const { id } = args;
      await db.removeApplication(id);  
      return { success: true };
    }).only(ACCESS_ADMIN),

    /** 신청서 업데이트 */
    updateApplication: makeResolver(async (obj, args, context, info) => {
      const { id, input } = args;
      await db.updateApplication(id, input);
      return { success: true };
    }).only(ACCESS_ADMIN),

    /** 새로운 세금계산서 링크 (기존에 링크는 삭제)  */
    updateNewTaxReqLink: makeResolver(async (obj, args, context, info) => {
      const { id, input } = args;
      await db.removeAndNewTaxReqToken(id, input);
      return { success: true };
    }).only(ACCESS_ADMIN),

    /** 세금계산서 링크 삭제 */
    removeTaxReqLink: makeResolver(async (obj, args, context, info) => {
      const { id } = args;
      await db.removeTaxReqLink(id);
      return { success: true };
    }).only(ACCESS_ADMIN),

    /** 견적서 임시로 만들고 삭제하는 건 별도 router 에서 진행.*/
    // createEstimate: makeResolver(async (obj, args, context, info) => {

    // }).only(ACCESS_ADMIN),
    // removeEstimate: makeResolver(async (obj, args, context, info) => {

    // }).only(ACCESS_ADMIN),

  },
};
