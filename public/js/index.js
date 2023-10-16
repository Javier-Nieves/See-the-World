/* eslint-disable */
import { login, logout } from './login.js';
import { displayMap } from './mapbox.js';

// DOM elements
const mapBox = document.getElementById('map');
const loginForm = document.querySelector('.login-form');
const logoutBtn = document.querySelector('.nav__logout-btn');
// const addBtn = document.querySelector('.newTrip__add-btn');

// handlers
if (mapBox) {
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
