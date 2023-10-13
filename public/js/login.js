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
