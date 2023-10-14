/* eslint-disable */
export const displayMap = (locations) => {
  console.log('displaying map', locations);
  mapboxgl.accessToken =
    'pk.eyJ1IjoiamF2aWVyLW5pZXZlcyIsImEiOiJjbG5heWppeDUwN2FyMmxwZ2VqZjBxZGdqIn0.jaVtxVlnW5rlkf2jlNVFlg';
  const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11',
    scrollZoom: false,
    center: [-74.07, 4.64],
    zoom: 11,
  });

  // const bounds = new mapboxgl.LngLatBounds();

  // locations.forEach(loc => {
  //   // create marker
  //   const el = document.createElement('div');
  //   el.className = 'marker';

  //   // add marker to map
  //   new mapboxgl.Marker({
  //     element: el,
  //     anchor: 'bottom'
  //   })
  //     .setLngLat(loc.coordinates)
  //     .addTo(map);

  //   // add popup
  //   new mapboxgl.Popup({
  //     offset: 30
  //   })
  //     .setLngLat(loc.coordinates)
  //     .setHTML(`<p>${loc.day} : ${loc.description}</p>`)
  //     .addTo(map);

  //   // extend map to fit current location
  //   bounds.extend(loc.coordinates);
  // });
  // map.fitBounds(bounds, {
  //   padding: {
  //     top: 200,
  //     bottom: 150,
  //     left: 100,
  //     right: 100
  //   }
  // });
};
