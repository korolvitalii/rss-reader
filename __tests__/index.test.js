import { promises as fs } from 'fs';
import path from 'path';
import { screen, fireEvent, waitFor } from '@testing-library/dom';
// import mockAxios from 'axios';
import appication from '../src/application';

const readFixture = async (fixtureName) => {
  const data = await fs.readFile(path.join(__dirname, '__fixtures__', fixtureName), 'utf-8');
  return data;
};

beforeEach(async () => {
  const initHtml = await readFixture('index.html');
  document.body.innerHTML = initHtml;
  appication();
});

afterEach(async () => {
  jest.clearAllTimers();
  jest.clearAllMocks();
});

test('init', async () => {
  expect(document.body.outerHTML).toMatchSnapshot();
});

test('invalid rss', async () => {
  fireEvent.input(screen.getByTestId('rss-field'), { target: { value: 'lalalalala' } });
  fireEvent.submit(screen.getByTestId('rss-form'));
  await waitFor(() => expect(screen.getByText('Ссылка должна быть валидным URL')));
  expect(document.body.outerHTML).toMatchSnapshot();
});
