import _ from 'lodash';
import * as yup from 'yup';

export default (feeds, fields, i18next) => {
  const schema = yup.object().shape({
    url: yup
      .string()
      .url(i18next.t('badUrl'))
      .notOneOf(feeds.map((feed) => feed.id), i18next.t('notOneOf'))
      .required(i18next.t('empty')),
  });
  try {
    schema.validateSync(fields, { abortEarly: false });
    return {};
  } catch (e) {
    return _.keyBy(e.inner, 'path');
  }
};
