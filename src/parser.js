const parseRSS = (data) => {
  const parser = new DOMParser();
  const xmlDocument = parser.parseFromString(data, 'application/xml');
  if (xmlDocument.querySelector('parsererror')) {
    throw new Error('no-parse');
  }
  return xmlDocument;
};

export default parseRSS;
