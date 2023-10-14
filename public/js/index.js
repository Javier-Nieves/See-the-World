/* eslint-disable */
import { login, logout } from './login.js';
import { displayMap } from './mapbox.js';

// DOM elements
const mapBox = document.getElementById('map');
const loginForm = document.querySelector('.login-form');
const logoutBtn = document.querySelector('.nav__logout-btn');

// handlers
if (mapBox) {
  console.log(mapBox);
  console.log('mapBox.dataset.locations', mapBox.dataset.locations);
  const locations = JSON.parse(mapBox.dataset.locations);
  displayMap(locations);
}

if (loginForm)
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.querySelector('#login-email').value;
    const password = document.querySelector('#login-password').value;
    login(email, password);
  });

if (logoutBtn) logoutBtn.addEventListener('click', logout);
