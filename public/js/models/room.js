/* eslint-disable */

import axios from 'axios';

export const roomResult = async roomId => {
  try {
    const res = await axios({
      method: 'GET',
      url: `/api/v1/rooms/${roomId}`
    });

    if (res.data.status === 'success') {
      return res;
    }
  } catch (err) {
    err;
  }
};
