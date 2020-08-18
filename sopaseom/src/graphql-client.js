import axios from 'axios';

const headers = {
  'Content-Type': 'application/json',
  Accept: 'application/json',
};

const url = process.env.NODE_ENV === 'production' ? 'https://sopaseom.com/graphql/' : '/graphql';

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
      console.log(value);
    });

    // for (const key in err.response.data.errors) {
    //   if (err.response.data.errors.hasOwnProperty(key)) {
    //     const value = err.response.data.errors[key];
    //     console.log(value);
    //   }
    // }
    // error.response.data.errors(console.log);
    // console.dir(error);
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
  page(permalink: $permalink) {
    id 
    permalink 
    title 
    content 
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

// export const singleUploadQuery = `
//   mutation singleUpload($file: Upload!) {
//     singleUpload(file: $file) {
//       filename
//     }
//   }

// `;
