/* eslint-disable */
import * as mapboxViews from './mapboxViews.js';
import * as mapboxModel from './mapboxModel.js';

export let map;
// waypoints - array for GeoJson creation => routes
let waypoints = [];
// features - array for the map.addSource method, contains Locations data
let features = [];

export const displayMap = async (locations) => {
  // main map configuration
  await mapboxModel.getKeys();
  mapboxgl.accessToken = mapboxModel.TOKEN;
  map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11',
    scrollZoom: window.location.href.includes('locations'),
    // center: [-74.07, 4.64],
    // zoom: 11,
  });
  // adding zoom buttons
  map.addControl(new mapboxgl.NavigationControl());
  // adding scale
  map.addControl(new mapboxgl.ScaleControl());
  // change cursor
  map.getCanvas().style.cursor = 'crosshair';

  // Trip page or Locations edit page?
  if (window.location.href.includes('locations')) {
    mapboxViews.activateGeocoder();
    map.on('click', (e) => mapboxViews.add_marker(e, locationPopupHandler));
  }

  if (locations.length === 0) return;

  const bounds = new mapboxgl.LngLatBounds();

  // locations and routes are created on the map via new layers
  // layers use Sourses, which are filled from arrays:
  fillGeoArrays(locations, bounds);
  map.on('load', createLocationsLayer);

  // adding padding to the map
  map.fitBounds(bounds, {
    padding: {
      top: 50,
      bottom: 50,
      left: 50,
      right: 50,
    },
    duration: 3000,
  });

  populatePopups();

  // getting GeoJSON data for location points
  const routeData = await mapboxModel.createGeoJSON(waypoints);
  drawRoute(routeData);
};

const fillGeoArrays = (locations, bounds) => {
  // create an array for future map.addSource method
  // and waypoints array for Routes drawing
  locations.forEach((loc) => {
    waypoints.push(loc.coordinates);
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
        images: loc.images,
      },
      geometry: {
        type: 'Point',
        coordinates: loc.coordinates,
      },
    });
    // extend map to fit current location
    bounds.extend(loc.coordinates);
  });
};

const createLocationsLayer = () => {
  if (map.getLayer('locations')) {
    map.removeLayer('locations');
    map.removeSource('locations');
  }
  map.addSource('locations', {
    type: 'geojson',
    data: {
      type: 'FeatureCollection',
      features,
    },
  });
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
  // center map on clicked location
  map.on('click', 'locations', (e) => {
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
  map.on('click', 'locations', (e) => {
    mapboxViews.displayLocationInfo(e.features[0].properties);
    popup.remove();
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

const createFeature = (name, address, description, coordArray) => {
  features.push({
    type: 'Feature',
    properties: {
      description: `
    <div class='location-description'>
      <h3>${name}</h3>
      <h4>${address}</h4>
      <h5>${description}</h5>
    </div>
    `,
    },
    geometry: {
      type: 'Point',
      coordinates: coordArray,
    },
  });
};

const locationPopupHandler = async (form, coordArray) => {
  mapboxModel.persistLocation(form);
  createFeature(
    form.get('name'),
    form.get('address'),
    form.get('description'),
    coordArray,
  );
  createLocationsLayer();
  waypoints.push(coordArray);
  if (waypoints.length > 1) {
    const geoData = await mapboxModel.createGeoJSON(waypoints);
    drawRoute(geoData);
  }
};
