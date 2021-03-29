import { CustomPassportContext, AuthType, AuthTypes, Resolver } from "@/typedef"; 
let _default_access: AuthType;

/**
 * 권한을 가진 resolver 를 만듭니다.
 * @param func
 */
const makeResolver = (func: Resolver) => ({
  /**
     * only 함수를 호출해야 최종 함수가 완성됩니다.
     * @param {AuthTypes} access
     * @returns {Resolver}
     */
  only(access: AuthTypes) {
    return async (obj, args, context: CustomPassportContext, info) => {
      // 권한 체크...
      let currentRole: AuthType;
      if (context.isUnauthenticated()) {
        currentRole = _default_access;
      } else {
        currentRole = (await context.getUser()).role;
      }

      if (access.includes(currentRole)) {
        return func(obj, args, context, info);
      }
      throw Error('resolver: 권한이 없습니다');
    };
  },
});

export default {
  /**
   * makeResolver 함수를 만듭니다.
   * @param {AuthType} default_access 로그인하지 않은 사람이 가지는 기본 권한
   */
  init(default_access: AuthType) {
    _default_access = default_access;
    return makeResolver;
  },
};
