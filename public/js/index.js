/* eslint-disable */
import { login, logout } from './login.js';
import { displayMap } from './mapboxController.js';
import { changeTrip, deleteTrip, editTrip } from './trips.js';

// DOM elements
const mapBox = document.getElementById('map');
const loginForm = document.querySelector('.login-form');
const logoutBtn = document.querySelector('.nav__logout-btn');
const newTripForm = document.querySelector('#newTripForm');
const editTripForm = document.querySelector('#editTripForm');
const deleteBtn = document.querySelector('.trip-info__delete-btn');

// handlers
if (mapBox) {
  let locations;
  if (mapBox.dataset.hasOwnProperty('locations'))
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

if (newTripForm || editTripForm) {
  const filledForm = newTripForm || editTripForm;
  filledForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.querySelector('.newTrip__input-name').value;
    const date = document.querySelector('.newTrip__input-date').value;
    const duration = document.querySelector('.newTrip__input-duration').value;
    const highlight = document.querySelector('.newTrip__input-highlight').value;
    const friendsOnly = document.querySelector('.newTrip__checkbox').checked;
    // prettier-ignore
    const description = document.querySelector('.newTrip__input-description').value;
    // todo - add "With" field
    filledForm === newTripForm &&
      changeTrip({ name, date, duration, highlight, description, friendsOnly });
    filledForm === editTripForm &&
      changeTrip(
        { name, date, duration, highlight, description, friendsOnly },
        filledForm.dataset.tripid,
      );
  });
}

if (deleteBtn) deleteBtn.addEventListener('click', deleteTrip);
