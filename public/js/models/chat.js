/* eslint-disable */

import axios from 'axios';
import { showAlert } from '../views/alert';

export const deleteChat = async chatId => {
  try {
    const res = await axios({
       method: 'delete',
       url: `/api/v1/chat/${chatId}`
    });
     
    if (res.data === '') {
      showAlert('success', 'Message deleted successfully!');
      window.setTimeout(() => {
         location.reload();
      }, 1500);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
