import onChange from 'on-change';
import _ from 'lodash';
import axios from 'axios';
import validator from './validator.js';
import config from './config.js';
import parser from './parser';
import { renderErrors, renderFeed, renderPosts } from './view';

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
    feeds: '',
    posts: '',
  };
  const form = document.querySelector('.rss-form');
  const fieldElements = {
    website: document.querySelector('.form-control.form-control-lg.w-100'),
  };
  const formElements = {
    feedback: document.querySelector('.feedback'),
    feeds: document.querySelector('.feeds'),
    posts: document.querySelector('.posts'),
  };

  const watchedState = onChange(state, (path, value) => {
    // console.log(path);
    if (path === 'feeds') {
      renderFeed(state, formElements);
    } else if (path === 'posts') {
      renderPosts(state, formElements);
    } else if (path === 'form.errors') {
      renderErrors(fieldElements, formElements, value);
    } else {
      // renderForm();
    }
  });

  const loadFeed = (path) => axios.get(`${config.proxy}${path}`)
    .then((response) => {
      const feedAndPost = parser(response.data.contents);
      watchedState.feeds = feedAndPost.feed;
      watchedState.posts = feedAndPost.items;
    })
    .catch((error) => {
      watchedState.form.processError = error;
    })
    .then(() => {
      watchedState.form.processState = 'finished';
    });

  Object.entries(fieldElements).forEach(([name, element]) => {
    element.addEventListener('input', (e) => {
      watchedState.form.fields[name] = e.target.value;
    });
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    watchedState.form.processState = 'sending';
    updateValidationState(watchedState);
    try {
      loadFeed(watchedState.form.fields.website);
      watchedState.form.processState = 'finished';
    } catch (err) {
      watchedState.form.processError = errorMessages.network.error;
      watchedState.form.processState = 'failed';
    }
    // console.log(state);
  });
  // console.log(state);
};
