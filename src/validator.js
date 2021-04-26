import _ from 'lodash';
import * as yup from 'yup';

export default (fields) => {
  const schema = yup.object().shape({
    url: yup.string().url(),
    // .notOneOf(feeds.map((f) => f.id)),
  });
  try {
    schema.validateSync(fields, { abortEarly: false });
    return {};
  } catch (e) {
    return _.keyBy(e.inner, 'path');
  }
};
