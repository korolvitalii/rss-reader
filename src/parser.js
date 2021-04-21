const parseRSS = (data) => {
  const parser = new DOMParser();
  const xmlDocument = parser.parseFromString(data, 'application/xml');
  if (xmlDocument.querySelector('parsererror')) {
    throw new Error('no-parse');
  }
  const channel = xmlDocument.querySelector('channel');
  const items = [...channel.querySelectorAll('item')].map(console.log);

  // console.log(items);
  // return {
  //   feed: {
  //     title: xmlDocument.querySelector('title'),
  //     description: xmlDocument.querySelector('description'),
  //   },
  // };
  return items;
};

export default parseRSS;
