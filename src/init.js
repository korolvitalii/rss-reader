import i18next from 'i18next';
import resources from './locale';
import app from './application';

export default () => {
  const i18nextInstance = i18next.createInstance();
  return i18nextInstance.init({
    lng: 'en',
    debug: false,
    resources,
  }).then(() => app(i18nextInstance));
};
