import {
  ACCESS_ALL,
  ACCESS_ADMIN,
  ACCESS_AUTH,
  ACCESS_UNAUTH,
  makeResolver,
  db,
  payment,
  mail,
  templateArgsRefiner,
} from '@/loader';
import '@/typedef';
import crypto from 'crypto';

export const Query = {
  applicationAdmin: makeResolver(async (obj, args, context, info) => {
    const { id } = args;
    return db.getApplication(id);
  }).only(ACCESS_ADMIN),
  applicationsAdmin: makeResolver(async (obj, args, context, info) => {
    const { condition } = args;
    // 간단한 설정
    if (!condition.perpage) condition.perpage = 30;
    return db.getApplications(condition);
  }).only(ACCESS_ADMIN),
  applicationTaxReq: makeResolver(async (obj, args, context, info) => {
    const { token } = args;
    const { isValidTTL, token: tokenDoc } = await db.getToken(
      token,
      'taxinfo_request',
    );
    // 토큰이 없으면 에러
    if (!tokenDoc) return { success: false, code: 'no_token' };

    // 토큰의 TTL 이 다 되었으면 에러
    if (!isValidTTL) {
      await db.removeToken(token);
      return { success: false, code: 'token_expired' };
    }

    // 토큰에 appl_id 없다면 실패
    if (!tokenDoc.appl_id) {
      await db.removeToken(token);
      return { success: false, code: 'token_has_no_application_id' };
    }
    const doc = await db.getApplication(tokenDoc.appl_id);
    return { success: true, doc };
  }).only(ACCESS_ALL),
};

export const Mutation = {
  /** 제출 */
  submitApplication: makeResolver(async (obj, args, context, info) => {
    const { input } = args;
    return db.createApplication(input);
  }).only(ACCESS_ALL),

  /** 세금계산서 관련 정보 제출 */
  submitTaxInformation: makeResolver(async (obj, args, context, info) => {
    const { token, input } = args;
    const { isValidTTL, token: tokenDoc } = await db.getToken(
      token,
      'taxinfo_request',
    );

    // 토큰이 없으면 에러
    if (!tokenDoc) return { success: false, code: 'no_token' };

    // 토큰의 TTL 이 다 되었으면 에러
    if (!isValidTTL) {
      await db.removeToken(token);
      return { success: false, code: 'token_expired' };
    }

    // 토큰에 appl_id 없다면 실패
    if (!tokenDoc.appl_id) {
      await db.removeToken(token);
      return { success: false, code: 'token_has_no_application_id' };
    }

    return db.updateApplication(tokenDoc.appl_id, input);
  }).only(ACCESS_ALL),

  /** 관리자가 새로운 신청서를 만들고자 할 때 */
  createApplication: makeResolver(async (obj, args, context, info) => {
    const appl = await db.createApplication(args.input);
    if (!appl) return { success: false, code: 'doc_not_created' };

    return { success: true, application_id: appl.id };
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
    const { id } = args;
    const { email } = context.user;

    // 기존 토큰 삭제
    await db.clearToken({ email, purpose: 'taxinfo_request', appl_id: id });

    // 새로운 토큰 생성
    const token = crypto.randomBytes(20).toString('hex');
    await db.createToken({
      email,
      token,
      purpose: 'taxinfo_request',
      ttl: 60 * 60 * 24 * 10,
    });
    return { token, success: true };
  }).only(ACCESS_ADMIN),

  /** 세금계산서 링크 삭제 */
  removeTaxReqLink: makeResolver(async (obj, args, context, info) => {
    const { id } = args;
    // await db.removeTaxReqLink(id);
    return { success: true };
  }).only(ACCESS_ADMIN),

  /** 견적서 임시로 만들고 삭제하는 건 별도 router 에서 진행. */
  // createEstimate: makeResolver(async (obj, args, context, info) => {

  // }).only(ACCESS_ADMIN),
  // removeEstimate: makeResolver(async (obj, args, context, info) => {

  // }).only(ACCESS_ADMIN),
};

export default {
  Query,
  Mutation,
};
