/* eslint-disable */
import axios from 'axios';
import { showAlert } from './../views/alert';

// type is either 'password' or 'data'
export const updateSettings = async data => {
  try {
    const res = await axios({
      method: 'PATCH',
      url: '/api/v1/users/updateMe',
      data
    });

    if (res.data.status === 'success') {
      showAlert('success', `Photo updated successfully!`);
      window.setTimeout(() => {
        location.reload(true);
      }, 1000);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

export const updatePassword = async (
  passwordCurrent,
  password,
  passwordConfirm
) => {
  try {
    const res = await axios({
      method: 'PATCH',
      url: '/api/v1/users/updateMyPassword',
      data: {
        passwordCurrent,
        password,
        passwordConfirm
      }
    });

    if (res.data.status === 'success') {
      showAlert('success', `Password updated successfully!`);
      window.setTimeout(() => {
        location.reload(true);
      }, 1000);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
