import axios from 'axios';
import store from '../store';
// import { baseUrl } from '../constants';

const headers = {
  'Content-Type': 'application/json',
  Accept: 'application/json',
};

// URL 수정 주의!! url이 같지 않으면 사용자 쿠키가 저장이 안되어 세션이 살아남지 못함!
const url =
  process.env.NODE_ENV === 'production' ? 'https://sopaseom.com/graphql/' : '/graphql';

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

const createGuestMutation = `
mutation createGuest($email: String!, $pwd: String!) {
  createGuest (email: $email, pwd: $pwd) {
    id
    email
    name
    role
    c_date
    verified
  }
}
`;
export const createGuest = (variables) => graphql(createGuestMutation, variables);

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
    name
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
