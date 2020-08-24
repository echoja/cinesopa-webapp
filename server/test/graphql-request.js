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

module.exports = {
  loginQuery: `
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
`,

  logoutMeMutation: `
mutation logoutMeMutation { 
  logoutMe { 
    name
    email
    role
    c_date
    verified
  }
}`,

  checkAuthQuery: `
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
`,

  // createPage(pageinfo: Pageinfo!): Page
  // modifyPage(permalink: String!, belongs_to: String!,  pageinfo: Pageinfo!): Page
  // removePage(permalink: String!, belongs_to: String!): Page
  getPageQuery: `
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
`,

  getPagesQuery: `
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
`,

  getPageByIdQuery: `
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
`,

  createPageMutation: `
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
`,

  updatePageMutation: `
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
`,

  removePageMutation: `
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
`,
  filmQuery: `
query filmQuery($id: Int!) {
  film(id: $id) ${filmResponse}
}`,
  filmsQuery: `
query getFilms($condition: FilmSearch!) {
  films(condition: $condition) ${filmResponse}
}`,

  createFilmMutation: `
mutation createFilm($input: FilmInput!) {
  createFilm(input: $input) ${filmResponse}
}
`,
  updateFilmMutation: `
mutation updateFilm($id: Int!, $input: FilmInput!) {
  updateFilm(id: $id, input: $input) ${filmResponse}
}
`,
  removeFilmMutation: `
mutation removeFilm($id: Int!) {
  removeFilm(id: $id) ${filmResponse}
}
`,
};

/** Films */
