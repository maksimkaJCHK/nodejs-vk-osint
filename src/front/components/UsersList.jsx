import React from 'react';
import UserItem from './UserItem.jsx';

import './_user-list.scss';

const UsersList = ({ users }) => {
  if (!users.length ){
    return (
      <div className = "users-list">
        Нет пользователей для отображения!!!
      </div>
    )
  }

  return (
    <div className = "users-list">
      {
        users.map((item) => <UserItem user = { item } key = { item.id } />)
      }
    </div>
  )
}

export default UsersList;