import errorHandling from './back/services/errorHandling.js';
import { getUserFreAndInf } from './back/hof/services.js';

import {
  writeToJSON,
  createFolders,
} from './back/services/fs.js';

import {
  vk,
  bDate,
  UsersCompare,
  log
} from './back/services/helpers.js';

// Сравнение 2 пользователей по id-ам, ищу общих друзей, общие группы/сообщества, общих подписчиков
const compareUsersFromNet = async (fId, lId, logger = log()) => {
  if (!fId && !lId) logger.mes('Отсутствуют id-ки для сравнения.');
  if (!fId && lId) logger.mes('Отсутствует первый id-ик для сравнения.');
  if (!lId && fId) logger.mes('Отсутствует второй id-ик для сравнения.');

  if (fId && lId) {
    const savePath = '../results/compare';

    createFolders([
      '../results',
      savePath
    ]);

    try {
      const data = await Promise.all([
        getUserFreAndInf({ vk, id: fId, name: 'Первый пользователь' }),
        getUserFreAndInf({ vk, id: lId, name: 'Второй пользователь' }),
      ]);

      const [fUserInfo, lUserInfo] = data;
      const usersCollection = new UsersCompare(fUserInfo, lUserInfo);
      const compare = usersCollection.commons;

      const fName = `${fUserInfo.userInfo[0].first_name} ${fUserInfo.userInfo[0].last_name}`;
      const lName = `${lUserInfo.userInfo[0].first_name} ${lUserInfo.userInfo[0].last_name}`;

      writeToJSON({
        path: savePath,
        name: `${fName}-${lName}-${bDate()}`,
        data: compare,
      });
    } catch (error) {
      errorHandling(error, 'Users');
    }
  }
}