import onChange from 'on-change';
import _ from 'lodash';
import axios from 'axios';
import i18next from 'i18next';
import validator from './validator.js';
import config from './config.js';
import parser from './parser';
import locale from './locale';
import {
  renderErrors, renderFeed, renderPosts, renderForm,
} from './view';

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
        feedsUrl: [],
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

  const elements = {
    url: document.querySelector('.form-control.form-control-lg.w-100'),
    feedback: document.querySelector('.feedback'),
    feedsElement: document.querySelector('.feeds'),
    postsElement: document.querySelector('.posts'),
    button: document.querySelector('.btn-primary'),
    form: document.querySelector('.rss-form'),

  };
  const watchedState = onChange(state, (path, value) => {
    if (path === 'feeds') {
      renderFeed(state, elements);
    } else if (path === 'posts') {
      renderPosts(state, elements);
    } else if (path === 'form.errors') {
      renderErrors(elements, value);
    } if (state.form.processState === 'finished') {
      if (state.form.valid === true) {
        renderForm(state, elements);
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
      watchedState.form.processError = { url: error };
      // watchedState.form.processState = 'failed';
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
      watchedState.form.processState = 'sending';
    } catch (err) {
      watchedState.form.processError = err;
      watchedState.form.processState = 'failed';
    }
  };
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
      console.log(e);
      return [];
    });
  const refreshPosts = () => {
    const promise = state.feeds.map((feed) => refreshFeeds(feed.id));
    Promise.all(promise).then((newPost) => {
      const flattedNewPost = _.flatten(newPost);
      watchedState.posts = [...state.posts, ...flattedNewPost];
      setTimeout(refreshPosts, 5000);
    });
  };

  const init = () => {
    i18next.init({
      lng: 'en',
      debug: false,
      resources: locale,
    }, () => {
      elements.form.addEventListener('submit', onSubmit);
      elements.url.addEventListener('input', onChangeInput);
    });
  };
  init();
  setTimeout(refreshPosts, 5000);
};
