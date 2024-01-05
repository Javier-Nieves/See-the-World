/* eslint-disable */
import axios from 'axios';

import * as Views from './Views.js';

export const friendSearch = async (data) => {
  try {
    const res = await axios({
      method: 'POST',
      url: 'https://seetheworld.onrender.com/api/v1/users/search',
      data,
    });
    if (res.data.status === 'success') {
      if (res.data.data.searchRes.length !== 0)
        Views.loadSearchResults(res.data.data.searchRes);
      else Views.showAlert('bad', 'No users found');
    }
  } catch (err) {
    Views.showAlert('bad', 'No users found');
  }
};

export const friendRequest = async (data, element) => {
  try {
    const res = await axios({
      method: 'POST',
      url: 'https://seetheworld.onrender.com/api/v1/users/friends',
      data,
    });
    if (res.data.status === 'success') {
      Views.showAlert('good', 'Friend request sent');
      // move friend from 'requests' field to 'friends' field
      Views.createFriend(element);
    }
  } catch (err) {
    Views.showAlert('bad', 'Can not send friend request');
  }
};

export const changeUserInfo = async (data) => {
  try {
    const res = await axios({
      method: 'PATCH',
      url: 'https://seetheworld.onrender.com/api/v1/users/updateMe',
      data,
    });
    if (res.data.status === 'success') {
      Views.showAlert('good', "User's info is changed");
      setTimeout(() => {
        location.reload(true);
      }, 1500);
    }
  } catch (err) {
    Views.showAlert('bad', "Can not change user's info");
  }
};
