import {
  getUserFriends,
  getSubscriptions,
  getFolowers,
  getGroups,
  getUsersInfo
} from '../API/index.js';

export const getUserFreAndInf = async ({ vk, id, name }) => {
  const userInfo = await getUsersInfo(vk, id, name);
  const userFriends = await getUserFriends(vk, id, name);
  const subscriptions = await getSubscriptions(vk, id, name);
  const folowers = await getFolowers(vk, id, name);
  const groups = await getGroups(vk, id, name);

  return {
    userInfo,
    userFriends,
    subscriptions,
    groups,
    folowers
  }
}