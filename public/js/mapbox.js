/* eslint-disable */
const myAPIKey = 'db5135ba42fa433eb6156159518a20ba';

export const displayMap = async (locations) => {
  // main map configuration
  mapboxgl.accessToken =
    'pk.eyJ1IjoiamF2aWVyLW5pZXZlcyIsImEiOiJjbG5heWppeDUwN2FyMmxwZ2VqZjBxZGdqIn0.jaVtxVlnW5rlkf2jlNVFlg';
  const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11',
    // scrollZoom: false,
    center: [-74.07, 4.64],
    zoom: 11,
  });
  // adding zoom buttons
  map.addControl(new mapboxgl.NavigationControl());

  const bounds = new mapboxgl.LngLatBounds();

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

    // add popup
    // new mapboxgl.Popup({
    //   offset: 30,
    // })
    //   .setLngLat(loc.coordinates)
    //   .setHTML(`<p>${loc.description}</p>`)
    //   .addTo(map);

    // extend map to fit current location
    bounds.extend(loc.coordinates);
  });
  console.log(waypoints);

  // adding padding to the map
  map.fitBounds(bounds, {
    padding: {
      top: 30,
      bottom: 15,
      left: 10,
      right: 10,
    },
  });

  let wayPointsString = '';
  // let wayPointsString = 'lonlat:-74,4|lonlat:-73.76,4.53|lonlat:-74.06,4.6';
  waypoints.forEach((place) => {
    wayPointsString += `lonlat:${place.join(',')}|`;
  }); // ${fromWaypoint.join(",")}|lonlat:${toWaypoint.join(",")}|lonlat:${thirdPoint.join(",")}
  wayPointsString = wayPointsString.slice(0, -1);
  console.log(wayPointsString);
  // prettier-ignore
  const res = await fetch(`https://api.geoapify.com/v1/routing?waypoints=${wayPointsString}&mode=hike&details=route_details,elevation&apiKey=${myAPIKey}`);
  const result = await res.json();

  const routeData = result;
  map.addSource('route', {
    type: 'geojson',
    data: routeData,
  });

  drawRoute(map, waypoints);
};

const drawRoute = (map, waypoints) => {
  if (!waypoints) return;
  if (map.getLayer('route-layer')) map.removeLayer('route-layer');

  map.getSource('route').setData(waypoints);
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
      'line-width': 8,
    },
    filter: ['==', '$type', 'LineString'],
  });
};
