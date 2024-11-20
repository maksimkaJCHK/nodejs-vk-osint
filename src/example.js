import { VK } from 'vk-io';
import fs from 'fs';

import getToken from './services/token.js';
import { friends } from './data/data.js';

import {
  getUserFriends,
  getSubscriptions,
  getFolowers,
  getGroups
} from './services/services.js';

import { makeFolder } from './services/fs.js';
import { bDate } from './services/helpers.js';

const token = getToken();

const vk = new VK({
  token
});

const example = async () => {
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

example();


