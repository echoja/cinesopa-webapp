import axios from 'axios';
import store from '../store';
// import { baseUrl } from '../constants';

const headers = {
  'Content-Type': 'application/json',
  Accept: 'application/json',
};

// URL 수정 주의!! url이 같지 않으면 사용자 쿠키가 저장이 안되어 세션이 살아남지 못함!
const url = process.env.NODE_ENV === 'production' ? 'https://sopaseom.com/graphql/' : '/graphql';

export const graphql = async (query, variables) => {
  try {
    const received = await axios.post(
      url,
      JSON.stringify({
        query,
        variables,
      }),
      {
        headers,
        credentials: true,
      },
    );

    const { data } = received;
    store.commit('setErrorMsg', { message: '' });
    if (data) return data;
    return received;
  } catch (error) {
    store.commit('setErrorMsg', { message: error.response.data.errors });
    error.response.data.errors.forEach((value) => {
      console.error(value);
    });
    throw error.response.data;
  }
};

export const dataGraphql = async (query, variables) => {
  const res = await graphql(query, variables);
  return res?.data;
};

export const currentUserQuery = `
query currentUserQuery {
  currentUser {
    email c_date role verified kakao_id has_pwd
    user_agreed {
      policy privacy advertisement
    }
    default_dest {
      name address address_detail phone request
    }
  }
}
`;

export const checkAuthQuery = `
query checkAuthQuery($redirectLink: String!, $role: Permission!, $should_verified: Boolean) {
  checkAuth(redirectLink: $redirectLink, role: $role, should_verified: $should_verified) {
    permissionStatus
    emailVerificationRequired
    user {
      email
      c_date
      role
      verified
    }
  }
}
`;

/** @deprecated */
export const loginQuery = `
mutation Login ($email: String!, $pwd: String!) {
  login(provider: {email:$email, pwd: $pwd}) {
    user {
      email
      name
      role
      c_date
      verified
    }
    redirectLink
  }
}
`;

// const createGuestMutation = `
// mutation createGuest($email: String!, $pwd: String!) {
//   createGuest (email: $email, pwd: $pwd) {
//     id
//     email
//     name
//     role
//     c_date
//     verified
//   }
// }
// `;
// export const createGuest = async (variables) => graphql(createGuestMutation, variables);

export const emailVerifyMutation = `
mutation emailVerify($token: String!)
{
  verifyUserEmail(token: $token)
  {
    id
    email
    name
    c_date
    role
  }
}`;

export const logoutQuery = `
`;

export const logoutMeQuery = `
mutation LogoutMe {
  logoutMe {
    email
    c_date
    role
    verified
  }
}
`;

export const getPageQuery = `
query getPage($permalink: String!, $belongs_to: String!) {
  page(permalink: $permalink, belongs_to: $belongs_to) {
    title
    content
    permalink
    c_date 
    m_date 
    role
    belongs_to
    meta_json
  }
}
`;

export const getPagesQuery = `
query getPages($belongs_to: String!, $page: Int, $perpage: Int) {
  pages(belongs_to: $belongs_to, page: $page, perpage: $perpage) {
    id
    title
    content
    permalink
    c_date 
    m_date 
    role
    belongs_to
    meta_json
  }
}
`;

export const getPageByIdQuery = `
query getPageById($id: Int!) {
  pageById(id: $id) {
    id
    title
    content
    permalink
    c_date 
    m_date 
    role
    belongs_to
    meta_json
  }
}
`;
export const createPageMutation = `
mutation createPage($permalink: String!, $belongs_to: String!, $pageinfo: PageInput!) {
  createPage(permalink: $permalink, belongs_to: $belongs_to, pageinfo: $pageinfo) {
    id
    title
    content
    permalink
    c_date 
    m_date 
    role
    belongs_to
    meta_json
  }
}
`;

export const updatePageMutation = `
mutation updatePage($permalink: String!, $belongs_to: String!, $pageinfo: PageInput!) {
  updatePage(permalink: $permalink, belongs_to: $belongs_to, pageinfo: $pageinfo) {
    id
    title
    content
    permalink
    c_date 
    m_date 
    role
    belongs_to
    meta_json
  }
}
`;

export const removePageMutation = `
mutation removePage($permalink: String!, $belongs_to: String!) {
  removePage(permalink: $permalink, belongs_to: $belongs_to) {
    id
    title
    content
    permalink
    c_date 
    m_date 
    role
    belongs_to
    meta_json
  }
}
`;

