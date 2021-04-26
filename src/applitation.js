import onChange from 'on-change';
import _ from 'lodash';
import axios from 'axios';
import validator from './validator.js';
import config from './config.js';
import parser from './parser';
import { renderErrors, renderFeed, renderPosts, renderForm } from './view';

const errorMessages = {
  network: {
    error: 'Network Problems. Try again.',
  },
};

export default () => {
  const state = {
    form: {
      processState: 'filling',
      processError: [],
      fields: {
        url: '',
      },
      valid: false,
      errors: [],
    },
    feeds: [],
    posts: [],
  };

  const updateValidationState = (watchedState) => {
    const errors = validator(watchedState.form.fields);
    watchedState.form.valid = _.isEqual(errors, {});
    watchedState.form.errors = errors;
  };

  const form = document.querySelector('.rss-form');

  const elements = {
    url: document.querySelector('.form-control.form-control-lg.w-100'),
    feedback: document.querySelector('.feedback'),
    feedsElement: document.querySelector('.feeds'),
    postsElement: document.querySelector('.posts'),
    button: document.querySelector('.btn-primary'),
  };

  const watchedState = onChange(state, (path, value) => {
    if (path === 'feeds') {
      renderFeed(state, elements);
    } else if (path === 'posts') {
      renderPosts(state, elements);
    } else if (path === 'form.errors') {
      renderErrors(elements, value);
    } else if (path === 'form.processState') {
      if (state.form.processState === 'checking') {
        updateValidationState(watchedState);
      }
      if (state.form.processState === 'finished') {
        if (state.form.valid === true) {
          renderForm(state, elements);
        }
      }
    }
  });

  const loadFeed = (path) => axios.get(`${config.proxy}${path}`)
    .then((response) => {
      const feedAndPost = parser(response.data.contents);
      watchedState.feeds = [...state.feeds, feedAndPost.feed];
      watchedState.posts = [...state.posts, ...feedAndPost.items];
    })
    .catch((error) => {
      watchedState.form.processError = error;
    })
    .then(() => {
      watchedState.form.processState = 'finished';
    });

  elements.url.addEventListener('input', (e) => {
    watchedState.form.fields.url = e.target.value;
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    watchedState.form.processState = 'checking';
    try {
      loadFeed(watchedState.form.fields.url);
      watchedState.form.processState = 'sending';
    } catch (err) {
      watchedState.form.processError = errorMessages.network.error;
      watchedState.form.processState = 'failed';
    }
  });
};
