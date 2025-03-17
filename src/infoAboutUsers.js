import { VK } from 'vk-io';

import logger from 'scrapy-logger';
import errorHandling, { isStopParser } from './back/services/errorHandling.js';

import getToken from './back/services/token.js';
import { friends } from './back/data/data.js';

import {
  getUserFriends,
  getUsersInfo,
} from './back/API/index.js';

import {
  readJSONFile,
  writeToJSON,
  createFolders,
} from './back/services/fs.js';

import { getUserFreAndInf } from './back/hof/services.js';

import delayF from './back/services/delay.js';

import {
  bDate,
  UsersCompare
} from './back/services/helpers.js';

const token = getToken();

const vk = new VK({
  token
});

logger.disableDate();

// Получаю друзей, подписки, подписчиков, группы
const getTypeInfAboutUsers = async (persons) => {
  if (persons && !persons.length) {
    logger.error('Список пользователей пуст, не о ком собирать информацию.');
  }

  if (persons && persons.length) {
    const savePath = '../results/person';
    const allUsers = persons.length;
    let errorCount = 0;
    let infoErrorUsers = [];
    let isInfoParser = true;

    createFolders([
      '../results',
      savePath
    ]);
  
    for (const item of persons) {
      const { id, name } = item;

      logger.group(`Собираю информацию о пользователе - ${name}`);

      try {
        const data = await getUserFreAndInf({ vk, id, name });

        writeToJSON({
          path: savePath,
          name: `${name.replace(/ /, '_')}-${bDate()}`,
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

const comparePersonsChanges = async (name) => {
  const folder = '../results/person';

  let firstFriendData = await readJSONFile({
    name: `${name}-first`,
    path: folder
  });

  let lastFriendData = await readJSONFile({
    name: `${name}-last`,
    path: folder
  });

  const usersCollection = new UsersCompare(firstFriendData, lastFriendData);
  const data = usersCollection.info;

  writeToJSON({
    path: folder,
    name: `${name}-compare-${bDate()}`,
    data,
  });
}

const getFriendsOfPersonsFriends = async () => {
  const savePath = '../results/person';
  const nameFile = 'example';

  let person = await readJSONFile({
    name: nameFile,
    path: savePath
  });

  if (person?.userFriends?.items && person.userFriends.items.length) {
    let isFriendParser = true;
    const lenFriends = person.userFriends.items.length;

    createFolders([
      '../results',
      savePath
    ]);

    await delayF();

    let currProfiles = 0;
    let openProfiles = 0;
    let closeProfiles = 0;

    for (const curFriend of person.userFriends.items) {
      const { id, first_name, last_name } = curFriend;

      const name = `${first_name} ${last_name}`;
      currProfiles++;

      logger.group(`Сбор информации о пользователе ${name}, это ${currProfiles} пользователь из ${ lenFriends }.`)

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
      await delayF();
    }

    if (isFriendParser) {
      person.userFriends.items = person.userFriends.items.sort((a, b) => {
        if (a.friendsCount < b.friendsCount) {
          return 1;
        }

        if (a.friendsCount > b.friendsCount) {
          return -1;
        }

        return 0;
      });

      logger.space();
      logger.space();

      logger.success(`Всего обработано ${currProfiles} профилей`);
      logger.success(`Открытых ${openProfiles} профилей`);
      logger.success(`Закрытых ${closeProfiles} профилей`);

      const paramsSaveFile = {
        path: savePath,
        name: `${nameFile}-sorted`,
        spices: 0
      }

      writeToJSON({
        data: person,
        ...paramsSaveFile
      });
    }
  } else {
    logger.error(`Не удалось прочитать информацию из файла "${savePath}/${nameFile}.json".`);
  }
}

const buildFriendFromData = async () => {
  const folderNew = '../results/person';
  const folderOld = '../results/friend-full';
  const folderOutput = '../results/person';

  const nameNew = 'example';
  const nameOld= 'friend-full';

  createFolders([
    '../results',
    folderNew,
    folderOld,
    folderOutput
  ]);

  await delayF();

  let curData = await readJSONFile({
    name: nameNew,
    path: folderNew
  });

  let oldData = await readJSONFile({
    name: nameOld,
    path: folderOld
  });

  if (!curData && !oldData) {
    logger.error('Нет данных для сравнения.');
  }

  const defaultParams = {
    friendsOld: [],
    idOldUser: null,
    first_name: '',
    last_name: ''
  }

  const bFriendObj = ({
    friendsOld,
    idOldUser,
    first_name,
    last_name
  } = defaultParams) => ({
    friendsOld,
    idOldUser,
    first_name,
    last_name
  });

  const fFriend = (oldData, idItem) => {
    const item = oldData.userFriends.items.find(({ id }) => id === idItem);

    if (!item) return bFriendObj();

    if (item) {
      const {
        friends,
        id,
        first_name,
        last_name
      } = item;

      return bFriendObj({
        friendsOld: friends,
        idOldUser: id,
        first_name,
        last_name
      })
    }
  }

  if (curData && oldData) {
    let noFriendsCount = 0;
    let isFriendsCount = 0;

    for (let item of curData.userFriends.items) {
      let { id, friends } = item;

      if (!friends.length) {
        const {
          friendsOld,
          idOldUser,
          first_name,
          last_name
        } = fFriend(oldData, id);

        if (!friendsOld.length) {
          noFriendsCount++;
          logger.info(`Пользователь ${first_name} ${last_name} с id${idOldUser} не имеет друзей.`);
        }

        if (friendsOld.length) {
          isFriendsCount++;
          item.friendsCount = friendsOld.length;
          item.friends = friendsOld;

          logger.successBg(`Пользователю ${first_name} ${last_name} с id${idOldUser} добавлены друзья.`);
        }
      }
    }

    logger.space();
    logger.success(`Добавлено друзей у ${isFriendsCount} пользователей.`);
    logger.success(`Нет друзей у ${noFriendsCount} пользователей.`);

    writeToJSON({
      path: folderOutput,
      name: 'friend-full',
      data: curData,
      spices: 0
    });
  }
}

const infoForFriends = async (arrNames) => {
  for (const name of arrNames) {
    await comparePersonsChanges(name);

    logger.type(`Сравниили пользователя - ${name}`);
  };
}