import React from 'react';
import UserItemRow from './UserItemRow.jsx';

const UserItemInfo = ({ user }) => {
  return (
    <>
      { user?.city?.title && <UserItemRow>Город: { user.city.title }</UserItemRow> }
      { user.bdate && <UserItemRow>День рождения: { user.bdate }</UserItemRow> }
    </>
  )
}

export default UserItemInfo;