// export const singleUploadQuery = `
//   mutation singleUpload($file: Upload!) {
//     singleUpload(file: $file) {
//       filename
//     }
//   }

// `;

const filmResponse = `{
  title
  title_en 
  kobis_code 
  genres 
  show_time
  type_name 
  prod_date
  open_date
  people {
    role_type
    name
    name_en
    role
  }
  companies {
    name
    name_en
    role
  }
  watch_grade 
  reviews {
    title
    url
    source
    author
  }
  star_naver
  star_daum
  star_cine21
  poster
  poster_url
  poster_alt
  photos {
    mongo_file_id
    filename
    preview_url
    alt
    title
  }
  id
  videos {
    is_main_trailer
    youtube_iframe
    title
  }
  awards {
    festival_name
    year
    person_name
    award_name
    award_type
  }
  note 
  tags 
  is_featured
  is_opened
  featured_steel
  featured_color
  featured_synopsis
  badge_text
  badge_color
  available_subtitles
  status
  synopsis 
  meta 
}
`;

export const filmQuery = `
query filmQuery($id: Int!) {
  film(id: $id) ${filmResponse}
}`;
export const filmsQuery = `
query getFilms($condition: FilmSearch!) {
  films(condition: $condition) {
    total
    list ${filmResponse}
  }
}`;

export const filmsAdminQuery = `
query getFilmsAdmin($condition: FilmSearch!) {
  filmsAdmin(condition: $condition) {
    total
    list ${filmResponse}
  }
}`;

export const createFilmMutation = `
mutation createFilm($input: FilmInput!) {
  createFilm(input: $input) ${filmResponse}
}
`;
export const updateFilmMutation = `
mutation updateFilm($id: Int!, $input: FilmInput!) {
  updateFilm(id: $id, input: $input) ${filmResponse}
}
`;
export const removeFilmMutation = `
mutation removeFilm($id: Int!) {
  removeFilm(id: $id) ${filmResponse}
}
`;

export const siteOptionsQuery = `
query siteOptionsQuery($names: [String!]!) {
  siteOptions(names: $names) {
    name
    value
    success
    code
  }
}
`;

export const setSiteOptionsMutation = `
mutation setSiteOptionsMutation($inputs: [SetSiteOptionInput!]!) {
  setSiteOptions(inputs: $inputs) {
    name
    success
    code
  }
}
`;

export const getFileInfoQuery = `
query getFileInfoQuery($filename: String) {
  file(filename: $filename) {
    mimetype
    filename
    fileurl
    label
  }
}
`;

const prodBlock = `{
  product_type
  status
  featured_image_url
  featured_image_alt
  content_main
  content_sub
  side_phrase
  notice
  name
  options {
    id
    content
    left
    price
  }
  related_film {
    id
#    poster_url
# poster_alt
#    title
#    title_en
#    prod_date
#    open_date
#    genres
#    show_time
#    people {
#      role_type
#      name
#      role
#    }
#    watch_grade  
#    synopsis
  }
}`;

export const productAdminQuery = `
query productAdminQuery($id: Int!) {
  productAdmin(id: $id) ${prodBlock}
}
`;

/** ------------------------------------------------------------- */
/** ------------------------------------------------------------- */
/** ------------------------------------------------------------- */
/** graphQL 관련 유틸 함수 */

/**
 * 제일 첫 글자를 대문자로 만듭니다.
 * @param {string} s
 */
const capitalize = (s) => {
  if (typeof s !== 'string') return '';
  return s.charAt(0).toUpperCase() + s.slice(1);
};

/**
 * graphql argument 로 들어갈 수 있는 문자열을 생성합니다.
 * @param {Object} obj
 */
const stringify = (obj) => {
  if (obj === null || obj instanceof Date || typeof obj !== 'object') {
    // not an object, stringify using native function
    return JSON.stringify(obj);
  }
  if (Array.isArray(obj)) {
    return `[${obj.map((c) => stringify(c)).join(', ')}]`;
  }
  // Implements recursive object serialization according to JSON spec
  // but without quotes around the keys.
  const props = Object.keys(obj)
    .map((key) => `${key}:${stringify(obj[key])}`)
    .join(', ');
  return `{${props}}`;
};

/**
 * 호호
 * @typedef {Object} GraphQLParamListItem
 * @property {string} varName
 * @property {string} typeName
 */

/**
 * @param {GraphQLParamListItem[]} paramList
 */
