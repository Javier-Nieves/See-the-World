/* eslint-disable */
import axios from 'axios';
import { map } from './mapboxController';

export let TOKEN;
let API_KEY;

export const persistLocation = async (data) => {
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
