import logger from '../logger/logger.js';
import delayF from '../services/delay.js';

// user_ids - id-ки пользователей через запятую, или их псевдонимы
export const getUsersInfo = async (vk, user_ids, names) => {
  const users = await vk.api.users.get({
    user_ids,
    fields: [
      'activities',
      'about',
      'blacklisted',
      'blacklisted_by_me',
      'books',
      'bdate',
      'can_be_invited_group',
      'can_post',
      'can_see_all_posts',
      'can_see_audio',
      'can_send_friend_request',
      'can_write_private_message',
      'career',
      'connections',
      'contacts',
      'city',
      'crop_photo',
      'domain',
      'education',
      'exports',
      'followers_count',
      'friend_status',
      'has_photo',
      'has_mobile',
      'home_town',
      'photo_400_orig',
      'photo_50',
      'sex',
      'site',
      'schools',
      'screen_name',
      'status',
      'verified',
      'games',
      'interests',
      'is_favorite',
      'is_friend',
      'is_hidden_from_feed',
      'last_seen',
      'maiden_name',
      'military',
      'movies',
      'music',
      'nickname',
      'occupation',
      'online',
      'personal',
      'photo_id',
      'photo_max',
      'photo_max_orig',
      'quotes',
      'relation',
      'relatives',
      'timezone',
      'tv',
      'universities',
      'is_verified'
    ],
  });

  logger.success(`Информация для следующих пользователях получена - ${names ?? user_ids}.`);

  return users;
}

export const getUserFriends = async (vk, user_id, name) => {
  // Схитрю, всего может быть 10_000 друзей, поэтому, если их будет четко 10_000, то я по тому, что их возвращается не 4_999 смогу понять, что запрос делать не нужно, тут API кривое, count всегда 5_000 отдает, даже если друзей 8_000 и я по второму разу делаю запрос, иначе я не пойму когда остановиться
  const fMaxCount = 4_999;
  let isScrap = true;
  let offset = 0;
  let friends = {};

  logger.success(`Сбор информации о пользователе ${name ?? user_id}.`);

  while (isScrap) {
    const friendsAPI = await vk.api.friends.get({
      user_id,
      offset: fMaxCount * offset,
      count: fMaxCount,
      fields: [
        'bdate',
        'domain',
        'universities',
        'education',
        'last_seen',
        'nickname',
        'photo_200_orig',
        'city',
        'contacts',
        'status',
        'universities'
      ],
    });

    const { items } = friendsAPI;

    if (offset === 0) {
      friends = {
        count: items.length,
        items,
      }
    }

    if (offset !== 0) {
      friends.count += items.length;
      friends.items = [ ...friends.items, ...items];
    }

    if (items.length === fMaxCount) {
      offset++;

      logger.info(`${offset + 1} проход по друзьям`)
    }

    // Всего может быть 10_000 друзей, не больше
    if (items.length !== fMaxCount) isScrap = false;
  }

  logger.success(`Информация о друзьях пользователя ${name ?? user_id} получена.`);

  return friends;
}

export const getSubscriptions = async (vk, user_id, name) => {
  logger.info(`Поучаю информацию о подписках для пользователя ${name ?? user_id}`);

  const subscriptions = await vk.api.users.getSubscriptions({
    user_id,
    fields: [
      'id',
      'first_name',
      'last_name',
      'deactivated',
      'is_closed',
      'can_access_closed',
      'about',
      'activities',
      'bdate',
      'blacklisted',
      'blacklisted_by_me'
    ],
  });

  logger.success(`Поучил информацию о подписках для пользователя ${name ?? user_id}`);

  return subscriptions;
}

export const getFolowers = async (vk, user_id, name) => {
  let folowers = {};
  let isScrap = true;
  let offsetCount = 0;

  logger.type(`Получаю подписчиков для пользователя ${name ?? user_id}`);

  while (isScrap) {
    const folowersAPI = await vk.api.users.getFollowers({
      user_id,
      count: 1_000, // Больше получить не получится, только 1_000
      offset: 1_000 * offsetCount,
      fields: [
        'about',
        'activities',
        'bdate',
        'blacklisted',
        'blacklisted_by_me',
        'books',
        'can_post',
        'can_see_all_posts',
        'can_see_audio',
        'can_send_friend_request',
        'can_write_private_message',
        'career',
        'city',
        'common_count',
        'connections',
        'contacts',
        'country',
        'crop_photo',
        'domain',
        'education',
        'exports',
        'followers_count',
        'friend_status',
        'games',
        'has_mobile',
        'has_photo',
        'home_town',
        'interests',
        'is_favorite',
        'is_friend',
        'is_hidden_from_feed',
        'last_seen',
        'lists',
        'maiden_name',
        'military',
        'movies',
        'music',
        'nickname',
        'occupation',
        'online',
        'personal',
        'photo_100',
        'photo_200',
        'photo_200_orig',
        'photo_400_orig',
        'photo_50',
        'photo_id',
        'photo_max',
        'photo_max_orig',
        'quotes',
        'relation',
        'relatives',
        'schools',
        'screen_name',
        'sex',
        'site',
        'status',
        'timezone',
        'tv',
        'universities',
        'verified',
        'wall_comments',
      ],
    });

    const { count, items } = folowersAPI;

    if (offsetCount === 0) {
      folowers = {
        count: items.length,
        items
      }
    }

    if (offsetCount !== 0) {
      folowers.count += items.length;
      folowers.items = [ ...folowers.items, ...items ];
    }

    if (count <= folowers.items.length) isScrap = false;

    offsetCount++;
    logger.info(`Получил ${folowers.items.length} подписчиков`);

    await delayF();
  }

  logger.success(`Собрал подписчиков для пользователя ${name ?? user_id}`);

  return folowers;
}

export const getGroups = async (vk, user_id, name) => {
  // Во вконтакте у пользователя почему-то групп больше чем тут отдается, но реально тут отдается правильно, если их пересчитать, то тут правильно, не знаю почему.
  const groups = await vk.api.groups.get({
    user_id,
    count: 1_000,
    extended: 1, //Если 1 то вернется полная информация о группах
    fields: [
      'activity',
      'can_create_topic',
      'can_post',
      'can_see_all_posts',
      'city',
      'contacts',
      'counters',
      'country',
      'description',
      'finish_date',
      'fixed_post',
      'links',
      'members_count',
      'place',
      'site',
      'start_date',
      'status',
      'verified',
      'wiki_page',
    ],
  });

  logger.success(`Получил группы Для пользователя ${name ?? user_id}`);

  return groups;
}