/* eslint-disable */
import axios from 'axios';

export const createTrip = async (formData) => {
  const res = await axios({
    method: 'POST',
    url: 'http://127.0.0.1:3000/api/v1/trips',
    data: {
      name: formData.name,
      date: formData.date,
      description: formData.description,
      highlight: formData.highlight,
    },
  });

  if (res.data.status === 'success') {
    // console.log(res.data.data.newTrip._id);
    location.assign(`/trips/${res.data.data.newTrip._id}/locations`);
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

  console.log(res);
  if (res.status === 204) {
    // todo - message
    setTimeout(() => {
      location.assign(`/`);
    }, 1500);
  }
};
