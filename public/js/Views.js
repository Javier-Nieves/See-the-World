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
  // add marker and form when map is clicked. Add handler to the form
  // clear all popups opened earlier
  const oldPopups = document.querySelectorAll('.mapboxgl-popup');
  oldPopups.forEach((popup) => popup.remove());
  // close info window if opened
  closeDetails();

  const coordinates = event.lngLat;

  const popup = new mapboxgl.Popup({ closeOnClick: false })
    .setLngLat(coordinates)
    .setHTML(
      `<form class='flex-column newLocation__popup-form'>
        <input type='text' class='newLocation__popup-name' placeholder='Name'>
        <input type='text' class='newLocation__popup-address' placeholder='Address'>
        <input type='text' class='newLocation__popup-desc' placeholder='Description'>
        <input type='file' accept='image/*' id='images' multiple>
        <input type='submit' class='newLocation__add-btn' value='Add location'>
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
  infoContainer.classList.add('active-info-window');
  const infoBlock = document.querySelector('.trip-info__location-info');
  infoBlock.innerHTML = '';
  infoBlock.insertAdjacentHTML('afterBegin', generateMarkup(info));
  // infoBlock.classList.remove('hidden');
  infoContainer.style.display = 'flex';
};

const generateMarkup = (info) => {
  let markup;
  let gallery = '';
  if (info.images) {
    const imagesArray = JSON.parse(info.images) || [];
    for (let i = 0; i < imagesArray.length; i++)
      gallery += `<img class='trip-info__loc-image' src='/img/locations/${imagesArray[i]}'>`;
  }
  if (window.location.href.includes('locations')) {
    // clicking on the location marker on the "Add locations page"
    const remadeCoord = info.coordinates
      .slice(1, -1)
      .split(',')
      .map(Number)
      .map((num) => num.toFixed(3))
      .join(', ');
    markup = `
    <h2 class='location-data-holder' data-locationid='${info.id}'>Change location info</h2>
    <div class='flex-container location-info__infoLine'>
      <div class='location-info__text'> Name: </div>
      <input type='text' class='location-info__editName' value='${info.name}'>
    </div>
    <div class='flex-container location-info__infoLine'>
      <div class='location-info__text'> Address: </div>
      <input type='text' class='location-info__editAddress' value='${info.address}'>
    </div>
    <div class='flex-container location-info__infoLine'>
      <div class='location-info__text'> Description: </div>
      <textarea class='location-info__editDesc'> ${info.desc} </textarea>
    </div>  
    <div class='flex-container location-info__infoLine location-info__coordBlock'>
      <div class='location-info__text'> Location: </div>
      <div class='flex-column location-info__newCoordForm'>
        <input type='text' class='location-info__editCoord' value='${remadeCoord}'>
        <button class='location-info__coordBtn'> Choose new coordinates </button>
      </div>
    </div>
    <div class='flex-container'>
      ${gallery}
    </div>
    `;
  } else {
    // clicking on the location on the trip's page:
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

// Friends search:
export const loadSearchResults = (data) => {
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

export const showAlert = (type, text) => {
  const alert = document.querySelector('.alert-container');
  const alertText = document.querySelector('.alert-text');
  alertText.innerHTML = text;
  alert.classList.remove('hidden-alert');
  alert.classList.add(type);
  setTimeout(() => {
    alert.classList.add('hidden-alert');
  }, 1000);
};

export const closeDetails = () => {
  // close location info window
  document
    .querySelector('.trip-info__details-window')
    .classList.remove('active-info-window');
  // delete marker from the location
  document.querySelector('.marker') &&
    document.querySelector('.marker').remove();
};
