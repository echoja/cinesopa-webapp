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

/*
input BoardInput {
  title: String
  description: String
  permalink: String
  belongs_to: String
  board_type: String
  meta: JSON
}
 */
const board = {
  boardQuery,
  boardsQuery,
  createBoardMutation,
  updateBoardMutation,
  removeBoardMutation,
};

export default board;
