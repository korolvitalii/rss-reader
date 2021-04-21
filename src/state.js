import onChange from 'on-change';
import _ from 'lodash';
import axios from 'axios';
import validator from './validator.js';
import config from './config.js';
import parser from './parser';

const renderErrors = (elements, errors) => {
  Object.entries(elements).forEach(([name, element]) => {
    const error = errors[name];
    if (!error) {
      element.classList.remove('is-invalid');
    } else {
      element.classList.add('is-invalid');
    }
  });
};

const errorMessages = {
  network: {
    error: 'Network Problems. Try again.',
  },
};

const updateValidationState = (watchedState) => {
  const errors = validator(watchedState.form.fields);
  watchedState.form.valid = _.isEqual(errors, {});
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
    feeds: [],
    posts: [],
  };
  const form = document.querySelector('.rss-form');
  const fieldElements = {
    website: document.querySelector('.form-control.form-control-lg.w-100'),
  };

  const watchedState = onChange(state, (path, value) => {
    console.log(`PATH === ${path}`);
    console.log(`VALUE === ${value}`);
    switch (path) {
      case 'form.fields.website':
      // GET DATA AND RENDER
        break;
      case 'form.errors':
        renderErrors(fieldElements, value);
        break;
      default:
        break;
    }
  });

  Object.entries(fieldElements).forEach(([name, element]) => {
    element.addEventListener('input', (e) => {
      watchedState.form.fields[name] = e.target.value;
    });
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    updateValidationState(watchedState);
  });
  const getData = axios.get(`${config.proxy}https://habr.com/ru/rss/all/all/?fl=ru`)
    .then((response) => {
      const parsedData = parser(response.data.contents);
      // parsedData.title.forEach((title) => console.log(title.textContent));
      console.log(parsedData);
    })
    .catch((error) => {
      console.log(error);
    })
    .then(() => {
      console.log('finished');
    });
};
