/* eslint-disable */
import axios from 'axios';

export const login = async (email, password) => {
  const res = await axios({
    method: 'POST',
    url: 'http://127.0.0.1:3000/api/v1/users/login',
    data: {
      email,
      password,
    },
  });

  if (res.data.status === 'success') {
    // showAlert('success', 'Logged in ok');
    window.setTimeout(() => {
      location.assign('/');
    }, 1500);
  }
};

export const logout = async () => {
  try {
    const res = await axios({
      method: 'GET',
      url: 'http://127.0.0.1:3000/api/v1/users/logout',
    });

    if (res.data.status === 'success') location.assign('/');
  } catch (err) {
    // showAlert('error', err.response.data.message);
  }
};

export const registerUser = async (data) => {
  const res = await axios({
    method: 'POST',
    url: 'http://127.0.0.1:3000/api/v1/users/signup',
    data,
  });

  if (res.data.status === 'success') {
    // showAlert('success', 'Logged in ok');
    console.log('new user is created');
    window.setTimeout(() => {
      location.assign('/');
    }, 1500);
  }
};
