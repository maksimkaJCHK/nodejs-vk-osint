import { VK } from 'vk-io';

import logger from './logger/logger.js';

import getToken from './services/token.js';
import { friends } from './data/data.js';

import {
  getUserFriends,
  getUsersInfo,
} from './API/index.js';

import {
  readJSONFile,
  writeToJSON,
  createFolders,
} from './services/fs.js';

import { getUserFriAndInt } from './hof/services.js';

import delayF from './services/delay.js';
import { bDate } from './services/helpers.js';

const token = getToken();

const vk = new VK({
  token
});

// Получаю друзей, подписки, подписчиков, группы
const getTypeInfAboutUsers = async () => {
  createFolders([
    '../results',
    '../results/user_friends'
  ]);

  for (const item of friends) {
    const { id, name } = item;

    logger.group(`Собираю информацию о пользователе - ${name}`);

    try {
      const data = await getUserFriAndInt({ vk, id, name });

      writeToJSON({
        path: '../results/user_friends',
        name: `${name.replace(/ /, '_')}-friend-${bDate()}`,
        data,
      });
    } catch (error) {
      logger.error(`Не удалось собрать информацию о ${name}`);
    }

    logger.endGroup();
  }
}

// Получаю информацию о пользователе/пользователях
const getUsersInfoFromData = async () => {
  const savePath = '../results/example';

  createFolders([
    '../results',
    savePath
  ]);

  let friends = await readJSONFile({
    name: 'friends-parser',
    path: savePath
  });

  const friendsIds = friends.map(({ id }) => id);

  const getFriendInfo = async (ids) => {
    const userFriends = await getUsersInfo(vk, ids);

    logger.success('Всего найдено, ' + userFriends.length);

    writeToJSON({
      path: savePath,
      name: `friends-API-${bDate()}`,
      data: userFriends,
    });
  }

  await getFriendInfo(friendsIds.join(','));
}

const getFriendsCountUser = async () => {
  let allProfiles = 0;
  let openProfiles = 0;
  let closeProfiles = 0;
  const savePath = '../results/example';

  createFolders([
    '../results',
    savePath
  ]);

  let friends = await readJSONFile({
    name: 'friends-API-2024-12-10',
    path: savePath
  });

  for (const curFriend of friends) {
    const { id, first_name, last_name } = curFriend;

    const name = `${first_name} ${last_name}`;
    allProfiles++;

    logger.group(`Сбор информации о пользователе ${name}, это ${allProfiles} пользователь`)

    try {
      const userFriends = await getUserFriends(vk, id, name);
      const { items, count } = userFriends;

      curFriend.friendsCount = count;
      curFriend.friends = items;

      openProfiles++;
    } catch (error) {
      if (error.code === 5) logger.error('Нужно авторизоваться, или срок действия токена закончился.');
      if (error.code === 6) logger.error('Слишком много запросов в секунду.');
      if (error.code === 10) logger.error('Произошла внутренняя ошибка сервера.');
      if (error.code === 15) logger.error('Доступ запрещен.');
      if (error.code === 18) logger.error(`Страница пользователя ${name} удалена, или заблокирована.`);
      if (error.code === 28) logger.error('Ключ доступа устарел, или не действительный.');
      if (error.code === 29) logger.error('Лимит на запросы исчерпан.');
      if (error.code === 30) logger.error(`Профиль для ${name} закрыт.`);

      logger.error(`Не удалось собрать информацию о пользователе ${name}, код ошибки ${error.code}.`);

      curFriend.friendsCount = 0;
      curFriend.friends = [];

      closeProfiles++;
    }

    logger.endGroup();
    await delayF(500);
  }

  // Я сортирую друзей по нормальному, а мне для моей задачи нужно от большего к меньшему, пока оставлю, а так тут заменить, и ничего переворачивать не нужно
  friends = friends.sort((a, b) => {
    if (a.friendsCount > b.friendsCount) {
      return 1;
    }

    if (a.friendsCount < b.friendsCount) {
      return -1;
    }

    return 0;
  });

  logger.space();
  logger.space();

  logger.success(`Всего обработано ${allProfiles} профилей`);
  logger.success(`Открытых ${openProfiles} профилей`);
  logger.success(`Закрытых ${closeProfiles} профилей`);

  const nameFile = `friend-API-full-sort-${bDate()}`;

  const paramsSaveFile = {
    path: savePath,
    name: nameFile,
    spices: 0
  }

  // Пока оставлю, но скорее всего мне это не понадобится
  // writeToJSON({
  //   data: newFriends,
  //   ...paramsSaveFile
  // });

  writeToJSON({
    data: friends.reverse(),
    ...paramsSaveFile
  });

  logger.space();
  logger.success(`Файл "${savePath}/${nameFile}" создан.`);
}

getFriendsCountUser();