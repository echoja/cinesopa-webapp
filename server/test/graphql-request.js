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
  photos
  id
  videos {
    youtube_id
    title
  }
  synopsis 
  note 
  tags 
  meta 
}
`;

const loginQuery = `
mutation Login ($email: String!, $pwd: String!) {
  login(provider: {email:$email, pwd: $pwd}) {
    user {
      name
      email
      role
      verified
    }
    redirectLink
  }
}
`;
const logoutMeMutation = `
mutation logoutMeMutation { 
  logoutMe { 
    name
    email
    role
    c_date
    verified
  }
}`;
const checkAuthQuery = `
query checkAuth($redirectLink: String!, $role: Permission!) {
  checkAuth(redirectLink:$redirectLink, role: $role) {
    permissionStatus
    user {
      name
      email
      c_date
      role
      verified
    }
  }
}
`;
const getPageQuery = `
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
const getPagesQuery = `
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
const getPageByIdQuery = `
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
const createPageMutation = `
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
const updatePageMutation = `
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
const removePageMutation = `
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
const filmQuery = `
query filmQuery($id: Int!) {
  film(id: $id) ${filmResponse}
}`;
const filmsQuery = `
query getFilms($condition: FilmSearch!) {
  films(condition: $condition) ${filmResponse}
}`;
const createFilmMutation = `
mutation createFilm($input: FilmInput!) {
  createFilm(input: $input) ${filmResponse}
}
`;
const updateFilmMutation = `
mutation updateFilm($id: Int!, $input: FilmInput!) {
  updateFilm(id: $id, input: $input) ${filmResponse}
}
`;
const removeFilmMutation = `
mutation removeFilm($id: Int!) {
  removeFilm(id: $id) ${filmResponse}
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
const postQuery = `
query getPost($id: Int!) {
  post(id: $id) ${postResponse}
}`;
const postsQuery = `
query getPosts($condition: PostSearch!) {
  posts(condition: $condition) ${postResponse}
}`;
const postAdminQuery = `
query getPostAdmin($id: Int!) {
  postAdmin(id: $id) ${postResponse}
}
`;
const postsAdminQuery = `
query getPostsAdmin($condition: PostSearch!) {
  postsAdmin(condition: $condition) ${postResponse}
}`;
const createPostMutation = `
mutation createPost($input: PostInput!) {
  createPost(input: $input) ${postResponse}
}
`;
const updatePostMutation = `
mutation updatePost($id: Int!, $input: PostInput!) {
  updatePost(id: $id, input: $input) ${postResponse}
}
`;
const removePostMutation = `
mutation removePost($id: Int!) {
  removePost(id: $id) ${postResponse}
}
`;

const post = {
  postQuery,
  postsQuery,
  postAdminQuery,
  postsAdminQuery,
  createPostMutation,
  updatePostMutation,
  removePostMutation,
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
}
`;
const boardQuery = `
query getBoard($condition: BoardSearch!) {
  board(condition: $condition) ${boardResponse}
}
`;
const boardsQuery = `
query getBoards($belongs_to: String) {
  boards(belongs_to: $belongs_to) ${boardResponse}
}
`;
const createBoardMutation = `
mutation createBoard($input: BoardInput!) {
  createBoard(input: $input) ${boardResponse}
}
`;
const updateBoardMutation = `
mutation updateBoard($id: Int!, $input: BoardInput!) {
  updateBoard(id: $id, input: $input) ${boardResponse}
}
`;
const removeBoardMutation = `
mutation removeBoard($id: Int!) {
  removeBoard(id: $id) ${boardResponse}
}

`;

const board = {
  boardQuery,
  boardsQuery,
  createBoardMutation,
  updateBoardMutation,
  removeBoardMutation,
};

module.exports = {
  loginQuery,
  logoutMeMutation,
  checkAuthQuery,
  getPageQuery,
  getPagesQuery,
  getPageByIdQuery,
  createPageMutation,
  updatePageMutation,
  removePageMutation,
  filmQuery,
  filmsQuery,
  createFilmMutation,
  updateFilmMutation,
  removeFilmMutation,
  ...post,
  ...board,
};
/** Films */
