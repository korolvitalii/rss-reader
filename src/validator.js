import _ from 'lodash';
import * as yup from 'yup';

const schema = yup.object().shape({
  input: yup.string().url(),
});

export default (fields) => {
  try {
    schema.validateSync(fields, { abortEarly: false });
    return {};
  } catch (e) {
    return _.keyBy(e.inner, 'path');
  }
};
