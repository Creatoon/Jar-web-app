/* eslint-disable */

import axios from 'axios';
import { showAlert } from '../views/alert';

export const propose = async (passwordHere, roomId) => {
  try {
    const res = await axios({
      method: 'POST',
      url: `/api/v1/proposal/${roomId}`,
      data: {
        password: passwordHere,
        room: roomId
      }
    });

    if (res.data.status === 'success') {
      showAlert(
        'success',
        'Congrats!! you have successfully joined this room '
      );

      window.setTimeout(() => {
        location.assign(`/room/${roomId}`);
      }, 1000);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
    if (err.response.data.message.toLowerCase() === 'sorry wrong password') {
      window.setTimeout(() => {
        location.reload(true);
      }, 1000);
    } else {
      window.setTimeout(() => {
        location.assign(`/room/${roomId}`);
      }, 1000);
    }
  }
};
