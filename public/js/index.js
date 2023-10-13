/* eslint-disable */
import { login } from './login.js';

// DOM elements
const loginForm = document.querySelector('.login-form');

// handlers
if (loginForm)
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.querySelector('#login-email').value;
    const password = document.querySelector('#login-password').value;
    login(email, password);
  });
