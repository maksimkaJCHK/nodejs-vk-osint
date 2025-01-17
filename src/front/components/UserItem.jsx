import React from 'react';

const UserItem = ({ user }) => {
  const { first_name, last_name } = user;

  return (
    <div className = "user-item">
      { first_name } { last_name }
    </div>
  )
}

export default UserItem;