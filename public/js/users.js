/* eslint-disable */
import axios from 'axios';

export const friendSearch = async (data) => {
  console.log('searching for users', data);
  const res = await axios({
    method: 'POST',
    url: 'http://127.0.0.1:3000/api/v1/users/search',
    data,
  });

  console.log('response:', res);
};
