/* eslint-disable */
import axios from 'axios';

import * as Views from './Views.js';

export const friendSearch = async (data) => {
  const res = await axios({
    method: 'POST',
    url: 'http://127.0.0.1:3000/api/v1/users/search',
    data,
  });
  if (res.data.status === 'success') {
    // console.log('Results: ', res.data.data.searchRes);
    Views.loadSearchResults(res.data.data.searchRes);
  }
};
