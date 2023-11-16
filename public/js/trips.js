/* eslint-disable */
import axios from 'axios';
import { map } from './mapboxController';

export let TOKEN;
let API_KEY;

export const changeTrip = async (data, tripId) => {
  // creating or editing trip document
  const res = await axios({
    method: tripId ? 'PATCH' : 'POST',
    url: tripId
      ? `http://127.0.0.1:3000/api/v1/trips/${tripId}`
      : 'http://127.0.0.1:3000/api/v1/trips',
    data,
  });
  if (res.data.status === 'success') {
    tripId
      ? location.assign(`http://127.0.0.1:3000/trips/${tripId}`) //console.log('Trip is modified')
      : location.assign(`/trips/${res.data.data.newTrip._id}/locations`);
  }
};

export const deleteTrip = async () => {
  const tripId = window.location.href.slice(
    window.location.href.lastIndexOf('trips/') + 6,
  );
  const res = await axios({
    method: 'DELETE',
    url: `http://127.0.0.1:3000/api/v1/trips/${tripId}`,
  });

  if (res.status === 204) {
    // todo - message
    setTimeout(() => {
      location.assign(`/`);
    }, 1500);
  }
};

export const editLocation = async (data, locationId) => {
  const res = await axios({
    method: 'PATCH',
    url: `http://127.0.0.1:3000/api/v1/locations/${locationId}`,
    data,
  });
  if (res.data.status === 'success') {
    console.log('Location is modified');
  }
};

export const deleteLocation = async (locationId) => {
  const res = await axios({
    method: 'DELETE',
    url: `http://127.0.0.1:3000/api/v1/locations/${locationId}`,
  });

  if (res.data.status === 'success') {
    console.log('Location is deleted');
  }
};

export const tripsOfUser = (userId) =>
  (window.location = `http://127.0.0.1:3000/users/${userId}`);

export const persistLocation = async (data) => {
  // create location in the DB
  const link = window.location.href;
  // prettier-ignore
  const url = link.slice(0, link.indexOf('/trips')) + '/api/v1' + link.slice(link.indexOf('/trips'));
  const res = await axios({
    method: 'POST',
    url,
    data,
  });
  if (res.data.status === 'success') {
    console.log('location added');
    // showAlert('success', 'Logged in ok');
    // window.setTimeout(() => {
    //   location.assign('/');
    // }, 1500);
  }
};

export const getKeys = async () => {
  const res = await axios({
    method: 'GET',
    url: 'http://127.0.0.1:3000/getKeys',
  });
  TOKEN = res.data.data.TOKEN;
  API_KEY = res.data.data.API_KEY;
};

export const createGeoJSON = async (waypoints) => {
  let wayPointsString = '';
  waypoints.forEach((place) => {
    wayPointsString += `lonlat:${place.join(',')}|`;
  });
  wayPointsString = wayPointsString.slice(0, -1);
  // prettier-ignore
  const res = await fetch(`https://api.geoapify.com/v1/routing?waypoints=${wayPointsString}&mode=hike&apiKey=${API_KEY}`);
  const routeData = await res.json();

  if (!map.getSource('route'))
    map.addSource('route', {
      type: 'geojson',
      data: routeData,
    });
  else map.getSource('route').setData(routeData);

  return routeData;
};

export const tripSearch = async (data) => {
  const res = await axios({
    method: 'POST',
    url: 'http://127.0.0.1:3000/api/v1/trips/search',
    data,
  });
  if (res.data.status === 'success') {
    console.log('Results: ', res.data.data.searchRes);
    // Views.loadTripSearchResults(res.data.data.searchRes);
  }
};
