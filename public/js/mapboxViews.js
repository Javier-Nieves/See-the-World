/* eslint-disable */
import { map } from './mapboxController';

export const activateGeocoder = () => {
  const geocoder = new MapboxGeocoder({
    accessToken: mapboxgl.accessToken,
    mapboxgl,
  });
  document.querySelector('#geocoder').appendChild(geocoder.onAdd(map));
};

export const add_marker = (event, handler) => {
  // clear all popups opened earlier
  const oldPopups = document.querySelectorAll('.mapboxgl-popup');
  oldPopups.forEach((popup) => popup.remove());

  const coordinates = event.lngLat;

  const popup = new mapboxgl.Popup({ closeOnClick: false })
    .setLngLat(coordinates)
    .setHTML(
      `<form class='newLocation__popup-form'>
        <input type='text' class='newLocation__popup-name' placeholder='Name' name='name'>
        <input type='text' class='newLocation__popup-address' placeholder='Address' name='address'>
        <input type='text' class='newLocation__popup-desc' placeholder='Description' name='desc'>
        <input type='file' accept='image/*' id='images' multiple name='images'>
        <input type='submit' value='Add location'>
      </form>`,
    )
    .addTo(map);

  addHandler(popup, handler);
};

const addHandler = (popup, handler) => {
  document
    .querySelector('.newLocation__popup-form')
    .addEventListener('submit', (e) => {
      e.preventDefault();
      const coordArray = [popup._lngLat.lng, popup._lngLat.lat];
      const form = createFormData(coordArray);
      popup.remove();
      handler(form, coordArray);
    });
};

const createFormData = (coordArray) => {
  const form = new FormData();
  form.append('name', document.querySelector('.newLocation__popup-name').value);
  // prettier-ignore
  form.append('address', document.querySelector('.newLocation__popup-address').value);
  // prettier-ignore
  form.append('description', document.querySelector('.newLocation__popup-desc').value);
  form.append('coordinates', coordArray);
  const images = document.querySelector('#images').files;
  for (let i = 0; i < images.length; i++) form.append('images', images[i]);
  return form;
};
