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
    email
    c_date
    role
    verified
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

export const loginMutation = `
mutation Login ($email: String!, $pwd: String!) {
  login(provider: {email:$email, pwd: $pwd}) {
    wrong_reason
    wrong_pwd_count
    success
    emailVerificationRequired
    user {
      email
      role
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

/**
 * 제일 첫 글자를 대문자로 만듭니다.
 * @param {string} s
 */
const capitalize = (s) => {
  if (typeof s !== 'string') return '';
  return s.charAt(0).toUpperCase() + s.slice(1);
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

export const checkAuth = async () => {
  if (store.state.userInitialized === false) {
    const result = await graphql(currentUserQuery, {});
    let { currentUser } = result.data;
    if (!currentUser) currentUser = null;
    console.log('currentUser every beforeEach ho~! (only once)');
    console.dir(currentUser);
    store.commit('setUserInitialized', true);
    store.commit('setCurrentUser', { currentUser });
  }
};

export const manualCheckAuth = async () => {
  store.commit('setUserInitialized', false);
  await checkAuth();
};

export const doLogout = async () => {
  store.commit('setCurrentUser', { currentUser: null });
  await graphql(logoutMeQuery, {});
};
