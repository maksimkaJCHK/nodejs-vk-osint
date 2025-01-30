import React, { useMemo } from 'react';
import UserItemRow from './UserItemRow.jsx';
import UserItemInfo from './UserItemInfo.jsx';
import UserItemEducation from './UserItemEducation.jsx';

import { bFullName, bOccupation } from '@/front/helpers.js';

import './_user-item.scss';
import '../styles/_main.scss';

const UserItem = ({ user }) => {
  const {
    id,
    first_name,
    last_name,
    photo_200_orig,
  } = user;

  const fullName = useMemo(() => bFullName(first_name, last_name),
    [first_name, last_name]
  );

  const url = useMemo(() => `https://vk.com/id${id}`,
    [id]
  );

  return (
    <div className = "user-item">
      <a
        href = { photo_200_orig }
        target = "_blank"
        className = "user-item-img"
      >
        <img src = { photo_200_orig } alt = { fullName } />
      </a>
      <div className="user-item-name">
        <a 
          href = { url }
          target = "_blank"
        >
          { fullName }
        </a>
      </div>

      <UserItemInfo user = { user } />

      { user?.occupation?.name && <UserItemRow>
        { bOccupation(user?.occupation?.type) }
        { user.occupation.name } { user.occupation?.graduate_year ? ` (${user.occupation.graduate_year})` : null }
      </UserItemRow> }

      { user.university_name && <UserItemEducation user = { user } /> }
    </div>
  )
}

export default UserItem;