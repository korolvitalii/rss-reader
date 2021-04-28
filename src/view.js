import i18next from 'i18next';

const renderErrors = (elements, errors) => {
  const { url, feedback } = elements;
  const error = errors.url;
  if (error) {
    feedback.textContent = error.message;
    feedback.classList.add('text-danger');
    url.classList.add('is-invalid');
  }
  if (!error) {
    url.classList.remove('is-invalid');
    feedback.textContent = '';
    feedback.classList.remove('text-danger');
  }
};

const renderForm = (state, elements) => {
  const { feedback } = elements;
  feedback.textContent = i18next.t('success');
  feedback.classList.add('text-success');
};

const renderFeed = (state, formElements) => {
  const { feedsElement } = formElements;
  feedsElement.innerHTML = '';
  formElements.url.value = '';
  const ul = document.createElement('ul');
  const h2 = document.createElement('h2');
  h2.innerHTML = i18next.t('feedHeader');
  state.feeds.forEach(({ title, description }) => {
    const li = document.createElement('li');
    const p = document.createElement('p');
    const h3 = document.createElement('h3');
    p.innerHTML = title;
    h3.innerHTML = description;
    ul.classList.add('list-group', 'mb-5');
    li.classList.add('list-group-item');
    li.append(h3);
    li.append(p);
    ul.append(li);
  });
  feedsElement.append(h2);
  feedsElement.append(ul);
};

const renderPosts = (state, formElements) => {
  const { postsElement } = formElements;
  postsElement.innerHTML = '';
  const h2 = document.createElement('h2');
  const ul = document.createElement('ul');
  ul.classList.add('list-group');
  h2.innerHTML = i18next.t('postHeader');
  const { posts } = state;
  posts.forEach(({ title, link }, index) => {
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
    button.setAttribute('data-id', `${index}`);
    button.setAttribute('data-toggle', 'modal');
    button.setAttribute('data-target', '#modal');
    button.innerHTML = 'See';
    li.append(a);
    li.append(button);
    ul.append(li);
  });
  postsElement.append(h2);
  postsElement.append(ul);
};

export {
  renderFeed, renderPosts, renderErrors, renderForm,
};
