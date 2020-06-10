import axios from 'axios';

const headers = {
  'Content-Type': 'application/json',
  Accept: 'application/json',
};

const url = '/graphql';

export const graphql = async (query, variables) => {
  try {
    return await axios.post(url, JSON.stringify({
      query,
      variables,
    }), {
      headers,
    });
  } catch (error) {
    return error;
  }
};
export const no = 'no';


// fetch('/graphql', {
//   method: 'POST',
//   headers: {
//     'Content-Type': 'application/json',
//     'Accept': 'application/json',
//   },
//   body: JSON.stringify({query: "{ hello }"})
// })
//   .then(r => r.json())
//   .then(data => console.log('data returned:', data));
