const renderErrors = (elements, errors) => {
  Object.entries(elements).forEach(([name, element]) => {
    const error = errors[name];
    if (!error) {
      element.classList.remove('is-invalid');
    } else {
      element.classList.add('is-invalid');
    }
  });
};

const renderFeed = () => {

};

const renderPost = () => {

};

const renderForm = () => {};

export {
  renderErrors, renderFeed, renderPost, renderForm,
};
