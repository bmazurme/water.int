const WHITE_LIST = [
  'http://localhost:3000',
  'http://localhost:3001',
  'https://oauth.yandex.ru/token',
];

const METHODS = [
  'GET',
  'HEAD',
  'PUT',
  'PATCH',
  'POST',
  'DELETE',
];

const ALLOWED_HEADERS = [
  'Content-Type',
  'origin',
  'x-access-token',
];

export { WHITE_LIST, METHODS, ALLOWED_HEADERS };
