/* eslint-disable */
import axios from 'axios';

let map, TOKEN, API_KEY;
let waypoints = [];

export const displayMap = async (locations) => {
  // main map configuration
  await getKeys();
  mapboxgl.accessToken = TOKEN;
  map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11',
    scrollZoom: `${window.location.href.includes('locations')}`,
    // center: [-74.07, 4.64],
    // zoom: 11,
  });
  // adding zoom buttons
  map.addControl(new mapboxgl.NavigationControl());
  // adding scale
  map.addControl(new mapboxgl.ScaleControl());

  if (window.location.href.includes('locations')) map.on('click', add_marker);

  const bounds = new mapboxgl.LngLatBounds();

  if (locations.length === 0) return;

  // adding markers and popups for each location
  locations.forEach((loc) => {
    waypoints.push(loc.coordinates);
    // create marker
    // const el = document.createElement('div');
    // el.className = 'marker';

    //create popup
    const popup = new mapboxgl.Popup({ offset: 25 }).setText('test text');
    // add marker to map
    new mapboxgl.Marker({
      color: '#3fa802',
      scale: 0.6,
    })
      .setLngLat(loc.coordinates)
      .setPopup(popup)
      .addTo(map);

    // extend map to fit current location
    bounds.extend(loc.coordinates);
  });

  // adding padding to the map
  map.fitBounds(bounds, {
    padding: {
      top: 50,
      bottom: 50,
      left: 50,
      right: 50,
    },
  });

  // getting GeoJSON data for location points
  const routeData = await createGeoJSON(waypoints);
  drawRoute(routeData);
};

const drawRoute = (routeData) => {
  if (!routeData) return;
  if (map.getLayer('route-layer')) map.removeLayer('route-layer');

  map.getSource('route').setData(routeData);
  map.addLayer({
    id: 'route-layer',
    type: 'line',
    source: 'route',
    layout: {
      'line-cap': 'round',
      'line-join': 'round',
    },
    paint: {
      'line-color': '#a80202',
      'line-width': 3,
    },
    filter: ['==', '$type', 'LineString'],
  });
};

const add_marker = (event) => {
  // clear all popups opened earlier
  const oldPopups = document.querySelectorAll('.mapboxgl-popup');
  oldPopups.forEach((popup) => popup.remove());

  const coordinates = event.lngLat;

  const popup = new mapboxgl.Popup({ closeOnClick: false })
    .setLngLat(coordinates)
    .setHTML(
      `<form class='newLocation__popup-form'>
        <input type='text' class='newLocation__popup-name' placeholder='Name'>
        <input type='text' class='newLocation__popup-address' placeholder='Address'>
        <input type='text' class='newLocation__popup-desc' placeholder='Description'>
        <input type='submit' value='Add location'>
      </form>`,
    )
    .addTo(map);

  popupHandler(popup);
};

const popupHandler = (popup) => {
  document.querySelector('.newLocation__popup-form').addEventListener(
    'submit',
    async (e) => {
      e.preventDefault();
      const name = document.querySelector('.newLocation__popup-name').value;
      // prettier-ignore
      const address = document.querySelector('.newLocation__popup-address',).value;
      // prettier-ignore
      const description = document.querySelector('.newLocation__popup-desc',).value;
      persistLocation(popup._lngLat, name, address, description);

      popup.remove();
      new mapboxgl.Marker({
        color: '#e60000',
        scale: 0.6,
      })
        .setLngLat(popup._lngLat)
        .addTo(map);

      // waypoints - array, used to create GeoJson => routes
      waypoints.push([popup._lngLat.lng, popup._lngLat.lat]);
      if (waypoints.length > 1) {
        const geoData = await createGeoJSON(waypoints);
        drawRoute(geoData);
      }
    },
    { once: true },
  );
};

// prettier-ignore
export const persistLocation = async (coordinates, name, address, description) => {
  const coordArray = [];
  coordArray.push(coordinates.lng, coordinates.lat);
  const link = window.location.href;
  // prettier-ignore
  const url = link.slice(0, link.indexOf('/trips')) + '/api/v1' + link.slice(link.indexOf('/trips'));
  const res = await axios({
    method: 'POST',
    url,
    data: {
      coordinates: coordArray,
      name,
      address,
      description,
    },
  });

  if (res.data.status === 'success') {
    console.log('location added');
    // showAlert('success', 'Logged in ok');
    // window.setTimeout(() => {
    //   location.assign('/');
    // }, 1500);
  }
};

const getKeys = async () => {
  const res = await axios({
    method: 'GET',
    url: 'http://127.0.0.1:3000/getKeys',
  });
  TOKEN = res.data.data.TOKEN;
  API_KEY = res.data.data.API_KEY;
};

const createGeoJSON = async (waypoints) => {
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

export const findLocation = async (query) => {
  const mapboxClient = mapboxSdk({ accessToken: mapboxgl.accessToken });
  const response = await mapboxClient.geocoding
    .forwardGeocode({
      query,
      autocomplete: false,
      limit: 1,
    })
    .send();

  if (!response.body.features.length) {
    console.error('Invalid response', response);
    return;
  }

  const feature = response.body.features[0];

  // new center for the existing map
  map.flyTo({
    center: feature.center,
  });
};
