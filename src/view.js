const renderErrors = (elements, errors) => {
  const { input, feedback } = elements;
  const error = errors.input;
  if (error) {
    feedback.textContent = error.message;
    feedback.classList.add('text-danger');
    input.classList.add('is-invalid');
  }
  if (!error) {
    input.classList.remove('is-invalid');
    feedback.textContent = '';
    feedback.classList.remove('text-danger');
  }
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
  ul.classList.add('list-group');
  h2.innerHTML = 'Posts';
  state.posts.map(({ title, link, description }, index) => {
    const li = document.createElement('li');
    const a = document.createElement('a');
    const button = document.createElement('button');
    li.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-start');
    a.setAttribute('href', `${link}`);
    a.classList.add('font-weight-bold');
    a.setAttribute('data-id', `${index}`);
    a.setAttribute('target', '_blank');
    a.setAttribute('rel', 'noopener noreferrer');
    a.innerHTML = title;
    button.setAttribute('type', 'button');
    button.classList.add('btn', 'btn-primary', 'btn-sm');
    button.setAttribute('data-id', `${index}`)
    button.setAttribute('data-toggle', 'modal');
    button.setAttribute('data-target', '#modal');
    button.innerHTML = 'See';
    li.append(a);
    li.append(button);
    ul.append(li);
  });
  formElements.posts.append(h2);
  formElements.posts.append(ul);
};

const renderForm = () => {};

export {
  renderErrors, renderFeed, renderPosts, renderForm,
};
