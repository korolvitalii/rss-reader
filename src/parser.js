// import _ from 'lodash';

const parser = (data) => {
  const xmlParser = new DOMParser();
  const xmlDocument = xmlParser.parseFromString(data, 'application/xml');
  if (xmlDocument.querySelector('parsererror')) {
    throw new Error('Ресурс не содержит валидный RSS');
  }
  const channel = xmlDocument.querySelector('channel');
  const items = [...channel.querySelectorAll('item')].map((el) => {
    const title = el.querySelector('title');
    const description = el.querySelector('description');
    const link = el.querySelector('link');
    return {
      title: title.textContent,
      description: description.textContent,
      link: link.textContent,
    };
  });
  return {
    feed: {
      title: xmlDocument.querySelector('title').textContent,
      description: xmlDocument.querySelector('description').textContent,
    },
    items,
  };
};

export default parser;
