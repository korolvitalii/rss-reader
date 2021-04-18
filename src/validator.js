import _ from 'lodash';
import * as yup from 'yup';
import onChange from 'on-change';
import axios from 'axios';

const schema = yup.object().shape({
  website: yup.string().url(),
});

const errorMessages = {
  network: {
    error: 'Network Problems. Try again.',
  },
};

const validate = (fields) => {
  try {
    schema.validateSync(fields, { abortEarly: false });
    return {};
  } catch (e) {
    return _.keyBy(e.inner, 'path');
  }
};

export default () => {
  const state = {
    form: {
      processState: 'filling',
      processError: null,
      fields: {
        name: '',
      },
      valid: true,
      errors: {},
    },
  };
  const form = document.querySelector('.rss-form');
  console.log('hui');
};