const makeOuterParamList = (paramList) => {
  return paramList.map((param) => `$${param.varName}: ${param.typeName}`).join(', ');
};
/**
 * @param {GraphQLParamListItem[]} paramList
 */
const makeInnerParamlist = (paramList) => {
  return paramList.map((param) => `${param.varName}: $${param.varName}`).join(', ');
};

/**
 * @typedef {Object} CreateQueryStringOption
 * @property {string} type 'query' | 'mutation'
 * @property {GraphQLParamListItem[]} paramList 사용할 파라미터
 * @property {string} resultString 결과 값들 {}로 둘러싸여져 있도록 함.
 */

/**
 * grapql 로 요청하는 쿼리 혹은 뮤테이션 string 을 제작해줍니다.
 * @param {string} reqName
 * @param {CreateQueryStringOption} param1
 */
export const makeReqString = (reqName, { type = 'query', paramList, resultString } = {}) => {
  if (typeof reqName !== 'string') return '# makeReqString: No reqName Error';
  return `${type} ${reqName}${capitalize(type)}(${makeOuterParamList(paramList)}) {
    ${reqName}(${makeInnerParamlist(paramList)}) ${resultString}
  }`;
};

/**
 * 쿼리에 따라 요청하는 graphql 함수를 만들어줍니다.
 * @param {string} reqName
 * @param {CreateQueryStringOption} defs
 */
export const makeRequest = (reqName, defs) => async (args) => {
  const res = await graphql(makeReqString(reqName, defs), args);
  const result = res.data[reqName];
  return result;
};

// simpleRequest${capitalize(endpoint)} { }

/**
 * graphql 자체의 arg 시스템을 쓰지 않고 그냥 간단한 쿼리를 만듭니다.
 * @param {string} endpoint
 * @param {Object.<string, any>} args
 * @param {string} resultString
 */
export const makeSimpleRequestString = (endpoint, args, resultString) => {
  const entries = Object.entries(args);
  let argsString = '';
  if (entries.length > 0) {
    argsString = `(${entries.map(([key, value]) => `${key}: ${stringify(value)}`).join(', ')})`;
  }

  return `{
   ${endpoint}${argsString} ${resultString}
  }`;
};

// /**
//  *
//  * @param {string} endpoint
//  */
// export const makeSimpleRequest = (endpoint) => async (args, resultString) => {
//   const res = await graphql(makeSimpleRequestString(endpoint, args, resultString));
//   return res.data[endpoint];
// };

/**
 * 간단한 Mutation 요청 함수를 만듭니다.
 * @param {string} endpoint
 */
export const makeSimpleMutation = (endpoint) => async (args, resultString) => {
  const reqStr = `mutation ${endpoint}Mutation ${makeSimpleRequestString(
    endpoint,
    args,
    resultString,
  )}`;
  // console.log("# graphql-client makeSimpleMutation");
  // console.log(reqStr);
  const res = await graphql(reqStr);
  return res.data[endpoint];
};

/**
 * 간단한 Query 요청 함수를 만듭니다.
 * @param {string} endpoint
 */
export const makeSimpleQuery = (endpoint) => async (args = {}, resultString = '') => {
  const res = await graphql(
    `query ${endpoint}Query ${makeSimpleRequestString(endpoint, args, resultString)}`,
  );
  return res.data[endpoint];
};

/** ------------------------------------------------------------- */
/** ------------------------------------------------------------- */
/** ------------------------------------------------------------- */

/**
 * 유저의 정보를 서버로부터 받아 store의 currentUser state에 저장합니다.
 */
export const checkAuth = async () => {
  console.log('# grpahql-client checkauth Called');
  const currentUserAsync = (async () => (await graphql(currentUserQuery, {})).data.currentUser)();
  store.commit('setCurrentUserAsync', currentUserAsync);
  // console.log('# grpahql-client currentUserAsync committed');
  let currentUser = await currentUserAsync;
  if (!currentUser) currentUser = null;
  store.commit('setCurrentUser', { currentUser });
  console.log('# grpahql-client checkauth currentUser GOT!');
  console.dir(currentUser);
};

// export const manualCheckAuth = async () => {
//   store.commit('setUserInitialized', false);
//   await checkAuth();
// };

/**
 * 로그아웃을 실시합니다.
 */
export const doLogout = async () => {
  store.commit('setCurrentUser', { currentUser: null });
  await graphql(logoutMeQuery, {});
};
