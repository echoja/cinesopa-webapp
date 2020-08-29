/*= ====================================
데이터베이스
===================================== */

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
 * @property {number} id - 자동 증가 id
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
 * @property {string} origin 본래 파일 이름
 * @property {string} encoding
 * @property {string} mimetype
 * @property {string} description 설명
 * @property {string} label 외부로 보여지는 이름
 * @property {string} alt 외부로 보여지는 설명
 * @property {string} path 전체 경로
 * @property {number} size 사이즈(바이트)
 * @property {import("mongoose/lib/types/objectid")} owner
 * @property {boolean} public 외부 링크로 접근할 수 있는가의 여부.
 * @property {boolean} managed 파일이 파일 매니저에서 관리되는지 아닌지의 여부.
 * @property {number} id
 */

/**
 * 영화의 사람 정보를 담는 객체
 * @typedef {object} Personinfo
 * @property {string} role_type
 * @property {string} name
 * @property {string} name_en
 * @property {string} role
 */

/**
 * 영화의 회사 정보를 담는 객체
 * @typedef {object} Companyinfo
 * @property {string} name
 * @property {string} name_en
 * @property {string} role
 */

/**
 * 영화의 리뷰 정보를 담는 객체
 * @typedef {object} Reviewinfo
 * @property {string} title
 * @property {string} url
 * @property {string} source
 * @property {string} author
 */

/**
 * 영화의 영상 정보를 담는 객체 (유튜브 연결)
 * @typedef {object} Videoinfo
 * @property {string} youtube_id
 * @property {string} title
 */

/**
 * 영화 정보를 담는 객체
 * @typedef {object} Filminfo
 * @property {string} title
 * @property {string} title_en
 * @property {string} kobis_code
 * @property {string[]} genres
 * @property {number} show_time
 * @property {string} type_name
 * @property {Date} prod_date
 * @property {Date} open_date
 * @property {Personinfo[]} people
 * @property {Companyinfo[]} companies
 * @property {string} watch_grade
 * @property {string} reviews
 * @property {number} star_naver
 * @property {number} star_daum
 * @property {number} star_cine21
 * @property {import("mongoose/lib/types/objectid")} poster File
 * @property {import("mongoose/lib/types/objectid")[]} photos File
 * @property {number} id
 * @property {Videoinfo[]} videos
 * @property {string} synopsis
 * @property {string} note
 * @property {string[]} tags
 * @property {object} meta
 * @property {string} search
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

/**
 * 게시판 정보를 담는 객체
 * @typedef {object} Boardinfo
 * @property {number} id
 * @property {string} title
 * @property {string} description
 * @property {string} permalink
 * @property {string} belongs_to
 * @property {string} board_type
 * @property {object} meta
 */

 /**
 * 게시판 검색 객체
 * @typedef {object} BoardSearch
 * @property {number} id
 * @property {string} permalink
 * @property {string} belongs_to
 */

/**
 * 게시물 정보를 담는 객체
 * @typedef {object} Postinfo
 * @property {number} id
 * @property {string} title
 * @property {string} content
 * @property {string} excerpt
 * @property {string} permalink
 * @property {string} status ['public', 'private']
 * @property {import("mongoose/lib/types/objectid")} board 게시판에 대한 ObjectId
 * @property {import("mongoose/lib/types/objectid")} featured_image 이미지에 대한 ObjectId
 * @property {Date} c_date
 * @property {Date} m_date
 * @property {string} search
 * @property {object} meta
 */

/**
 * 게시물 검색 정보를 담는 객체
 * @typedef {object} PostSearch
 * @property {number} page 0이 1페이지임.
 * @property {number} perpage
 * @property {Date} date_gte
 * @property {Date} date_lte
 * @property {string} search
 * @property {string} board_permalink
 * @property {string} board_belongs_to
 */

/*= ====================================
api
===================================== */

/**
 * resolver의 기본 형태
 *
 * @callback Resolver
 * @param {object} obj
 * @param {object} args
 * @param {PassportContext} context
 * @param {object} info
 * @returns {Promise<any>}
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

/** @typedef {import("./auth/validator").AuthValidator} AuthValidator */

/** @typedef {import("./manager/db").DBManager} DBManager */

/** @typedef {import("./manager/file")} FileManager */

/** @typedef {import('./manager/mail').MailManager} MailManager */

// eslint-disable-next-line
/** @typedef {Object.<string, import('mongoose').Model<import('mongoose').MongooseDocument, {}>>} ModelWrapper */

// eslint-disable-next-line
/** @typedef {import("graphql-passport/lib/types").PassportContext<Userinfo,{},{},Express.Request>} PassportContext */
