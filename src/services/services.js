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

  console.log(`Информация для следующих пользователях получена - ${names ?? user_ids}.`);

  return users;
}

// Тут я получаю пользователей группы
export const getMembersGroup = async (vk, group_id, nameGroup) => {
  const members = await vk.api.groups.getMembers({
    group_id,
    fields: [
      'bdate',
      'can_post',
      'can_see_all_posts',
      'can_see_audio',
      'can_write_private_message',
      'city',
      'common_count',
      'connections',
      'contacts',
      'country',
      'domain',
      'education',
      'has_mobile',
      'last_seen',
      'lists',
      'online',
      'online_mobile',
      'photo_100',
      'photo_200',
      'photo_200_orig',
      'photo_400_orig',
      'photo_50',
      'photo_max',
      'photo_max_orig',
      'relation',
      'relatives',
      'schools',
      'sex',
      'site',
      'status',
      'universities',
    ],
  });

  console.log(`Информация о пользователях группы (${nameGroup ?? group_id}) получена.`);

  return members;
}

export const getUserFriends = async (vk, user_id, name) => {
  const friends = await vk.api.friends.get({
    user_id,
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

  console.log(`Информация о друзьях пользователя ${name ?? user_id} получена.`);

  return friends;
}

export const getSubscriptions = async (vk, user_id, name) => {
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
  
  console.log(`Поучаю информацию о подписках для пользователя ${name ?? user_id}`);

  return subscriptions;
}

export const getFolowers = async (vk, user_id, name) => {
  const folowers = await vk.api.users.getFollowers({
    user_id,
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

  console.log(`Получаю подписчиков для пользователя ${name ?? user_id}`);

  return folowers;
}

export const getGroups = async (vk, user_id, name) => {
  const groups = await vk.api.groups.get({
    user_id,
    count: 1000,
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

  console.log(`Получил группы Для пользователя ${name ?? user_id}`);

  return groups;
}