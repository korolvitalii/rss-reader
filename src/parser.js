import _ from 'lodash';

const parser = (data) => {
  const xmlParser = new DOMParser();
  const xmlDocument = xmlParser.parseFromString(data, 'application/xml');
  if (xmlDocument.querySelector('parsererror')) {
    throw new Error('no-parse');
  }
  const generateFeedId = _.uniqueId();
  const channel = xmlDocument.querySelector('channel');
  const items = [...channel.querySelectorAll('item')].map((el) => {
    const title = el.querySelector('title');
    const link = el.querySelector('link');
    return {
      id: generateFeedId,
      title: title.textContent,
      link: link.textContent,
    };
  });
  return {
    feed: {
      id: generateFeedId,
      title: xmlDocument.querySelector('title').textContent,
      description: xmlDocument.querySelector('description').textContent,
    },
    items,
  };
};

export default parser;
