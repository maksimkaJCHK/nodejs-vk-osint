import React, { useMemo } from 'react';
import { bFullName } from '@/front/helpers.js';

import './_user-item.scss';
import '../styles/_main.scss';

const UserItem = ({ user }) => {
  const {
    id,
    first_name,
    last_name,
    photo_max,
    university_name,
    graduation,
    bdate,
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
        className="user-item-img"
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
      { user?.city?.title && <div> { user.city.title }</div> }
      { bdate && <div> { bdate }</div> }
      { university_name && <div> { university_name } </div> }
      { graduation && graduation !== 0 && <div> { graduation } </div> }
      { user.education_form && <div> { user.education_form }</div> }
      { user.education_status && <div> { user.education_status } </div> }
    </div>
  )
}

export default UserItem;