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

logger.disableDate();

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
  const nameFile = 'example-file';

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

    await delayF();

    let currProfiles = 0;
    let openProfiles = 0;
    let closeProfiles = 0;

    for (const curFriend of friends) {
      const { id, first_name, last_name } = curFriend;

      const name = `${first_name} ${last_name}`;
      currProfiles++;

      logger.group(`Сбор информации о пользователе ${name}, это ${currProfiles} пользователь из ${friends.length}.`)

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

      logger.success(`Всего обработано ${currProfiles} профилей`);
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
    }
  } else {
    logger.error(`Не удалось прочитать информацию из файла "${savePath}/${nameFile}.json".`);
  }
}

const compareFriend = async (name) => {
  const folder = '../results/example';

  let firstFriendData = await readJSONFile({
    name: `${name}-friend-old-date`,
    path: folder
  });

  let lastFriendData = await readJSONFile({
    name: `${name}-friend-last-date`,
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

  logger.info(`Чтение из файла "${folder}/${nameCurArr}.json".`);

  let curArr = await readJSONFile({
    name: nameCurArr,
    path: folder
  });

  const deleteArr = await readJSONFile({
    name: nameFArr,
    path: folder
  });

  logger.info(`Первоначально в массиве ${curArr.length} элементов.`);
  logger.info(`Нужно удалить ${deleteArr.notFriendIds.length} элементов.`);

  curArr = curArr.filter(({ id }) => !deleteArr.notFriendIds.includes(id));

  logger.info(`Теперь в массиве ${curArr.length} элементов.`);

  writeToJSON({
    path: folder,
    name: nameCurArr,
    data: curArr,
  });
}

const findNewFriends = async () => {
  const folder = '../results/example';
  const nameFile = 'friends-parser';
  let newUsers = 0;

  let curArr = await readJSONFile({
    name: nameFile,
    path: folder
  });

  logger.info(`Всего в друзьях ${curArr.length} пользователей.`);

  const curIds = curArr.map(({ id }) => id);

  for (const friend of friends) {
    const { id, name } = friend;
    const isFriend = curIds.includes(id);
    let bFraze = '';

    if (isFriend) bFraze = `Пользователь ${name} есль в друзьях.`;

    if (!isFriend) {
      bFraze = `Пользователя ${name} нет в друзьяхи и сейчас будет добавлен.`;
      newUsers++;

      curArr = [
        friend,
        ...curArr
      ]
    }

    logger.success(bFraze);
  }

  const bFraze = newUsers
    ? `Найдено ${newUsers} новых пользователей.`
    : 'Новых пользователей не найдено.';

  logger.space();
  logger.success(bFraze);

  if (newUsers) {
    writeToJSON({
      path: folder,
      name: nameFile,
      data: curArr,
    });

    logger.info(`Всего в друзьях ${curArr.length} пользователей.`);
  }
}

const findNewFriendFromCompare = async (findId, nameUser = 'User') => {
  const folder = '../results/example';
  const nameFile = 'friends-parser';

  let curArr = await readJSONFile({
    name: nameFile,
    path: folder
  });

  const curIds = curArr.map(({ id }) => id);

  const usersCompare = [
    'Марка_Цукермана',
  ];

  const prefix = '-compare-2024-12-12';
  let newUserCount = 0;
  const newUser = [];
  const usersInfo = {};
  const friendFolder = '../results/user_friends';

  for (const user of usersCompare) {
    logger.group(`Сбор информации о пользователе ${user}.`);
    
    let data = await readJSONFile({
      name: user + prefix,
      path: friendFolder
    });

    if (data?.addFriends.length) {
      for (const friend of data.addFriends) {
        const { id, first_name, last_name } = friend;
        const name = `${first_name} ${last_name}`;

        logger.group(`Сбор информации о пользователе ${name}.`);

        if (usersInfo[name]) {
          logger.info(`Информация о пользователе ${name} уже запрашивалась.`);

          usersInfo[name].id = id;
          usersInfo[name].count++;
          usersInfo[name].commonUsers.push(user);
        } else {
          try {
            const userFriends = await getUserFriends(vk, id, name);

            userFriends.items.forEach((item) => {
              if (item.id === findId && !curIds.includes(id)) {
                logger.info(`Пользователь ${name} есть в друзьях у ${nameUser}.`);

                usersInfo[name] = {
                  id,
                  count: 1,
                  commonUsers: [user]
                }

                newUserCount++;
                newUser.push({
                  id,
                  name,
                  nick: `id${id}`
                });
              }
            });
          } catch (error) {
            errorHandling(error, name);
            logger.error(`Не удалось собрать информацию о пользователе ${name}, код ошибки ${error.code}.`);

            usersInfo[name] = {
              id,
              count: 1,
              commonUsers: [user]
            }
          }
        }

        logger.endGroup();
        await delayF();
      };
    }
    logger.endGroup();
  }

  logger.success(`Найдено новых пользователей - ${newUserCount}.`);

  writeToJSON({
    path: folder,
    name: 'friends-parser',
    data: [
      ...newUser,
      ...curArr
    ],
  });

  writeToJSON({
    path: friendFolder,
    name: 'compare-info',
    data: usersInfo,
  });
}

const findFriendsOnArr = async ({
  friendsIds,
  data,
  sId
}) => {
  const newFriends = [];
  const commonFriends = [];
  let countUser = 0;
  let countIsUser = 0;

  for (const user of data) {
    countUser++;
    const { id, first_name, last_name } = user;
    const name = `${first_name} ${last_name}`;

    logger.group(`Пользователь ${name} это ${countUser} пользователь из ${data.length}. Новых друзей ${newFriends.length}, общих друзей ${countIsUser}.`);

    if (friendsIds.includes(id)) {
      countIsUser++;
      commonFriends.push(user);

      logger.infoBg(`Пользователь ${name} c id${id} уже есть в друзьях.`);
    }

    if (id !== sId && !friendsIds.includes(id)) {
      try {
        const userFriends = await getUserFriends(vk, id, name);
        const { items } =  userFriends;

        const isFriend = items.map(({ id }) => id).includes(sId);

        if (isFriend) {
          newFriends.push(user);
          logger.successBg(`Найден новый друг ${name} c id${id}.`);
        }

        if (!isFriend) {
          logger.info(`Пользователь ${name} c id${id} не явдяется другом.`);
        }
      } catch (error) {
        errorHandling(error, name);
        logger.error(`Не удалось собрать информацию о ${name}.`);

        if (isStopParser(error)) {
          logger.space();
          logger.error('Дальнейший сбор информации не имеет смысла.');

          break;
        }
      }

      await delayF();
    }

    logger.endGroup();
  }

  return {
    newFriends,
    commonFriends,
    countUser,
    countIsUser
  }
}

const friendOutput = ({
  countUser,
  newFriends,
  countIsUser,
  name,
  folderOutput,
  commonFriends
}) => {
  logger.space();
  logger.success(`Всего обработано ${countUser} пользователей.`);
  logger.success(`Найдено новых друзей ${newFriends.length}.`);
  logger.success(`Пользователь имеет ${countIsUser} общих друзей.`);

  if (newFriends.length || commonFriends.length) {
    const nameFile = `info-${name}`;

    writeToJSON({
      path: folderOutput,
      name: nameFile,
      data: {
        newFriendsLength: newFriends.length,
        countIsUser,
        newFriends,
        commonFriends,
      },
    });
  }
}

const findNewFriendFromData = async (userId, sId) => {
  const folder = '../results/friend-full';
  const folderOutput = '../results/example-new';
  const nameFile = 'friend-full';

  let curData = await readJSONFile({
    name: nameFile,
    path: folder
  });

  if (!curData) {
    logger.error(`Не удалось прочитать файл "${folder}/${nameFile}.json".`)
  }

  if (curData) {
    const friendsIds = curData.map(({ id }) => id);
    curData = curData.find(({ id }) => id === userId);

    if (!curData) {
      logger.error(`Пользователя с id${userId} в друзьях не найдено.`)
    }

    if (curData?.friends.length) {
      const { id, first_name, last_name } = curData;
      const bNameFile = `${first_name}-${last_name}-${id}-${bDate()}`;

      curData = curData.friends.filter(({ is_closed }) => !is_closed);

      const {
        newFriends,
        commonFriends,
        countUser,
        countIsUser
      } = await findFriendsOnArr({
        friendsIds,
        sId,
        data: curData
      });

      friendOutput({
        countUser,
        newFriends,
        countIsUser,
        name: bNameFile,
        folderOutput,
        commonFriends
      });
    }
  }
}

const deletedFriend = async (sUserId) => {
  const folder = '../results/example';
  const nameFile = 'friends-parser';

  let curData = await readJSONFile({
    name: nameFile,
    path: folder
  });

  if (!curData) {
    logger.error('Список пользователей пуст, не о ком собирать информацию.');
  }

  if (curData) {
    let deletedUsers = [];
    let count = 0;
    const allUsersLength = curData.length;

    for (const user of curData) {
      const { id, name } = user;
      count++;

      logger.group(`Сбор информации о пользователе ${name} с id${id} - это ${count} пользователь из ${allUsersLength}.`);

      try {
        const friends = await getUserFriends(vk, id, name);
        const { items } =  friends;

        const isFriend = items.findIndex(({ id }) => id === sUserId) !== -1;

        if (isFriend) logger.info(`Пользователь ${name} есть в друзьях.`);

        if (!isFriend) {
          deletedUsers.push(user);
          logger.success(`Пользователь ${name} с id${id} удален из друзей.`);
        }
      } catch (error) {
        errorHandling(error, name);
        logger.error(`Не удалось собрать информацию о ${name}.`);

        if (isStopParser(error)) {
          logger.space();
          logger.error('Дальнейший сбор информации не имеет смысла.');

          break;
        }
      }

      logger.endGroup();

      await delayF();
    };

    logger.space();
    logger.success(`Всего проверено ${count} пользователей.`)
    logger.success(`Всего удалено ${deletedUsers.length} пользователей.`);

    if (deletedUsers.length) {
      const nameDUFile = `deleted-users-${bDate()}`;

      writeToJSON({
        path: folder,
        name: nameDUFile,
        data: deletedUsers,
      });

      logger.info(`Первоначально было ${curData.length} друзей.`);

      deletedUsers = deletedUsers.map(({ id }) => id);
      curData = curData.filter(({ id }) => !deletedUsers.includes(id));

      logger.info(`Стало ${curData.length} друзей.`);

      writeToJSON({
        path: folder,
        name: nameFile,
        data: curData,
      });
    }
  }
}

const findNewFriendsGroup = async () => {
  const sId = 2;

  const folder = '../results/example';
  const folderOutput = '../results/example-new';

  createFolders([
    '../results',
    folder,
    folderOutput
  ]);

  await delayF();

  logger.group('Паша Дуров');
  await findNewFriendFromData(1, sId);
  logger.endGroup();
}

const findNewFriendsFromData = async () => {
  const sId = 1;
  const folder = '../results/example';
  const folderOutput = '../results/example-new';
  const folderClosedFriends = '../results/closed-example';
  const name = "Паша Дуров";

  createFolders([
    '../results',
    folder,
    folderOutput
  ]);

  await delayF();

  let curData = await readJSONFile({
    name: 'friends-parser',
    path: folder
  });

  let friends = await readJSONFile({
    name: 'example-file',
    path: folderClosedFriends
  });

  if (!curData || !friends) {
    logger.error('Список пользователей пуст, не о ком собирать информацию.');
  }

  if (curData && friends) {
    const friendsIds = curData.map(({ id }) => id);

    if (friends?.items.length) {
      const data = friends.items.filter(({ is_closed }) => !is_closed);

      const {
        newFriends,
        commonFriends,
        countUser,
        countIsUser
      } = await findFriendsOnArr({
        friendsIds,
        sId,
        data
      });

      friendOutput({
        countUser,
        newFriends,
        countIsUser,
        name,
        folderOutput,
        commonFriends
      });
    } else {
      logger.success('Нет друзей для поиска.');
    }
  }
}

const buildFriendFromData = async () => {
  const folderNew = '../results/example-new';
  const folderOld = '../results/example-old';
  const folderOutput = '../results/example-full';

  const nameNew = 'example-new';
  const nameOld= 'example_old';

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
    const item = oldData.find(({ id }) => id === idItem);

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

    for (let item of curData) {
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