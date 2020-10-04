/* eslint-disable */

import axios from 'axios';

export const searchResults = async name => {
  try {
    const res = await axios({
      method: 'GET',
      url: `/api/v1/rooms/name/${name}`
    });

    if (res.data.status === 'success') {
      return res;
    }
  } catch (err) {
    err;
  }
};
