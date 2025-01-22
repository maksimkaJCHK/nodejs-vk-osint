import React, { useMemo } from 'react';
import UserItemRow from './UserItemRow.jsx';
import UserItemEducation from './UserItemEducation.jsx';

import { bFullName, bOccupation } from '@/front/helpers.js';

import './_user-item.scss';
import '../styles/_main.scss';

const UserItem = ({ user }) => {
  const {
    id,
    first_name,
    last_name,
    photo_max,
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
        href = { photo_max }
        target = "_blank"
        className = "user-item-img"
      >
        <img src = { photo_max } alt = { fullName } />
      </a>
      <div className="user-item-name">
        <a 
          href = { url }
          target = "_blank"
        >
          { fullName }
        </a>
      </div>

      { user?.city?.title && <UserItemRow>Город: { user.city.title }</UserItemRow> }
      { user.bdate && <UserItemRow>День рождения: { user.bdate }</UserItemRow> }

      { user?.occupation?.name && <UserItemRow>
        { bOccupation(user?.occupation?.type) }
        { user.occupation.name } { user.occupation?.graduate_year ? ` (${user.occupation.graduate_year})` : null }
      </UserItemRow> }

      { user.university_name && <UserItemEducation user = { user } /> }
    </div>
  )
}

export default UserItem;