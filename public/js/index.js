/* eslint-disable */
import { login, logout, registerUser } from './login.js';
import * as users from './users.js';
import * as trips from './trips.js';
import * as mapController from './mapboxController.js';

// variables
let travelers = [];

// DOM elements
const mapBox = document.getElementById('map');

const friendsTable = document.querySelector('.friendsPage__table');
const addFriendBtn = document.querySelector('.addFriendBtn');
const friendRequests = document.querySelector('.friendsPage__friendRequests');

const loginForm = document.querySelector('.login-form');
const registerForm = document.querySelector('.register-form');
const logoutBtn = document.querySelector('.nav__logout-btn');

const newTripForm = document.querySelector('#newTripForm');
const editTripForm = document.querySelector('#editTripForm');
const editLocationForm = document.querySelector('.locations__editForm');
const friendSearchForm = document.querySelector('.friendsPage__searchForm');
const deleteLocationBtn = document.querySelector('.locations__deleteBtn');
const deleteBtn = document.querySelector('.trip-info__delete-btn');
const datalist = document.querySelector('#travelersList');
const withSelector = document.querySelector('.newTrip__input-with');
const travelersList = document.querySelector('.newTrip__travelersList');

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

if (registerForm)
  registerForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.querySelector('#register-name').value;
    const email = document.querySelector('#register-email').value;
    const password = document.querySelector('#register-password').value;
    const passwordConfirm = document.querySelector('#register-confirm').value;
    registerUser({ name, email, password, passwordConfirm });
  });

if (logoutBtn) logoutBtn.addEventListener('click', logout);

if (editLocationForm)
  editLocationForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.querySelector('.location-info__editName').value;
    const address = document.querySelector('.location-info__editAddress').value;
    let coord = document.querySelector('.location-info__editCoord').value;
    // prettier-ignore
    const description = document.querySelector('.location-info__editDesc',).value;
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
  withSelector.addEventListener('change', (e) => fillTravelers(e));

  const filledForm = newTripForm || editTripForm;
  filledForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.querySelector('.newTrip__input-name').value;
    const date = document.querySelector('.newTrip__input-date').value;
    const duration = document.querySelector('.newTrip__input-duration').value;
    const highlight = document.querySelector('.newTrip__input-highlight').value;
    const friendsOnly = document.querySelector('.newTrip__checkbox').checked;
    const desc = document.querySelector('.newTrip__input-description').value;

    filledForm === newTripForm &&
      // prettier-ignore
      trips.changeTrip({ name, date, duration, highlight, desc, travelers, friendsOnly });

    filledForm === editTripForm &&
      trips.changeTrip(
        { name, date, duration, highlight, desc, travelers, friendsOnly },
        filledForm.dataset.tripid,
      );
  });
}

if (deleteBtn) deleteBtn.addEventListener('click', trips.deleteTrip);

if (friendSearchForm)
  friendSearchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const query = document.querySelector('.friendsPage__input-name').value;
    users.friendSearch({ query });
  });

if (friendsTable)
  // open user's profile at click
  friendsTable.addEventListener('click', (e) => {
    const userId = e.target.closest('.data-holder').dataset.userid;
    trips.tripsOfUser(userId);
  });

if (addFriendBtn)
  addFriendBtn.addEventListener('click', () => {
    const btn = document.querySelector('.addFriendBtn');
    const hostId = btn.dataset.hostid;
    users.friendRequest({ hostId, action: 'send' });
  });

if (friendRequests)
  friendRequests.addEventListener('click', (e) => {
    const userId = e.target.dataset.userid;
    console.log('userid is ', userId);
    users.friendRequest({ userId, action: 'accept' });
  });

const fillTravelers = (event) => {
  let friendId;
  // "with" field. Creating an array od ID's of friends
  // when datalist option is selected we get friend's name and look for their ID in the options
  const friend = event.target.value;
  // prettier-ignore
  const selectedOption = Array.from(datalist.options).find((option) => option.value === friend);
  if (selectedOption) {
    friendId = selectedOption.getAttribute('data-travelerid');
    travelers.push(friendId);
  }
  withSelector.value = '';
  console.log(travelers);

  const markup = `<div data-friendid=${friendId}>
                    ${friend}
                    </div>`;
  travelersList.insertAdjacentHTML('beforeend', markup);
};
