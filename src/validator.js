import _ from 'lodash';
import * as yup from 'yup';

export default (watchedState) => {
  console.log(watchedState.form.fields.url);
  const schema = yup.object().shape({
    url: yup
      .string()
      .url()
      // .notOneOf()
      .required(),
  });
  try {
    schema.validateSync(watchedState.form.fields, { abortEarly: false });
    return {};
  } catch (e) {
    return _.keyBy(e.inner, 'path');
  }
};
