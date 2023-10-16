/* eslint-disable */
import axios from 'axios';

export const createTrip = async () => {
  const res = await axios({
    method: 'POST',
    url: 'http://127.0.0.1:3000/api/v1/trips',
  });
};
