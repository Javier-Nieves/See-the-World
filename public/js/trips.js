/* eslint-disable */
import axios from 'axios';
import { map } from './mapboxController';
import * as Views from './Views.js';

export let TOKEN;
let API_KEY;

export const changeTrip = async (data, tripId) => {
  // creating or editing trip document
  try {
    const res = await axios({
      method: tripId ? 'PATCH' : 'POST',
      // url: tripId
      //   ? `https://seetheworld.onrender.com/api/v1/trips/${tripId}`
      //   : 'https://seetheworld.onrender.com/api/v1/trips',
      url: tripId
        ? `${Views.siteUrl}/api/v1/trips/${tripId}`
        : `${Views.siteUrl}/api/v1/trips`,
      data,
    });
    if (res.data.status === 'success') {
      if (tripId) {
        Views.showAlert('good', 'Trip is modified');
        setTimeout(() => {
          // location.assign(`https://seetheworld.onrender.com/trips/${tripId}`);
          location.assign(`${Views.siteUrl}/trips/${tripId}`);
        }, 1500);
      } else {
        Views.showAlert('good', 'Trip is created');
        setTimeout(() => {
          location.assign(`/trips/${res.data.data.newTrip._id}/locations`);
        }, 1500);
      }
    }
  } catch (err) {
    Views.showAlert('bad', 'Something went wrong');
  }
};

export const deleteTrip = async () => {
  const tripId = window.location.href.slice(
    window.location.href.lastIndexOf('trips/') + 6,
  );
  const res = await axios({
    method: 'DELETE',
    // url: `https://seetheworld.onrender.com/api/v1/trips/${tripId}`,
    url: `${Views.siteUrl}/api/v1/trips/${tripId}`,
  });

  if (res.status === 204) {
    Views.showAlert('good', 'Trip is deleted');
    setTimeout(() => {
      location.assign(`/`);
    }, 1500);
  }
};

export const editLocation = async (data, locationId) => {
  try {
    const res = await axios({
      method: 'PATCH',
      // url: `https://seetheworld.onrender.com/api/v1/locations/${locationId}`,
      url: `${Views.siteUrl}/api/v1/locations/${locationId}`,
      data,
    });
    if (res.data.status === 'success') {
      // console.log('Location is modified');
      Views.showAlert('good', 'Location is modified');
    }
  } catch (err) {
    Views.showAlert('bad', 'Location was not modified');
  }
};

export const deleteLocation = async (locationId) => {
  try {
    const res = await axios({
      method: 'DELETE',
      // url: `https://seetheworld.onrender.com/api/v1/locations/${locationId}`,
      url: `${Views.siteUrl}/api/v1/locations/${locationId}`,
    });
    Views.showAlert('good', 'Location is deleted');
  } catch (err) {
    Views.showAlert('bad', 'Location was not deleted');
  }
};

export const tripSearch = async (query) => {
  // try {
  // const res = await axios({
  //   // method: 'GET',
  //   url: `http://127.0.0.1:3000/searchTrips/${query}`,
  // });
  // console.log(res);
  // window.location = `https://seetheworld.onrender.com/searchTrips/${query}`;
  window.location = `${Views.siteUrl}/searchTrips/${query}`;
  // } catch (err) {
  //   Views.showAlert('bad', 'No such trips');
  // }
};

export const tripsOfUser = (userId) =>
  (window.location = `${Views.siteUrl}/users/${userId}`);
//window.location = `https://seetheworld.onrender.com/users/${userId}`

export const persistLocation = async (data) => {
  // create location in the DB
  try {
    const link = window.location.href;
    // prettier-ignore
    const url = link.slice(0, link.indexOf('/trips')) + '/api/v1' + link.slice(link.indexOf('/trips'));
    const res = await axios({
      method: 'POST',
      url,
      data,
    });
    if (res.data.status === 'success') {
      // console.log('location added');
      Views.showAlert('good', 'Location is added');
    }
  } catch (err) {
    Views.showAlert('bad', 'Can not write location data');
  }
};

export const getKeys = async () => {
  const res = await axios({
    method: 'GET',
    // url: 'https://seetheworld.onrender.com/getKeys',
    url: `${Views.siteUrl}/getKeys`,
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
