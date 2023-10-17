/* eslint-disable */
import { login, logout } from './login.js';
import { displayMap } from './mapbox.js';
import { createTrip } from './trips.js';

// DOM elements
const mapBox = document.getElementById('map');
const loginForm = document.querySelector('.login-form');
const logoutBtn = document.querySelector('.nav__logout-btn');
const newTripForm = document.querySelector('.newTrip__form');

// handlers
if (mapBox) {
  let locations;
  if (mapBox.className === 'map')
    locations = JSON.parse(mapBox.dataset.locations);
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

if (newTripForm)
  newTripForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.querySelector('.newTrip__input-name').value;
    const date = document.querySelector('.newTrip__input-date').value;
    const highlight = document.querySelector('.newTrip__input-highlight').value;
    // const private = document.querySelector('.newTrip__checkbox').value;
    // todo - add "With" field
    const description = document.querySelector(
      '.newTrip__input-description',
    ).value;
    createTrip({ name, date, highlight, description });
  });

// if (newLocationForm)
//   newLocationForm.addEventListener('submit', (e) => {
//     e.preventDefault();
//     console.log('popup submitted');
//   });
