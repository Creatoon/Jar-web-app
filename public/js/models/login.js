/* eslint-disable */

import axios from 'axios';
import { showAlert } from '../views/alert';

export let userId;

export const login = async (email, password) => {
  try {
    const res = await axios({
      method: 'POST',
      url: '/api/v1/users/login',
      data: {
        email,
        password
      }
    });

    if (res.data.status === 'success') {
      userId = res.data.data.user.id;
      showAlert('success', 'Logged in successfully!');
      window.setTimeout(() => {
        location.assign('/room/default');
      }, 1500);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

export const logout = async () => {
  try {
    const res = await axios({
      method: 'GET',
      url: '/api/v1/users/logout'
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Logged Out Successfully!');
      window.setTimeout(() => {
        location.assign('/login');
      }, 1500);
    }
  } catch (err) {
    showAlert('error', 'Error logging out! Try again');
  }
};
