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
  posts(condition: $condition) {
    total
    posts ${postResponse}
  }
}`;
const postAdminQuery = `
query getPostAdmin($id: Int!) {
  postAdmin(id: $id) ${postResponse}
}
`;
const postsAdminQuery = `
query getPostsAdmin($condition: PostSearch!) {
  postsAdmin(condition: $condition) {
    total
    posts ${postResponse}
  }
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

export default post;
