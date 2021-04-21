import _ from 'lodash';
import * as yup from 'yup';

const schema = yup.object().shape({
  website: yup.string().url().required(),
});

export default (fields) => {
  try {
    schema.validateSync(fields, { abortEarly: false });
    return {};
  } catch (e) {
    return _.keyBy(e.inner, 'path');
  }
};
