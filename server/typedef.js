/*=====================================
데이터베이스
=====================================*/

/**
 * 유저 정보를 담는 객체
 * @typedef {Object} Userinfo
 * @property {string} email - 이메일
 * @property {string} pwd - 비밀번호
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
 * @property {String} pwd
 * @property {String} salt
 */

/**
 * 파일 정보를 담는 객체
 * @typedef {object} Fileinfo
 * @property {string} filename 실제 저장되는 파일 이름 (multer에 의해 생성)
 * @property {string} encoding
 * @property {string} mimetype 
 * @property {string} description 설명
 * @property {string} label 보여지는 이름
 * @property {string} alt
 * @property {string} path
 * @property {string} size
 * @property {import("mongoose/lib/types/objectid")} owner
 * @property {boolean} public 외부 링크로 접근할 수 있는가의 여부.
 * @property {boolean} managed 파일이 파일 매니저에서 관리되는지 아닌지의 여부.
 */

 /**
 * 토큰 정보를 담는 객체
 * @typedef {object} Tokeninfo
 * @property {string} email 
 * @property {string} token
 * @property {number} ttl 유효 시간 (초)
 * @property {Date} c_date 
 * @property {string} purpose 
 */

/*=====================================
api
=====================================*/

/**
 * resolver의 기본 형태
 *
 * @callback Resolver
 * @param {object} obj
 * @param {object} args
 * @param {object} context
 * @param {object} info
 */

/**
 * passport 에서 deserializeUser에 쓰이는 함수
 *
 * @callback UserFinder
 * @param {string} email
 * @return {Promise<Userinfo>} 유저 정보
 */

/**
 * passport 에서 GraphQLLocalStrategy 에 쓰이는 함수
 * @callback UserGetterByAuth
 * @param {string} email
 * @param {string} pwd
 * @return {Promise<Userinfo>} 유저 정보
 */

// /**
//  * @typedef {UserGetterByAuth} UserGetterByAuth
//  */

/**
 * @typedef {import("./graphql/validator").AuthValidator} AuthValidator
 */

/**
 * @typedef {import("./manager/db").DBManager} DBManager
 */
// /**
//  * @typedef {Express.Re}
//  */

/** @typedef {import("graphql-passport/lib/types").PassportContext<Userinfo,{},{},Express.Request>} PassportContext */
