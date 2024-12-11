import logger from '../logger/logger.js';
import delayF from '../services/delay.js';

// Тут я получаю пользователей группы
export const getMembersGroup = async (vk, group_id, nameGroup) => {
  let members = {};
  let isScrap = true;
  let offsetCount = 0;
  const offset = 1_000;

  while (isScrap) {
    const membersAPI = await vk.api.groups.getMembers({
      group_id,
      offset: offset * offsetCount,
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

    const { count, items } = membersAPI;

    if (offsetCount === 0) {
      members = {
        count: items.length,
        items
      }
    }

    if (offsetCount !== 0) {
      members.count += items.length;
      members.items = [ ...members.items, ...items ];
    }

    offsetCount++;

    if (count <= members.items.length) isScrap = false;

    await delayF(400);
  }

  logger.success(`Информация о пользователях группы (${nameGroup ?? group_id}) получена.`);

  return members;
}