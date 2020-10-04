/* eslint-disable */

import axios from 'axios';
import { showAlert } from '../views/alert';

export const signup = async (name, email, password, passwordConfirm) => {
  try {
    const res = await axios({
      method: 'POST',
      url: '/api/v1/users/signup',
      data: {
        name,
        email,
        password,
        passwordConfirm
      }
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Signed up successfully!');
      window.setTimeout(() => {
        location.assign('/room/default');
      }, 1500);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
