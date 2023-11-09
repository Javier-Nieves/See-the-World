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

export const friendRequest = async (data, element) => {
  const res = await axios({
    method: 'POST',
    url: 'http://127.0.0.1:3000/api/v1/users/friends',
    data,
  });
  if (res.data.status === 'success') {
    // todo - message
    // move friend from 'requests' field to 'friends' field
    Views.createFriend(element);
  }
};

export const changeUserInfo = async (data) => {
  const res = await axios({
    method: 'PATCH',
    url: 'http://127.0.0.1:3000/api/v1/users/updateMe',
    data,
  });
  if (res.data.status === 'success') {
    console.log('success!');
    location.reload(true);
    // Views.loadSearchResults(res.data.data.searchRes);
  }
};
