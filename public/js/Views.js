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
        <input type='text' class='newLocation__popup-name' placeholder='Name'>
        <input type='text' class='newLocation__popup-address' placeholder='Address'>
        <input type='text' class='newLocation__popup-desc' placeholder='Description'>
        <input type='file' accept='image/*' id='images' multiple>
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

export const removePopup = () =>
  document
    .querySelectorAll('.mapboxgl-popup')
    .forEach((popup) => popup.remove());

export const displayLocationInfo = (info) => {
  // remove old popups
  document
    .querySelectorAll('.mapboxgl-popup')
    .forEach((popup) => popup.remove());
  // show and fill location info block
  const infoContainer = document.querySelector('.trip-info__details-window');
  const infoBlock = document.querySelector('.trip-info__location-info');
  infoBlock.innerHTML = '';
  infoBlock.insertAdjacentHTML('afterBegin', generateMarkup(info));
  infoBlock.classList.remove('hidden');
  infoContainer.style.display = 'flex';
};

const generateMarkup = (info) => {
  let markup;
  let gallery = '';
  const imagesArray = JSON.parse(info.images);
  for (let i = 0; i < imagesArray.length; i++)
    gallery += `<img class='trip-info__loc-image' src='/img/locations/${imagesArray[i]}'>`;

  if (window.location.href.includes('locations')) {
    markup = `
    <h2 class='location-data-holder' data-locationid=${info.id}>Change location info</h2>
    <div class='flex-container'>
      <div class='location-info__text'> Name: </div>
      <input type='text' class='location-info__editName' value=${info.name}>
    </div>
    <div class='flex-container'>
      <div class='location-info__text'> Adress: </div>
      <input type='text' class='location-info__editAddress' value=${info.address}>
    </div>
    <div class='flex-container'>
      <div class='location-info__text'> Description: </div>
      <textarea class='location-info__editDesc'> ${info.desc} </textarea>
    </div>  
    <div class='flex-container'>
      <form class='flex-column location-info__newCoordForm'>
        <div>
          <div class='location-info__text'> Location: </div>
          <input type='text' class='location-info__editCoord' value=${info.coordinates}>
        </div>
        <button> Choose new coordinates </button>
      </form>
    </div> 
    <div class='flex-container'>
      ${gallery}
    </div>
    `;
  } else {
    markup = `
    <h1>${info.name}</h1>
    <h2>${info.address}</h2>
    <h3>${info.desc}</h3>
    <div class='flex-container'>
        ${gallery}
    </div>
  `;
  }
  return markup;
};

// Search:
export const loadSearchResults = (data) => {
  console.log('search data: ', data);
  const container = document.querySelector('.friendsPage__search-results');
  container.innerHTML = '';
  document.querySelector('.friendsPage__table').style.display = 'flex';
  data.forEach((result) => {
    const markup = `<tr class='data-holder' data-userid=${result._id}>
          <td>
            <img src='/img/users/${result.photo}' class='friendsPage__pic'></img>
          </td>
          <td>${result.name}</td>
          <td>Trips of this person</td>
          </tr>`;
    container.insertAdjacentHTML('beforeend', markup);
  });
};

export const createFriend = (element) => {
  element.querySelector('button').remove();
  const parent = document.querySelector('.friendsPage__friendsContainer');
  parent.insertAdjacentElement('beforeend', element);
};
