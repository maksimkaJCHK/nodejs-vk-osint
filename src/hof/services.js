import {
  getUserFriends,
  getSubscriptions,
  getFolowers,
  getGroups,
  getUsersInfo
} from '../services/services.js';

export const getUserFriAndInt = async ({ vk, id, name }) => {
  const userFriends = await getUserFriends(vk, id, name);
  const subscriptions = await getSubscriptions(vk, id, name);
  const folowers = await getFolowers(vk, id, name);
  const groups = await getGroups(vk, id, name);

  return {
    userFriends,
    subscriptions,
    groups,
    folowers
  }
}