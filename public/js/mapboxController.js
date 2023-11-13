/* eslint-disable */
import * as mapboxViews from './Views.js';
import * as trips from './trips.js';

export let map;
// waypoints - array for GeoJson creation => routes
let waypoints = [];
// features - array for the map.addSource method, contains Locations data
let features = [];

export const displayMap = async (locations) => {
  // main map configuration
  await trips.getKeys();
  mapboxgl.accessToken = trips.TOKEN;
  map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11',
    scrollZoom: window.location.href.includes('locations'),
    // center: [-74.07, 4.64],
    // zoom: 11,
  });
  // adding scale
  map.addControl(new mapboxgl.ScaleControl());
  // adding zoom buttons
  const zoom = new mapboxgl.NavigationControl({ showCompass: false });
  map.addControl(zoom, 'bottom-left');
  // change cursor
  map.getCanvas().style.cursor = 'crosshair';

  map.on('load', async () => {
    // Trip page or Locations page?
    if (window.location.href.includes('locations')) {
      mapboxViews.activateGeocoder();
      map.on('click', (e) => mapboxViews.add_marker(e, locationPopupHandler));
    }

    if (locations.length === 0) return;

    const bounds = new mapboxgl.LngLatBounds();
    // locations and routes are created on the map via new layers
    // layers use Sourses, which are filled from arrays:
    fillGeoArrays(locations, bounds);
    createLocationsLayer();
    populatePopups();

    // adding padding to the map
    map.fitBounds(bounds, {
      padding: {
        top: 80,
        bottom: 80,
        left: 80,
        right: 80,
      },
      duration: 3000,
    });

    // getting GeoJSON data for location points
    const routeData = await trips.createGeoJSON(waypoints);
    drawRoute(routeData);
  });
};

export const removeLocation = async (locationId) => {
  const location = features.find((loc) => loc.properties.id === locationId);
  const index = features.indexOf(location);
  features.splice(index, 1);
  // create new layer without the deleted location
  createLocationsLayer();
  // redraw all routes
  waypoints.splice(index, 1);
  const routeData = await trips.createGeoJSON(waypoints);
  drawRoute(routeData);
};

const fillGeoArrays = (locations, bounds) => {
  // create an array for future map.addSource method
  // and waypoints array for Routes drawing
  locations.forEach((loc) => {
    waypoints.push(loc.coordinates);
    createFeature({
      name: loc.name,
      address: loc.address,
      description: loc.description,
      coordinates: loc.coordinates,
      images: loc.images,
      id: loc._id,
    });
    bounds.extend(loc.coordinates);
  });
};

const createLocationsLayer = () => {
  // creating or updating layer's source
  if (!map.getSource('locations')) {
    map.addSource('locations', {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features,
      },
    });
  } else {
    map.getSource('locations').setData({
      type: 'FeatureCollection',
      features,
    });
  }
  // creating Locations layer
  if (!map.getLayer('locations')) {
    map.addLayer({
      id: 'locations',
      type: 'circle',
      source: 'locations',
      paint: {
        'circle-color': '#000012',
        'circle-radius': 6,
        'circle-stroke-width': 2,
        'circle-stroke-color': '#ffffff',
      },
    });
  }
  // center map on clicked location (with padding to the right)
  map.on('click', 'locations', (e) => {
    // add marker to clicked location
    document.querySelector('.marker') &&
      document.querySelector('.marker').remove();
    const el = document.createElement('div');
    el.className = 'marker';
    new mapboxgl.Marker(el)
      .setLngLat(e.features[0].geometry.coordinates)
      .addTo(map);
    // centering to the location
    map.easeTo({
      center: e.features[0].geometry.coordinates,
      padding: { right: window.innerWidth * 0.2 },
      duration: 1000,
    });
  });
};

const populatePopups = () => {
  const popup = new mapboxgl.Popup({
    closeButton: false,
    closeOnClick: false,
  });
  map.on('mouseenter', 'locations', (e) => {
    map.getCanvas().style.cursor = 'pointer';
    const coordinates = e.features[0].geometry.coordinates.slice();
    const description = e.features[0].properties.description;
    // Populate the popup and set its coordinates
    popup.setLngLat(coordinates).setHTML(description).addTo(map);
  });
  // hide popup when cursor leaves
  map.on('mouseleave', 'locations', () => {
    map.getCanvas().style.cursor = 'crosshair';
    popup.remove();
  });
  // clicking on the Location
  map.on('click', 'locations', (e) => {
    mapboxViews.displayLocationInfo(e.features[0].properties);
  });
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
  // for Routes layer to be lower than Locations
  map.moveLayer('route-layer', 'locations');
};

const createFeature = (loc) => {
  features.push({
    type: 'Feature',
    properties: {
      description: `
        <div class='location-description'>
          <h3>${loc.name}</h3>
          <h4>${loc.address}</h4>
          <h5>${loc.description}</h5>
        </div>
        `,
      name: loc.name,
      address: loc.address,
      desc: loc.description,
      coordinates: loc.coordinates,
      images: loc.images,
      id: loc.id,
    },
    geometry: {
      type: 'Point',
      coordinates: loc.coordinates,
    },
  });
};

const locationPopupHandler = async (form, coordArray) => {
  trips.persistLocation(form);
  createFeature({
    name: form.get('name'),
    address: form.get('address'),
    description: form.get('description'),
    coordinates: coordArray,
    images: form.get('images'),
  });
  createLocationsLayer();
  waypoints.push(coordArray);
  if (waypoints.length > 1) {
    const geoData = await trips.createGeoJSON(waypoints);
    drawRoute(geoData);
  }
};
