import { VK } from 'vk-io';

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

import delayF from './back/services/delay.js';

import { bDate, log } from './back/services/helpers.js';

const token = getToken();

const vk = new VK({
  token
});

// Получаю информацию о пользователе/пользователях
const getUsersInfoFromData = async (logger = log()) => {
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

const searchUserInFriends = (users, userId, logger = log()) => {
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

const clearOldFriend = async (logger = log()) => {
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

const findNewFriends = async (logger = log()) => {
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

const findNewFriendFromCompare = async (findId, nameUser = 'User', logger = log()) => {
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
  closedFriends,
  sId
}, logger = log()) => {
  const newFriends = [];
  const commonFriends = [];
  const closedCommonFriends = [];
  let countUser = 0;
  let countIsUser = 0;
  let countClosedCommonFriends = 0;

  if (closedFriends) {
    for (const user of closedFriends) {
      if (friendsIds.includes(user.id)) {
        countClosedCommonFriends++;
        closedCommonFriends.push(user);

        const { id, first_name, last_name } = user;
        const name = `${first_name} ${last_name}`;
        logger.info(`Найден общий закрытый друг ${name} c id${id}.`);
      }
    }
  }

  for (const user of data) {
    countUser++;
    const { id, first_name, last_name } = user;
    const name = `${first_name} ${last_name}`;

    logger.group(`Пользователь ${name} это ${countUser} пользователь из ${data.length}. Новых друзей ${newFriends.length}, общих друзей ${countIsUser + countClosedCommonFriends}.`);

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
    countIsUser,
    countClosedCommonFriends,
    closedCommonFriends
  }
}

const friendOutput = ({
  countUser,
  newFriends,
  countIsUser,
  name,
  folderOutput,
  commonFriends,
  countClosedCommonFriends,
  closedCommonFriends,
}, logger = log()) => {
  logger.space();
  logger.success(`Всего обработано ${countUser} пользователей.`);
  logger.success(`Найдено новых друзей ${newFriends.length}.`);
  logger.success(`Пользователь имеет ${countIsUser + countClosedCommonFriends} общих друзей (${countIsUser} открытых общих друзей, ${countClosedCommonFriends} закрытых общих друзей).`);

  if (newFriends.length || commonFriends.length) {
    const nameFile = `info-${name}`;

    writeToJSON({
      path: folderOutput,
      name: nameFile,
      data: {
        newFriendsLength: newFriends.length,
        countCommon: countIsUser + countClosedCommonFriends,
        countIsUser,
        countClosedCommonFriends,
        newFriends,
        commonFriends,
        closedCommonFriends
      },
    });
  }
}

const findNewFriendFromData = async (userId, sId, logger = log()) => {
  const folder = '../results/friend-full';
  const folderOutput = '../results/example-output';
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

      const closedFriends = curData.friends.filter(({ is_closed }) => is_closed);
      curData = curData.friends.filter(({ is_closed }) => !is_closed);

      const {
        newFriends,
        commonFriends,
        countUser,
        countIsUser,
        countClosedCommonFriends,
        closedCommonFriends
      } = await findFriendsOnArr({
        friendsIds,
        sId,
        closedFriends,
        data: curData
      });

      friendOutput({
        countUser,
        newFriends,
        countIsUser,
        countClosedCommonFriends,
        closedCommonFriends,
        name: bNameFile,
        folderOutput,
        commonFriends
      });
    }
  }
}

const deletedFriend = async (sUserId, logger = log()) => {
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

const findNewFriendsGroup = async (logger = log()) => {
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