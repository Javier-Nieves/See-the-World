/* eslint-disable */
import { login, logout } from './login.js';

// DOM elements
const loginForm = document.querySelector('.login-form');
const logoutBtn = document.querySelector('.nav__logout-btn');

// handlers
if (loginForm)
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.querySelector('#login-email').value;
    const password = document.querySelector('#login-password').value;
    login(email, password);
  });

if (logoutBtn) logoutBtn.addEventListener('click', logout);
