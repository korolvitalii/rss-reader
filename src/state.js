import onChange from 'on-change';
import _ from 'lodash';
import axios from 'axios';
import validator from './validator.js';
import config from './config.js';
import parser from './parser';

const errorMessages = {
  network: {
    error: 'Network Problems. Try again.',
  },
};

const updateValidationState = (watchedState) => {
  const errors = validator(watchedState.form.fields);
  watchedState.form.valid = _.isEqual(errors, {});
  console.log( watchedState.form.valid);
  watchedState.form.errors = errors;
};

export default () => {
  const state = {
    form: {
      processState: 'filling',
      processError: null,
      fields: {
        website: '',
      },
      valid: false,
      errors: {},
    },
  };
  const form = document.querySelector('.rss-form');
  const fieldElements = {
    website: document.querySelector('.form-control.form-control-lg.w-100'),
  };
  const submitButton = form.querySelector('[type="submit"]');

  const watchedState = onChange(state, (path, value) => {
    switch (path) {
      case 'form.valid':
        submitButton.disabled = !value;
        break;
      case 'form.errors':
        // renderErrors(fieldElements, value);
        break;
      default:
        break;
    }
  });

  Object.entries(fieldElements).forEach(([name, element]) => {
    element.addEventListener('input', (e) => {
      watchedState.form.fields[name] = e.target.value;
      updateValidationState(watchedState);
    });
  });
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    watchedState.form.processState = 'sending';
    try {
    //   await axios.post(routes.usersPath(), watchedState.form.fields);
      watchedState.form.processState = 'finished';
    } catch (err) {
      // В реальных приложениях также требуется корректно обрабатывать сетевые ошибки
      watchedState.form.processError = errorMessages.network.error;
      watchedState.form.processState = 'failed';
      // здесь это опущено в целях упрощения приложения
      throw err;
    }
  });
  const getData = axios.get(`${config.proxy}https://habr.com/ru/rss/all/all/?fl=ru`)
    .then((response) => {
      const parsedData = parser(response.data.contents);
      console.log(parsedData);
    })
    .catch((error) => {
      console.log(error);
    })
    .then(() => {
      console.log('finished');
    });
};
