import onChange from 'on-change';
import _ from 'lodash';
import axios from 'axios';
import validator from './validator.js';
import config from './config.js';
import parser from './parser';

import {
  renderErrors, renderFeed, renderPosts, renderForm, toggleForm,
} from './view';

export default (i18next) => {
  const state = {
    form: {
      processState: 'filling',
      fields: {
        url: '',
        feedsUrl: [],
      },
      valid: false,
      errors: [],
    },
    feeds: [],
    posts: [],
    uiState: {
      viewPosts: [],
    },
  };

  const updateValidationState = (watchedState) => {
    const errors = validator(watchedState.feeds, watchedState.form.fields, i18next);
    watchedState.form.valid = _.isEqual(errors, {});
    watchedState.form.errors = errors;
  };

  const elements = {
    form: document.querySelector('.rss-form'),
    url: document.querySelector('.form-control.form-control-lg.w-100'),
    feedback: document.querySelector('.feedback'),
    feedsElement: document.querySelector('.feeds'),
    postsElement: document.querySelector('.posts'),
    button: document.querySelector('[type="submit"]'),
  };
  const watchedState = onChange(state, (path, value) => {
    if (path === 'feeds') {
      renderFeed(state, elements, i18next);
    } else if (path === 'posts') {
      renderPosts(state, elements, i18next);
    } else if (path === 'form.errors') {
      renderErrors(elements, value, i18next);
    } if (path === 'form.processState') {
      if (state.form.processState === 'pending') {
        toggleForm(elements, 'true');
      } if (state.form.processState === 'finished') {
        if (state.form.valid === true && _.isEmpty(state.form.errors)) {
          renderForm(state, elements, i18next);
          toggleForm(elements, 'false');
        } else {
          toggleForm(elements, 'false');
        }
      }
    }
  });

  const setId = (data, id) => {
    const { feed, items } = data;
    feed.id = id;
    items.forEach((item) => ({
      title: item.title,
      link: item.link,
      id: item.id,
    }));
    return {
      feed,
      items,
    };
  };

  const loadFeed = (path) => axios.get(`${config.proxy}${path}`)
    .then((response) => {
      const feedAndPost = parser(response.data.contents);
      const marked = setId(feedAndPost, path);
      watchedState.feeds = [...state.feeds, marked.feed];
      watchedState.posts = [...state.posts, ...marked.items];
      watchedState.form.fields.feedsUrl.push(path);
    })
    .catch((error) => {
      if (error.isAxiosError) {
        error.message = i18next.t('notInternet');
        watchedState.form.errors = { ...state.form.errors, url: error };
        watchedState.form.processState = 'failed';
      } else {
        error.message = i18next.t('urlNotRss');
        watchedState.form.errors = { ...state.form.errors, url: error };
        watchedState.form.processState = 'failed';
      }
    })
    .then(() => {
      watchedState.form.processState = 'finished';
    });

  const onChangeInput = (e) => {
    watchedState.form.fields.url = e.target.value;
  };

  const onSubmit = (e) => {
    e.preventDefault();
    updateValidationState(watchedState);
    if (state.form.valid === false) {
      return;
    }
    try {
      loadFeed(watchedState.form.fields.url);
      watchedState.form.processState = 'pending';
    } catch (err) {
      watchedState.form.errors = { ...state.form.errors, ...err };
      watchedState.form.processState = 'failed';
    }
  };

  elements.form.addEventListener('submit', onSubmit);
  elements.url.addEventListener('input', onChangeInput);

  const refreshFeeds = (path) => axios.get(`${config.proxy}${path}`)
    .then((response) => {
      if (_.isEmpty(response.data)) {
        return [];
      }
      const refreshFeedsAndPosts = parser(response.data.contents);
      const marked = setId(refreshFeedsAndPosts, path);
      const filteredPosts = state.posts.filter(({ id }) => id === path);
      const diff = _.differenceWith(filteredPosts, marked.items, _.isEqual);
      return diff;
    })
    .catch((e) => {
      watchedState.form.errors = { ...state.form.errors, ...e };
      watchedState.form.processState = 'failed';
    });
  const refreshPosts = () => {
    const promise = state.feeds.map((feed) => refreshFeeds(feed.id));
    Promise.all(promise).then((newPost) => {
      const flattedNewPost = _.flatten(newPost);
      watchedState.posts = [...state.posts, ...flattedNewPost];
      setTimeout(refreshPosts, 5000);
    });
  };
  setTimeout(refreshPosts, 5000);
};
