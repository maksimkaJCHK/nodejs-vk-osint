import { VK } from 'vk-io';

import logger from './logger/logger.js';
import errorHandling, { isStopParser } from './services/errorHandling.js';

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

import { getUserFreAndInf } from './hof/services.js';

import delayF from './services/delay.js';

import {
  bDate,
  parseFriends,
  parseGroups,
  parseSubscriptions
} from './services/helpers.js';

const token = getToken();

const vk = new VK({
  token
});

// Получаю друзей, подписки, подписчиков, группы
const getTypeInfAboutUsers = async () => {
  if (friends && !friends.length) {
    logger.error('Список пользователей пуст, не о ком собирать информацию.');
  }

  if (friends && friends.length) {
    const savePath = '../results/user_friends';
    const allUsers = friends.length;
    let errorCount = 0;
    let infoErrorUsers = [];
    let isInfoParser = true;

    createFolders([
      '../results',
      savePath
    ]);
  
    for (const item of friends) {
      const { id, name } = item;

      logger.group(`Собираю информацию о пользователе - ${name}`);

      try {
        const data = await getUserFreAndInf({ vk, id, name });

        writeToJSON({
          path: savePath,
          name: `${name.replace(/ /, '_')}-friend-${bDate()}`,
          data,
        });
      } catch (error) {
        errorHandling(error, name);
        logger.error(`Не удалось собрать информацию о ${name}`);
        errorCount++;
        infoErrorUsers.push(`-Пользователь "${name}" c id${id};\n`);

        if (isStopParser(error)) {
          logger.space();
          logger.error('Дальнейший сбор информации не имеет смысла.');
          isInfoParser = false;

          break;
        }
      }

      logger.endGroup();
    }

    if (isInfoParser) {
      logger.space();
      logger.type(`Всего обработано ${allUsers} пользователей`);

      if (errorCount) {
        logger.disableTimePeriod();
        logger.type(`Не удалось собрать информацию о ${errorCount} пользователях:`);
        logger.group()
        logger.type(infoErrorUsers.join(' '));
        logger.endGroup();
        logger.enableTimePeriod();
      }
    }
  }
}

// Получаю информацию о пользователе/пользователях
const getUsersInfoFromData = async () => {
  const savePath = '../results/example';

  let friends = await readJSONFile({
    name: 'friends-parser',
    path: savePath
  });

  if (friends) {
    createFolders([
      '../results',
      savePath
    ]);

    const friendsIds = friends.map(({ id }) => id);

    const getFriendInfo = async (ids) => {
      try {
        const userFriends = await getUsersInfo(vk, ids);

        logger.success('Всего найдено, ' + userFriends.length);

        const nameSaveFile = `friends-API-${bDate()}`;

        writeToJSON({
          path: savePath,
          name: nameSaveFile,
          data: userFriends,
        });

        logger.success(`Файл "${savePath}/${nameSaveFile}" создан.`);
      } catch (error) {
        errorHandling(error, ids);
        logger.error(`Информацию о пользователе/ях:\n\n"${ids}"\n\nне удалось собрать.`);
      }
    }

    await getFriendInfo(friendsIds.join(','));
  } else {
    logger.error(`Не удалось прочитать информацию из файла "${savePath}/friends-parser.json".`)
  }
}

const getFriendsCountUser = async () => {
  const savePath = '../results/example';
  const nameFile = 'friends-API-2024-12-10';

  let friends = await readJSONFile({
    name: nameFile,
    path: savePath
  });

  if (friends && friends.length) {
    let isFriendParser = true;

    createFolders([
      '../results',
      savePath
    ]);

    let allProfiles = 0;
    let openProfiles = 0;
    let closeProfiles = 0;

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
        errorHandling(error, name)
        logger.error(`Не удалось собрать информацию о пользователе ${name}, код ошибки ${error.code}.`);

        if (isStopParser(error)) {
          isFriendParser = false;
          logger.space();
          logger.error('Дальнейший сбор информации не имеет смысла.');

          break;
        }

        curFriend.friendsCount = 0;
        curFriend.friends = [];

        closeProfiles++;
      }

      logger.endGroup();
      await delayF(500);
    }

    if (isFriendParser) {
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
  } else {
    logger.error(`Не удалось прочитать информацию из файла "${savePath}/${nameFile}.json".`);
  }
}

