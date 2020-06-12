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
