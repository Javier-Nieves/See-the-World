/* eslint-disable */
import axios from 'axios';

let map, TOKEN, API_KEY;
let linePainter = [];

export const displayMap = async (locations) => {
  // main map configuration
  await getKeys();
  mapboxgl.accessToken = TOKEN;
  map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11',
    // scrollZoom: false,
    center: [-74.07, 4.64],
    zoom: 11,
  });
  // adding zoom buttons
  map.addControl(new mapboxgl.NavigationControl());
  // adding scale
  map.addControl(new mapboxgl.ScaleControl());

  if (window.location.href.includes('locations')) map.on('click', add_marker);

  const bounds = new mapboxgl.LngLatBounds();

  if (!locations) return;

  const waypoints = [];
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
      color: '#57fa7d',
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
      top: 20,
      bottom: 20,
      left: 20,
      right: 20,
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
      'line-color': '#6084eb',
      'line-width': 6,
    },
    filter: ['==', '$type', 'LineString'],
  });
};

const add_marker = (event) => {
  var coordinates = event.lngLat;

  const popup = new mapboxgl.Popup({ closeOnClick: false, offset: 25 })
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

  new mapboxgl.Marker({
    color: '#e60000',
    scale: 0.6,
  })
    .setLngLat(coordinates)
    .addTo(map);

  popupHandler(popup, coordinates);
};

const popupHandler = (popup, coordinates) => {
  document.querySelector('.newLocation__popup-form').addEventListener(
    'submit',
    async (e) => {
      e.preventDefault();
      const name = document.querySelector('.newLocation__popup-name').value;
      // prettier-ignore
      const address = document.querySelector('.newLocation__popup-address',).value;
      // prettier-ignore
      const description = document.querySelector('.newLocation__popup-desc',).value;
      persistLocation(coordinates, name, address, description);

      popup.remove();
      // linePainter.push(coordinates);
      linePainter.push([coordinates.lng, coordinates.lat]);
      if (linePainter.length > 1) {
        const geoData = await createGeoJSON(linePainter);
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

const findLocation = async (query) => {
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

  map.flyTo({
    center: feature.center,
  });
};
