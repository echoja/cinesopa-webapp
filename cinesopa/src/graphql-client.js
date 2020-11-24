import axios from 'axios';

const headers = {
  'Content-Type': 'application/json',
  Accept: 'application/json',
};

const url =
  process.env.NODE_ENV === 'production' ? 'https://graphql.sopaseom.com/graphql/' : '/graphql';

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
    if (data) return data;
    return received;
  } catch (error) {
    error.response.data.errors.forEach((value) => {
      console.error(value);
    });
    throw error.response.data;
  }
};

export const dataGraphql = async (...args) => {
  const res = await graphql(...args);
  return res?.data;
};

export const getPagesQuery = `
query getPages {
  pages {
    id
    permalink
    title
    c_date
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

export const checkAuthQuery = `
query CheckAuth($redirectLink: String!, $role: Permission!) {
  checkAuth(redirectLink:$redirectLink, role: $role) {
    permissionStatus
    user {
      name
      email
      c_date
      role
    }
  }
}
`;

export const loginQuery = `
mutation Login ($email: String!, $pwd: String!) {
  login(provider: {email:$email, pwd: $pwd}) {
    user {
      name
      email
    }
    redirectLink
  }
}
`;

export const logoutQuery = `
`;

export const logoutMeQuery = `
mutation LogoutMe {
  logoutMe {
    user {
      id
      email
      name
      c_date
      role
    }
  }
}
`;

const postResponse = `{
  id
  title
  content
  excerpt
  permalink
  status
  board
  c_date
  m_date
  meta
}`;
export const postQuery = `
query getPost($id: Int!) {
  post(id: $id) ${postResponse}
}`;
export const postsQuery = `
query getPosts($condition: PostSearch!) {
  posts(condition: $condition) {
    total
    posts ${postResponse}
  }
}`;

export const postsInBoardQuery = `
query getPosts($condition: PostSearch!) {
  posts(condition: $condition) {
    total
    posts {
      id
      title
      permalink
      board
      c_date
      featured_image_link
      featured_image_alt
    }
  }
}`;

export const post = {
  postQuery,
  postsQuery,
};

const boardResponse = `
{
  id
  title
  description
  permalink
  belongs_to
  board_type
  meta
  _id
}
`;
export const boardQuery = `
query getBoard($condition: BoardSearch!) {
  board(condition: $condition) ${boardResponse}
}
`;
export const boardsQuery = `
query getBoards($belongs_to: String) {
  boards(belongs_to: $belongs_to) ${boardResponse}
}
`;

export const initPostsOperation = `
query initPosts($condition: PostSearch!, $belongs_to: String) {
  posts(condition: $condition) {
    total
    posts ${postResponse}
  }
  boards(belongs_to: $belongs_to) ${boardResponse}
}
`;

const filmResInList = `{
total
list {
  title
  title_en
  open_date
  poster
  poster_url
  featured_synopsis
  featured_color
  featured_steel
  badge_text
  badge_color
  id
  synopsis 
  note 
  tags 
  meta
  is_opened
}
}`;

export const filmsNormalQuery = `
query getFilms($condition: FilmSearch!) {
  films(condition: $condition) ${filmResInList}
}`;

export const filmsFeaturedQuery = `
query getFilmsFeatured {
  filmsFeatured ${filmResInList}
}`;

const filmDetail = `{
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
export const filmDetailQuery = `
query filmDetailQuery($id: Int!) {
  film(id: $id) ${filmDetail}
}`;

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
  if (typeof obj !== 'object' || Array.isArray(obj)) {
    // not an object, stringify using native function
    return JSON.stringify(obj);
  }
  // Implements recursive object serialization according to JSON spec
  // but without quotes around the keys.
  const props = Object.keys(obj)
    .map((key) => `${key}:${stringify(obj[key])}`)
    .join(',');
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
  const result = `{
    ${endpoint}${argsString} ${resultString}
   }`;
  console.log('# graphql-client makeSimpleRequestString');
  console.log(result);
  return result;
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

// export const setSiteOptionsMutation = `
// mutation setSiteOptionsMutation($inputs: [SetSiteOptionInput!]!) {
//   setSiteOptions(inputs: $inputs) {
//     name
//     success
//     code
//   }
// }
// `;

// export const singleUploadQuery = `
//   mutation singleUpload($file: Upload!) {
//     singleUpload(file: $file) {
//       filename
//     }
//   }

// `;
