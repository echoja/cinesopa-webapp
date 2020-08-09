/*=====================================
데이터베이스
=====================================*/

/**
 * 유저 정보를 담는 객체
 * @typedef {Object} Userinfo
 * @property {string} email - 이메일
 * @property {string} name - 이름
 * @property {Date} c_date - 생성일
 * @property {string} role - 역할
 * @property {boolean} verified - 이메일이 인증되었는지 여부
 */

/**
 * 페이지 정보를 담는 객체
 * @typedef {Object} Pageinfo
 * @property {string} title - 제목
 * @property {string} content - 내용(html)
 * @property {string} permalink - 주소
 * @property {Date} c_date - 생성일
 * @property {Date} m_date - 수정일
 * @property {string} role - 페이지의 역할
 * @property {string} belongs_to - cinesopa.kr, sopaseom.com 중 어느 곳에 속하는지
 * @property {Object} meta - 기타 정보
 */

/**
 * 로그인 정보를 담는 객체
 * @typedef {Object} Logininfo
 * @property {string} email 이메일
 * @property {string} pwd 비밀번호
 * @property {string} salt scrypt 용 salt
 */

/**
 * 암호화된 비밀번호 객체
 *
 * @typedef {Object} Encrypted
 * @property {String} result
 * @property {String} salt
 */

/*=====================================
api
=====================================*/

/**
 * resolver의 기본 형태
 *
 * @typedef {function} Resolver
 * @callback Resolver
 * @param {object} obj
 * @param {object} args
 * @param {object} context
 * @param {object} info
 */

/**
 * @typedef {import("./graphql/validator").AuthValidator} AuthValidator
 */

/**
 * @typedef {import("./dao/db-manager").DBManager} DBManager
 */

 /** @typedef {import("graphql-passport/lib/types").PassportContext} PassportContext */