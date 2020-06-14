import axios from 'axios';

const headers = {
  'Content-Type': 'application/json',
  Accept: 'application/json',
};

const url = '/graphql';

export const graphql = async (query, variables) => {
  try {
    const { data } = await axios.post(url, JSON.stringify({
      query,
      variables,
    }), {
      headers,
    });
    return data;
  } catch (error) {
    return error;
  }
};
export const checkAuthQuery = `
query CheckAuth($redirectLink: String!) {
  checkAuth(redirectLink:$redirectLink) 
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

export const singleUploadQuery = `
  mutation singleUpload($file: Upload!) {
    singleUpload(file: $file) {
      filename
    }
  }

`;
