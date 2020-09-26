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

// export const singleUploadQuery = `
//   mutation singleUpload($file: Upload!) {
//     singleUpload(file: $file) {
//       filename
//     }
//   }

// `;
