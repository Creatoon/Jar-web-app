/* eslint-disable */

import axios from 'axios';
import { showAlert } from '../views/alert';
import { propose } from '../models/proposal';

export const registerGroup = async (data, password) => {
  try {
    const res = await axios({
      method: 'POST',
      url: '/api/v1/rooms',
      data
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Wait!! Room is being created');

      if (password === undefined)
        password =
          'afaefeaJFNEWjfneJEWFFF&^*%t&oiylvhyvkvhEWKNFLKFNEF32E32233&%^76^$%^$&^yfjhcvghCGHCGXFD$@%%%##jkjbjkbjk';

      propose(password, res.data.data.data.id);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
