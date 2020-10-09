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

// export const singleUploadQuery = `
//   mutation singleUpload($file: Upload!) {
//     singleUpload(file: $file) {
//       filename
//     }
//   }

// `;
