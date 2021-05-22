import mockAxios from 'axios';
import adapter from 'axios/lib/adapters/http';
import path from 'path';
import { promises as fs } from 'fs';
import { screen } from '@testing-library/dom/dist/screen.js';
import { fireEvent } from '@testing-library/dom/dist/events.js';
import { waitFor } from '@testing-library/dom/dist/wait-for.js';
import nock from 'nock';
import '@testing-library/jest-dom';
import init from '../src/init.js';

nock.disableNetConnect();

// axios.defaults.adapter = adapter;

const readFixture = async (fixtureName) => {
  const data = await fs.readFile(path.join(__dirname, '__fixtures__', fixtureName), 'utf-8');
  return data;
};

// beforeEach(async () => {
//   const html = await readFixture('index.html');
//   document.body.innerHTML = html;
//   await init();
// });

beforeEach(async () => {
  const initHtml = await readFixture('index.html');
  document.body.innerHTML = initHtml;
  jest.useFakeTimers();
  init();
});

afterEach(async () => {
  jest.clearAllTimers();
  jest.clearAllMocks();
});

test('init', () => {
  expect(document.body.innerHTML).toMatchSnapshot();
});

test('invalid rss 1', async () => {
  fireEvent.input(screen.getByTestId('rss-field'), { target: { value: 'lalalalala' } });
  fireEvent.submit(screen.getByTestId('rss-form'));
  await waitFor(() => expect(screen.getByText('url must be a valid URL')));
  expect(document.body.innerHTML).toMatchSnapshot();
});

test('invalid rss 2', async () => {
  fireEvent.input(screen.getByTestId('rss-field'), { target: { value: 'aaaaaaaaa' } });
  fireEvent.submit(screen.getByTestId('rss-form'));
  await waitFor(() => expect(screen.getByText('url must be a valid URL')));
  expect(document.body.innerHTML).toMatchSnapshot();
});

// test('add rss', async () => {
//   const rss = await readFixture('breaking_news.rss');
//   mockAxios.get.mockImplementationOnce(() => Promise.resolve({ data: rss }));
//   fireEvent.input(screen.getByTestId('rss-field'), { target: { value: 'https://valid.url.com/news.rss' } });
//   fireEvent.submit(screen.getByTestId('rss-form'));
//   await waitFor(() => expect(screen.getByText('Feeds')));
//   expect(document.body.outerHTML).toMatchSnapshot();
// });

// test('try to add the same rss feed twice', async () => {
//   const rss = await readFixture('breaking_news.rss');
//   axios.get.mockImplementationOnce(() => Promise.resolve({ data: rss }));
//   fireEvent.input(screen.getByTestId('rss-field'), { target: { value: 'https://valid.url.com/news.rss' } });
//   fireEvent.submit(screen.getByTestId('rss-form'));
//   await waitFor(() => expect(screen.getByText('Feeds')));
//   fireEvent.input(screen.getByTestId('rss-field'), { target: { value: 'https://valid.url.com/news.rss' } });
//   fireEvent.submit(screen.getByTestId('rss-form'));
//   await waitFor(() => expect(screen.getByText('RSS лента уже была добавлена')));
//   expect(document.body.outerHTML).toMatchSnapshot();
// });