const compareFriend = async (name) => {
  const folder = '../results/example';

  let firstFriendData = await readJSONFile({
    name: `${name}-friend-2024-11-03`,
    path: folder
  });

  let lastFriendData = await readJSONFile({
    name: `${name}-friend-2024-12-12`,
    path: folder
  });

  const infoAboutFriends = parseFriends(firstFriendData, lastFriendData);
  const {
    countRemovedFriends,
    countAddFriends,
    removedFriends,
    addFriends
  } = infoAboutFriends;

  const infoAboutGroups = parseGroups(firstFriendData, lastFriendData);
  const {
    countRemovedGroups,
    countAddGroups,
    removedGroups,
    addGroups
  } = infoAboutGroups;

  const infoAboutSub = parseSubscriptions(firstFriendData, lastFriendData);

  const {
    countRemovedSubGroups,
    countAddSubGroups,
    countRemovedSubUsers,
    countAddSubUsers,
    removedSubGroups,
    addSubGroups,
    removedSubUsers,
    addSubUsers
  } = infoAboutSub;

  const data = {
    countRemovedFriends,
    countAddFriends,
    countRemovedGroups,
    countAddGroups,
    countRemovedSubGroups,
    countAddSubGroups,
    countRemovedSubUsers,
    countAddSubUsers,
    removedFriends,
    addFriends,
    removedGroups,
    addGroups,
    removedSubGroups,
    addSubGroups,
    removedSubUsers,
    addSubUsers
  }

  writeToJSON({
    path: folder,
    name: `${name}-compare-${bDate()}`,
    data,
  });
}

const infoForFriends = async () => {
  const constNameArr = [
    'Павел_Дуров'
  ];

  for (const name of constNameArr) {
    await compareFriend(name);

    logger.type(`Сравниили пользователя - ${name}`);
  };
}

const searchUserInFriends = (users, userId) => {
  const idx = users.findIndex(({ id }) => id === userId);

  return idx !== -1;
}

const searchUserInFriendsJSON = async (userId, nameUser = 'user') => {
  const folder = '../results/example';
  const name = 'example';

  const friendsArr = await readJSONFile({
    name,
    path: folder
  });

  logger.info(`Прочитал значение их файла ${folder}/${name}.`);

  const notFriend = [];
  const notFriendIds = [];
  const closedFriend = [];
  const closedFriendIds = [];

  friendsArr.forEach(({
    friends,
    first_name,
    last_name,
    is_closed,
    id
  }) => {
    const isUserInFriend = searchUserInFriends(friends, userId);

    const name = `${first_name} ${last_name}`;

    if (isUserInFriend && !is_closed) {
      const buildLog = `Пользователь ${name} с id-ом "${id}" является другом ${nameUser}.`;
      logger.success(buildLog);
    }

    if (!isUserInFriend && !is_closed) {
      const buildLog = `Пользователь ${name} с id-ом "${id}" не является другом ${nameUser}.`;

      notFriend.push({
        name,
        id
      });
      notFriendIds.push(id);

      logger.error(buildLog);
    }

    if (is_closed) {
      const buildLog = `Пользователь ${name} с id-ом "${id}" закрыл свои данные.`;

      closedFriend.push({
        name,
        id
      });
      closedFriendIds.push(id);

      logger.error(buildLog);
    }
  });

  logger.space();
  logger.success(`В друзьях у ${nameUser} нет ${notFriendIds.length} пользователей.`);
  logger.success(`Всего закрытых пользователи ${closedFriendIds.length}.`);

  writeToJSON({
    path: folder,
    name: 'info-not-friend',
    data: {
      notFriendIds,
      notFriend,
      closedFriendIds,
      closedFriend,
    }
  });
}

const clearOldFriend = async () => {
  const folder = '../results/example';
  const nameCurArr = 'example';
  const nameFArr = 'info-not-friend';

  logger.info(`Чтение из файла "${folder}/${nameCurArr}".`);

  let curArr = await readJSONFile({
    name: nameCurArr,
    path: folder
  });

  logger.info(`Чтение из файла "${folder}/${nameFArr}".`);

  const deleteArr = await readJSONFile({
    name: nameFArr,
    path: folder
  });

  logger.info(`Первоначально в массиве ${curArr.length} элементов.`);
  logger.info(`Нужно удалить ${deleteArr.notFriendIds.length} элементов.`);

  curArr = curArr.filter(({id}) => !deleteArr.notFriendIds.includes(id));

  logger.info(`Теперь в массиве ${curArr.length} элементов.`);

  writeToJSON({
    path: folder,
    name: nameCurArr,
    data: curArr,
    spices: 0
  });

  logger.info(`Файл "${folder}/${nameCurArr}.json" перезаписан.`);
}

clearOldFriend();