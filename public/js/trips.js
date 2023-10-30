/* eslint-disable */
import axios from 'axios';

export const changeTrip = async (data, tripId) => {
  const res = await axios({
    method: tripId ? 'PATCH' : 'POST',
    url: tripId
      ? `http://127.0.0.1:3000/api/v1/trips/${tripId}`
      : 'http://127.0.0.1:3000/api/v1/trips',
    data: {
      name: data.name,
      date: data.date,
      duration: data.duration,
      description: data.description,
      highlight: data.highlight,
      private: data.friendsOnly,
    },
  });

  if (res.data.status === 'success') {
    tripId
      ? console.log('Trip is modified')
      : location.assign(`/trips/${res.data.data.newTrip._id}/locations`);
  }
};

export const deleteTrip = async () => {
  const tripId = window.location.href.slice(
    window.location.href.lastIndexOf('trips/') + 6,
  );

  const res = await axios({
    method: 'DELETE',
    url: `http://127.0.0.1:3000/api/v1/trips/${tripId}`,
  });

  if (res.status === 204) {
    // todo - message
    setTimeout(() => {
      location.assign(`/`);
    }, 1500);
  }
};

export const editLocation = async (data, locationId) => {
  const res = await axios({
    method: 'PATCH',
    url: `http://127.0.0.1:3000/api/v1/locations/${locationId}`,
    data,
  });

  if (res.data.status === 'success') {
    console.log('Location is modified');
  }
};

export const deleteLocation = async (locationId) => {
  const res = await axios({
    method: 'DELETE',
    url: `http://127.0.0.1:3000/api/v1/locations/${locationId}`,
  });

  if (res.data.status === 'success') {
    console.log('Location is deleted');
  }
};
