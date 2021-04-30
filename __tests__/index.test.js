import { promises as fs } from 'fs';
// import mockAxios from 'axios';
import path from 'path';
// import { screen, fireEvent, waitFor } from '@testing-library/dom';
import appication from '../src/application';

const readFixture = async (fixtureName) => {
  const data = await fs.readFile(path.join(__dirname, '__fixtures__', fixtureName), 'utf-8');
  return data;
};

beforeEach(async () => {
  const initHtml = await readFixture('index.html');
  document.body.innerHTML = initHtml;
  jest.useFakeTimers();
  appication();
});

afterEach(async () => {
  jest.clearAllTimers();
  jest.clearAllMocks();
});

test('init ', async () => {
  expect(document.body.outerHTML).toMatchSnapshot();
});
