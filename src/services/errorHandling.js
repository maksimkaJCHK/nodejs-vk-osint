import logger from '../logger/logger.js';

export const isStopParser = ({ code }) => {
  const isError = [5, 28, 29];

  return isError.includes(code);
}

const errorHandling = ({ code }) => {
  if (code === 5) logger.error('Нужно авторизоваться, или срок действия токена закончился.');
  if (code === 6) logger.error('Слишком много запросов в секунду.');
  if (code === 10) logger.error('Произошла внутренняя ошибка сервера.');
  if (code === 15) logger.error('Доступ запрещен.');
  if (code === 18) logger.error(`Страница пользователя ${name} удалена, или заблокирована.`);
  if (code === 28) logger.error('Ключ доступа устарел, или не действительный.');
  if (code === 29) logger.error('Лимит на запросы исчерпан.');
  if (code === 30) logger.error(`Профиль для ${name} закрыт.`);
}

export default errorHandling;