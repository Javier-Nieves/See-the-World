/* eslint-disable */
import axios from 'axios';
import * as Views from './Views.js';

export const login = async (email, password) => {
  try {
    const res = await axios({
      method: 'POST',
      url: 'https://seetheworld.onrender.com/api/v1/users/login',
      data: {
        email,
        password,
      },
    });

    if (res.data.status === 'success') {
      Views.showAlert('good', 'Logged in ok');
      window.setTimeout(() => {
        location.assign('/');
      }, 1500);
    }
  } catch (err) {
    Views.showAlert('bad', 'Please enter valid email and password');
  }
};

export const logout = async () => {
  try {
    const res = await axios({
      method: 'GET',
      url: 'https://seetheworld.onrender.com/api/v1/users/logout',
    });

    if (res.data.status === 'success') {
      Views.showAlert('good', 'Logged out');
      location.assign('/');
    }
  } catch (err) {
    Views.showAlert('bad', 'Logout error');
  }
};

export const registerUser = async (data) => {
  try {
    const res = await axios({
      method: 'POST',
      // todo - change:
      url: 'https://seetheworld.onrender.com/api/v1/users/signup',
      data,
    });
    if (res.data.status === 'success') {
      Views.showAlert('good', 'You are registered!');
      window.setTimeout(() => {
        location.assign('/');
      }, 1500);
    }
  } catch (err) {
    console.log(err);
    // todo - extract error message from AxiosError
    Views.showAlert('bad', 'User can not be registered');
  }
};
