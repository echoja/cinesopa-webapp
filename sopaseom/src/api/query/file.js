const fileResponse = `
{
  id
  _id
  c_date
  encoding
  mimetype
  filename
  fileurl
  origin
  description
  label
  alt
  path
  size
  owner
  public
  managed
  width
  height
}
`;

const fileQuery = `
query fileQuery($filename: String, $id: Int) {
  file(filename: $filename, id: $id) ${fileResponse}
}
`;
const filesQuery = `
query filesQuery($page: Int, $perpage:Int, $onlyManaged: Boolean) {
  files(page: $page, perpage: $perpage, onlyManaged: $onlyManaged) ${fileResponse}
}
`;
const updateFileMutation = `
mutation updateFileMutation($filename: String!, $input: FileInput!) {
  updateFile(filename: $filename, input: $input) ${fileResponse}
}
`;

const removeFileMutation = `
mutation removeFileMutation($filename: String!) {
  removeFile(filename: $filename) ${fileResponse}
}
`;
const file = {
  fileQuery,
  filesQuery,
  updateFileMutation,
  removeFileMutation,
};

export default file;
