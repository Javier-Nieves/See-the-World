/* eslint-disable */
import { login, logout } from './login.js';
import * as mapController from './mapboxController.js';

import * as trips from './trips.js';

// DOM elements
const mapBox = document.getElementById('map');
const loginForm = document.querySelector('.login-form');
const logoutBtn = document.querySelector('.nav__logout-btn');
const newTripForm = document.querySelector('#newTripForm');
const editTripForm = document.querySelector('#editTripForm');
const editLocationForm = document.querySelector('.locations__editForm');
const deleteLocationBtn = document.querySelector('.locations__deleteBtn');
const deleteBtn = document.querySelector('.trip-info__delete-btn');

// handlers
if (mapBox) {
  let locations;
  if (mapBox.dataset.hasOwnProperty('locations'))
    locations = JSON.parse(mapBox.dataset.locations);
  mapController.displayMap(locations);
}

if (loginForm)
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.querySelector('#login-email').value;
    const password = document.querySelector('#login-password').value;
    login(email, password);
  });

if (logoutBtn) logoutBtn.addEventListener('click', logout);

if (editLocationForm)
  editLocationForm.addEventListener('submit', (e) => {
    e.preventDefault();
    console.log('modifying?');
    const name = document.querySelector('.location-info__editName').value;
    const address = document.querySelector('.location-info__editAddress').value;
    let coord = document.querySelector('.location-info__editCoord').value;
    const description = document.querySelector(
      '.location-info__editDesc',
    ).value;
    coord = JSON.parse(coord);
    const locationId = document.querySelector('.location-data-holder').dataset
      .locationid;
    trips.editLocation({ name, address, description, coord }, locationId);
  });

if (deleteLocationBtn)
  deleteLocationBtn.addEventListener('click', () => {
    const locationId = document.querySelector('.location-data-holder').dataset
      .locationid;
    trips.deleteLocation(locationId);
    mapController.removeLocation(locationId);
  });

if (newTripForm || editTripForm) {
  const filledForm = newTripForm || editTripForm;
  filledForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.querySelector('.newTrip__input-name').value;
    const date = document.querySelector('.newTrip__input-date').value;
    const duration = document.querySelector('.newTrip__input-duration').value;
    const highlight = document.querySelector('.newTrip__input-highlight').value;
    const friendsOnly = document.querySelector('.newTrip__checkbox').checked;
    const desc = document.querySelector('.newTrip__input-description').value;
    // todo - add "With" field
    filledForm === newTripForm &&
      trips.changeTrip({ name, date, duration, highlight, desc, friendsOnly });
    filledForm === editTripForm &&
      trips.changeTrip(
        { name, date, duration, highlight, desc, friendsOnly },
        filledForm.dataset.tripid,
      );
  });
}

if (deleteBtn) deleteBtn.addEventListener('click', trips.deleteTrip);
