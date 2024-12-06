import { VK } from 'vk-io';

import logger from './logger/logger.js';

import getToken from './services/token.js';
import { friends } from './data/data.js';

import {
  getUserFriends,
  getUsersInfo
} from './services/services.js';

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
const getMainUserInfo = async () => {
  createFolders([
    '../results',
    '../results/example'
  ]);

  const friendsIds = friends.map(({ id }) => id);

  const getFriendInfo = async (ids) => {
    const userFriends = await getUsersInfo(vk, ids);

    logger.success('Всего найдено, ' + userFriends.length);

    writeToJSON({
      path: '../results/example',
      name: `friend-API-${bDate()}`,
      data: userFriends,
    });
  }

  await getFriendInfo(friendsIds.join(','));
}

const getFriendsCountUser = async () => {
  let allProfiles = 0;
  let openProfiles = 0;
  let closeProfiles = 0;

  createFolders([
    '../results',
    '../results/example'
  ]);

  for (const { id, first_name, last_name } of friends) {
    const name = `${first_name} ${last_name}`;
    allProfiles++;

    const fIdx = friends.findIndex((el) => el.id === id);

    try {
      const userFriends = await getUserFriends(vk, id, name);

      const { items, count } = userFriends;
      friends[fIdx].friendsCount = count;
      friends[fIdx].friends = items;

      openProfiles++;
    } catch (error) {
      logger.error(`Профиль для ${name} закрыт.`);

      friends[fIdx].friendsCount = 0;
      friends[fIdx].friends = [];

      closeProfiles++;
    }

    await delayF(500);
  }

  const newFriends = friends.sort((a, b) => {
    if (a.friendsCount > b.friendsCount) {
      return 1;
    }

    if (a.friendsCount < b.friendsCount) {
      return -1;
    }

    return 0;
  });

  const newFriendsLToS = newFriends.reverse();

  logger.success(`Всего обработано ${allProfiles} профилей`);
  logger.success(`Открытых ${openProfiles} профилей`);
  logger.success(`Закрытых ${closeProfiles} профилей`);

  writeToJSON({
    path: '../results/example',
    name: `friend-API-full-sort-${bDate()}`,
    data: newFriends,
    spices: 0
  });

  writeToJSON({
    path: '../results/example',
    name: `friend-API-full-sort-ls-${bDate()}`,
    data: newFriendsLToS,
    spices: 0
  });
}