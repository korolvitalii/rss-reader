import _ from 'lodash';
import * as yup from 'yup';
import i18next from 'i18next';

export default (fields) => {
  const schema = yup.object().shape({
    url: yup
      .string()
      .url(i18next.t('badUrl'))
      .notOneOf([fields.feedsUrl.map((url) => url)], i18next.t('notOneOf'))
      .required(i18next.t('empty')),
  });
  try {
    schema.validateSync(fields, { abortEarly: false });
    return {};
  } catch (e) {
    return _.keyBy(e.inner, 'path');
  }
};
