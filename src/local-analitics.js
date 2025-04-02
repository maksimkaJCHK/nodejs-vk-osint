import {
  readJSONFile,
  writeToJSON,
  createFolders,
} from './back/services/fs.js';

import {
  bDate,
  UsersCompare,
  log
} from './back/services/helpers.js';

const comparePersons = async (name, logger = log()) => {
  const folder = '../results/person';

  let firstFriendData = await readJSONFile({
    name: `${name}-first`,
    path: folder
  });

  let lastFriendData = await readJSONFile({
    name: `${name}-last`,
    path: folder
  });

  if (!firstFriendData && !lastFriendData) {
    logger.mes('Отсутствуют данные для сравнения.');
    logger.mes(`Сравнение для пользователя ${name} осущеcтвить не получилось.`);
  }

  if (!firstFriendData && lastFriendData) {
    logger.mes('Отсутствуют предыдущие данные для сравнения');
    logger.mes(`Сравнение для пользователя ${name} осущеcтвить не получилось.`);
  }

  if (!lastFriendData && firstFriendData) {
    logger.mes('Отсутствуют последние данные для сравнения.');
    logger.mes(`Сравнение для пользователя ${name} осущеcтвить не получилось.`);
  }

  if (firstFriendData && lastFriendData) {
    const usersCollection = new UsersCompare(firstFriendData, lastFriendData);
    const data = usersCollection.changes;

    writeToJSON({
      path: folder,
      name: `${name}-compare-${bDate()}`,
      data,
    });
  }
}

const infoForFriends = async (arrNames, logger = log()) => {
  for (const name of arrNames) {
    await comparePersons(name, logger);

    logger.type(`Сравнили пользователя - ${name}`);
  };
}