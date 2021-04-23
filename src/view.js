const renderErrors = (elements, formElements, errors) => {
  Object.entries(elements).forEach(([name, element]) => {
    const error = errors[name];
    if (error) {
      formElements.feedback.textContent = error.message;
      formElements.feedback.classList.add('text-danger');
    }
    if (!error) {
      element.classList.remove('is-invalid');
      formElements.feedback.textContent = '';
      formElements.feedback.classList.remove('text-danger');
    }
  });
};

const renderFeed = (state, formElements) => {
  const h2 = document.createElement('h2');
  const ul = document.createElement('ul');
  const li = document.createElement('li');
  const p = document.createElement('p');
  const h3 = document.createElement('h3');
  h2.innerHTML = 'Feeds';
  p.innerHTML = state.feeds.title;
  h3.innerHTML = state.feeds.description;
  ul.classList.add('list-group', 'mb-5');
  li.classList.add('list-group-item');
  li.append(h3);
  li.append(p);
  ul.append(li);
  formElements.feeds.append(h2);
  formElements.feeds.append(ul);
};

const renderPosts = (state, formElements) => {
  const h2 = document.createElement('h2');
  const ul = document.createElement('ul');
  const li = document.createElement('li');
  console.log(state.posts);
};

const renderForm = () => {};

export {
  renderErrors, renderFeed, renderPosts, renderForm,
};
