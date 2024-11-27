import { VK } from 'vk-io';
import fs from 'fs';

import getToken from './services/token.js';
import { friends } from './data/data.js';

import {
  getUserFriends,
  getSubscriptions,
  getFolowers,
  getGroups,
  getUsersInfo
} from './services/services.js';

import delayF from './services/delay.js';
import { makeFolder, readJSONFile } from './services/fs.js';
import { bDate } from './services/helpers.js';

const token = getToken();

const vk = new VK({
  token
});

// Получаю друзей, подписки подписчиков, группы
const getFullUserInfo = async () => {
  makeFolder('../results');
  makeFolder('../results/user_friends');

  const getFriendInfo = async ({ id, name }) => {
    const userFriends = await getUserFriends(vk, id, name);
    const subscriptions = await getSubscriptions(vk, id, name);
    const folowers = await getFolowers(vk, id, name);
    const groups = await getGroups(vk, id, name);

    const userInfo = {
      userFriends,
      subscriptions,
      groups,
      folowers
    }

    fs.appendFileSync(`../results/user_friends/${name.replace(/ /, '_')}-friend-${bDate()}.json`, JSON.stringify(userInfo, null, 2));
  }

  for (const item of friends) {
    await getFriendInfo(item);
  }
}

// Получаю информацию о пользователе
const getMainUserInfo = async () => {
  makeFolder('../results');
  makeFolder('../results/example');

  const friendsIds = friends.map(({ id }) => id);

  const getFriendInfo = async (ids) => {
    const userFriends = await getUsersInfo(vk, ids);

    console.log('Всего найдено, ' + userFriends.length);

    fs.appendFileSync(`../results/example/friend-API-${bDate()}.json`, JSON.stringify(userFriends, null, 2));
  }

  await getFriendInfo(friendsIds.join(','));
}

//getMainUserInfo();
//getFullUsersInfo();

const getFriendsCountUser = async () => {
  let allProfiles = 0;
  let openProfiles = 0;
  let closeProfiles = 0;

  makeFolder('../results');
  makeFolder('../results/example');

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
      console.log(`Профиль для ${name} закрыт.`);

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

  console.log(`Всего обработано ${allProfiles} профилей`);
  console.log(`Открытых ${openProfiles} профилей`);
  console.log(`Закрытых ${closeProfiles} профилей`);

  fs.appendFileSync(`../results/example/friend-API-full-sort-${bDate()}.json`, JSON.stringify(newFriends, null, 0));
  fs.appendFileSync(`../results/example/friend-API-full-sort-ls-${bDate()}.json`, JSON.stringify(newFriendsLToS, null, 0));
}

getFriendsCountUser();
